'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/api/auth/current-user');
                const { userId } = await response.json();
                if (userId) {
                    router.push(`/profile/${Number(userId)}`);
                }
            } catch (error) {
                console.error('Erro ao obter usuário atual:', error);
            }
        };

        fetchCurrentUser();
    }, [router]);

    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
}
