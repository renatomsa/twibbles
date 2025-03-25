from pydantic import BaseModel, ConfigDict
from typing import Optional

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    user_id: int
    post_id: int

class CommentRead(CommentBase):
    id: int
    user_id: int
    post_id: int
    user_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
