from fastapi import APIRouter
from src.schemas.response import HttpResponseModel
import src.service.impl.post_service as post_service
import src.service.impl.follow_service as follow_service

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

@api.post("/{user_id}/posts/{text}", response_model=HttpResponseModel)
def post_post(user_id : int, text : str):
    post_post_response = post_service.post_post(user_id, text)
    return post_post_response

@api.get("/{user_id}/feed", response_model=HttpResponseModel)
def load_feed(user_id: int):
    following_ids = follow_service.get_following_ids(user_id).data or []
    load_feed_response = post_service.load_feed(following_ids)
    return load_feed_response

@api.get("/location/{location}", response_model=HttpResponseModel)
def explore_by_location(location: str):
    response = post_service.get_posts_by_location(location)
    return response

@api.get("/hashtag/{hashtag}", response_model=HttpResponseModel)
def explore_by_hashtag(hashtag: str):
    response = post_service.get_posts_by_hashtag(hashtag)
    return response
