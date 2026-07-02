
import React, { useState } from 'react'; // make sure useState is imported
import { Head, Link,router } from '@inertiajs/react';
import LogoutConfirmation from '../../Components/LogoutConfirmation';

import {
    ChartBarIcon,
    CheckCircleIcon,
    XCircleIcon,
    CameraIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
    KeyIcon,
    CalendarIcon,
    MapPinIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

export default function Dashboard({
    overall,
    weekStats,
    monthStats,
    recent,
    locationStats,
    chartData,
    avgTime,
    activeLocation,
}) {
    // Calculate attendance rate
    const rate = overall?.total > 0
        ? Math.round((overall.attended / overall.total) * 100)
        : 0;

    // Helper to format date
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString('en-PH', {
            timeZone: 'Asia/Manila',
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };


    const [showLogout, setShowLogout] = useState(false);


    // Helper for status badge
    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-500/20 text-green-300';
            case 'late': return 'bg-yellow-500/20 text-yellow-300';
            default: return 'bg-red-500/20 text-red-300';
        }



    };



    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                {/* ====== HEADER (responsive) ====== */}
                <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-between gap-2 py-2 sm:py-0 sm:h-16">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="bg-blue-600 rounded-lg p-1.5">
                                    <ChartBarIcon className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-base sm:text-lg font-semibold tracking-tight">Dashboard</h1>
                            </div>
                            {/* Navigation links - all pages */}
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                <Link
                                    href={route('attendance.create')}
                                    className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
                                >
                                    <CameraIcon className="h-4 w-4 sm:mr-1.5" />
                                    <span className="hidden sm:inline">Scan</span>
                                </Link>
                                <Link
                                    href={route('attendance.history')}
                                    className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
                                >
                                    <ClockIcon className="h-4 w-4 sm:mr-1.5" />
                                    <span className="hidden sm:inline">History</span>
                                </Link>
                                <Link
                                    href={route('password.change')}
                                    className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm font-medium text-blue-300 transition"
                                >
                                    <KeyIcon className="h-4 w-4 sm:mr-1.5" />
                                    <span className="hidden sm:inline">Password</span>
                                </Link>
                                <button
    onClick={() => setShowLogout(true)}
    className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium text-red-300 transition"
    aria-label="Logout"
>
    <ArrowRightOnRectangleIcon className="h-4 w-4 sm:mr-1.5" />
    <span className="hidden sm:inline">Logout</span>
</button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                    {/* ====== QUICK ACTION ====== */}
                    {activeLocation && (
                        <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <MapPinIcon className="h-6 w-6 text-blue-400" />
                                <div>
                                    <p className="text-sm font-medium">Active location: <span className="text-blue-300">{activeLocation.name}</span></p>
                                    <p className="text-xs text-gray-400">Tap “Scan Now” to record attendance</p>
                                </div>
                            </div>
                            <Link
                                href={route('attendance.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition w-full sm:w-auto justify-center"
                            >
                                <CameraIcon className="h-4 w-4 mr-2" />
                                Scan Now
                            </Link>
                        </div>
                    )}

                   {/* ====== OVERALL STATS – Minimal ====== */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center">
        <div className="flex items-center justify-center mb-1">
            <CheckCircleIcon className="h-6 w-6 text-green-400" />
        </div>
        <p className="text-xs text-gray-400">Attended</p>
        <p className="text-2xl font-bold text-green-300">{overall?.attended ?? 0}</p>
    </div>
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center">
        <div className="flex items-center justify-center mb-1">
            <XCircleIcon className="h-6 w-6 text-red-400" />
        </div>
        <p className="text-xs text-gray-400">Missed</p>
        <p className="text-2xl font-bold text-red-300">{overall?.missed ?? 0}</p>
    </div>
    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 text-center sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-center mb-1">
            <ChartBarIcon className="h-6 w-6 text-blue-400" />
        </div>
        <p className="text-xs text-gray-400">Attendance Rate</p>
        <p className="text-2xl font-bold text-blue-300">{rate}%</p>
        <p className="text-[10px] text-gray-500">({overall?.attended ?? 0} / {overall?.total ?? 0})</p>
    </div>
</div>

                    {/* ====== WEEKLY / MONTHLY SUMMARY ====== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
                            <p className="text-sm text-gray-400">This week</p>
                            <p className="text-2xl font-semibold">
                                {weekStats?.attended ?? 0}
                                <span className="text-sm text-gray-400 ml-2">
                                    / {weekStats?.total ?? 0}
                                </span>
                            </p>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                <div
                                    className="bg-green-400 h-1.5 rounded-full"
                                    style={{ width: `${weekStats?.total > 0 ? (weekStats.attended / weekStats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
                            <p className="text-sm text-gray-400">This month</p>
                            <p className="text-2xl font-semibold">
                                {monthStats?.attended ?? 0}
                                <span className="text-sm text-gray-400 ml-2">
                                    / {monthStats?.total ?? 0}
                                </span>
                            </p>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                <div
                                    className="bg-green-400 h-1.5 rounded-full"
                                    style={{ width: `${monthStats?.total > 0 ? (monthStats.attended / monthStats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ====== 7‑DAY CHART ====== */}
                    {chartData && chartData.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Last 7 days</h3>
                            <div className="h-48 sm:h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="present" stackId="a" fill="#4ade80" />
                                        <Bar dataKey="late" stackId="a" fill="#facc15" />
                                        <Bar dataKey="absent" stackId="a" fill="#f87171" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded" /> Present</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded" /> Late</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded" /> Absent</span>
                            </div>
                        </div>
                    )}

                    {/* ====== LOCATION BREAKDOWN ====== */}
                    {locationStats && locationStats.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Check‑ins by Location</h3>
                            <div className="space-y-2">
                                {locationStats.map((loc) => (
                                    <div key={loc.location_id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">
                                            <MapPinIcon className="h-4 w-4 inline mr-1" />
                                            {loc.location_name || 'Unknown'}
                                        </span>
                                        <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                                            {loc.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ====== AVERAGE CHECK‑IN TIME ====== */}
                    {avgTime && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 text-center">
                            <p className="text-sm text-gray-400">Average check‑in time</p>
                            <p className="text-2xl font-semibold text-blue-300">{avgTime}</p>
                            <p className="text-xs text-gray-500">(for present / late entries)</p>
                        </div>
                    )}

                    {/* ====== RECENT ATTENDANCE ====== */}
                    {recent && recent.length > 0 && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-semibold text-gray-300">Recent Activity</h3>
                                <Link
                                    href={route('attendance.history')}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    View all →
                                </Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {recent.map((record) => (
                                    <div key={record.id} className="py-2 flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-block w-2 h-2 rounded-full ${record.status === 'present' ? 'bg-green-400' : record.status === 'late' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                                            <span className="text-sm">{formatDate(record.attendance_timestamp)}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {record.location?.name || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <LogoutConfirmation
    isOpen={showLogout}
    onClose={() => setShowLogout(false)}
    onConfirm={() => router.post(route('logout'))}
/>
        </>
    );
}
