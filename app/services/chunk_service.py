from sqlalchemy.orm import Session

from app.ai.embedding_service import EmbeddingService
from app.models.document_chunk import DocumentChunk
from app.utils.text_chunker import chunk_text


class ChunkService:

    @staticmethod
    def create_chunks(
        db: Session,
        document_id: int,
        text: str,
    ):
        chunks = chunk_text(text)

        for index, chunk in enumerate(chunks):

            embedding = EmbeddingService.generate_embedding(chunk)

            db_chunk = DocumentChunk(
                document_id=document_id,
                chunk_index=index,
                chunk_text=chunk,
                embedding=embedding,
            )

            db.add(db_chunk)

        db.commit()