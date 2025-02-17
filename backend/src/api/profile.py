from fastapi import APIRouter, Depends, HTTPException, status
from src.schemas.profile import ProfileUpdate, ProfileResponse
from src.service.impl import profile_service
from src.schemas.response import HttpResponseModel
from src.dependencies.auth import get_current_user

api = APIRouter()

@api.get("/{user_id}", response_model=HttpResponseModel)
def get_profile(user_id: int, current_user=Depends(get_current_user)):
    profile_data = profile_service.get_profile(user_id)
    if profile_data is None:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    return profile_data

@api.put("/{user_id}", response_model=HttpResponseModel)
def update_profile(user_id: int, profile_update: ProfileUpdate, current_user=Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Autenticação necessária")
    if not profile_update.bio:
        raise HTTPException(status_code=400, detail="Biografia é um campo obrigatório")
    if profile_update.photo and not profile_update.photo.lower().endswith(('.jpg', '.png', '.jpeg')):
        raise HTTPException(status_code=400, detail="Formato de foto inválido")
    update_result = profile_service.update_profile(user_id, profile_update)
    return update_result
