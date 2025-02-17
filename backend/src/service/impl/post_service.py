from src.engine import postgresql_engine
from sqlalchemy.orm import Session
from model.sqlalchemy.user import User
from model.pydantic.user import User as UserPydantic

from model.sqlalchemy.post import Post
from model.pydantic.post import Post as PostPydantic

from src.schemas.response import HttpResponseModel

from sqlalchemy import select

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