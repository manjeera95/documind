from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    filename: Mapped[str] = mapped_column(String(255))

    filepath: Mapped[str] = mapped_column(String(500))

    content: Mapped[str] = mapped_column()

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )