'use client';

import { apiService } from '@/lib/api';
import { useState } from 'react';

interface PrivacyButtonProps {
    userId: number;
    isPrivate: boolean;
    onPrivacyChange: (newPrivacyState: boolean) => void;
}

export default function PrivacyButton({ userId, isPrivate, onPrivacyChange }: PrivacyButtonProps) {
    const [showModal, setShowModal] = useState(false);

    const handlePrivacyChange = async () => {
        try {
            await apiService.patch(`user/update_user_privacy/${userId}/${!isPrivate}`);
            onPrivacyChange(!isPrivate);
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao atualizar privacidade:', error);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
                {isPrivate ? 'Tornar Público' : 'Tornar Privado'}
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium mb-4">
                            Confirmar alteração de privacidade
                        </h3>
                        <p className="mb-4">
                            {isPrivate
                                ? 'Tem certeza que deseja tornar seu perfil público?'
                                : 'Tem certeza que deseja tornar seu perfil privado?'}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePrivacyChange}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 