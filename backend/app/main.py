from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import ingestion, chat
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MalRag API",
    description="Backend API for MalRag RAG Pipeline",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:3000", # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ingestion.router, prefix="/api/v1/ingest", tags=["Ingestion"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
from .api.v1 import transcribe, general
app.include_router(transcribe.router, prefix="/api/v1", tags=["Transcription"])
app.include_router(general.router, prefix="/api/v1", tags=["General"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "MalRag Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
