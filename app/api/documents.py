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
        owner_id=1,
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
    return DocumentService.get_documents(db)