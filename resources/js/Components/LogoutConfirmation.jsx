import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function LogoutConfirmation({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 w-full max-w-md rounded-t-2xl p-6 pb-8 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Logout</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <p className="text-gray-300 mb-6">Are you sure you want to sign out?</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
