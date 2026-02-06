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
    sources: Optional[list] = []
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
        print(f"DEBUG: rag.query result keys: {result.keys() if isinstance(result, dict) else 'Not a dict'}") # Debugging log
        
        answer = result
        sources = []
        
        if isinstance(result, dict):
            answer = result.get("response", "")
            sources = result.get("context_data", [])
            
        if not answer or answer == "":
             print("WARNING: rag.query returned empty answer")
             
        # Normalize source objects if needed (e.g., ensure 'source_id' or 'id')
        formatted_sources = []
        seen = set()
        for s in sources:
            # We use 'id' or 'full_doc_id' as a unique key if possible
            sid = s.get("id") or s.get("full_doc_id")
            if sid and sid not in seen:
                formatted_sources.append(s)
                seen.add(sid)
                
        return Response(status="success", data=answer, sources=formatted_sources)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")
