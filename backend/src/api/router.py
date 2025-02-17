from fastapi import APIRouter
from src.api import user, follow, register, profile, auth

api_router = APIRouter()
api_router.include_router(user.api, prefix="/user", tags=["user"])
api_router.include_router(follow.api, prefix="/follow", tags=["follow"])
api_router.include_router(register.api, prefix="/users", tags=["register"])
api_router.include_router(profile.api, prefix="/user/profile", tags=["profile"])
api_router.include_router(auth.api, prefix="/auth", tags=["auth"])
