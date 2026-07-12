import ollama

from app.ai.memory_service import MemoryService


class LLMService:

    @staticmethod
    def generate_answer(
        question: str,
        context: str,
        session_id: str | None = None,
        original_question: str | None = None,
    ):
        prompt = f"""
You are DocuMind, an AI assistant.

Use the previous conversation if it helps answer follow-up questions.

Always answer using the provided document context.

If the answer is not present in the document, say:
"I couldn't find that information in the uploaded documents."

Document Context:
{context}

Current Question:
{question}
"""

        messages = []

        # Load previous conversation
        if session_id:
            messages.extend(
                MemoryService.get_history(session_id)
            )

        # Add current prompt
        messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

        response = ollama.chat(
            model="llama3.2",
            messages=messages,
        )

        answer = response["message"]["content"]

        # Save only clean conversation history
        if session_id:
            MemoryService.add_message(
                session_id,
                "user",
                original_question or question,
            )

            MemoryService.add_message(
                session_id,
                "assistant",
                answer,
            )

        return answer