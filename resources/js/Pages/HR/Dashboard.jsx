import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line // <-- added LineChart and Line
} from 'recharts';


const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function Dashboard({
    employeeSummary,
    departmentSummary,
    locationAttendanceSummary = [],
    employees = [],
    filters = {},
    stats,
    locations,
    locationEmployeeSummary,
    departments,
    absenceReport,
    totalActiveLocations,
    absenceFilters
}) {
    const { data, setData, get } = useForm({
        employee_id: filters.employee_id || '',
        date: filters.date || '',
        absence_start_date: absenceFilters.start_date,
        absence_end_date: absenceFilters.end_date,
        absence_department_id: absenceFilters.department_id || '',
    });

    const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || null);

    // Absence report search & pagination
    const [absenceSearch, setAbsenceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Filter absence report by name
    const filteredAbsence = absenceReport.filter(emp =>
        emp.name.toLowerCase().includes(absenceSearch.toLowerCase())
    );
    const totalFiltered = filteredAbsence.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAbsence = filteredAbsence.slice(startIndex, startIndex + itemsPerPage);

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('hr.dashboard'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const barData = employeeSummary.map(emp => ({
        name: emp.name.split(' ').slice(0, 2).join(' '),
        Present: emp.total - emp.late,
        Late: emp.late,
    }));

    const pieData = departmentSummary.map(dept => ({
        name: dept.department,
        value: dept.total,
    }));

    const currentLocationData = selectedLocationId && locationEmployeeSummary[selectedLocationId]
        ? locationEmployeeSummary[selectedLocationId]
        : [];

    return (
        <HRLayout>
            <Head title="HR Dashboard – Reports" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 relative">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Attendance Reports
                    </h1>
                    <p className="mt-2 text-gray-400 text-lg">
                        Visual summaries of attendance data. Use filters to focus on specific employees or dates.
                    </p>
                    <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2" />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Employees</p>
                                <p className="text-3xl font-bold text-white">{stats.totalEmployees}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Attendance</p>
                                <p className="text-3xl font-bold text-white">{stats.totalAttendance}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Today's Attendance</p>
                                <p className="text-3xl font-bold text-white">{stats.todayAttendance}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Filter Card */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 mb-8 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filter Reports
                    </h3>
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Employee</label>
                            <select
                                value={data.employee_id}
                                onChange={e => setData('employee_id', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">All Employees</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-lg transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                            <a
                                href={route('hr.dashboard.export', { employee_id: data.employee_id, date: data.date })}
                                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-200 inline-block text-center"
                            >
                                Export CSV
                            </a>
                        </div>
                    </form>
                </div>

               {/* Location Comparison Report - Modern Line Chart */}
<div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 mb-8 p-6">
    <h3 className="text-xl font-semibold text-white mb-2">Attendance by Location</h3>
    <p className="text-sm text-gray-400 mb-4">
        Trend of total attendance and unique employees per location.
    </p>
    {locationAttendanceSummary.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No attendance records for the selected filters.</div>
    ) : (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={locationAttendanceSummary}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <defs>
                        {/* Gradients for line strokes (optional, can be used as stroke) */}
                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.8}/>
                        </linearGradient>
                        <linearGradient id="uniqueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12, angle: -45, textAnchor: 'end' }}
                        height={60}
                        interval={0}
                    />
                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.9)',
                            backdropFilter: 'blur(8px)',
                            borderColor: '#374151',
                            borderRadius: '0.75rem',
                            color: '#F9FAFB',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        }}
                        labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
                        itemStyle={{ color: '#D1D5DB' }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#9CA3AF', paddingTop: 20 }}
                        iconType="circle"
                        iconSize={10}
                    />
                    <Line
                        type="monotone"
                        dataKey="total_attendance"
                        stroke="url(#totalGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 5, strokeWidth: 0 }}
                        activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                        name="Total Attendances"
                    />
                    <Line
                        type="monotone"
                        dataKey="unique_employees"
                        stroke="url(#uniqueGradient)"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', r: 5, strokeWidth: 0 }}
                        activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2 }}
                        name="Unique Employees"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )}
</div>


              {/* Employee Bar Chart - Modern */}
