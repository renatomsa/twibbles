import { Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Comment, commentService } from "@/services/commentService";
import CommentComponent from "./Comment";
import CommentForm from "./CommentForm";

interface PostProps {
  post_id: number;
  user_id: number;
  user_name: string;
  post_text: string;
  currentUserId: number;
}

const Post: React.FC<PostProps> = ({ post_id, user_id, user_name, post_text, currentUserId }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    
    if (newShowComments && comments.length === 0) {
      await fetchComments();
    }
  };

  const fetchComments = async () => {
    if (!post_id) return;
    
    setCommentError(null);
    try {
      setIsLoadingComments(true);
      const fetchedComments = await commentService.getCommentsByPostId(post_id);
      console.log(`Fetched comments for post ${post_id}:`, fetchedComments);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentError("Failed to load comments. Please try again.");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!post_id) return;
    
    setCommentError(null);
    try {
      console.log(`Adding comment to post ${post_id} by user ${currentUserId}:`, content);
      
      // Call the service to create a comment
      const newComment = await commentService.createComment(currentUserId, post_id, content);
      
      if (newComment) {
        console.log('Comment added successfully:', newComment);
        setComments(prev => [...prev, newComment]);
      } else {
        setCommentError("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentError("An error occurred while adding your comment.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setCommentError(null);
    try {
      console.log(`Deleting comment ${commentId} by user ${currentUserId}`);
      const success = await commentService.deleteComment(currentUserId, commentId);
      
      if (success) {
        console.log('Comment deleted successfully');
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        setCommentError("Failed to delete comment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setCommentError("An error occurred while deleting the comment.");
    }
  };

  // Load comments if the component starts with showComments=true
  useEffect(() => {
    if (showComments && comments.length === 0 && post_id) {
      fetchComments();
    }
  }, [post_id, showComments]);

  return (
    <div className="bg-gray-200 rounded-md p-4 shadow-sm">
      <h3 className="font-semibold text-lg text-gray-800">{user_name}</h3>
      <p className="my-2 text-gray-700">{post_text}</p>
      
      <div className="flex items-center mt-3 space-x-4">
        <button 
          onClick={toggleLike} 
          className="flex items-center text-gray-500 hover:text-red-500"
        >
          <Heart 
            size={18} 
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
        </button>
        
        <button 
          onClick={toggleComments}
          className="flex items-center text-gray-500 hover:text-blue-500"
        >
          <MessageCircle size={18} />
          {comments.length > 0 && (
            <span className="ml-1 text-xs">{comments.length}</span>
          )}
        </button>
      </div>
      
      {showComments && (
        <div className="mt-3">
          {commentError && (
            <p className="text-sm text-red-500 mb-2">{commentError}</p>
          )}
          
          {isLoadingComments ? (
            <p className="text-sm text-gray-500">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-2">
              {comments.map((comment, index) => (
                <CommentComponent
                  key={`${comment.id}-${index}`}
                  comment={comment}
                  currentUserId={currentUserId}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
          
          <div className="mt-3">
            <CommentForm 
              postId={post_id}
              userId={currentUserId}
              onSubmit={handleAddComment}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;