import { Trash2 } from "lucide-react";
import { Comment } from "@/services/commentService";
import { useState, useEffect } from "react";
import DeleteCommentModal from "./DeleteCommentModal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [validComment, setValidComment] = useState(true);

  console.log("Rendering comment:", comment);

  // Extract data from the array structure
  const getCommentValue = (key: string): any => {
    // If comment is an array of arrays (as seen in the console)
    if (Array.isArray(comment)) {
      for (const item of comment) {
        if (Array.isArray(item) && item[0] === key) {
          return item[1];
        }
      }
    } else {
      // If it's a regular object
      return (comment as any)[key];
    }
    return null;
  };

  const content = getCommentValue("content");
  const commentId = getCommentValue("id");
  const userId = getCommentValue("user_id");
  const userName = getCommentValue("user_name") || `User #${userId}`;

  // Validate if we have a valid comment with required fields
  useEffect(() => {
    if (!commentId || !userId) {
      console.error("Invalid comment data:", comment);
      setValidComment(false);
    }
  }, [comment, commentId, userId]);

  const isAuthor = currentUserId === userId;

  // If comment is invalid, don't render anything
  if (!validComment) return null;

  return (
    <div className="py-2 px-3 border-t border-gray-300 mt-2 bg-gray-100 rounded">
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-600 font-medium">
          {userName}
        </p>
        {isAuthor && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-gray-400 hover:text-red-500"
            aria-label="Delete comment"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-800">{content || "No content"}</p>

      {/* Delete Comment Modal */}
      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        commentId={commentId}
        userId={currentUserId}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={(deletedCommentId) => {
          if (onDelete) {
            onDelete(deletedCommentId);
          }
        }}
      />
    </div>
  );
};

export default CommentComponent;
