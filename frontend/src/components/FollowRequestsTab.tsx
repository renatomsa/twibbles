import { apiService } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface FollowRequestsTabProps {
  userId: number;
}

interface FollowRequest {
  requester_id: number;
  requested_id: number;
  requester: {
    id: number;
    user_name: string;
    profile_img_path: string;
  };
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
      setRequests(response.data || []);
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
    <div className="follow-requests-container" data-testid="follow-requests-tab">
      <h2 className="text-xl font-bold mb-4" data-testid="follow-requests-heading">Follow Requests</h2>
      {requests.length === 0 ? (
        <p data-testid="no-requests-message">No pending follow requests</p>
      ) : (
        <ul className="space-y-4" data-testid="follow-requests-list">
          {requests.map((request) => (
            <li
              key={request.requester_id}
              className="flex items-center justify-between p-3 border rounded"
              data-testid={`request-item-${request.requester_id}`}
            >
              <div className="flex items-center">
                <Link href={`/profile/${request.requester.id}`} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-3 cursor-pointer hover:opacity-80 transition-opacity">
                    {request.requester.profile_img_path ? (
                      <img
                        src={request.requester.profile_img_path}
                        alt={`${request.requester.user_name}'s profile`}
                        className="w-full h-full object-cover"
                        data-testid={`requester-avatar-${request.requester_id}`}
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-600">
                        {request.requester.user_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hover:underline" data-testid={`requester-username-${request.requester_id}`}>
                    {request.requester.user_name}
                  </span>
                </Link>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(request.requester_id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  data-testid={`accept-request-${request.requester_id}`}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.requester_id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  data-testid={`reject-request-${request.requester_id}`}
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
