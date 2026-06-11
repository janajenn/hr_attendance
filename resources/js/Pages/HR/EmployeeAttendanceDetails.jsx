import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { ArrowLeftIcon, MapPinIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function EmployeeAttendanceDetails({ employee, details }) {
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
    };

    return (
        <HRLayout>
            <Head title={`${employee.name} – Attendance Details`} />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Back button and header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.visit(route('hr.employee.attendance.overview'))}
                        className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Overview
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{employee.name}</h1>
                        <p className="text-gray-400">{employee.department}</p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 text-center">
                        <p className="text-sm text-gray-400">Total Active Days</p>
                        <p className="text-3xl font-bold text-white">{employee.total_active_days}</p>
                    </div>
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 text-center">
                        <p className="text-sm text-gray-400">Attended</p>
                        <p className="text-3xl font-bold text-white">{employee.attended}</p>
                    </div>
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 text-center">
                        <p className="text-sm text-gray-400">Attendance Rate</p>
                        <p className={`text-3xl font-bold ${employee.percentage < 50 ? 'text-red-400' : 'text-green-400'}`}>
                            {employee.percentage}%
                        </p>
                    </div>
                </div>

                {/* Detailed records table */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white">Attendance Records</h2>
                        <p className="text-sm text-gray-400">All check‑ins with activity start times</p>
                    </div>
                    {details.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">No attendance records found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Checked In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Activity Started</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {details.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                                                    {item.location_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                                    {formatDateTime(item.check_in_time)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                                    {formatDateTime(item.activity_start_time)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'present'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </HRLayout>
    );
}
