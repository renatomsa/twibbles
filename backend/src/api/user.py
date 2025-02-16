from fastapi import APIRouter
from src.schemas.response import HttpResponseModel
import src.service.impl.user_service as user_service

api = APIRouter()


@api.get("/{user_id}", response_model=HttpResponseModel)
def get_user(user_id: int):
    get_user_response = user_service.get_user(user_id)
    return get_user_response
