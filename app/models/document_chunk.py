from sqlalchemy import ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id")
    )

    chunk_index: Mapped[int] = mapped_column()

    chunk_text: Mapped[str] = mapped_column()

    embedding: Mapped[list] = mapped_column(
        JSON,
        nullable=True,
    )