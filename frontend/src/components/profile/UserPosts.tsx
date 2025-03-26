'use client';

import { useEffect, useState } from 'react';
import { Post, postService } from '@/services/postService';
import { Trash2, Plus } from 'lucide-react';
import CreatePost from '@/components/feed/createPost';
import DeletePostModal from "../feed/DeletePostModal";
import Link from "next/link";

interface UserPostsProps {
  userId: number;
  currentUserId: number;
}

const UserPosts: React.FC<UserPostsProps> = ({ userId, currentUserId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [userName, setUserName] = useState<string>(`User #${userId}`);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userPosts = await postService.getPostsByUserId(userId);
      console.log(`Fetched ${userPosts.length} posts for user ${userId}`);

      // If we have posts and a username, save it
      if (userPosts.length > 0 && userPosts[0].user_name) {
        setUserName(userPosts[0].user_name);
      }

      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const handleDeleteClick = (postId: number) => {
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(prev => !prev);
  };

  const handlePostSubmit = async (postContent: string, location: string, hashtags: string) => {
    try {
      setError(null);

      // Create a new post in the backend with location and hashtags
      const newPost = await postService.createPost(currentUserId, postContent, location, hashtags);

      if (newPost) {
        // Add the new post to the list
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setIsFormVisible(false);
      } else {
        setError("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating your post.");
    }
  };

  const isOwnProfile = userId === currentUserId;

  if (isLoading) {
    return <div className="py-4">Loading posts...</div>;
  }

  return (
    <div className="user-posts-container">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Show create post button only on own profile */}
      {isOwnProfile && (
        <div className="mb-4">
          {!isFormVisible ? (
            <button
              onClick={toggleFormVisibility}
              className="flex items-center space-x-2 bg-cyan-900 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition-colors"
            >
              <Plus size={18} />
              <span>Create New Post</span>
            </button>
          ) : (
            <div className="mb-6">
              <CreatePost userName={userName} onPostSubmit={handlePostSubmit} />
              <button
                onClick={toggleFormVisibility}
                className="mt-2 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="py-4 text-center text-gray-500">
          {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-4 relative">
              <div className="flex items-center mb-3">
                <Link href={`/profile/${post.user_id}`} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-3 cursor-pointer hover:opacity-80 transition-opacity">
                    {post.profile_img_path ? (
                      <img
                        src={post.profile_img_path}
                        alt={`${post.user_name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        {post.user_name?.charAt(0).toUpperCase() || userId.toString().charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-lg hover:underline">{post.user_name || `User #${post.user_id}`}</span>
                </Link>

                {/* Only show delete button if current user is the post owner */}
                {currentUserId === post.user_id && (
                  <button
                    onClick={() => handleDeleteClick(post.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="text-gray-700 mb-2">{post.text}</p>

              {/* Show location if available */}
              {post.location && (
                <div className="text-sm text-gray-500 mb-1">
                  Location: {post.location}
                </div>
              )}

              {/* Show hashtags if available */}
              {post.hashtags && (
                <div className="text-sm text-blue-500">
                  {post.hashtags.split(' ').map((tag, index) => (
                    <span key={index} className="mr-2">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}

              {/* Show post date if available */}
              {post.date_time && (
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(post.date_time).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Post Modal */}
      {postToDelete && (
        <DeletePostModal
          isOpen={isDeleteModalOpen}
          postId={postToDelete}
          userId={currentUserId}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPostToDelete(null);
          }}
          onDeleted={(postId) => {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
          }}
        />
      )}
    </div>
  );
};

export default UserPosts;
