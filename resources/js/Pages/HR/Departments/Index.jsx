import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { MagnifyingGlassIcon, BuildingOfficeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function Index({ departments, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        router.get(route('hr.departments.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSearching(false),
        });
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'Delete Department?',
            text: `Are you sure you want to delete "${name}"? This cannot be undone if the department has employees.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('hr.departments.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Department has been deleted.',
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
            <Head title="Manage Departments" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 shadow-lg">
                            <BuildingOfficeIcon className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Departments</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search departments..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-64 pl-10 pr-3 py-2 border border-gray-600 rounded-xl bg-gray-800/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                            >
                                {isSearching ? '...' : 'Search'}
                            </button>
                        </form>
                        <Link
                            href={route('hr.departments.create')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition"
                        >
                            + Add Department
                        </Link>
                    </div>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mb-4 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-xl">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl">
                        {flash.error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Employees</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {departments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                            No departments found.
                                        </td>
                                    </tr>
                                ) : (
                                    departments.data.map((dept) => (
                                        <tr key={dept.id} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{dept.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{dept.code || '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <Link
                                                    href={route('hr.departments.employees', dept.id)}
                                                    className="text-blue-400 hover:text-blue-300 font-medium transition"
                                                >
                                                    {dept.users_count || 0} {dept.users_count === 1 ? 'employee' : 'employees'}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                <Link
                                                    href={route('hr.departments.edit', dept.id)}
                                                    className="text-green-400 hover:text-green-300 transition"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-5 w-5 inline" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(dept.id, dept.name)}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-5 w-5 inline" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {departments.links && departments.links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {departments.links.map((link, index) => {
                            if (!link.url) {
                                return (
                                    <span
                                        key={index}
                                        className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }
                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                        link.active
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveScroll
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </HRLayout>
    );
}
