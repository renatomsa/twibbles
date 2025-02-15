from sqlalchemy import String
from model.sqlalchemy.base import Base

from typing import Optional, List
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "user_account"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(30))
    email: Mapped[Optional[str]] = mapped_column(String(50))

    following: Mapped[List["Following"]] = relationship(back_populates="follower",
                                                        cascade="all, delete-orphan")
    followers: Mapped[List["Following"]] = relationship(back_populates="followed",
                                                        cascade="all, delete-orphan")
