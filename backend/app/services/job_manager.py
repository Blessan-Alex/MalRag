import uuid
from typing import Dict, Optional, Any
from enum import Enum
import time

class JobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class JobStep(str, Enum):
    UPLOADED = "uploaded"
    EXTRACTING = "extracting_text"
    CHUNKING = "chunking"
    EMBEDDING = "embedding"
    INDEXING = "indexing"
    READY = "ready"

class JobManager:
    _instance = None
    _jobs: Dict[str, Dict[str, Any]] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(JobManager, cls).__new__(cls)
        return cls._instance

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = JobManager()
        return cls._instance

    def create_job(self, filename: str) -> str:
        job_id = str(uuid.uuid4())
        self._jobs[job_id] = {
            "id": job_id,
            "filename": filename,
            "status": JobStatus.QUEUED,
            "step": JobStep.UPLOADED,
            "progress": 0,
            "message": "File uploaded, waiting for processing...",
            "created_at": time.time(),
            "updated_at": time.time()
        }
        return job_id

    def update_job(self, job_id: str, status: Optional[JobStatus] = None, step: Optional[JobStep] = None, progress: Optional[int] = None, message: Optional[str] = None):
        if job_id not in self._jobs:
            return # Or raise error
        
        job = self._jobs[job_id]
        if status:
            job["status"] = status
        if step:
            job["step"] = step
        if progress is not None:
            job["progress"] = progress
        if message:
            job["message"] = message
        
        job["updated_at"] = time.time()

    def set_failed(self, job_id: str, error_message: str):
        self.update_job(job_id, status=JobStatus.FAILED, message=error_message, progress=0)

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        return self._jobs.get(job_id)

    def get_all_jobs(self) -> Dict[str, Dict[str, Any]]:
        return self._jobs

# Global accessor
job_manager = JobManager.get_instance()
