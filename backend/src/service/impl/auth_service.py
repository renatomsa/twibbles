from sqlalchemy import select
from sqlalchemy.orm import Session
from src.engine import postgresql_engine
from src.schemas.response import HttpResponseModel
from model.sqlalchemy.user import User
import bcrypt
import secrets

# Simulação de um armazenamento temporário para tokens de redefinição de senha
password_reset_tokens = {}

def login(identifier: str, password: str):
    """
    Realiza o login verificando nome de usuário ou e-mail
    """
    try:
        with Session(postgresql_engine) as session:
            statement = select(User).where((User.user_name == identifier) | (User.email == identifier))
            user = session.execute(statement).scalars().first()

            if not user:
                return HttpResponseModel(status_code=404, message="Usuário não encontrado")

            if not bcrypt.checkpw(password.encode(), user.password.encode()):
                return HttpResponseModel(status_code=401, message="Senha incorreta")

            return HttpResponseModel(status_code=200, message="Login efetuado com sucesso!")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def request_password_reset(email: str):
    """
    Gera um token de redefinição de senha e armazena temporariamente
    """
    try:
        with Session(postgresql_engine) as session:
            statement = select(User).where(User.email == email)
            user = session.execute(statement).scalars().first()

            if not user:
                return HttpResponseModel(status_code=404, message="Usuário não encontrado")

            token = secrets.token_urlsafe(16)
            password_reset_tokens[token] = user.id  # Armazena temporariamente

            return HttpResponseModel(status_code=200, message="Link de redefinição de senha enviado para o e-mail")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def confirm_password_reset(token: str, new_password: str, confirm_password: str):
    """
    Valida o token e redefine a senha do usuário
    """
    try:
        if token not in password_reset_tokens:
            return HttpResponseModel(status_code=400, message="Token inválido ou expirado")

        if new_password != confirm_password:
            return HttpResponseModel(status_code=400, message="As senhas não coincidem")

        user_id = password_reset_tokens.pop(token)  # Remove o token após o uso

        with Session(postgresql_engine) as session:
            statement = select(User).where(User.id == user_id)
            user = session.execute(statement).scalars().first()

            if not user:
                return HttpResponseModel(status_code=404, message="Usuário não encontrado")

            hashed_password = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
            user.password = hashed_password
            session.commit()

            return HttpResponseModel(status_code=200, message="Senha redefinida com sucesso")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
