from pydantic import BaseModel, validator
from typing import Optional

class ProfileUpdate(BaseModel):
    name: Optional[str]
    username: Optional[str]
    email: Optional[str]
    bio: Optional[str]
    photo: Optional[str]

    @validator("bio")
    def bio_must_not_be_empty(cls, v):
        if v is None or v.strip() == "":
            raise ValueError("Biografia é um campo obrigatório")
        return v

class ProfileResponse(BaseModel):
    name: str
    username: str
    email: str
    bio: str
    photo: Optional[str]
