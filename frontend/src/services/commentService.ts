import { apiService } from '@/lib/api';

// Interface definitions
export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  user_name?: string;
}

export interface CommentCreate {
  content: string;
  user_id: number;
  post_id: number;
}

// Helper function to convert array-like comment data to the expected format
function normalizeComment(commentData: any): Comment {
  // If it's already in the right format, return it
  if (commentData && typeof commentData === 'object' && !Array.isArray(commentData)) {
    if ('id' in commentData && 'content' in commentData) {
      return commentData as Comment;
    }
  }

  // If it's an array of [key, value] pairs
  if (Array.isArray(commentData)) {
    const result: any = {};

    for (const item of commentData) {
      if (Array.isArray(item) && item.length >= 2) {
        result[item[0]] = item[1];
      }
    }

    return {
      id: result.id || 0,
      content: result.content || '',
      user_id: result.user_id || 0,
      post_id: result.post_id || 0,
      user_name: result.user_name || `User #${result.user_id || 0}`
    };
  }

  // If we can't normalize, return a default empty comment
  return {
    id: 0,
    content: '',
    user_id: 0,
    post_id: 0,
    user_name: 'Unknown User'
  };
}

// Comment service
export const commentService = {
  // Get all comments for a post
  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    try {
      const response = await apiService.get<any>(`/comments/post/${postId}`);
      console.log('Comments raw response:', response);

      // Check the response structure and extract the data
      if (response && response.status_code === 200) {
        // Handle nested data structure if present
        if (response.data) {
          console.log('Comments extracted data:', response.data);
          // If data is an array, normalize each item
          if (Array.isArray(response.data)) {
            return response.data.map(normalizeComment);
          }
          return response.data;
        }
      } else if (response && response.status_code === 404) {
        console.log('No comments found for this post');
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

      const response = await apiService.post<any>(
        `/comments/user/${userId}/post/${postId}`,
        commentData
      );

      console.log('Comment creation raw response:', response);

      // Check if the comment was created successfully
      if (response && response.status_code === 201 && response.data) {
        console.log('Comment creation extracted data:', response.data);
        return normalizeComment(response.data);
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
      console.log('Delete comment response:', response);

      return response && response.status_code === 200;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },
};
