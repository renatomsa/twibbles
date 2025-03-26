import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import React, { useEffect, useState } from 'react';
import FollowButton from './FollowButton';

interface FollowingTabProps {
  userId: number;
  currentUserId: number;
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
      setFollowing(response.data ?? []);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowStatusChange = () => {
    fetchFollowing(); // Recarrega a lista quando o status de follow muda
  };

  if (loading) {
    return <div className="p-4">Loading following...</div>;
  }

  return (
    <div className="following-container" data-testid="following-tab">
      <h2 className="text-xl font-bold mb-4" data-testid="following-heading">Following</h2>
      {following.length === 0 ? (
        <p data-testid="no-following-message">Not following anyone yet</p>
      ) : (
        <ul className="space-y-4" data-testid="following-list">
          {following.map((user) => (
            <li 
              key={user.id} 
              className="flex items-center justify-between p-3 border rounded"
              data-testid={`following-item-${user.id}`}
            >
              <div className="flex items-center">
                <img
                  src={user.profile_img_path}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full mr-3"
                  data-testid={`following-avatar-${user.id}`}
                />
                <span data-testid={`following-username-${user.id}`}>{user.user_name}</span>
              </div>
              {currentUserId !== user.id && (
                <FollowButton
                  currentUserId={currentUserId}
                  profileUserId={user.id}
                  isPrivateAccount={user.is_private}
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

export default FollowingTab;
