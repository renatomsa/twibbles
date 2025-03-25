import { useState } from "react";

interface CommentFormProps {
  postId: number;
  userId: number;
  userName?: string;
  onSubmit: (content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, userId, userName, onSubmit }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setFormError(null);
    try {
      setIsSubmitting(true);
      console.log(`Submitting comment for post ${postId} by user ${userId} (${userName}): "${content}"`);

      await onSubmit(content);
      setContent(""); // Clear form after successful submission
    } catch (error) {
      console.error("Failed to submit comment:", error);
      setFormError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 border-t border-gray-300 pt-3">
      {formError && (
        <p className="text-red-500 text-xs mb-2">{formError}</p>
      )}

      <div className="flex space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-900"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm text-white bg-cyan-900 rounded-md hover:bg-cyan-800 disabled:bg-gray-400"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
