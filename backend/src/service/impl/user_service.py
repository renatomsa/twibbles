from model.pydantic.user import User as UserPydantic
from model.sqlalchemy.user import User
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.engine import postgresql_engine
from src.schemas.response import HttpResponseModel
from src.schemas.user import UserRegisterRequest
from pydantic.error_wrappers import ValidationError


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
                                is_private=user.is_private,
                                profile_img_path=user.profile_img_path,
                                bio=user.bio,
                                ).model_dump()

            return HttpResponseModel(status_code=200,
                                     message="User found",
                                     data=user)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def get_users_by_substring(substring: str):
    try:
        with Session(postgresql_engine) as session:
            statement = select(User).where(User.user_name.contains(substring))
            users = session.execute(statement).scalars().all()

            users = [UserPydantic(id=user.id,
                                  user_name=user.user_name,
                                  profile_img_path=user.profile_img_path,
                                  ).model_dump() for user in users]

            return HttpResponseModel(status_code=200,
                                     message="Users found",
                                     data=users)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
    
def update_user_privacy(user_id: int, is_private: bool):
    try:
        with Session(postgresql_engine) as session:
            statement = select(User).where(User.id == user_id).limit(1)
            user = session.execute(statement).scalars().first()

            if user is None:
                return HttpResponseModel(status_code=404, message="User not found")
            
            user.is_private = is_private
            session.commit()

            return HttpResponseModel(status_code=200,
                                        message="User privacy updated")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def register_user(user_data: UserRegisterRequest):
    try:
        # Caso haja alguma inconsistência no payload, o Pydantic já terá levantado a exceção
        with Session(postgresql_engine) as session:
            # Verificar se o nome de usuário já existe
            stmt = select(User).where(User.user_name == user_data.user_name).limit(1)
            user_existente = session.execute(stmt).scalars().first()
            if user_existente:
                return HttpResponseModel(
                    status_code=409, 
                    message="Nome de usuário já existe"
                )

            # Criação do novo usuário
            # Aqui, lembre de realizar o hash da senha antes de salvar (caso necessário)
            novo_usuario = User(
                nome=user_data.nome,
                user_name=user_data.user_name,
                email=user_data.email,
                senha=user_data.senha,  # Considere aplicar hashing!
                is_private=False  # Valor default ou conforme sua lógica
            )
            session.add(novo_usuario)
            session.commit()
            session.refresh(novo_usuario)

            return HttpResponseModel(
                status_code=201,
                message="Usuário registrado com sucesso!",
                data={"id": novo_usuario.id}
            )
    except ValidationError as e:
        # Caso alguma validação do schema falhe (por exemplo, senhas não coincidem ou email inválido)
        error_msg = e.errors()[0]['msg'] if e.errors() else "Dados inválidos"
        return HttpResponseModel(status_code=400, message=error_msg)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
