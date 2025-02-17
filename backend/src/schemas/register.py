from pydantic import BaseModel, EmailStr, Field, validator

class UserRegisterRequest(BaseModel):
    nome: str = Field(..., example="Alice Peruniz")
    user_name: str = Field(..., example="aliceperuniz")
    email: EmailStr = Field(..., example="alice@example.com")
    senha: str = Field(..., example="senha123")
    confirma_senha: str = Field(..., example="senha123")

    @validator('confirma_senha')
    def senhas_devem_conferir(cls, v, values):
        if 'senha' in values and v != values['senha']:
            raise ValueError("Senhas não coincidem")
        return v
