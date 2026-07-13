import numpy as np

from app.ai.embedding_service import EmbeddingService


class RetrievalService:

    @staticmethod
    def cosine_similarity(vec1, vec2):
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)

        return np.dot(vec1, vec2) / (
            np.linalg.norm(vec1) * np.linalg.norm(vec2)
        )

    @staticmethod
    def rank_chunks(question, chunks):

        question_embedding = EmbeddingService.generate_embedding(question)

        scored_chunks = []

        for chunk in chunks:

            # Skip old chunks that don't have embeddings yet
            if chunk.embedding is None:
                continue

            score = RetrievalService.cosine_similarity(
                question_embedding,
                chunk.embedding,
            )

            scored_chunks.append(
                (
                    score,
                    chunk,
                )
            )

        scored_chunks.sort(
            key=lambda x: x[0],
            reverse=True,
        )

        return scored_chunks