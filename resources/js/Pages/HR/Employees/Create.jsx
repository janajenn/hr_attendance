import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { UserPlusIcon } from '@heroicons/react/24/outline';

export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        department_id: '',
        position: '',
        username: '',
        birthdate: '',
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('hr.employees.store'), {
            forceFormData: true,
        });
    };

    return (
        <HRLayout>
            <Head title="Add Employee" />
            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-green-600 rounded-xl p-3">
                        <UserPlusIcon className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Add New Employee</h1>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-xl border border-green-900/30 p-6">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                        {/* Two-column grid for main fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Full Name <span className="text-green-400">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                            </div>

                            {/* Department Dropdown */}
                            <div>
                                <label htmlFor="department_id" className="block text-sm font-medium text-gray-300 mb-1">
                                    Department <span className="text-green-400">*</span>
                                </label>
                                <select
                                    id="department_id"
                                    value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} {dept.code ? `(${dept.code})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.department_id && <p className="mt-1 text-sm text-red-400">{errors.department_id}</p>}
                            </div>

                            {/* Position */}
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
                                    Position <span className="text-green-400">*</span>
                                </label>
                                <input
                                    id="position"
                                    type="text"
                                    value={data.position}
                                    onChange={e => setData('position', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="e.g., Developer, Manager"
                                />
                                {errors.position && <p className="mt-1 text-sm text-red-400">{errors.position}</p>}
                            </div>

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                    Username <span className="text-green-400">*</span>
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={e => setData('username', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="johndoe"
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                            </div>

                            {/* Birthdate */}
                            <div>
                                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-300 mb-1">
                                    Birthdate <span className="text-green-400">*</span>
                                </label>
                                <input
                                    id="birthdate"
                                    type="date"
                                    value={data.birthdate}
                                    onChange={e => setData('birthdate', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-400">Initial password (YYYY-MM-DD)</p>
                                {errors.birthdate && <p className="mt-1 text-sm text-red-400">{errors.birthdate}</p>}
                            </div>

                            {/* Photo Upload - spans full width on md */}
                            <div className="md:col-span-2">
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-300 mb-1">
                                    Profile Photo <span className="text-green-400">(optional)</span>
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 transition">
                                        Choose File
                                        <input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('photo', e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                    {data.photo && (
                                        <span className="text-sm text-gray-300">{data.photo.name}</span>
                                    )}
                                </div>
                                {errors.photo && <p className="mt-1 text-sm text-red-400">{errors.photo}</p>}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Employee'
                                )}
                            </button>
                            <Link
                                href={route('hr.employees.index')}
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
