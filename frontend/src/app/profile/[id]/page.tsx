'use client';

import FollowButton from '@/components/FollowButton';
import FollowersTab from '@/components/FollowersTab';
import FollowingTab from '@/components/FollowingTab';
import FollowRequestsTab from '@/components/FollowRequestsTab';
import PrivacyButton from '@/components/PrivacyButton';
import DashboardButton from '@/components/profile/dashboardButton';
import UserPosts from '@/components/profile/UserPosts';
import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

async function getInitialData(): Promise<number> {
    const response = await fetch('/api/auth/current-user');
    const { userId } = await response.json();
    return Number(userId);
}

export default function ProfilePage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [canViewProfile, setCanViewProfile] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentId = await getInitialData();
                setCurrentUserId(currentId);
                const profileId = Number(params.id);

                const response = await apiService.get<User>(`user/get_user_by_id/${profileId}`);
                setProfile(response.data || null);
                const isCurrentUserProfile = currentId === response?.data?.id;
                setIsCurrentUser(isCurrentUserProfile);

                if (!isCurrentUserProfile) {
                    const followsResponse = await apiService.get(`follow/${currentId}/follows/${profileId}`);
                    setIsFollowing(followsResponse.data as boolean);
                }

                setCanViewProfile(isCurrentUserProfile || !response?.data?.is_private || isFollowing);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [params.id]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
    }

    if (!profile) {
        return <div className="flex justify-center items-center min-h-screen">Perfil não encontrado</div>;
    }

    return (
        <div className="min-h-screen pt-10 bg-[#FFFFFF]">
            {/* Box de perfil - mantém-se sempre visível */}
            <div className="w-[80%] mx-auto p-6 bg-[#2D2D2D] rounded-lg shadow-sm mt-16">
                <div className="flex items-start space-x-8">
                    <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-gray-200">
                        {profile.profile_img_path ? (
                            <Image
                                src={profile.profile_img_path}
                                alt={`Foto de perfil de ${profile.user_name}`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-5xl font-bold">
                                {profile.user_name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-medium text-[#FFFFFF]">
                                {profile.user_name}
                            </h1>

                            {isCurrentUser ? (
                                <div className="flex gap-4">
                                    <PrivacyButton
                                        userId={profile.id}
                                        isPrivate={profile.is_private}
                                        onPrivacyChange={(newPrivacyState) => {
                                            setProfile(prev => prev ? {
                                                ...prev,
                                                is_private: newPrivacyState
                                            } : null);
                                        }}
                                    />
                                    <DashboardButton userId={profile.id} />
                                </div>
                            ) : (
                                currentUserId && profile && (
                                    <FollowButton
                                        currentUserId={currentUserId}
                                        profileUserId={profile.id}
                                        isPrivateAccount={profile.is_private}
                                    />
                                )
                            )}
                        </div>

                        <p className="text-[#FFFFFF] text-lg">
                            {profile.bio}
                        </p>
                    </div>
                </div>
            </div>

            {!canViewProfile && profile?.is_private ? (
                <div className="w-[80%] mx-auto mt-8 text-center">
                    <p className="text-lg text-gray-600">Este perfil é privado</p>
                </div>
            ) : (
                /* Tabs de navegação e conteúdo - só aparecem se puder visualizar */
                <div className="w-[80%] mx-auto mt-8">
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

                        {isCurrentUser && profile.is_private && (
                            <button
                                className={`tab py-2 px-4 font-medium ${activeTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                Follow Requests
                            </button>
                        )}
                        
                        {isCurrentUser && (
                            <button 
                                className={`tab py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Estatísticas
                            </button>
                        )}
                    </div>

                    <div className="tab-content">
                        {activeTab === 'posts' && profile && currentUserId && (
                            <UserPosts
                                userId={profile.id}
                                currentUserId={currentUserId}
                            />
                        )}

                        {activeTab === 'followers' && profile && currentUserId && (
                            <FollowersTab
                                userId={profile.id}
                                currentUserId={currentUserId}
                            />
                        )}

                        {activeTab === 'following' && profile && currentUserId && (
                            <FollowingTab
                                userId={profile.id}
                                currentUserId={currentUserId}
                            />
                        )}
                        
                        {activeTab === 'dashboard' && isCurrentUser && (
                            <div className="mt-4">
                                <Link 
                                    href={`/profile/${profile.id}/dashboard`}
                                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Ver Estatísticas de Desempenho
                                </Link>
                            </div>
                        )}

                        {activeTab === 'requests' && isCurrentUser && profile?.is_private && (
                            <FollowRequestsTab userId={profile.id} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
