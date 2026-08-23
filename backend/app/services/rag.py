import logging
pipeline = None # Disabled to prevent tokenizers threading crash on macOS

logger = logging.getLogger(__name__)

embedding_pipe = None
if pipeline is not None:
    try:
        # Load a small, local embedding model to avoid API charges
        embedding_pipe = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")
        logger.info("Local all-MiniLM-L6-v2 embedding model loaded successfully.")
    except Exception as e:
        logger.error(f"Could not load embedding model: {e}")

def embed_text(text: str) -> list[float]:
    """Generates a 384-dimensional vector embedding for the given text."""
    if embedding_pipe is not None:
        try:
            # feature-extraction returns a list of lists. We take the mean across the sequence length (pooling).
            features = embedding_pipe(text)
            # features is shape (1, seq_len, 384). 
            import numpy as np
            embeddings = np.array(features[0])
            pooled = np.mean(embeddings, axis=0)
            return pooled.tolist()
        except Exception as e:
            logger.error(f"Embedding failed: {e}")
            pass
            
    # Fallback dummy embedding (384 dims for all-MiniLM-L6-v2)
    return [0.0] * 384

def generate_advisory(ndvi: float, weather_data: dict, diagnosis: dict) -> dict:
    """Mock LangChain/Pgvector retrieval pipeline for regenerative farming guidelines."""
    # In a real implementation with LLM generation:
    # 1. Convert the context into an embedding using embed_text()
    # 2. Search pgvector for IIFSR Modipuram regenerative farming guidelines
    # 3. Use an LLM to generate a response
    
    return {
        "treatments": [
            "Apply Bio-fungicide sprays (e.g., Bacillus subtilis based) immediately to surrounding healthy plants.",
            "Use Neem oil at a dosage of 2 tablespoons per gallon of water, applied weekly in the early morning or late evening.",
            "Remove and securely dispose of infected lower leaves to reduce spore spread."
        ],
        "management_rules": [
            "Adjust irrigation based on upcoming rainfall: Switch entirely to drip irrigation to keep foliage dry. Avoid overhead watering.",
            "Increase spacing for airflow: Ensure a minimum of 24 inches between plants if possible, pruning excess dense foliage in the lower canopy.",
            "Apply a thick layer of organic mulch to prevent soil-borne spores from splashing onto lower leaves during heavy rain."
        ]
    }
