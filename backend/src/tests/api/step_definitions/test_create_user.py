from pytest_bdd import scenarios, given, when, then, parsers
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from model.sqlalchemy.post import Post
from model.sqlalchemy.user import User
from model.sqlalchemy.comment import Comment
from src.engine import postgresql_engine 

scenarios('../features/cadastro.feature')

# ------------------------ Scenario 1: Cadastro com sucesso ------------------------

@given('Nenhum usuário foi cadastrado ainda 1')
def nenhum_usuario_cadastrado_1():
    with Session(postgresql_engine) as session:
        statement = select(User)
        user = session.execute(statement).scalars().first()
        if(user is not None):
            statement = delete(User)
            session.execute(statement)
            session.commit()

@when(parsers.parse('uma requisição "POST" for enviada para "/user/create_user" 1 com os dados:\n   nome de usuário: "{user_name}"\n    email: "{email}"\n    senha: "{senha}"\n 1'))
def send_post_create_user_success(context, user_name, email, senha, client):
    payload = {
        "user_name": user_name,
        "email": email,
        "password": senha,
        "is_private": False,
    }
    response = client.post("/user/create_user", json=payload)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status:d}" 1'))
def check_create_user_status_1(context, expected_status):
    actual_status = context["response"]["status_code"]
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('o usuário é cadastrado com o id = "{expected_id:d}" 1'))
def check_created_user_id(context, expected_id):
    data = context["response"].get("data", {})
    actual_id = data.get("id")
    assert actual_id == expected_id, f"ID esperado {expected_id}, mas obtido {actual_id}"

@then(parsers.parse('a mensagem deve ser "{expected_message}" 1'))
def check_create_user_message_1(context, expected_message):
    actual_message = context["response"].get("message", "")
    assert actual_message == expected_message, f"Mensagem esperada '{expected_message}', mas obtida '{actual_message}'"

# ------------------------ Scenario 2: Cadastro com email inválido ------------------------

@given('Nenhum usuário foi cadastrado ainda 2')
def nenhum_usuario_cadastrado_2(context):
    context["db_clean"] = True

@when(parsers.parse('uma requisição "POST" for enviada para "/create_user" 2 com os dados:\n    nome: "{nome}"\n    nome de usuário: "{user_name}"\n    email: "{email}"\n    senha: "{senha}"\n 2'))
def send_post_create_user_invalid_email(context, nome, user_name, email, senha, client):
    payload = {
        "user_name": user_name,
        "email": email,
        "password": senha,
        "is_private": False,
        "profile_img_path": "",
        "bio": nome
    }
    response = client.post("/create_user", json=payload)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 2'))
def check_create_user_status_2(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('a mensagem deve ser "{expected_message}" 2'))
def check_create_user_message_2(context, expected_message):
    actual_message = context["response"].get("message", "")
    assert actual_message == expected_message, f"Mensagem esperada '{expected_message}', mas obtida '{actual_message}'"

# ------------------------ Scenario 3: Cadastro com nome de usuário já existente ------------------------

@given(parsers.parse('o usuário de id = "{user_id}" e nome de usuário = "{user_name}" já foi cadastrado 3'))
def user_already_registered(context, user_id, user_name, client):
    user_id_int = int(user_id)
    payload = {
        "user_name": user_name,
        "email": "existente@example.com",
        "password": "senha123",
        "confirm_password": "senha123",
        "is_private": False,
        "profile_img_path": "",
        "bio": "Usuário Existente"
    }
    response = client.post("/create_user", json=payload)
    response_data = response.json()
    assert response_data["status_code"] == 201, f"Falha ao cadastrar usuário existente"
    context["existing_user_id"] = user_id_int
    context["existing_user_name"] = user_name

@when(parsers.parse('uma requisição "POST" for enviada para "/create_user" 3 com os dados:\n    nome: "{nome}"\n    nome de usuário: "{user_name}"\n    email: "{email}"\n    senha: "{senha}"\n    confirmação de senha: "{confirm_senha}" 3'))
def send_post_create_user_existing(context, nome, user_name, email, senha, confirm_senha, client):
    payload = {
        "user_name": user_name,
        "email": email,
        "password": senha,
        "confirm_password": confirm_senha,
        "is_private": False,
        "profile_img_path": "",
        "bio": nome
    }
    response = client.post("/create_user", json=payload)
    context["response"] = response.json()

@then(parsers.parse('o status da resposta deve ser "{expected_status}" 3'))
def check_create_user_status_3(context, expected_status):
    expected_status = int(expected_status)
    actual_status = context["response"].get("status_code")
    assert actual_status == expected_status, f"Status esperado {expected_status}, mas obtido {actual_status}"

@then(parsers.parse('a mensagem deve ser "{expected_message}" 3'))
def check_create_user_message_3(context, expected_message):
    actual_message = context["response"].get("message", "")
    assert actual_message == expected_message, f"Mensagem esperada '{expected_message}', mas obtida '{actual_message}'"