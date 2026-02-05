from sentence_transformers import SentenceTransformer
import numpy as np
from malrag.utils import wrap_embedding_func_with_attrs

# Initialize the model globally to avoid reloading
# Vyakarth: Krutrim-AI-Labs/vyakyarth-embed-v1-non-commercial
VYAKARTH_MODEL_NAME = "Krutrim-AI-Labs/Vyakyarth"
_vyakarth_model = None

def get_vyakarth_model():
    global _vyakarth_model
    if _vyakarth_model is None:
        print(f"Loading Vyakarth model: {VYAKARTH_MODEL_NAME}...")
        _vyakarth_model = SentenceTransformer(VYAKARTH_MODEL_NAME, trust_remote_code=True)
    return _vyakarth_model

@wrap_embedding_func_with_attrs(embedding_dim=768, max_token_size=512)
async def vyakarth_embedding(texts: list[str]) -> np.ndarray:
    model = get_vyakarth_model()
    # SentenceTransformer handles batching effectively
    embeddings = model.encode(texts, convert_to_numpy=True)
    return embeddings
