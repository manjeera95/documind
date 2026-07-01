import fitz
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document
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
    def get_documents(db: Session):
        return db.execute(
            select(Document)
        ).scalars().all()