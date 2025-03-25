"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';
import FollowButton from '../../components/FollowButton';
import FollowersTab from '../../components/FollowersTab';
import FollowingTab from '../../components/FollowingTab';
import FollowRequestsTab from '../../components/FollowRequestsTab';

interface ProfileProps {
  userId: number;
  currentUserId: number;
}

const Profile: React.FC<ProfileProps> = () => {
  // mocking the userId and currentUserId
  const userId = 709;
  const currentUserId = 709;

  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // This is a placeholder - you'll need your own API endpoint to fetch user profiles
      const response = await apiService.get(`user/get_user_by_id/709`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="p-4">User not found</div>;
  }

  const isOwnProfile = userId === currentUserId;

  return (
    <div className="profile-container max-w-4xl mx-auto p-4">
      <div className="profile-header flex items-center justify-between mb-8">
        <div className="flex items-center">
          <img 
            src={profileData.avatar || '/default-avatar.png'}
            alt="Profile avatar" 
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h1 className="text-2xl font-bold">{profileData.user_name}</h1>
            <div className="stats flex space-x-4 mt-2">
            </div>
          </div>
        </div>
        
        {!isOwnProfile && (
          <FollowButton 
            currentUserId={currentUserId}
            profileUserId={userId}
            isPrivateAccount={profileData.is_private}
          />
        )}
      </div>

      <div className="profile-tabs">
        <div className="tabs flex border-b mb-4">
          <button 
            className={`tab py-2 px-4 font-medium ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`tab py-2 px-4 font-medium ${activeTab === 'followers' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </button>
          <button 
            className={`tab py-2 px-4 font-medium ${activeTab === 'following' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
          
          {/* Show follow requests tab only for private accounts and only to the owner */}
          {isOwnProfile && profileData.is_private && (
            <button 
              className={`tab py-2 px-4 font-medium ${activeTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Follow Requests
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'posts' && (
            <div className="posts-grid">
              {/* Your posts display logic here */}
              <p>Posts content</p>
            </div>
          )}
          
          {activeTab === 'followers' && (
            <FollowersTab userId={userId} currentUserId={currentUserId} />
          )}
          
          {activeTab === 'following' && (
            <FollowingTab userId={userId} currentUserId={currentUserId} />
          )}
          
          {activeTab === 'requests' && isOwnProfile && profileData.is_private && (
            <FollowRequestsTab userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 