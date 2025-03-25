import { apiService } from '@/lib/api';

// Interface definitions
export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
}

export interface CommentCreate {
  content: string;
  user_id: number;
  post_id: number;
}

// Comment service
export const commentService = {
  // Get all comments for a post
  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    try {
      const response = await apiService.get<Comment[]>(`/comments/post/${postId}`);
      console.log('Comments response:', response);
      
      // Check the response structure and extract the data
      if (response && response.status_code === 200 && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  // Create a new comment
  createComment: async (userId: number, postId: number, content: string): Promise<Comment | null> => {
    try {
      // Create the comment data with the structure expected by the backend
      const commentData: CommentCreate = {
        content,
        user_id: userId,
        post_id: postId
      };
      
      console.log(`Creating comment for post ${postId} by user ${userId}:`, commentData);
      
      const response = await apiService.post<Comment>(
        `/comments/user/${userId}/post/${postId}`, 
        commentData
      );
      
      console.log('Comment creation response:', response);
      
      // Check if the comment was created successfully
      if (response && response.status_code === 201 && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  },

  // Delete a comment
  deleteComment: async (userId: number, commentId: number): Promise<boolean> => {
    try {
      const response = await apiService.delete<any>(`/comments/user/${userId}/comment/${commentId}`);
      
      return response && response.status_code === 200;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },
}; 