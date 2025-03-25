import { User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import { apiService } from '../lib/api';

interface FollowRequest {
  requested_id: string;
}

interface FollowButtonProps {
  currentUserId: string;
  profileUserId: string;
  isPrivateAccount: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
  currentUserId, 
  profileUserId,
  isPrivateAccount 
}) => {
  const [relationship, setRelationship] = useState<'none' | 'following' | 'requested'>('none');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkRelationship();
  }, [currentUserId, profileUserId]);

  const checkRelationship = async () => {
    try {
      // Get list of who current user is following
      const followingResponse = await apiService.get<User[]>(`/follow/${currentUserId}/following`);
      
      // Check if profile user is in the following list
      const isFollowing = followingResponse.data.some(
        (user: User) => user.id === profileUserId
      );
      
      if (isFollowing) {
        setRelationship('following');
        return;
      }
      
      // If not following and profile is private, check if request was sent
      if (isPrivateAccount) {
        const requestsResponse = await apiService.get<FollowRequest[]>(`/follow/${currentUserId}/follow_requests_as_requester`);
        const requestSent = requestsResponse.data.some(
          (request: FollowRequest) => request.requested_id === profileUserId
        );
        
        setRelationship(requestSent ? 'requested' : 'none');
      } else {
        setRelationship('none');
      }
    } catch (error) {
      console.error('Error checking relationship:', error);
    }
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      if (relationship === 'following') {
        // Unfollow user
        await apiService.post(`/follow/${currentUserId}/unfollow/${profileUserId}`, {});
        setRelationship('none');
      } 
      else if (relationship === 'requested') {
        // Cancel request - we need to use unfollow for this based on the API
        await apiService.post(`/follow/${currentUserId}/unfollow/${profileUserId}`, {});
        setRelationship('none');
      }
      else {
        // Follow or request to follow
        await apiService.post(`/follow/${currentUserId}/follow/${profileUserId}`, {});
        setRelationship(isPrivateAccount ? 'requested' : 'following');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    
    switch (relationship) {
      case 'following':
        return 'Unfollow';
      case 'requested':
        return 'Cancel Request';
      default:
        return isPrivateAccount ? 'Request to Follow' : 'Follow';
    }
  };

  const getButtonStyle = () => {
    if (relationship === 'following') {
      return 'bg-gray-200 text-black';
    }
    return 'bg-blue-500 text-white';
  };

  return (
    <button
      className={`px-4 py-2 rounded-md ${getButtonStyle()}`}
      onClick={handleButtonClick}
      disabled={isLoading}
    >
      {getButtonText()}
    </button>
  );
};

export default FollowButton; 