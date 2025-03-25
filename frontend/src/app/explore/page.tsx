"use client";

import { useState, useEffect } from "react";
import { Post as PostType, postService } from "@/services/postService";
import Post from "@/components/feed/post";

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number>(709); // Default user ID

  // Get current user ID from localStorage when component mounts
  useEffect(() => {
    // Use localStorage directly to avoid server component dependencies
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setCurrentUserId(parseInt(storedUserId, 10));
      } else {
        // If no userId in localStorage, use default
        localStorage.setItem('userId', '709');
      }
    }
  }, []);

  // Fetch public posts when component mounts
  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const publicPosts = await postService.getPublicPosts();
        console.log('Fetched public posts:', publicPosts);

        if (publicPosts.length > 0) {
          console.log('Sample post with user_name:', publicPosts[0].user_name);
        }

        setPosts(publicPosts);
      } catch (error) {
        console.error('Error fetching public posts:', error);
        setError('Failed to load posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pt-16">
      <main className="flex-1 max-w-2xl mx-auto w-full py-4 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Explore</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading public posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">No public posts found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="mb-4">
                <Post
                  post_id={post.id}
                  user_id={post.user_id}
                  user_name={post.user_name || `Anonymous User #${post.user_id}`}
                  post_text={post.text}
                  currentUserId={currentUserId}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
