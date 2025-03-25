'use client';

import { apiService } from '@/lib/api';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ProfileData {
    id: string;
    user_name: string;
    email: string;
    is_private: boolean;
    bio: string;
    profile_img_path: string;
}

async function getInitialData() {
    const response = await fetch('/api/auth/current-user');
    const { userId } = await response.json();
    return userId;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUserId = await getInitialData();
                const profileId = params.id || currentUserId;

                if (!profileId) {
                    throw new Error('Usuário não está logado');
                }

                const response = await apiService.get<ProfileData>(`user/get_user_by_id/${profileId}`);
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
        <div className="min-h-screen bg-[#FFFFFF]">
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
                        
                        <p className="text-[#666666] text-lg">
                            {profile.bio}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}