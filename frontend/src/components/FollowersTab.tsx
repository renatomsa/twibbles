import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import FollowButton from './FollowButton';

interface FollowersTabProps {
  userId: number;
  currentUserId: number;
}

const FollowersTab: React.FC<FollowersTabProps> = ({ userId, currentUserId }) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<User[]>(`/follow/${userId}/followers`);
      setFollowers(response.data || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowStatusChange = () => {
    fetchFollowers();
  };

  if (loading) {
    return <div className="p-4">Loading followers...</div>;
  }

  return (
    <div className="followers-container" data-testid="followers-tab">
      <h2 className="text-xl font-bold mb-4" data-testid="followers-heading">Followers</h2>
      {followers.length === 0 ? (
        <p data-testid="no-followers-message">No followers yet</p>
      ) : (
        <ul className="space-y-4" data-testid="followers-list">
          {followers.map((follower) => (
            <li 
              key={follower.id} 
              className="flex items-center justify-between p-3 border rounded"
              data-testid={`follower-item-${follower.id}`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-3">
                  {follower.profile_img_path ? (
                    <img
                      src={follower.profile_img_path}
                      alt={`${follower.user_name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-600">
                      {follower.user_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <span>{follower.user_name}</span>
              </div>
              {currentUserId !== follower.id && (
                <FollowButton
                  currentUserId={currentUserId}
                  profileUserId={follower.id}
                  isPrivateAccount={follower.is_private}
                  onStatusChange={handleFollowStatusChange}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowersTab;
