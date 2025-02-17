from datetime import datetime as dt
from datetime import timezone
from typing import TYPE_CHECKING

from model.sqlalchemy.base import Base
from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from model.sqlalchemy.comment import Comment
    from model.sqlalchemy.user import User

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"))
    text: Mapped[str] = mapped_column(String(280), nullable=False)
    date_time: Mapped[dt] = mapped_column(DateTime, default=dt.now(timezone.utc), nullable=False)

    requester: Mapped["User"] = relationship(
        "User", foreign_keys=[user_id]
    )