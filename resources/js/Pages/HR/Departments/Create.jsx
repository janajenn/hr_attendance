import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('hr.departments.store'));
    };

    return (
        <HRLayout>
            <Head title="Add Department" />
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-green-600 rounded-xl p-3">
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Add New Department</h1>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-xl border border-green-900/30 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Department Name <span className="text-green-400">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="e.g., Information Technology"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        {/* Code */}
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                                Department Code <span className="text-green-400">(optional)</span>
                            </label>
                            <input
                                id="code"
                                type="text"
                                value={data.code}
                                onChange={e => setData('code', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                placeholder="e.g., IT"
                            />
                            {errors.code && <p className="mt-1 text-sm text-red-400">{errors.code}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Department'}
                            </button>
                            <Link
                                href={route('hr.departments.index')}
                                className="w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition text-center"
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
