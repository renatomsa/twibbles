from sqlalchemy import String
from model.sqlalchemy.base import Base

from typing import Optional
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class User(Base):
    __tablename__ = "user_account"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(30))
    email: Mapped[Optional[str]]
