from pytest_bdd import scenarios, given, when, then, parsers
import pytest
from sqlalchemy.orm import Session
from sqlalchemy import select, text
from model.sqlalchemy.post import Post
from model.sqlalchemy.user import User
from model.sqlalchemy.comment import Comment
from src.engine import postgresql_engine
from src.api.post import post_service
from datetime import datetime, timedelta

scenarios("../features/dashboard.feature")

# ------ Scenario 1 ------ #
@pytest.fixture
def db_session():
    with Session(postgresql_engine) as session:
        yield session
        session.rollback()
        session.close()

@given(parsers.parse('Existe um usuário de ID "{user_id:d}"'))
def user_exists(context, user_id):
    context['user_id'] = user_id
    with Session(postgresql_engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.execute(statement).scalars().first()
    if(user is None):
        user = User(id=user_id, user_name="Usuário Teste", password="password", email="user@example.com", is_private=False)
        db_session.add(user)
        db_session.commit()

@given(parsers.parse('O filtro selecionado para a categoria intervalo de tempo considerado é "{days:d}" dias'))
def set_time_filter(context, days):
    context["days"] = days

@given(parsers.parse('existem comentários registrados nas postagens desse usuário ao longo dos últimos "{days:d}" dias'))
def comments_exist(db_session, context):
    with Session(postgresql_engine) as session:
        post = session.get(Post, 0)
        if post:
            post_service.delete_post(context["user_id"], 0)
    days_count = 5
    post = Post(id=0, user_id=context["user_id"], text="description", date_time=datetime.now() - timedelta(days=days_count))
    db_session.add(post)
    comment = Comment(id=0, post_id=0, user_id=context["user_id"], content="comment", created_at=datetime.now())
    db_session.add(comment)
    db_session.commit()

@when(parsers.parse('o sistema recebe uma requisição GET "/post/{user_id:d}/dashboard" com parameto de período igual a "{days:d}" dias'))
def send_get_request(context, user_id, client, days):
    response = client.get(f"/post/{user_id}/dashboard", params={"period":days}).json()
    context["response"] = response

@then(parsers.parse('o sistema retorna uma mensagem contendo o número de comentários do usuário ao longo dos últimos "{days}" dias'))
def check_comment_count(context, days):
    response = context["response"]
    assert context["response"], f'Expected comments but response was empty: {response}'

@then(parsers.parse('o status da resposta é 200 OK'))
def check_status_code(context):
    status = context["response"]["status_code"]
    assert context["response"]["status_code"] == 200, f'Expected 200, but got {status}'


# ------ Scenario 2 ------ #

@given(parsers.parse('Existe um usuário de ID "{user_id:d}" 2'))
def user_exists(db_session, context, user_id):
    context['user_id'] = user_id
    with Session(postgresql_engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.execute(statement).scalars().first()
    if(user is None):
        user = User(id=user_id, user_name="Usuário Teste", password="password", email="user@example.com", is_private=False)
        db_session.add(user)
        db_session.commit()

@given(parsers.parse('O filtro selecionado para a categoria intervalo de tempo considerado é "{days:d}" dias'))
def selected_filter(context, days):
    context["days"] = days

@given(parsers.parse('Não existem comentários registrados nas postagens desse usuário ao longo dos últimos "{days:d}" dias'))
def no_comments(db_session, context, days):
    db_session.execute(text("DELETE FROM comments C WHERE C.post_id IN (SELECT P.id FROM posts P WHERE P.user_id = :user_id)"), {"user_id": context["user_id"]})
    db_session.commit()

@when(parsers.parse('o sistema recebe uma requisição GET "/post/{user_id:d}/dashboard" com parâmeto de período igual a "{days:d}" dias'))
def get_dashboard_request(context, user_id, days, client):
    response = client.get(f"/post/{user_id}/dashboard", params={"period":days}).json()
    context["response"] = response

@then(parsers.parse('o sistema retorna uma mensagem informando que o usuário não possui comentários ao longo dos últimos "{days:d}" dias'))
def check_response_message(context, days):
    response = context['response']['message']
    assert context['response']['message'] == "No comments were found", f'Expected No comments were found, but got {response}'

@then(parsers.parse('o status da resposta é 404 NOT FOUND'))
def check_status_code(context):
    status = context['response'].status_code
    assert context["response"]["status_code"] == 404, f'Expected status 404 but got {status}'
