from pydantic import BaseModel
from typing import Optional


class FollowRequest(BaseModel):
    requester_id: int
    requested_id: int

    requester: Optional[dict] = None
    requested: Optional[dict] = None
