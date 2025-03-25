'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, Compass } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'text-blue-500' : 'text-gray-600 hover:text-blue-400';
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
                <Link href="/" className="text-white rounded-full p-2 hover:bg-cyan-800">
                    <Search size={20} />
                </Link>
                <Link href="/profile" className="text-white rounded-full p-2 hover:bg-cyan-800">
                    <User size={20} />
                </Link>
            </div>
        </header>
    );
} 