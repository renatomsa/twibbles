from fastapi import APIRouter
from src.schemas.response import HttpResponseModel
import src.service.impl.follow_service as follow_service

api = APIRouter()


@api.get("/{user_id}/following", response_model=HttpResponseModel)
def get_following(user_id: int):
    get_following_response = follow_service.get_following(user_id)
    return get_following_response


@api.get("/{user_id}/followers", response_model=HttpResponseModel)
def get_followers(user_id: int):
    get_followers_response = follow_service.get_followers(user_id)
    return get_followers_response


@api.post("/{follower_id}/follow/{followed_id}", response_model=HttpResponseModel)
def follow(follower_id: int, followed_id: int):
    follow_response = follow_service.follow(follower_id, followed_id)
    return follow_response


@api.post("/{follower_id}/unfollow/{followed_id}", response_model=HttpResponseModel)
def unfollow(follower_id: int, followed_id: int):
    unfollow_response = follow_service.unfollow(follower_id, followed_id)
    return unfollow_response    


@api.post("/{requester_id}/accept_request/{requested_id}", response_model=HttpResponseModel)
def accept_follow_request(requester_id: int, requested_id: int):
    accept_follow_request_response = follow_service.accept_follow_request(requester_id, requested_id)
    return accept_follow_request_response


@api.post("/{requester_id}/reject_request/{requested_id}", response_model=HttpResponseModel)
def reject_follow_request(requester_id: int, requested_id: int):
    reject_follow_request_response = follow_service.reject_follow_request(requester_id, requested_id)
    return reject_follow_request_response


@api.get("/{user_id}/follow_requests_as_requester", response_model=HttpResponseModel)
def get_follow_requests_as_requester(user_id: int):
    get_follow_requests_by_requester_id_response = follow_service.get_follow_requests_by_requester_id(user_id)
    return get_follow_requests_by_requester_id_response


@api.get("/{user_id}/follow_requests_as_requested", response_model=HttpResponseModel)
def get_follow_requests_as_requested(user_id: int):
    get_follow_requests_by_requested_id_response = follow_service.get_follow_requests_by_requested_id(user_id)
    return get_follow_requests_by_requested_id_response