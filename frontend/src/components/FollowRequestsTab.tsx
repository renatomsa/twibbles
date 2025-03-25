import { apiService } from '@/lib/api';
import React, { useEffect, useState } from 'react';

interface FollowRequestsTabProps {
  userId: number;
}

interface FollowRequest {
  requester_id: number;
  requester_username: string;
  profile_img_path: string;
}

const FollowRequestsTab: React.FC<FollowRequestsTabProps> = ({ userId }) => {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowRequests();
  }, [userId]);

  const fetchFollowRequests = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<FollowRequest[]>(`/follow/${userId}/follow_requests_as_requested`);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching follow requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requesterId: number) => {
    try {
      await apiService.post(`/follow/${requesterId}/accept_request/${userId}`, {});
      // Remove from list after accepting
      setRequests(requests.filter(r => r.requester_id !== requesterId));
    } catch (error) {
      console.error('Error accepting follow request:', error);
    }
  };

  const handleReject = async (requesterId: number) => {
    try {
      await apiService.post(`/follow/${requesterId}/reject_request/${userId}`, {});
      // Remove from list after rejecting
      setRequests(requests.filter(r => r.requester_id !== requesterId));
    } catch (error) {
      console.error('Error rejecting follow request:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading follow requests...</div>;
  }

  return (
    <div className="follow-requests-container">
      <h2 className="text-xl font-bold mb-4">Follow Requests</h2>
      {requests.length === 0 ? (
        <p>No pending follow requests</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.requester_id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center">
                <img 
                  src={request.profile_img_path} 
                  alt="User avatar" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span>{request.requester_username}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleAccept(request.requester_id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleReject(request.requester_id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowRequestsTab; 