import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function EmployeeAttendanceOverview({ overview }) {
    const viewDetails = (userId) => {
        router.visit(route('hr.employee.attendance.show', userId));
    };

    return (
        <HRLayout>
            <Head title="Employee Attendance Overview" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white mb-6">Employee Attendance Overview</h1>

                <div className="overflow-x-auto bg-gray-800/70 rounded-2xl border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Employee</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Department</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Attendance</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">%</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {overview.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-700/50">
                                    <td className="px-4 py-3 text-sm text-white">{emp.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-300">{emp.department}</td>
                                    <td className="px-4 py-3 text-sm text-white">{emp.attended} / {emp.total_active_days}</td>
                                    <td className={`px-4 py-3 text-sm font-bold ${emp.percentage < 50 ? 'text-red-400' : 'text-green-400'}`}>{emp.percentage}%</td>
                                    <td className="px-4 py-3 text-sm">
                                        <button
                                            onClick={() => viewDetails(emp.id)}
                                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                        >
                                            <EyeIcon className="h-4 w-4" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </HRLayout>
    );
}
