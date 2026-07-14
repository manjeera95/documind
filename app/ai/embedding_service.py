from sentence_transformers import SentenceTransformer


class EmbeddingService:
    model = None

    @classmethod
    def get_model(cls):
        if cls.model is None:
            cls.model = SentenceTransformer("BAAI/bge-small-en-v1.5")
        return cls.model

    @classmethod
    def generate_embedding(cls, text: str):
        model = cls.get_model()
        embedding = model.encode(text)
        return embedding.tolist()