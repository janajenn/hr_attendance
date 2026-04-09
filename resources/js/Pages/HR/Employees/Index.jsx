import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import Swal from 'sweetalert2';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Index({ employees, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('hr.employees.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetPassword = (userId, userName) => {
        Swal.fire({
            title: 'Reset Password?',
            text: `Reset password for ${userName}? The password will be set to their birthdate.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reset it!',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('hr.employees.reset-password', userId), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Reset!',
                            text: 'Password has been reset.',
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

    const handleDelete = (userId, userName) => {
        Swal.fire({
            title: 'Delete Employee?',
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
                router.delete(route('hr.employees.destroy', userId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Employee has been deleted.',
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
            <Head title="Manage Employees" />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-white">Employees</h1>
                    <div className="flex items-center gap-4">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-green-900/30 rounded-md leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                            >
                                Search
                            </button>
                        </form>
                        <Link
                            href={route('hr.employees.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            + Add Employee
                        </Link>
                    </div>
                </div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="mb-4 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Employees table */}
                <div className="bg-gray-800 shadow overflow-hidden rounded-lg border border-green-900/30">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-green-900/30">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Photo</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-green-900/30">
                                {employees.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-400">
                                            No employees found.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.data.map(emp => (
                                        <tr key={emp.id} className="hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.employee_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {emp.photo ? (
                                                    <img src={`/storage/${emp.photo}`} alt={emp.name} className="h-10 w-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                                                        {emp.name?.charAt(0)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.department?.code || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.position}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <Link href={route('hr.employees.edit', emp.id)} className="text-green-400 hover:text-green-300">Edit</Link>
                                                <button onClick={() => handleResetPassword(emp.id, emp.name)} className="text-yellow-400 hover:text-yellow-300">Reset PW</button>
                                                <button onClick={() => handleDelete(emp.id, emp.name)} className="text-red-400 hover:text-red-300">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {employees.links && (
                    <div className="mt-4 flex justify-center">
                        <nav className="inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                            {employees.links.map((link, index) => {
                                const isPrevious = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');
                                const label = isPrevious ? '«' : (isNext ? '»' : link.label);
                                if (link.url === null) {
                                    return (
                                        <span
                                            key={index}
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-700 border border-gray-600 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-600 ${
                                            link.active
                                                ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                        preserveScroll
                                        preserveState
                                    />
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </HRLayout>
    );
}
