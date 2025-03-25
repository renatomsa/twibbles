'use client';

import { apiService } from '@/lib/api';
import { User } from '@/types/user';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        try {
            setIsSearching(true);
            const response = await apiService.get<User[]>(`/user/get_users_by_substring/${searchTerm}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] pt-20">
            <div className="w-[80%] max-w-3xl mx-auto">
                {/* Search Box */}
                <div className="bg-[#2D2D2D] p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar usuários..."
                                className="w-full px-4 py-2 rounded-md bg-[#FFFFFF] text-gray-800 focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="p-2 bg-[#FFB067] rounded-md hover:bg-[#FF9647] transition-colors"
                        >
                            <Search size={24} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {isSearching ? (
                        <div className="text-center py-4">Buscando...</div>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <Link
                                key={user.id}
                                href={`/profile/${user.id}`}
                                className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                        src={user.profile_img_path}
                                        alt={`Foto de ${user.user_name}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-gray-800 font-medium">
                                    {user.user_name}
                                </span>
                            </Link>
                        ))
                    ) : searchTerm && !isSearching ? (
                        <div className="text-center py-4 text-gray-600">
                            Nenhum usuário encontrado
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
} 