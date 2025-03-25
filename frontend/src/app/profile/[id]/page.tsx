'use client';

import FollowersTab from '@/components/FollowersTab';
import FollowingTab from '@/components/FollowingTab';
import FollowRequestsTab from '@/components/FollowRequestsTab';
import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUserId = await getInitialData();
                const profileId = Number(params.id);

                const response = await apiService.get<User>(`user/get_user_by_id/${profileId}`);
                setProfile(response.data);
                setIsCurrentUser(currentUserId === response.data.id);
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
            {/* Box de perfil */}
            <div className="w-[80%] mx-auto p-6 bg-[#2D2D2D] rounded-lg shadow-sm mt-16">
                <div className="flex items-start space-x-8">
                    <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src={profile.profile_img_path}
                            alt={`Foto de perfil de ${profile.user_name}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-medium text-[#FFFFFF]">
                                {profile.user_name}
                            </h1>
                            
                            {!isCurrentUser && (
                                <button className="px-8 py-2.5 bg-[#FFB067] text-white rounded-md hover:bg-[#FF9647] transition-colors font-medium">
                                    SEGUIR
                                </button>
                            )}
                        </div>
                        
                        <p className="text-[#FFFFFF] text-lg">
                            {profile.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs de navegação */}
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
                </div>

                <div className="tab-content">
                    {activeTab === 'posts' && (
                        <div className="posts-grid">
                            <p>Posts content</p>
                        </div>
                    )}
                    
                    {activeTab === 'followers' && profile && (
                        <FollowersTab 
                            userId={profile.id} 
                            currentUserId={profile.id} 
                        />
                    )}
                    
                    {activeTab === 'following' && profile && (
                        <FollowingTab 
                            userId={profile.id} 
                            currentUserId={profile.id} 
                        />
                    )}
                    
                    {activeTab === 'requests' && isCurrentUser && profile?.is_private && (
                        <FollowRequestsTab userId={profile.id} />
                    )}
                </div>
            </div>
        </div>
    );
}
