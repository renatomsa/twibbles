'use client';

import Link from 'next/link';

interface DashboardButtonProps {
    userId: number;
}

export default function DashboardButton({ userId }: DashboardButtonProps) {
    return (
        <Link 
            href={`/profile/${userId}/dashboard`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
            Estatísticas de Desempenho
        </Link>
    );
} 