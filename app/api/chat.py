from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai.chat_service import ChatService
from app.auth.dependencies import get_current_user
from app.db.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    chunks = DocumentService.get_chunks_by_documents(
        db=db,
        document_ids=request.document_ids,
        owner_id=current_user.id,
    )

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No chunks found for the selected documents.",
        )

    answer, sources = ChatService.ask(
        question=request.question,
        chunks=chunks,
        session_id=request.session_id,
    )

    return ChatResponse(
        answer=answer,
        sources=sources,
    )