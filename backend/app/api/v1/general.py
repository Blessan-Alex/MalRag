from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/departments")
async def get_departments():
    # Return mock departments for now or fetch from DB/RAG
    return {
        "departments": [
            "Operations",
            "Maintenance",
            "Safety",
            "Engineering",
            "Finance",
            "Legal"
        ]
    }

@router.get("/stats")
async def get_stats():
    return {
        "total_documents": 145,
        "queries_today": 23,
        "system_status": "optimal"
    }
