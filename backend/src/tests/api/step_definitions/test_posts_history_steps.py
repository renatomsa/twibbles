from pytest_bdd import scenarios, given, when, then, parsers
import pytest
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from model.sqlalchemy.post import Post
from model.sqlalchemy.user import User
from model.sqlalchemy.comment import Comment
from src.engine import postgresql_engine 
from src.api.post import post_service
from datetime import datetime

scenarios("../features/posts_history.feature")

# ------ Scenario 1 ------ #

@pytest.fixture
def db_session():
    with Session(postgresql_engine) as session:
        yield session
        session.rollback() 
        session.close()

def create_comment(session : Session, index: int, user_id: int, post_id: int):
    comment = Comment(
        user_id=user_id,
        post_id=post_id,
        content=f"Comentário gerado automaticamente número {index}",
        created_at=datetime.now()
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)

    
@given(parsers.parse('O sistema possui a postagem com ID "{post_id:d}" criada pelo usuário com ID "{user_id:d}"'))
def create_test_post(user_id, post_id, db_session):
    with Session(postgresql_engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.execute(statement).scalars().first()
        
    # Caso o usuário não exista cria um usuário e uma postagem
    if(user is None):
        user = User(id=user_id, user_name="Usuário Teste", password="password", email="user@example.com", is_private=False)
        db_session.add(user)
        db_session.commit()
        post = Post(id=post_id, user_id=user_id, text="description", date_time=datetime(2025, 7, 23))
        db_session.add(post)
        db_session.commit()
    else:
        with Session(postgresql_engine) as session:
            statement = select(Post).where(Post.user_id == user_id, Post.id == post_id)
            post = session.execute(statement).scalars().first()
        if(post is None):
            post = Post(id=post_id, user_id=user_id, text="description", date_time=datetime(2025, 7, 23))
            db_session.add(post)
            db_session.commit()

@when(parsers.parse('O usuário envia uma requisição DELETE para a rota "/post/{user_id:d}/posts/{post_id:d}"'))
def send_delete_request(client, context, user_id, post_id):
    response = client.delete(f"/post/{user_id}/posts/{post_id}").json()
    context["response"] = response

@then(parsers.parse('O sistema não possui a postagem "{post_id:d}" criada pelo usuário com ID "{user_id:d}"'))
def verify_post_deleted(context, post_id):
    with Session(postgresql_engine) as session:
        stmt = select(Post, User).join(Post, Post.user_id == User.id).where(Post.id == post_id)
        post = session.execute(stmt).scalars().first()
    print(context["response"])
    assert post is None, "The post was not deleted"
    assert context["response"]["status_code"] == 200

@then(parsers.parse('A seguinte resposta é enviada pelo sistema para o usuário : Post deleted'))
def check_response(context):
    assert context["response"]["message"] == "Post deleted"

#------ Scenario 2 ------#

@given(parsers.parse('Existe o usuário com ID "{user_id:d}"'))
def verify_user_existence(user_id, db_session):
    with Session(postgresql_engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.execute(statement).scalars().first()
    if(user is None):
        user = User(id=user_id, user_name="Usuário Teste", password="password", email="user@example.com", is_private=False)
        db_session.add(user)
        db_session.commit()

@given(parsers.parse('O usuário com ID "{user_id:d}" possui as postagens "{post1_id:d}", com data "{date1}", "{post2_id:d}" com data "{date2}" e "{post3_id:d}" com data "{date3}"'))
def verify_posts_existence(context, user_id, post1_id, post2_id, post3_id, db_session):
    with Session(postgresql_engine) as session:
        records = session.query(Post).filter(Post.user_id == user_id).all()
        for record in records:
            post_service.delete_post(record.user_id, record.id)
    posts = [
        Post(id=post1_id, user_id=user_id, text="description 1", date_time=datetime(2025, 7, 23)),
        Post(id=post2_id, user_id=user_id, text="description 2", date_time=datetime(2020, 7, 23)),
        Post(id=post3_id, user_id=user_id, text="description 3", date_time=datetime(2013, 1, 10)),
    ]
    db_session.add_all(posts)
    db_session.commit()

@when(parsers.parse('O usuário com ID "{user_id:d}" solicita a primeira página de postagens com limite de "{limit:d}" itens, ordenadas por mais recentes'))
def get_first_posts(client, context, user_id):
   response = client.get(f"/post/{user_id}/posts", params={"sort_by_comment":False}).json()
   context["response"] = response

@then(parsers.parse('A resposta contém a postagem "{post1_id:d}" com data "{date1}", seguida da postagem "{post2_id:d}" com data "{date2}"'))
def check_response(context, date1, date2, post1_id, post2_id):
    response_data = context["response"]['data']
    response_data = response_data[:2]
    response_date1 = response_data[0]['date']
    response_date2 = response_data[1]['date']
    formatted_date1 = datetime.fromisoformat(response_date1).strftime('%d/%m/%Y')
    formatted_date2 = datetime.fromisoformat(response_date2).strftime('%d/%m/%Y')
    assert context["response"]["status_code"] == 200
    assert formatted_date1 == date1 and response_data[0]['id'] == post1_id
    assert formatted_date2 == date2 and response_data[1]['id'] == post2_id

#------ Scenario 3 ------#

@given(parsers.parse('Existe o usuário com ID "{user_id:d}"'))
def verify_user_existence(user_id, db_session):
    with Session(postgresql_engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.execute(statement).scalars().first()
    if(user is None):
        user = User(id=user_id, user_name="Usuário Teste", password="password", email="user@example.com", is_private=False)
        db_session.add(user)
        db_session.commit()

@given(parsers.parse('O usuário com ID "{user_id:d}" possui as postagens "{post1_id:d}", com "{comments1:d}" comentários, "{post2_id:d}" com "{comments2:d}" comentários e "{post3_id:d}" com "{comments3:d}" comentários'))
def verify_posts_existence(user_id, post1_id, post2_id, post3_id, comments1, comments2, comments3, db_session):

    with Session(postgresql_engine) as session:
        records = session.query(Post).filter(Post.user_id == user_id).all()
        for record in records:
            post_service.delete_post(record.user_id, record.id)

    # Apagando todoso os comentários no banco
    statement = delete(Comment)
    db_session.execute(statement)
    db_session.commit()

    # Criando posts pro usuário
    posts = [
        Post(id=post1_id, user_id=user_id, text="description 1", date_time=datetime(2020, 7, 23)),
        Post(id=post2_id, user_id=user_id, text="description 2", date_time=datetime(2013, 7, 23)),
        Post(id=post3_id, user_id=user_id, text="description 3", date_time=datetime(2025, 1, 10)),
    ]
    db_session.add_all(posts)
    db_session.commit()

    # Criando o número de comentários necessários pra cada post
    for comment in range(0, comments1 * 3, 3):
        create_comment(db_session, comment, user_id, post1_id)
    for comment in range(0, comments2 * 3, 3):
        create_comment(db_session, comment + 1, user_id, post2_id)
    for comment in range(0, comments3 * 3, 3):
        create_comment(db_session, comment + 2, user_id, post3_id)

@when(parsers.parse('O usuário com ID "{user_id:d}" solicita a primeira página de postagens com limite de "{limit:d}" itens, ordenadas por mais comentados'))
def get_first_posts(client, context, user_id):
   response = client.get(f"/post/{user_id}/posts", params={"sort_by_comment":True}).json()
   context["response"] = response

@then(parsers.parse('A resposta contém a postagem "{post2_id:d}" com "{comments2:d}" comentários, seguida da postagem "{post3_id:d}" com "{comments3:d}" comentários'))
def check_response(context, comments2, comments3, post3_id, post2_id):
    comments = context["response"]["data"][1]
    posts = context["response"]["data"][0]
    assert context["response"]["status_code"] == 200
    assert posts[0]["id"] == post2_id and comments[0] == comments2
    assert posts[1]["id"] == post3_id and comments[1] == comments3