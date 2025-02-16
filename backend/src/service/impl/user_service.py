from src.engine import postgresql_engine
from sqlalchemy.orm import Session
from model.sqlalchemy.user import User
from model.pydantic.user import User as UserPydantic

from src.schemas.response import HttpResponseModel

from sqlalchemy import select


def get_user(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(User).where(User.id == user_id).limit(1)
            user = session.execute(statement).scalars().first()

            if user is None:
                return HttpResponseModel(status_code=404, message="User not found")

            user = UserPydantic(id=user.id,
                                user_name=user.user_name,
                                email=user.email,
                                is_private=user.is_private).model_dump()

            return HttpResponseModel(status_code=200,
                                     message="User found",
                                     data=user)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
