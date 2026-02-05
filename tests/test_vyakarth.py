
import asyncio
import warnings
import os

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

# Fix for protobuf issue if needed (though we are downgrading via pip)
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

from malrag.llm import vyakarth_embedding
import numpy as np

async def test():
    print("Testing Krutrim Vyakarth Embedding...")
    texts = ["Namaskaram", "How are you?"]
    embeddings = await vyakarth_embedding(texts)
    
    print(f"Embedding shape: {embeddings.shape}")
    print(f"Embedding type: {type(embeddings)}")
    
    if embeddings.shape == (2, 768):
        print("SUCCESS: Shape is correct (2, 768)")
    else:
        print(f"FAILURE: Shape is {embeddings.shape}")

if __name__ == "__main__":
    asyncio.run(test())
