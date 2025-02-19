from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    id: int
    user_name: str
    profile_img_path: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    is_private: Optional[bool] = None
    bio: Optional[str] = None


class CreateUser(BaseModel):
    user_name: str
    email: str
    password: str
    is_private: bool
    profile_img_path: Optional[str] = None
    bio: Optional[str] = None