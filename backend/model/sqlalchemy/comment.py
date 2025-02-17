from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Integer, String, DateTime
from backend.model.sqlalchemy.post import Post
from backend.model.sqlalchemy.user import User
from model.sqlalchemy.base import Base
from datetime import datetime as dt
from datetime import timezone

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"), nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"), nullable=False)
    content: Mapped[str] = mapped_column(String(600), nullable=False)
    created_at: Mapped[dt] = mapped_column(DateTime, default=dt.now(timezone.utc), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="comments")
    post: Mapped["Post"] = relationship("Post", back_populates="comments")
