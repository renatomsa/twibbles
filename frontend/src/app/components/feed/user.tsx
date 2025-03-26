'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface UserDashboard {
  username: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  // Add more fields as needed
}

export default function User() {
  const [userData, setUserData] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you'd get the user_id from authentication or params
        const userId = '123'; // Replace with actual user ID
        const response = await fetch(`/api/${userId}/dashboard`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!userData) {
    return <div className="p-4">No user data available</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{userData.username}&apos;s Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="font-bold text-xl">{userData.posts_count}</div>
            <div className="text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{userData.followers_count}</div>
            <div className="text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl">{userData.following_count}</div>
            <div className="text-gray-600">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
} 