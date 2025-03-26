"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Post from "./post";
import CreatePost from "./createPost";
import { Post as PostType, postService } from "../../services/postService";
import { apiService } from "@/lib/api";

interface UserData {
  id: number;
  user_name: string;
  profile_img_path?: string;
}

const User = () => {
  const [postList, setPostList] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(709); // Default user ID
  const [userData, setUserData] = useState<UserData | null>(null);

  // Get current user ID from localStorage when component mounts
  useEffect(() => {
    // Use localStorage directly to avoid server component dependencies
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const userId = parseInt(storedUserId, 10);
        setCurrentUserId(userId);
        fetchUserData(userId);
      } else {
        // If no userId in localStorage, use default
        localStorage.setItem('userId', '709');
        fetchUserData(709);
      }
    }
  }, []);

  // Fetch user data (name, profile picture, etc.)
  const fetchUserData = async (userId: number) => {
    try {
      const response = await apiService.get<UserData>(`/user/get_user_by_id/${userId}`);
      if (response && response.status_code === 200 && response.data) {
        setUserData(response.data);
      } else {
        console.error("Failed to fetch user data");
        // Set default user data if fetch fails
        setUserData({ id: userId, user_name: `User #${userId}` });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set default user data if fetch fails
      setUserData({ id: userId, user_name: `User #${userId}` });
    }
  };

  // Fetch feed when component mounts or userId changes
  useEffect(() => {
    fetchFeed();
  }, [currentUserId]);

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get feed for current user
      const posts = await postService.getFeed(currentUserId);
      console.log(`Fetched feed posts for user ${currentUserId}:`, posts);

      setPostList(posts);
    } catch (error) {
      console.error("Error fetching feed:", error);
      setError("Failed to load feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handlePostSubmit = async (postContent: string) => {
    try {
      setError(null);

      // Create a new post in the backend
      // The text parameter is required, location and hashtags are optional
      const newPost = await postService.createPost(currentUserId, postContent);

      if (newPost) {
        // Add the new post to the list
        setPostList((prevList) => [newPost, ...prevList]);
        setIsFormVisible(false);
      } else {
        setError("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating your post.");
    }
  };

  const userName = userData?.user_name || `User #${currentUserId}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pt-16">
      <main className="flex-1 max-w-2xl mx-auto w-full py-4 px-4">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <button
            onClick={toggleFormVisibility}
            className="bg-cyan-900 text-white p-4 rounded-full shadow-lg hover:bg-cyan-800 transition-colors flex items-center justify-center w-14 h-14"
            aria-label="Create post"
          >
            <Plus size={24} />
          </button>
        </div>

        {isFormVisible && (
          <div className="mb-6 p-4">
            <CreatePost userName={userName} onPostSubmit={handlePostSubmit} />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : postList.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">No posts in your feed. Follow users to see their posts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {postList.map((post) => (
              <div key={post.id} className="mb-4">
                <Post
                  post_id={post.id}
                  user_id={post.user_id}
                  user_name={post.user_name || `User #${post.user_id}`}
                  post_text={post.text}
                  currentUserId={currentUserId}
                  currentUserName={userName}
                  location={post.location}
                  hashtags={post.hashtags}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default User;
