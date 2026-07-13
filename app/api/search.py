from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.retrieval_service import RetrievalService
from app.auth.dependencies import get_current_user
from app.db.session import get_db
from app.schemas.question import QuestionRequest
from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post("/")
def search_documents(
    request: QuestionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    chunks = DocumentService.get_chunks_by_user(
        db=db,
        owner_id=current_user.id,
    )

    ranked_chunks = RetrievalService.rank_chunks(
        request.question,
        chunks,
    )

    return [
        {
            "score": round(float(score), 4),
            "chunk": chunk.chunk_text,
            "document_id": chunk.document_id,
            "chunk_index": chunk.chunk_index,
        }
        for score, chunk in ranked_chunks[:5]
    ]