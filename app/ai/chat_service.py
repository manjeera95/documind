from app.ai.llm_service import LLMService
from app.ai.retrieval_service import RetrievalService


class ChatService:

    @staticmethod
    def ask(
        question: str,
        chunks,
        session_id: str | None = None,
    ):
        ranked_chunks = RetrievalService.rank_chunks(
            question,
            chunks,
        )

        top_chunks = ranked_chunks[:5]

        context = "\n\n".join(
            chunk.chunk_text
            for _, chunk in top_chunks
        )

        answer = LLMService.generate_answer(
            question=question,
            context=context,
            session_id=session_id,
            original_question=question,
        )

        sources = [
            {
                "document_id": chunk.document_id,
                "chunk_index": chunk.chunk_index,
                "score": round(score, 4),
            }
            for score, chunk in top_chunks
        ]

        return answer, sources