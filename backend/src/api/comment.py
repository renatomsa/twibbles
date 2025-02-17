from fastapi import APIRouter, Body
from src.schemas.response import HttpResponseModel
import src.service.impl.comment_service as comment_service
from model.pydantic.comment import CommentCreate

api = APIRouter()

@api.get("/{post_id}/comments", response_model=HttpResponseModel)
def get_comments_for_post(post_id: int):
    response = comment_service.get_comments_by_post_id(post_id)
    return response

@api.post("/{user_id}/comment/{post_id}", response_model=HttpResponseModel)
def create_comment_for_post(
    user_id: int,
    post_id: int,
    comment_in: CommentCreate = Body(...)
):
    response = comment_service.create_comment(user_id, post_id, comment_in)
    return response

@api.delete("/{user_id}/comment/{comment_id}", response_model=HttpResponseModel)
def delete_comment(user_id: int, comment_id: int):
    response = comment_service.delete_comment(user_id, comment_id)
    return response
