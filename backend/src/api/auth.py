from fastapi import APIRouter, HTTPException
from src.schemas.response import HttpResponseModel
import src.service.impl.auth_service as auth_service

api = APIRouter()

@api.get("/login", response_model=HttpResponseModel)
def login(identifier: str, password: str):
    """
    Login usando nome de usuário ou e-mail
    """
    response = auth_service.login(identifier, password)
    return response

@api.post("/password_reset/request", response_model=HttpResponseModel)
def request_password_reset(email: str):
    """
    Solicitar link de redefinição de senha
    """
    response = auth_service.request_password_reset(email)
    return response

@api.post("/password_reset/confirm", response_model=HttpResponseModel)
def confirm_password_reset(token: str, new_password: str, confirm_password: str):
    """
    Confirmar redefinição de senha com token
    """
    response = auth_service.confirm_password_reset(token, new_password, confirm_password)
    return response
