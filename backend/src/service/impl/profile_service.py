from sqlalchemy.orm import Session
from src.engine import postgresql_engine
from src.models.user import User
from src.schemas.profile import ProfileUpdate, ProfileResponse
from src.schemas.response import HttpResponseModel
from sqlalchemy import select

def get_profile(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            user = session.execute(select(User).where(User.id == user_id)).scalars().first()
            if not user:
                return None
            profile = ProfileResponse(
                name=user.name,
                username=user.user_name,
                email=user.email,
                bio=user.bio,
                photo=user.profile_img_path
            )
            return HttpResponseModel(status_code=200, message="Perfil encontrado", data=profile.dict())
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def update_profile(user_id: int, profile_data: ProfileUpdate):
    try:
        with Session(postgresql_engine) as session:
            user = session.execute(select(User).where(User.id == user_id)).scalars().first()
            if not user:
                return HttpResponseModel(status_code=404, message="Perfil não encontrado")
            if profile_data.name is not None:
                user.name = profile_data.name
            if profile_data.username is not None:
                user.user_name = profile_data.username
            if profile_data.email is not None:
                user.email = profile_data.email
            if profile_data.bio is not None:
                user.bio = profile_data.bio
            if profile_data.photo is not None:
                user.profile_img_path = profile_data.photo
            session.commit()
            return HttpResponseModel(status_code=200, message="Perfil atualizado com sucesso")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
