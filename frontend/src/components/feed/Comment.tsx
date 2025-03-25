import { Trash2 } from "lucide-react";
import { Comment } from "@/services/commentService";

interface CommentProps {
  comment: Comment;
  currentUserId: number;
  onDelete?: (commentId: number) => void;
}

const CommentComponent: React.FC<CommentProps> = ({ 
  comment, 
  currentUserId,
  onDelete 
}) => {
  const isAuthor = currentUserId === comment.user_id;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="py-2 border-t border-gray-300 mt-2">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-500">
          <span className="font-medium">User #{comment.user_id}</span>
        </p>
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
            aria-label="Delete comment"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p className="mt-1 text-sm">{comment.content}</p>
    </div>
  );
};

export default CommentComponent; 