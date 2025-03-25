from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class Post(BaseModel):
    id: int
    user_id: int
    text: str
    date_time: datetime
    location: Optional[str] = None
    hashtags: Optional[str] = None
    user_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)



class CreatePost(BaseModel):
    text: str
    location: Optional[str] = ""
    hashtags: Optional[str] = ""
