from pydantic import BaseModel, ConfigDict

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    user_id: int
    post_id: int

class CommentRead(CommentBase):
    id: int
    user_id: int
    post_id: int

    model_config = ConfigDict(from_attributes=True)