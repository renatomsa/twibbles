from src.engine import postgresql_engine
from sqlalchemy.orm import Session
from model.sqlalchemy.user import User
from model.sqlalchemy.post import Post
from model.pydantic.post import Post as PostPydantic
from model.pydantic.post import CreatePost as CreatePostPydantic
from src.service.impl import follow_service
from model.sqlalchemy.comment import Comment
from model.sqlalchemy.following import Following as Following
from datetime import datetime, timedelta
from src.schemas.response import HttpResponseModel
from sqlalchemy import select, func, and_, cast, Date, desc, delete

def get_posts(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = (
                select(Post, User)
                .join(User, User.id == Post.user_id)
                .where(Post.user_id == user_id)
                .order_by(Post.date_time.desc())
            )
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
    
def get_posts_sorted_by_comment(user_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = (
                select(Post.text, Post.date_time, Comment.post_id, func.count(Comment.id).label("comment_count"))
                .join(Post, Post.id == Comment.post_id)
                .where(Post.user_id == user_id)
                .group_by(Comment.post_id, Post.text, Post.date_time)
                .order_by(desc(func.count(Comment.id)))
            )
            posts = session.execute(statement).fetchall()
            result_posts = []
            result_comments = []
            for p in posts:
                post = PostPydantic(
                                    id=p.post_id,
                                    user_id=user_id,
                                    text=p.text,
                                    date_time=p.date_time).model_dump()
                result_posts.append(post)
                result_comments.append(p.comment_count)
    
            if posts is None:
                return HttpResponseModel(status_code=404, message="No posts were found")
            return HttpResponseModel(status_code=200,
                                     message="Posts found",
                                     data=(result_posts, result_comments))
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def delete_post(user_id: int, post_id: int):
    try:
        with Session(postgresql_engine) as session:
            statement = (
                select(Post, User)
                .join(User, User.id == Post.user_id)
                .where(Post.id == post_id)
            )
            post = session.execute(statement).scalars().first()

            if post is None:
                return HttpResponseModel(status_code=404, message="Post not found")

            if post.user_id != user_id:
                return HttpResponseModel(status_code=403, message="Unauthorized to delete post")
            
            session.execute(delete(Comment).where(Comment.post_id == post_id))
            session.delete(post)
            session.commit()

            return HttpResponseModel(status_code=200,
                                     message="Post deleted")
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))

def get_posts_by_location(location: str) -> HttpResponseModel:
    try:
        with Session(postgresql_engine) as session:
            stmt = (
                select(Post)
                .where(Post.location == location)
                .order_by(Post.date_time.desc())
            )
            posts = session.execute(stmt).scalars().all()

            if not posts:
                return HttpResponseModel(
                    status_code=404,
                    message="No posts found for this location"
                )

            post_list = [PostPydantic.model_validate(p) for p in posts]

            return HttpResponseModel(
                status_code=200,
                message="Posts found",
                data=post_list
            )
    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )


def get_posts_by_hashtag(hashtag: str) -> HttpResponseModel:
    try:
        with Session(postgresql_engine) as session:
            # Exemplo de busca por substring (caso 'hashtags' armazene "#foo #bar #baz")
            stmt = (
                select(Post)
                .where(Post.hashtags.ilike(f"%{hashtag}%"))
                .order_by(Post.date_time.desc())
            )
            posts = session.execute(stmt).scalars().all()

            if not posts:
                return HttpResponseModel(
                    status_code=404,
                    message="No posts found for this hashtag"
                )

            post_list = [PostPydantic.model_validate(p) for p in posts]

            return HttpResponseModel(
                status_code=200,
                message="Posts found",
                data=post_list
            )
    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )


def create_post(user_id: int, data: dict) -> HttpResponseModel:
    try:
        with Session(postgresql_engine) as session:
            post = Post(user_id=user_id,
                        text=data["text"],
                        location=data["location"],
                        hashtags=data["hashtags"])
            session.add(post)
            session.commit()
            session.refresh(post)

            post = PostPydantic(id=post.id,
                                user_id=post.user_id,
                                text=post.text,
                                location=post.location,
                                hashtags=post.hashtags,
                                date_time=post.date_time
                                ).model_dump()
            return HttpResponseModel(
                status_code=201,
                message="Post created",
                data=post
            )
    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )


def get_feed(user_id: int) -> HttpResponseModel:
    try:
        following = follow_service.get_following(user_id).data
        posts_list = []
        for user in following:
            posts_list += get_posts(user["id"]).data

        posts_list.sort(key=lambda x: x["date_time"], reverse=True)

        return HttpResponseModel(
            status_code=200,
            message="Feed retrieved successfully",
            data=posts_list
        )
    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )


def get_date_range(period):
    end_date = datetime.now()
    if period == 7:
        start_date = end_date - timedelta(days=7)
    elif period == 30:
        start_date = end_date - timedelta(days=30)
    elif period == 365:
        start_date = end_date - timedelta(days=365)
    else:
        raise ValueError("Invalid flag. Use 7, 30, or 365.")

    return start_date, end_date

def get_dashboard_data(user_id: int, period: int) -> HttpResponseModel:
    start_date, end_date = get_date_range(period)
    try:
        with Session(postgresql_engine) as session:
            statement = select(func.count(Comment.id)).join(Post, Post.id == Comment.post_id).where(
                Post.user_id == user_id,
                Comment.created_at.between(start_date, end_date)
            ).group_by(Post.id)

            comment_counts = session.execute(statement).scalars().all()
            comment_avg = sum(comment_counts) / len(comment_counts) if len(comment_counts) > 0 else 0
            if not comment_counts:
                return HttpResponseModel(status_code=404, message="No comments were found")
            
            statement = (
                select(
                    cast(Comment.created_at, Date).label("comment_date"), 
                    func.count(Comment.id).label("comment_count")
                )
                .join(Post, Post.id == Comment.post_id)
                .where(
                    and_(Post.user_id == user_id, Comment.created_at.between(start_date, end_date))
                )
                .group_by(cast(Comment.created_at, Date))
                .order_by("comment_date")
            )

            comments = session.execute(statement).all()

            result = [(c.comment_date, c.comment_count) for c in comments if c.comment_count > 0]

            if not result:
                return HttpResponseModel(status_code=404, message="No comments were found")
            
            return HttpResponseModel(
                status_code=200,
                message="Dashboard ready",
                data={"comment_avg": comment_avg, "comments": result}
            )
    
    except Exception as e:
        return HttpResponseModel(status_code=500, message=str(e))
