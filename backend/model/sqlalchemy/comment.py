from datetime import datetime as dt
from datetime import timezone
from typing import TYPE_CHECKING

from model.sqlalchemy.base import Base
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from model.sqlalchemy.post import Post
    from model.sqlalchemy.user import User


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id", ondelete="CASCADE"), nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[str] = mapped_column(String(600), nullable=False)
    created_at: Mapped[dt] = mapped_column(DateTime, default=dt.now(timezone.utc), nullable=False)

    user: Mapped["User"] = relationship(
        "User", foreign_keys=[user_id]
    )
    post: Mapped["Post"] = relationship(
        "Post", foreign_keys=[post_id]
    )