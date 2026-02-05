from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from malrag import MalRag, QueryParam
from ...core.rag_engine import get_rag_engine
import asyncio

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    mode: str = "hybrid"
    only_need_context: bool = False

class Response(BaseModel):
    status: str
    data: Optional[str] = None
    message: Optional[str] = None

@router.post("/query", response_model=Response)
async def query_endpoint(request: QueryRequest):
    rag = get_rag_engine()
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: rag.query(
                request.query,
                param=QueryParam(
                    mode=request.mode, only_need_context=request.only_need_context
                ),
            ),
        )
        return Response(status="success", data=result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")
