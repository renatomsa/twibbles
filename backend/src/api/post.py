from fastapi import APIRouter
from src.schemas.response import HttpResponseModel
import src.service.impl.post_service as post_service

api = APIRouter()

@api.get("/{user_id}/posts", response_model=HttpResponseModel)
def get_posts(user_id : int):
    get_posts_response = post_service.get_posts(user_id)
    return get_posts_response

@api.delete("/{user_id}/posts/{post_id}", response_model=HttpResponseModel)
def delete_post(user_id : int, post_id : int):
    delete_post_response = post_service.delete_post(user_id, post_id)
    return delete_post_response

@api.get("/{user_id}/dashboard", response_model=HttpResponseModel)
def get_dashboard(user_id : int, metric : str, period : str):
    get_dashboard_response = post_service.get_dashboard(user_id, metric, period)
    return get_dashboard_response

@api.get("/location/{location}", response_model=HttpResponseModel)
def explore_by_location(location: str):
    response = post_service.get_posts_by_location(location)
    return response

@api.get("/hashtag/{hashtag}", response_model=HttpResponseModel)
def explore_by_hashtag(hashtag: str):
    response = post_service.get_posts_by_hashtag(hashtag)
    return response
