from typing import Optional

from model.sqlalchemy.base import Base
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from model.sqlalchemy.comment import Comment


class User(Base):
    __tablename__ = "user_account"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(50), nullable=False, default="password")
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    is_private: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    profile_img_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    comments : Mapped["Comment"] = relationship("Comment", back_populates="post")
