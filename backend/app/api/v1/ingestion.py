from fastapi import APIRouter, HTTPException, File, UploadFile, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import os
import shutil
import uuid
import asyncio
from ...core.rag_engine import get_rag_engine
from ...services.file_parser import parse_file_content
from ...services.job_manager import job_manager, JobStatus, JobStep
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

UPLOAD_DIR = "backend/temp_uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class InsertRequest(BaseModel):
    text: str

class Response(BaseModel):
    status: str
    message: Optional[str] = None
    job_id: Optional[str] = None
    data: Optional[dict] = None

@router.post("/text", response_model=Response)
async def insert_text_endpoint(request: InsertRequest):
    rag = get_rag_engine()
    try:
        # We can also wrap this in a job if we wanted consistency, but keeping simple for now
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: rag.insert(request.text))
        return Response(status="success", message="Text inserted successfully")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_file_background(job_id: str, file_path: str, filename: str):
    rag = get_rag_engine()
    job_manager.update_job(job_id, status=JobStatus.PROCESSING, step=JobStep.EXTRACTING, progress=10, message="Extracting text from file...")
    
    try:
        logger.info(f"Processing job {job_id} for file {filename}...")
        try:
            content = await parse_file_content(file_path, filename)
        except Exception as parse_error:
             job_manager.set_failed(job_id, f"Parsing failed: {str(parse_error)}")
             return

        logger.info(f"File parsed. Inserting into MalRag ({len(content)} chars)...")
        job_manager.update_job(job_id, step=JobStep.CHUNKING, progress=20, message="Chunking content...")
        
        # Callback for granular progress from MalRag
        async def rag_progress_callback(step_name: str):
            if step_name == "chunking":
                job_manager.update_job(job_id, step=JobStep.CHUNKING, progress=30, message="Chunking documents...")
            elif step_name == "embedding":
                job_manager.update_job(job_id, step=JobStep.EMBEDDING, progress=50, message="Generating embeddings...")
            elif step_name == "extracting_entities":
                job_manager.update_job(job_id, step=JobStep.EMBEDDING, progress=70, message="Extracting entities...")
            elif step_name == "indexing":
                job_manager.update_job(job_id, step=JobStep.INDEXING, progress=90, message="Indexing into Vector DB...")

        # Use ainsert directly since we are async here. 
        # Note: We modified MalRag.ainsert to accept progress_callback
        await rag.ainsert(content, progress_callback=rag_progress_callback)
        
        job_manager.update_job(job_id, status=JobStatus.COMPLETED, step=JobStep.READY, progress=100, message="File processed and ready for chat.")
        logger.info(f"Job {job_id} complete.")
        
    except Exception as e:
        logger.error(f"Failed to process job {job_id}: {e}")
        job_manager.set_failed(job_id, str(e))
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/upload", response_model=Response)
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        temp_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_extension}")
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Create Job
        job_id = job_manager.create_job(file.filename)
        
        # Start Background Task
        background_tasks.add_task(process_file_background, job_id, temp_path, file.filename)

        return Response(
            status="processing",
            message=f"File {file.filename} uploaded. Processing started.",
            job_id=job_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}", response_model=Response)
async def get_job_status(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return Response(
        status=job["status"],
        message=job["message"],
        job_id=job_id,
        data=job # Return full job data including progress/step
    )
