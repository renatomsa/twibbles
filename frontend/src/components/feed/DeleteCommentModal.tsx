'use client';

import ConfirmationModal from "../ConfirmationModal";
import { commentService } from "@/services/commentService";
import { useState } from "react";

interface DeleteCommentModalProps {
  isOpen: boolean;
  commentId: number;
  userId: number;
  onClose: () => void;
  onDeleted: (commentId: number) => void;
}

const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
  isOpen,
  commentId,
  userId,
  onClose,
  onDeleted
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      console.log(`Attempting to delete comment: ID=${commentId}, User ID=${userId}`);
      const success = await commentService.deleteComment(userId, commentId);

      if (success) {
        console.log('Comment deleted successfully');
        // Even if backend says comment not found, we should remove it from the UI
        // since it no longer exists in the database
        onDeleted(commentId);
        onClose();
      } else {
        // If the backend returned an error, check if it's a 404
        setError('Failed to delete comment. It may have been already deleted or you do not have permission to delete it.');

        // If comment wasn't found, let's still remove it from UI after user acknowledges
        setTimeout(() => {
          onDeleted(commentId);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('An error occurred while deleting the comment. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Comment"
      message={
        <>
          <p className="mb-2">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {isDeleting && (
            <p className="text-gray-500 text-sm mt-2">Deleting comment...</p>
          )}
        </>
      }
      confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
      isDanger={true}
    />
  );
};

export default DeleteCommentModal;
