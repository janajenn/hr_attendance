import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function EmployeeAttendanceOverview({ overview, departments, filters, totalActiveDays }) {
    const [search, setSearch] = useState(filters.search || '');
    const [departmentId, setDepartmentId] = useState(filters.department_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route('hr.employee.attendance.overview'), {
            search,
            department_id: departmentId,
            start_date: startDate,
            end_date: endDate,
            status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setDepartmentId('');
        setStartDate('');
        setEndDate('');
        setStatus('');
        router.get(route('hr.employee.attendance.overview'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const viewDetails = (userId) => {
        router.visit(route('hr.employee.attendance.show', userId));
    };

    return (
        <HRLayout>
            <Head title="Employee Attendance Overview" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-white mb-6">Employee Attendance Overview</h1>

                {/* Filter Section */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 mb-6">
                    <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Employee or department..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                            </select>
                        </div>
                    </form>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Summary info */}
                <div className="text-sm text-gray-400 mb-4">
                    Total active days in period: <span className="font-bold text-white">{totalActiveDays}</span>
                </div>

                {/* Table */}
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
                            {overview.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400">No employees found.</td>
                                </tr>
                            ) : (
                                overview.map(emp => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </HRLayout>
    );
}
