import fitz
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.services.chunk_service import ChunkService


class DocumentService:

    @staticmethod
    def extract_text(file_path: str) -> str:
        document = fitz.open(file_path)

        text = ""

        for page in document:
            text += page.get_text()

        document.close()

        return text

    @staticmethod
    def save_document(
        db: Session,
        filename: str,
        filepath: str,
        owner_id: int,
    ):
        text = DocumentService.extract_text(filepath)

        document = Document(
            filename=filename,
            filepath=filepath,
            content=text,
            owner_id=owner_id,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        ChunkService.create_chunks(
            db=db,
            document_id=document.id,
            text=text,
        )

        return document

    @staticmethod
    def get_documents(
        db: Session,
        owner_id: int,
    ):
        return (
            db.query(Document)
            .filter(Document.owner_id == owner_id)
            .order_by(Document.id.desc())
            .all()
        )

    @staticmethod
    def get_document_by_id(
        db: Session,
        document_id: int,
        owner_id: int,
    ):
        return (
            db.query(Document)
            .filter(
                Document.id == document_id,
                Document.owner_id == owner_id,
            )
            .first()
        )

    @staticmethod
    def get_chunks_by_user(
        db: Session,
        owner_id: int,
    ):
        return (
            db.query(DocumentChunk)
            .join(
                Document,
                Document.id == DocumentChunk.document_id,
            )
            .filter(Document.owner_id == owner_id)
            .order_by(DocumentChunk.chunk_index)
            .all()
        )

    @staticmethod
    def get_chunks_by_document(
        db: Session,
        document_id: int,
        owner_id: int,
    ):
        return (
            db.query(DocumentChunk)
            .join(
                Document,
                Document.id == DocumentChunk.document_id,
            )
            .filter(
                Document.id == document_id,
                Document.owner_id == owner_id,
            )
            .order_by(DocumentChunk.chunk_index)
            .all()
        )

    @staticmethod
    def get_chunks_by_documents(
        db: Session,
        document_ids: list[int],
        owner_id: int,
    ):
        return (
            db.query(DocumentChunk)
            .join(
                Document,
                Document.id == DocumentChunk.document_id,
            )
            .filter(
                Document.id.in_(document_ids),
                Document.owner_id == owner_id,
            )
            .order_by(
                DocumentChunk.document_id,
                DocumentChunk.chunk_index,
            )
            .all()
        )