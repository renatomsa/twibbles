import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import FollowButton from './FollowButton';

interface FollowingTabProps {
  userId: string;
  currentUserId: string;
}

const FollowingTab: React.FC<FollowingTabProps> = ({ userId, currentUserId }) => {
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<User[]>(`/follow/${userId}/following`);
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading following...</div>;
  }

  return (
    <div className="following-container">
      <h2 className="text-xl font-bold mb-4">Following</h2>
      {following.length === 0 ? (
        <p>Not following anyone yet</p>
      ) : (
        <ul className="space-y-4">
          {following.map((user) => (
            <li key={user.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center">
                <img 
                  src={user.profile_img_path || '/default-avatar.png'} 
                  alt="User avatar" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span>{user.user_name}</span>
              </div>
              {currentUserId !== user.id && (
                <FollowButton 
                  currentUserId={currentUserId}
                  profileUserId={user.id}
                  isPrivateAccount={user.is_private}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingTab; 