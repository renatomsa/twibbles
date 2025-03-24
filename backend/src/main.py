from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI
from src.api.router import api_router
from typing import Annotated

from model.pydantic.user import User as UserPydantic
from model.pydantic.user import CreateUser
from model.sqlalchemy.user import User
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.engine import postgresql_engine
from src.schemas.response import HttpResponseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)


def login_dep(user_email: str, password: str):
    return {"user_email": user_email, "password": password}


@app.post("/login")
def login(login_data: Annotated[dict, Depends(login_dep)]):
    return login_method(login_data["user_email"], login_data["password"])


def login_method(user_email: str, password: str):
    """Insecure login method for simplicity

    Args:
        user_email (str)
        password (str)

    Returns:
        HttpResponseModel: response object
    """
    try:
        with Session(postgresql_engine) as session:
            statement = select(User).where(User.email == user_email).limit(1)
            user = session.execute(statement).scalars().first()

            if user is None:
                return HttpResponseModel(status_code=404, message="User not found")

            if user.password != password:
                return HttpResponseModel(status_code=401, message="Incorrect password")

            token = {"user_id": user.id, "type": "access_token"}
            return HttpResponseModel(status_code=200,
                                     message="login successful",
                                     data=token)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
