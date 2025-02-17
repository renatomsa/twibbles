from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, DateTime
from sqlalchemy import ForeignKey
from model.sqlalchemy.base import Base

from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.orm import mapped_column

from datetime import datetime as dt
from datetime import timezone

if TYPE_CHECKING:
    from model.sqlalchemy.comment import Comment
    from model.sqlalchemy.user import User

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"))
    text: Mapped[str] = mapped_column(String(280), nullable=False)
    date_time: Mapped[dt] = mapped_column(DateTime, default=dt.now(timezone.utc), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    hashtags: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    comments : Mapped["Comment"] = relationship("Comment", back_populates="user")
