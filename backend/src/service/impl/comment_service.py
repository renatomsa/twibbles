from sqlalchemy.orm import Session
from sqlalchemy import select
from src.engine import postgresql_engine
from src.schemas.response import HttpResponseModel

from model.sqlalchemy.comment import Comment
from model.sqlalchemy.user import User
from model.sqlalchemy.post import Post

from model.pydantic.comment import CommentCreate, CommentRead

def get_comments_by_post_id(post_id: int) -> HttpResponseModel:
    try:
        with Session(postgresql_engine) as session:
            post = session.get(Post, post_id)
            if not post:
                return HttpResponseModel(
                    status_code=404,
                    message="Post not found"
                )

            # Join Comment with User to get user_name
            statement = (
                select(Comment, User)
                .join(User, User.id == Comment.user_id)
                .where(Comment.post_id == post_id)
            )
            results = session.execute(statement).fetchall()

            if not results:
                return HttpResponseModel(
                    status_code=404,
                    message="No comments found for this post"
                )

            comment_list = []
            for result in results:
                comment = result.Comment
                user = result.User

                # Create a CommentRead object and add user_name
                comment_data = CommentRead.model_validate(comment).model_dump()
                comment_data["user_name"] = user.user_name
                comment_list.append(comment_data)

            return HttpResponseModel(
                status_code=200,
                message="Comments retrieved successfully",
                data=comment_list
            )

    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )


def create_comment(user_id: int, post_id: int, comment_in: CommentCreate) -> HttpResponseModel:
    try:
        with Session(postgresql_engine) as session:
            post = session.get(Post, post_id)
            if not post:
                return HttpResponseModel(
                    status_code=404,
                    message="Post not found"
                )

            user = session.get(User, user_id)
            if not user:
                return HttpResponseModel(
                    status_code=404,
                    message="User not found"
                )

            new_comment = Comment(
                content=comment_in.content,
                user_id=user_id,
                post_id=post_id
            )
            session.add(new_comment)
            session.commit()
            session.refresh(new_comment)

            return HttpResponseModel(
                status_code=201,
                message="Comment created successfully",
                data=CommentRead.model_validate(new_comment)
            )

    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )


def delete_comment(user_id: int, comment_id: int) -> HttpResponseModel:
    try:
        with Session(postgresql_engine) as session:
            comment = session.get(Comment, comment_id)
            if not comment:
                return HttpResponseModel(
                    status_code=404,
                    message="Comment not found"
                )

            if comment.user_id != user_id:
                return HttpResponseModel(
                    status_code=403,
                    message="You are not authorized to delete this comment"
                )

            session.delete(comment)
            session.commit()

            return HttpResponseModel(
                status_code=200,
                message="Comment deleted successfully"
            )

    except Exception as e:
        return HttpResponseModel(
            status_code=500,
            message=str(e)
        )
