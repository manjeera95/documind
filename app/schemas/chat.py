from pydantic import BaseModel


class Source(BaseModel):
    document_id: int
    chunk_index: int
    score: float


class ChatRequest(BaseModel):
    document_ids: list[int]
    question: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]