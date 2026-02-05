import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch, AsyncMock
import asyncio
import os
import sys

# Add project root to sys.path to ensure backend imports work
sys.path.append(os.getcwd())

from backend.app.main import app
from backend.app.core.rag_engine import get_rag_engine

client = TestClient(app)

# Mock MalRag to avoid actual API calls (ResourceExhausted)
@pytest.fixture
def mock_rag_engine():
    with patch("backend.app.api.v1.ingestion.get_rag_engine") as mock_get:
        mock_rag = MagicMock()
        
        # Define an async mock for ainsert that simulates callbacks
        async def mock_ainsert(content, progress_callback=None):
            if progress_callback:
                await progress_callback("chunking")
                await asyncio.sleep(0.1)
                await progress_callback("embedding")
                await asyncio.sleep(0.1)
                await progress_callback("extracting_entities")
                await asyncio.sleep(0.1)
                await progress_callback("indexing")
        
        mock_rag.ainsert = AsyncMock(side_effect=mock_ainsert)
        
        # Mock insert for synchronous calls if needed
        mock_rag.insert = MagicMock()
        
        mock_get.return_value = mock_rag
        yield mock_rag

def test_file_upload_flow(mock_rag_engine):
    # 1. Create a dummy file
    filename = "test_doc.txt"
    content = "This is a test document for MalRag with Krutrim Vyakarth."
    with open(filename, "w") as f:
        f.write(content)

    try:
        # 2. Upload
        with open(filename, "rb") as f:
            response = client.post("/api/v1/ingest/upload", files={"file": (filename, f, "text/plain")})
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "processing"
        job_id = data["job_id"]
        assert job_id is not None
        print(f"Job ID: {job_id}")

        # 3. Poll Status
        max_retries = 20
        completed = False
        
        for i in range(max_retries):
            # TestClient doesn't run background tasks in a separate thread automatically in a way we can race against easily in a synchronous test loop 
            # unless we use AsyncClient or manage the loop. 
            # However, Starlette/FastAPI TestClient *does* execute background tasks synchronously after the response is sent.
            # So the background task should have ALREADY run by the time we get here.
            
            status_res = client.get(f"/api/v1/ingest/status/{job_id}")
            assert status_res.status_code == 200
            status_data = status_res.json()
            
            print(f"Poll {i}: {status_data['status']} - {status_data.get('message')}")
            
            if status_data["status"] == "completed":
                completed = True
                # Check steps
                job_details = status_data["data"]
                assert job_details["step"] == "ready"
                assert job_details["progress"] == 100
                break
            
            if status_data["status"] == "failed":
                pytest.fail(f"Job failed: {status_data.get('message')}")
            
            # Since TestClient runs synchronously, we shouldn't actually need to loop wait if it works as expected,
            # but getting it 'completed' depends on how the background task execution was handled.
            # If it already ran, we should break immediately.
            if i > 2: 
                 break
            
            time.sleep(0.1)
        
        if not completed:
            # If we are here, checking why. 
            # With TestClient, background tasks run *after* response. 
            # Since our mock_ainsert is async but run in a sync wrapper (loop.run_in_executor) in the original code? 
            # Wait, ingestion.py uses: background_tasks.add_task(process_file_background, ...)
            # process_file_background is async. 
            # FastAPI runs it in the event loop.
            pass
            
        assert completed, "Job did not complete (background task execution verification)"

    finally:
        if os.path.exists(filename):
            try:
                os.remove(filename)
            except:
                pass
