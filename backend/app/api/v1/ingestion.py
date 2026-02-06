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
import json
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../temp_uploads"))
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
        
        # Verify file exists and has content
        if not os.path.exists(file_path):
             job_manager.set_failed(job_id, f"File not found: {file_path}")
             return
        
        if os.path.getsize(file_path) == 0:
             job_manager.set_failed(job_id, "File is empty")
             return

        try:
            content = await parse_file_content(file_path, filename)
        except Exception as parse_error:
             job_manager.set_failed(job_id, f"Parsing failed: {str(parse_error)}")
             return

        logger.info(f"File parsed. Inserting into MalRag ({len(content)} chars)...")
        job_manager.update_job(job_id, step=JobStep.CHUNKING, progress=20, message="Chunking content...")
        
        job_manager.update_job(job_id, step=JobStep.CHUNKING, progress=30, message="Chunking content...")
        
        job_manager.update_job(job_id, step=JobStep.CHUNKING, progress=30, message="Chunking content...")
        
        # Callback for granular progress from MalRag
        async def rag_progress_callback(step_name: str):
            # Using standard logging format which is cleaner but still detailed
            logger.info(f"[Ingestion] Job {job_id} | File: {filename} | Step: {step_name.upper()}")
            
            if step_name == "chunking":
                logger.info(f" -> Chunking document into manageable pieces...")
                job_manager.update_job(job_id, step=JobStep.CHUNKING, progress=30, message="Chunking documents...")
            elif step_name == "embedding":
                logger.info(f" -> Generating embeddings using Gemini API...")
                job_manager.update_job(job_id, step=JobStep.EMBEDDING, progress=50, message="Generating embeddings with model...")
            elif step_name == "extracting_entities":
                logger.info(f" -> Extracting entities and knowledge graph relationships...")
                job_manager.update_job(job_id, step=JobStep.EMBEDDING, progress=70, message="Extracting entities and relationships...")
            elif step_name == "indexing":
                logger.info(f" -> Storing vectors in ChromaDB...")
                job_manager.update_job(job_id, step=JobStep.INDEXING, progress=90, message="Indexing into Vector DB...")

        logger.info(f"Starting ingestion pipeline for {filename} (Job {job_id})")
        # Use ainsert directly since we are async here. 
        # Note: We modified MalRag.ainsert to accept progress_callback
        await rag.ainsert(content, progress_callback=rag_progress_callback)
        
        job_manager.update_job(job_id, status=JobStatus.COMPLETED, step=JobStep.READY, progress=100, message="File processed and ready for chat.")
        _save_document_record(filename)
        logger.info(f"Job {job_id} completed successfully. Document {filename} is ready for chat.")
        
    except Exception as e:
        logger.error(f"Failed to process job {job_id}: {e}")
        job_manager.set_failed(job_id, str(e))
    finally:
        # Cleanup
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                logger.warning(f"Failed to remove temp file {file_path}: {e}")

@router.post("/upload", response_model=Response)
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        temp_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_extension}")
        
        # Ensure directory exists just in case
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Verify write
        if not os.path.exists(temp_path) or os.path.getsize(temp_path) == 0:
             if os.path.exists(temp_path):
                 os.remove(temp_path)
             raise HTTPException(status_code=400, detail="Uploaded file is empty or write failed")
            
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

# --- Persistent Document Tracking ---
DOCS_FILE = "backend/documents.json"

def _load_documents():
    if not os.path.exists(DOCS_FILE):
        return []
    try:
        with open(DOCS_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def _save_document_record(filename, doc_id=None):
    docs = _load_documents()
    # Check if already exists
    for d in docs:
        if d["filename"] == filename:
            d["updated_at"] = str(datetime.now())
            d["doc_id"] = doc_id or d.get("doc_id")
            break
    else:
        docs.append({
            "id": str(uuid.uuid4()),
            "filename": filename,
            "doc_id": doc_id,
            "uploaded_at": str(datetime.now()),
            "status": "indexed"
        })
    
    # Ensure dir exists
    os.makedirs(os.path.dirname(DOCS_FILE), exist_ok=True)
    with open(DOCS_FILE, "w") as f:
        json.dump(docs, f, indent=2)

@router.get("/documents", response_model=Response)
async def list_documents():
    docs = _load_documents()
    return Response(status="success", data={"documents": docs})
