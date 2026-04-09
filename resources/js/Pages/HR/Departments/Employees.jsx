import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { ArrowLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Employees({ department, employees }) {
    return (
        <HRLayout>
            <Head title={`${department.name} Employees`} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 rounded-lg p-2">
                            <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">{department.name} Employees</h1>
                    </div>
                    <Link
                        href={route('hr.departments.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Departments
                    </Link>
                </div>

                <div className="bg-gray-800 shadow overflow-hidden rounded-lg border border-green-900/30">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-green-900/30">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Employee ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Position</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Username</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-green-900/30">
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-400">
                                            No employees in this department.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.employee_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.position || '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.username}</td>
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
