'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'text-blue-500' : 'text-gray-600 hover:text-blue-400';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link 
                            href="/" 
                            className="text-xl font-bold text-gray-800"
                        >
                            Twibbles
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link 
                            href="/" 
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/explore" 
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/explore')}`}
                        >
                            Explorar
                        </Link>
                        <Link 
                            href="/notifications" 
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/notifications')}`}
                        >
                            Notificações
                        </Link>
                        
                        <Link 
                            href="/profile/709" 
                            className="flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    EU
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 