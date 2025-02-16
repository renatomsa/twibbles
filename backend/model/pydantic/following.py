from typing import Optional
from pydantic import BaseModel


class Following(BaseModel):
    follower_id: int
    followed_id: int

    follower: Optional[dict] = None
    followed: Optional[dict] = None
