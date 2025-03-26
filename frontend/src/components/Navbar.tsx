'use client';

import { Compass, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

interface UserData {
    id: number;
    user_name: string;
    profile_img_path?: string;
}

export function Navbar() {
    const pathname = usePathname();
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/api/auth/current-user');
                const { userId } = await response.json();
                if (userId) {
                    fetchUserData(Number(userId));
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const fetchUserData = async (userId: number) => {
        try {
            const response = await apiService.get<UserData>(`/user/get_user_by_id/${userId}`);
            if (response && response.status_code === 200 && response.data) {
                setUserData(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <header className="bg-cyan-900 py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
            <Link href="/" className="text-white text-2xl font-bold">
                T
            </Link>
            <div className="flex items-center space-x-4">
                <Link href="/explore" className="text-white rounded-full p-2 hover:bg-cyan-800">
                    <Compass size={20} />
                </Link>
                <Link href="/search" className="text-white rounded-full p-2 hover:bg-cyan-800">
                    <Search size={20} />
                </Link>
                <Link href="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                    {userData?.user_name ? (
                        <span className="text-sm font-bold">{userData.user_name.charAt(0).toUpperCase()}</span>
                    ) : (
                        <span className="text-sm font-bold">U</span>
                    )}
                </Link>
            </div>
        </header>
    );
}
