from pydantic import BaseModel
from datetime import datetime

class Post(BaseModel):
    id: int
    user_id: int
    text: str
    date : datetime

