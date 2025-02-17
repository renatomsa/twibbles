from src.engine import postgresql_engine
from sqlalchemy.orm import Session
from model.sqlalchemy.user import User

from model.sqlalchemy.post import Post
from model.pydantic.post import Post as PostPydantic

from model.sqlalchemy.comment import Comment
from model.pydantic.comment import CommentBase as CommentPydantic

from model.sqlalchemy.following import Following as Following
from model.pydantic.following import Following as FollowingPydantic

from datetime import datetime, timedelta

from src.schemas.response import HttpResponseModel

from sqlalchemy import select, func, and_

def get_posts(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(Post, User).join(User, User.id == Post.user_id).where(Post.user_id == user_id).order_by(Post.date_time.desc())
            posts = session.execute(statement).fetchall()

            if posts is None:
                return HttpResponseModel(status_code=404, message="No posts were found")

            result = []
            for p in posts:
                p = p.Post
                post = PostPydantic(id=p.id,
                                    user_id=p.user_id,
                                    text=p.text,
                                    date_time=p.date_time).model_dump()
                result.append(post)

            return HttpResponseModel(status_code=200,
                                     message="Posts found",
                                     data=result)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
    
def delete_post(user_id: int, post_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = select(Post, User).join(User, User.id == Post.user_id).where(Post.id == post_id)
            post = session.execute(statement).scalars().first()

            if post is None:
                return HttpResponseModel(status_code=404, message="Post not found")

            if post.user_id != user_id:
                return HttpResponseModel(status_code=403, message="Unauthorized to delete post")

            session.delete(post)
            session.commit()

            return HttpResponseModel(status_code=200,
                                     message="Post deleted")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def get_date_range(period):
    end_date = datetime.today()
    if period == "last_7_days":
        start_date = end_date - timedelta(days=7)
    elif period == "last_30_days":
        start_date = end_date - timedelta(days=30)
    elif period == "last_365_days":
        start_date = end_date - timedelta(days=365)
    else:
        raise ValueError("Invalid flag. Use 'last_7_days', 'last_30_days', or 'last_365_days'.")

    return start_date, end_date

def get_dashboard_data(user_id: int, period: str):
    start_date, end_date = get_date_range(period)
    try:
        with Session(postgresql_engine) as session:
            # Calcular o número médio de comentários no intervalo de tempo
            statement = select(func.avg(func.count(Comment.id))).join(Post, Post.id == Comment.post_id).where(Post.user_id == user_id, Comment.created_at.between(start_date, end_date)).group_by(Post.id)
            comment_avg = session.execute(statement).scalar()

            # Pegar todos os comentários nos posts de um usuário ao longo do tempo
            statement = (
                select(
                    func.date(Comment.created_at).label("comment_date"), 
                    func.count(Comment.id).label("comment_count") 
                )
                .join(Post, Post.id == Comment.post_id)  
                .where(and_(Post.user_id == user_id, Comment.created_at.between(start_date, end_date)))  # Filtrando posts do usuário
                .group_by(func.date(Comment.created_at)) 
                .order_by("comment_date")
            )

            # Executar a query
            comments = session.execute(statement).all()

            result = []
            result.append(comment_avg)
            for c in comments:            
                result.append(c)

            return HttpResponseModel(status_code=200,
                                     message="Dashboard ready",
                                     data=result)
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))