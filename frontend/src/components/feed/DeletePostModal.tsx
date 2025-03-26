'use client';

import ConfirmationModal from "../ConfirmationModal";
import { postService } from "@/services/postService";
import { useState } from "react";

interface DeletePostModalProps {
  isOpen: boolean;
  postId: number;
  userId: number;
  onClose: () => void;
  onDeleted: (postId: number) => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({
  isOpen,
  postId,
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

      const success = await postService.deletePost(userId, postId);

      if (success) {
        console.log('Post deleted successfully');
        onDeleted(postId);
        onClose();
      } else {
        setError('Failed to delete post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('An error occurred while deleting the post.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Post"
      message={
        <>
          <p className="mb-2">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {isDeleting && (
            <p className="text-gray-500 text-sm mt-2">Deleting post...</p>
          )}
        </>
      }
      confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
      isDanger={true}
    />
  );
};

export default DeletePostModal;
