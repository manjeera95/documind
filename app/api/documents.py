import os
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.db.session import get_db
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = DocumentService.save_document(
        db=db,
        filename=file.filename,
        filepath=file_path,
        owner_id=current_user.id,
    )

    return {
        "id": document.id,
        "filename": document.filename,
        "message": "Document uploaded successfully",
    }


@router.get("/")
def list_documents(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    documents = DocumentService.get_documents(
        db=db,
        owner_id=current_user.id,
    )

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
        }
        for doc in documents
    ]

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    document = DocumentService.get_document_by_id(
        db=db,
        document_id=document_id,
        owner_id=current_user.id,
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    DocumentService.delete_document(
        db=db,
        document=document,
    )

    return {
        "message": "Document deleted successfully",
    }