<div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 mb-8 p-6">
    <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Attendance by Employee</h3>
        <p className="text-sm text-gray-400">Present and late breakdown for each employee</p>
    </div>
    {barData.length === 0 ? (
        <div className="py-16 text-center text-gray-400">No data for selected filters.</div>
    ) : (
        <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                        {/* Gradient for Present bars */}
                        <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
                        </linearGradient>
                        {/* Gradient for Late bars */}
                        <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.9}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        interval={0}
                    />
                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.9)',
                            backdropFilter: 'blur(8px)',
                            borderColor: '#374151',
                            borderRadius: '0.75rem',
                            color: '#F9FAFB',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                        }}
                        labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
                        itemStyle={{ color: '#D1D5DB' }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#9CA3AF', paddingTop: 10 }}
                        iconType="circle"
                        iconSize={10}
                    />
                    <Bar
                        dataKey="Present"
                        stackId="a"
                        fill="url(#presentGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                    />
                    <Bar
                        dataKey="Late"
                        stackId="a"
                        fill="url(#lateGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )}
</div>

                {/* Department Section (Pie + Table) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pie Chart */}
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">Attendance by Department</h3>
                        <p className="text-sm text-gray-400 mb-4">Share of total attendance per department</p>
                        {pieData.length === 0 ? (
                            <div className="py-12 text-center text-gray-400">No data.</div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.75rem', color: '#F9FAFB' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Department Late Table */}
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">Department Late Details</h3>
                        <p className="text-sm text-gray-400 mb-4">Total attendance and late arrivals per department</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Department</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Late</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Late %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {departmentSummary.length === 0 ? (
                                        <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400">No data.</td></tr>
                                    ) : (
                                        departmentSummary.map((dept, idx) => {
                                            const latePct = dept.total > 0 ? ((dept.late / dept.total) * 100).toFixed(1) : '0.0';
                                            return (
                                                <tr key={idx} className="hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 py-3 text-sm text-white">{dept.department}</td>
                                                    <td className="px-4 py-3 text-sm text-white font-mono">{dept.total}</td>
                                                    <td className="px-4 py-3 text-sm text-white font-mono">{dept.late}</td>
                                                    <td className="px-4 py-3 text-sm text-white font-mono">{latePct}%</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

               {/* Per‑Location Employee Participation */}
<div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Employee Participation by Location</h3>
        <div className="mt-2 sm:mt-0">
            <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-green-500"
            >
                {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
            </select>
        </div>
    </div>
    <p className="text-sm text-gray-400 mb-4">
        Top 10 employees by attendance count at the selected location.
    </p>
    {currentLocationData.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No attendance records for this location.</div>
    ) : (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentLocationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                    {/* Gradient for bars */}
                    <linearGradient id="participationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.9}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
                <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    interval={0}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.9)',
                        backdropFilter: 'blur(8px)',
                        borderColor: '#374151',
                        borderRadius: '0.75rem',
                        color: '#F9FAFB',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    labelStyle={{ color: '#F9FAFB', fontWeight: 600 }}
                    itemStyle={{ color: '#D1D5DB' }}
                />
                <Legend wrapperStyle={{ color: '#9CA3AF', paddingTop: 10 }} />
                <Bar
                    dataKey="total"
                    fill="url(#participationGradient)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                    name="Attendances"
                />
            </BarChart>
        </ResponsiveContainer>
    )}
</div>
                {/* Attendance Negligence Report */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Attendance Negligence Report</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Employees with attendance percentage below 50% in the selected period. Use filters below to adjust the date range or department.
                    </p>

                    {/* Absence report filters */}
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="absence_start_date"
                                value={data.absence_start_date}
                                onChange={e => setData('absence_start_date', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                            <input
                                type="date"
                                name="absence_end_date"
                                value={data.absence_end_date}
                                onChange={e => setData('absence_end_date', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                            <select
                                name="absence_department_id"
                                value={data.absence_department_id}
                                onChange={e => setData('absence_department_id', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
                            >
                                Apply
                            </button>
                        </div>
                    </form>

                    {/* Note when no active locations */}
                    {totalActiveLocations === 0 && (
                        <div className="text-yellow-400 text-sm mb-4">
                            No locations were active during this period. The report shows attendance counts only.
                        </div>
                    )}

                    {/* Search */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={absenceSearch}
                            onChange={(e) => {
                                setAbsenceSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Department</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Attendance</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">%</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {paginatedAbsence.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400">No employees found.</td>
                                    </tr>
                                ) : (
                                    paginatedAbsence.map(emp => (
                                        <tr key={emp.id} className="hover:bg-gray-700/50">
                                            <td className="px-4 py-3 text-sm text-white">{emp.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-300">{emp.department}</td>
                                            <td className="px-4 py-3 text-sm text-white">
                                                {totalActiveLocations > 0 ? (
                                                    <>
                                                        <span className={emp.attendance_count === 0 ? 'text-red-400 font-bold' : ''}>
                                                            {emp.attendance_count}
                                                        </span>
                                                        <span className="text-gray-400 text-xs ml-1">/ {totalActiveLocations}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">{emp.attendance_count}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-white">
                                                {totalActiveLocations > 0 && (
                                                    <span className={emp.percentage < 50 ? 'text-red-400 font-bold' : ''}>
                                                        {emp.percentage}%
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                               <button
    onClick={() => window.open(
        route('hr.employees.memo', {
            user: emp.id,
            start: data.absence_start_date,
            end: data.absence_end_date,
            total_active: totalActiveLocations,
            attendance_count: emp.attendance_count,
            percentage: emp.percentage
        }),
        '_blank'
    )}
    className="text-blue-400 hover:text-blue-300"
>
    Generate Memo
</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalFiltered > itemsPerPage && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-400">
                                Page {currentPage} of {Math.ceil(totalFiltered / itemsPerPage)}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage >= Math.ceil(totalFiltered / itemsPerPage)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </HRLayout>
    );
}

