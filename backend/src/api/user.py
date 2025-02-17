import src.service.impl.user_service as user_service
from fastapi import APIRouter
from src.schemas.response import HttpResponseModel

api = APIRouter()


@api.get("/get_user_by_id/{user_id}", response_model=HttpResponseModel)
def get_user_by_id(user_id: int):
    get_user_response = user_service.get_user(user_id)
    return get_user_response

@api.get("/get_users_by_substring/{substring}", response_model=HttpResponseModel)
def get_users_by_substring(substring: str):
    get_user_response = user_service.get_users_by_substring(substring)
    return get_user_response

@api.patch("/update_user_privacy/{user_id}/{is_private}", response_model=HttpResponseModel)
def update_user_privacy(user_id: int, is_private: bool):
    update_user_response = user_service.update_user_privacy(user_id, is_private)
    return update_user_response