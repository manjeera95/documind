from app.ai.embedding_service import EmbeddingService

embedding = EmbeddingService.generate_embedding(
    "FastAPI is an amazing framework."
)

print(type(embedding))
print(len(embedding))
print(embedding[:10])