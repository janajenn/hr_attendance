import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarIcon,
    ArrowLeftIcon,
    MapPinIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    FunnelIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function History({ records, locations, filters }) {
    const items = records.data;
    const links = records.links;
    const [selectedLocation, setSelectedLocation] = useState(filters.location_id || '');

    const handleLocationFilter = (e) => {
        const locationId = e.target.value;
        setSelectedLocation(locationId);
        router.get(route('attendance.history'), { location_id: locationId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilter = () => {
        setSelectedLocation('');
        router.get(route('attendance.history'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present':
                return <CheckCircleIcon className="h-3 w-3 mr-1" />;
            case 'late':
                return <ClockIcon className="h-3 w-3 mr-1" />;
            default:
                return <XCircleIcon className="h-3 w-3 mr-1" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-500/20 text-green-300';
            case 'late':
                return 'bg-yellow-500/20 text-yellow-300';
            default:
                return 'bg-red-500/20 text-red-300';
        }
    };

    return (
        <>
            <Head title="Attendance History" />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                {/* Header */}
                <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-600 rounded-lg p-1.5">
                                    <CalendarIcon className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-lg font-semibold tracking-tight">Attendance History</h1>
                            </div>
                            <Link
    href={route('attendance.create')}
    className="inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
>
    <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
    <span>Back to Scanner</span>
</Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-6">

                    {/* Queue Info Card */}
<div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-4">
    <div className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-200">
            <p className="font-semibold">About attendance records</p>
            <p>When you submit your attendance, it may take up to 1 minute to appear in your history. This is because we process records in the background to keep the system fast and reliable. No need to resubmit – your attendance will be saved automatically.</p>
        </div>
    </div>
</div>


                    {/* Filter Section */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-2">
    <FunnelIcon className="h-5 w-5 text-blue-400" />
    <h3 className="text-sm font-semibold text-gray-300">Filter by Location</h3>
</div>
                            {selectedLocation && (
                                <button
                                    onClick={clearFilter}
                                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Clear
                                </button>
                            )}
                        </div>
                        <select
                            value={selectedLocation}
                            onChange={handleLocationFilter}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Locations</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">
                            Select a location to view only attendance records from that venue.
                        </p>
                    </div>

                    {items.length === 0 ? (
    <div className="text-center py-8 sm:py-16 px-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
        <CalendarIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
        <p className="text-base sm:text-lg text-gray-400">No attendance records yet.</p>
        <div className="mt-4 bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 max-w-full sm:max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
                <span className="font-semibold">📌 Note:</span> If you just scanned a QR code, your record may take up to 1 minute to appear here.
                Please wait a moment and refresh the page. Do not scan again.
            </p>
        </div>
    </div>
) : (
                        <>
                            <div className="space-y-4">
                                {items.map((record) => (
                                    <div
                                        key={record.id}
                                        className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-5 hover:bg-white/10 transition-all duration-200"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <CalendarIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                                    <time className="text-sm text-blue-400 font-medium break-words">
                                                        {new Date(record.attendance_timestamp).toLocaleString('en-PH', {
                                                            timeZone: 'Asia/Manila',
                                                            dateStyle: 'full',
                                                            timeStyle: 'medium'
                                                        })}
                                                    </time>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm">
                                                    <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-300">
                                                        {record.location?.name || 'Unknown Location'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-col sm:items-end">
                                                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                                                    {getStatusIcon(record.status)}
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {links && links.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 mt-8">
                                    {links.map((link, index) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
