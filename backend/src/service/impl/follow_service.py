from src.engine import postgresql_engine
from sqlalchemy.orm import Session
from model.sqlalchemy.user import User
from model.sqlalchemy.following import Following
from model.sqlalchemy.follow_requests import FollowRequest
from model.pydantic.user import User as UserPydantic
from model.pydantic.follow_request import FollowRequest as FollowRequestPydantic
from src.schemas.response import HttpResponseModel

from src.service.impl.user_service import get_user

from sqlalchemy import select


def get_following(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(Following, User).join(User, Following.followed_id == User.id).where(Following.follower_id == user_id)
            following = session.execute(statement).fetchall()
            result = []
            for f in following:
                f = f.User
                user = UserPydantic(id=f.id,
                                    user_name=f.user_name,
                                    email=f.email,
                                    is_private=f.is_private).model_dump()
                result.append(user)

            return HttpResponseModel(status_code=200, message="Followed users retrieved successfully", data=result)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def get_followers(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(Following, User).join(User, Following.follower_id == User.id).where(Following.followed_id == user_id)
            followers = session.execute(statement).fetchall()
            result = []
            for f in followers:
                f = f.User
                user = UserPydantic(id=f.id,
                                    user_name=f.user_name,
                                    email=f.email,
                                    is_private=f.is_private).model_dump()
                result.append(user)

            return HttpResponseModel(status_code=200, message="Followers retrieved successfully", data=result)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def follow(follower_id: int, followed_id: int):
    try:
        if follower_id == followed_id:
            return HttpResponseModel(status_code=400, message="User cannot follow themselves")
        with Session(postgresql_engine) as session:
            # check if the user is already following
            statement = select(Following).where(Following.follower_id == follower_id, Following.followed_id == followed_id)
            following = session.execute(statement).fetchone()
            if following is not None:
                return HttpResponseModel(status_code=400, message="User is already following")
            # first check if the user is private or not
            followed_user = get_user(followed_id).data
            if followed_user["is_private"]:
                return request_follow(follower_id, followed_id)
            session.add(Following(follower_id=follower_id, followed_id=followed_id))
            session.commit()
            return HttpResponseModel(status_code=201, message="Followed successfully")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def request_follow(follower_id: int, followed_id: int):
    try:
        with Session(postgresql_engine) as session:
            # first check if the user is already requested
            statement = select(FollowRequest).where(FollowRequest.requester_id == follower_id).where(FollowRequest.requested_id == followed_id)
            follow_request = session.execute(statement).fetchone()
            if follow_request is not None:
                return HttpResponseModel(status_code=400, message="Follow request already sent")

            session.add(FollowRequest(requester_id=int(follower_id), requested_id=int(followed_id)))
            session.commit()
            return HttpResponseModel(status_code=201, message="Follow request sent")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def accept_follow_request(requester_id: int, requested_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(FollowRequest).where(FollowRequest.requester_id == requester_id, FollowRequest.requested_id == requested_id)
            follow_request = session.execute(statement).fetchone()
            if follow_request is None:
                return HttpResponseModel(status_code=404, message="Follow request not found")
            follow_request = follow_request[0]
            session.delete(follow_request)
            session.add(Following(follower_id=int(requester_id), followed_id=int(requested_id)))
            session.commit()
            return HttpResponseModel(status_code=201, message="Follow request accepted")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def reject_follow_request(requester_id: int, requested_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(FollowRequest).where(FollowRequest.requester_id == requester_id, FollowRequest.requested_id == requested_id)
            follow_request = session.execute(statement).fetchone()
            if follow_request is None:
                return HttpResponseModel(status_code=404, message="Follow request not found")
            follow_request = follow_request[0]
            session.delete(follow_request)
            session.commit()
            return HttpResponseModel(status_code=200, message="Follow request rejected")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def unfollow(follower_id: int, followed_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(Following).where(Following.follower_id == follower_id, Following.followed_id == followed_id)
            following = session.execute(statement).fetchone()
            if following is None:
                return HttpResponseModel(status_code=400, message="User is not following")
            following = following[0]
            session.delete(following)
            session.commit()
            return HttpResponseModel(status_code=200, message="Unfollowed successfully")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def get_follow_requests_by_requester_id(requester_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(FollowRequest, User).join(User, FollowRequest.requested_id == User.id).where(FollowRequest.requester_id == requester_id)
            follow_requests = session.execute(statement).fetchall()
            result = []
            for f in follow_requests:
                follow_request = f.FollowRequest
                u = f.User
                requested = UserPydantic(id=u.id,
                                         user_name=u.user_name,
                                         email=u.email,
                                         is_private=u.is_private).model_dump()
                to_append = FollowRequestPydantic(requester_id=follow_request.requester_id,
                                                  requested_id=follow_request.requested_id,
                                                  requested=requested).model_dump()
                result.append(to_append)
            return HttpResponseModel(status_code=200, message="OK", data=result)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))


def get_follow_requests_by_requested_id(requested_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(FollowRequest, User).join(User, FollowRequest.requester_id == User.id).where(FollowRequest.requested_id == requested_id)
            follow_requests = session.execute(statement).fetchall()
            result = []
            for f in follow_requests:
                follow_request = f.FollowRequest
                u = f.User
                requester = UserPydantic(id=u.id,
                                         user_name=u.user_name,
                                         email=u.email,
                                         is_private=u.is_private).model_dump()
                to_append = FollowRequestPydantic(requester_id=follow_request.requester_id,
                                                  requested_id=follow_request.requested_id,
                                                  requester=requester).model_dump()
                result.append(to_append)
            return HttpResponseModel(status_code=200, message="OK", data=result)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))