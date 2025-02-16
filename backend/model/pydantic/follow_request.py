from pydantic import BaseModel
from typing import Optional

from model.sqlalchemy.user import User


class FollowRequest(BaseModel):
    requester_id: int
    requested_id: int

    requester: Optional[User]
    requested: Optional[User]
