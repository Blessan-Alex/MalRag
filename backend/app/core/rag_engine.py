import os
from malrag import MalRag
from malrag.llm import openai_complete_if_cache, openai_embedding, gemini_complete, gemini_embedding, vyakarth_embedding
from malrag.utils import EmbeddingFunc
import asyncio
import numpy as np
from functools import lru_cache

# Settings
WORKING_DIR = os.environ.get("RAG_DIR", "malrag_index")
LLM_MODEL = os.environ.get("LLM_MODEL", "gemini-1.5-flash") # Default to Gemini if not set, based on user context
EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "vyakarth") # Default to Vyakarth

# Global RAG instance
_rag_instance = None

def get_rag_engine():
    global _rag_instance
    if _rag_instance is None:
        initialize_rag()
    return _rag_instance

def initialize_rag():
    global _rag_instance
    
    if not os.path.exists(WORKING_DIR):
        os.makedirs(WORKING_DIR)

    # Detect if we should use Gemini
    # For this specific plan, we strictly enforce Vyakarth for embedding and Gemini for LLM as per request
    # but still allow fallback if env vars are extremely specific.
    
    use_gemini = "gemini" in LLM_MODEL.lower() or "flash" in LLM_MODEL.lower() or "pro" in LLM_MODEL.lower()
    
    # Configure Embedding Function (Vyakarth Preference)
    if "vyakarth" in EMBEDDING_MODEL.lower():
        print("Initializing MalRag with Krutrim Vyakarth Embeddings...")
        async def embedding_func_wrapper(texts: list[str]) -> np.ndarray:
            return await vyakarth_embedding(texts)
        # Vyakarth dim is 768
        embedding_dim = 768
    else:
        # Fallback to OpenAI or Gemini Embedding if specified
        if use_gemini and "text-embedding" not in EMBEDDING_MODEL:
             print(f"Initializing MalRag with Gemini Embeddings ({EMBEDDING_MODEL})...")
             async def embedding_func_wrapper(texts: list[str]) -> np.ndarray:
                return await gemini_embedding(texts)
             embedding_dim = 768
        else:
             print(f"Initializing MalRag with OpenAI Embeddings ({EMBEDDING_MODEL})...")
             async def embedding_func_wrapper(texts: list[str]) -> np.ndarray:
                return await openai_embedding(texts, model=EMBEDDING_MODEL)
             embedding_dim = 3072 if "large" in EMBEDDING_MODEL else 1536

    # Configure LLM Function
    if use_gemini:
        if not os.environ.get("GOOGLE_API_KEY"):
            print("CRITICAL WARNING: GOOGLE_API_KEY is not set. Gemini integration will fail.")
            
        print(f"Initializing MalRag with Gemini LLM ({LLM_MODEL})...")
        llm_func = gemini_complete
    else:
        print(f"Initializing MalRag with OpenAI/Compatible LLM ({LLM_MODEL})...")
        llm_func = openai_complete_if_cache

    _rag_instance = MalRag(
        working_dir=WORKING_DIR,
        llm_model_func=llm_func, 
        llm_model_name=LLM_MODEL,
        embedding_func=EmbeddingFunc(
            embedding_dim=embedding_dim,
            max_token_size=8192,
            func=embedding_func_wrapper,
        ),
    )

    print("MalRag Engine Initialized.")
