from model.sqlalchemy.user import User
from model.sqlalchemy.base import Base
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey


# follower_id is foreign key to user.id
class Following(Base):
    __tablename__ = "following"

    follower_id: Mapped[int] = mapped_column(ForeignKey("user_account.id", ondelete="CASCADE"), primary_key=True)
    followed_id: Mapped[int] = mapped_column(ForeignKey("user_account.id", ondelete="CASCADE"), primary_key=True)

    follower: Mapped["User"] = relationship(
        "User", foreign_keys="Following.follower_id", viewonly=True
    )
    followed: Mapped["User"] = relationship(
        "User", foreign_keys="Following.followed_id", viewonly=True
    )
