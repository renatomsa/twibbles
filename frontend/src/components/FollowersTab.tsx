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
    <div className="followers-container">
      <h2 className="text-xl font-bold mb-4">Followers</h2>
      {followers.length === 0 ? (
        <p>No followers yet</p>
      ) : (
        <ul className="space-y-4">
          {followers.map((follower) => (
            <li key={follower.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center">
                <img 
                  src={follower.profile_img_path} 
                  alt="User avatar" 
                  className="w-10 h-10 rounded-full mr-3"
                />
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