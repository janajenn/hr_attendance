import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import Swal from 'sweetalert2';
import { UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Index({ users }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (userId, userName) => {
        Swal.fire({
            title: 'Delete HR User?',
            text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('hr.hr-users.destroy', userId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'HR user has been deleted.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            background: '#1f2937',
                            color: '#fff',
                        });
                    },
                });
            }
        });
    };

    return (
        <HRLayout>
            <Head title="Manage HR Users" />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-white">HR Users</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-green-900/30 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <Link
                            href={route('hr.hr-users.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                        >
                            <UserPlusIcon className="h-5 w-5 mr-2" />
                            Add HR User
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                <div className="bg-gray-800 shadow overflow-hidden rounded-lg border border-green-900/30">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-green-900/30">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                 </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-green-900/30">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No HR users found.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.email || '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {new Date(user.created_at).toLocaleDateString('en-PH')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {user.id !== window.Laravel?.userId && (
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.name)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </HRLayout>
    );
}
