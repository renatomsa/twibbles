import pytest
from pytest_bdd import given, parsers, scenarios, then, when
from sqlalchemy import select
from sqlalchemy.orm import Session
from model.sqlalchemy.user import User
from src.engine import postgresql_engine

# Carregar os cenários do arquivo de feature
scenarios("../features/post.feature")

# ------------------------ Cenário 1: Postagem válida ---------------------------


@given(parsers.parse('O usuário "{user_name}" existe na plataforma Twibbles e tem o ID "{user_id:d}" 1'))
def user_exists_valid(context, user_id, user_name):
    context["user_id"] = user_id
    with Session(postgresql_engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.execute(statement).scalars().first()

        assert user is not None, f"User {user_name} not found"
        assert user.user_name == user_name, f"User {user_name} not found"


@when(parsers.parse('"{user_name}" cria uma postagem com o texto "{text}" 1'))
def create_valid_post(context, text, client, user_name):
    user_id = context["user_id"]
    response = client.post(f"/post/{user_id}/post", json={"text": text}).json()
    print("Response: ", response)
    context["response"] = response


@then(parsers.parse('O sistema retorna status {expected_status:d} com a mensagem "{expected_message}" 1'))
def check_valid_post_status(context, expected_status, expected_message):
    assert context["response"]["status_code"] == int(expected_status)
    assert context["response"]["message"] == expected_message

