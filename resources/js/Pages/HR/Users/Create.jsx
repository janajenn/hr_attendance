import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { UserPlusIcon } from '@heroicons/react/24/outline';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('hr.hr-users.store'));
    };

    return (
        <HRLayout>
            <Head title="Add HR User" />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-green-600 rounded-xl p-3">
                        <UserPlusIcon className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Add New HR User</h1>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-xl border border-green-900/30 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Full Name <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Username <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={e => setData('username', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email (optional)
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Password <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Confirm Password <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-400">{errors.password_confirmation}</p>}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
                            >
                                {processing ? 'Creating...' : 'Create HR User'}
                            </button>
                            <Link
                                href={route('hr.hr-users.index')}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HRLayout>
    );
}
