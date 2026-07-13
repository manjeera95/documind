class MemoryService:

    _sessions = {}

    @classmethod
    def get_history(cls, session_id: str):
        return cls._sessions.get(session_id, []).copy()

    @classmethod
    def add_message(cls, session_id: str, role: str, content: str):
        if session_id not in cls._sessions:
            cls._sessions[session_id] = []

        cls._sessions[session_id].append(
            {
                "role": role,
                "content": content,
            }
        )

        # Keep only the last 10 messages
        cls._sessions[session_id] = cls._sessions[session_id][-10:]