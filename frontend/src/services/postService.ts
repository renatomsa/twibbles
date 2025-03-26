import { apiService, ApiResponse } from '@/lib/api';

// Interface definitions based on backend models
export interface Post {
  id: number;
  user_id: number;
  text: string;
  location?: string;
  hashtags?: string;
  date_time?: string;
  user_name?: string; // Added for frontend display
  profile_img_path?: string; // Added for user profile image
}

export interface PostCreate {
  text: string;
  location: string;
  hashtags: string;
}

// Post service
export const postService = {
  // Get all public posts for the explore page
  getPublicPosts: async (): Promise<Post[]> => {
    try {
      const response = await apiService.get<Post[]>('/post/public');
      console.log('Public posts response:', response);

      // Make sure we correctly use the data from response
      if (response && response.status_code === 200 && response.data) {
        // Log to check if user_name exists in each post
        console.log('First post sample:', response.data[0]);
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching public posts:', error);
      return [];
    }
  },

  // Get feed - posts from followed users
  getFeed: async (userId: number): Promise<Post[]> => {
    try {
      const response = await apiService.get<Post[]>(`/post/feed/${userId}`);
      console.log(`Feed response for user ${userId}:`, response);

      if (response && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching feed:', error);
      return [];
    }
  },

  // Get posts by user ID
  getPostsByUserId: async (userId: number): Promise<Post[]> => {
    try {
      // Backend endpoint expects sort_by_comment parameter
      const response = await apiService.get<Post[]>(`/post/${userId}/posts`, { sort_by_comment: false });
      console.log('User posts response:', response);

      if (response && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  },

  // Create a new post
  createPost: async (userId: number, text: string, location: string = "", hashtags: string = ""): Promise<Post | null> => {
    try {
      // Match the backend expected structure
      const postData: PostCreate = {
        text,
        location,
        hashtags
      };

      console.log(`Creating post for user ${userId}:`, postData);

      const response = await apiService.post<Post>(
        `/post/${userId}/post`,
        postData
      );

      console.log('Post creation response:', response);

      if (response && response.status_code === 201 && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  // Delete a post
  deletePost: async (userId: number, postId: number): Promise<boolean> => {
    try {
      const response = await apiService.delete<any>(`/post/${userId}/posts/${postId}`);
      return response && response.status_code === 200;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },
};
