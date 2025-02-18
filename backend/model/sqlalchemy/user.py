from typing import Optional

from typing import List
from model.sqlalchemy.base import Base
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class User(Base):
    __tablename__ = "user_account"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(30), nullable=False)
    password: Mapped[str] = mapped_column(String(50), nullable=False, default="password")
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    is_private: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    profile_img_path: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # many to many self-referential relationship
    # relations with following
    following_list: Mapped[List["User"]] = relationship("User",
                                                    secondary="following",
                                                    primaryjoin="User.id==Following.follower_id",
                                                    secondaryjoin="User.id==Following.followed_id",
                                                    back_populates="followers_list"
                                        )

    followers_list: Mapped[List["User"]] = relationship("User",
                                                    secondary="following",
                                                    primaryjoin="User.id==Following.followed_id",
                                                    secondaryjoin="User.id==Following.follower_id",
                                                    back_populates="following_list"
                                        )                                                                      


    # relations with follow_request
    follow_requests_list: Mapped[List["User"]] = relationship("User",
                                                    secondary="follow_request",
                                                    primaryjoin="User.id==FollowRequest.requester_id",
                                                    secondaryjoin="User.id==FollowRequest.requested_id",
                                                    back_populates="follow_requested_list"
                                        )
    
    follow_requested_list: Mapped[List["User"]] = relationship("User",
                                                    secondary="follow_request",
                                                    primaryjoin="User.id==FollowRequest.requested_id",
                                                    secondaryjoin="User.id==FollowRequest.requester_id",
                                                    back_populates="follow_requests_list"
                                        )
