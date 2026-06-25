import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    CalendarIcon,
    UserGroupIcon,
    DocumentDuplicateIcon,
    TruckIcon,
    ClockIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function Welcome() {
    const { auth } = usePage().props;

    // Define service modules
    const modules = [
        {
            id: 'attendance',
            title: 'Employee Activity Attendance Management',
            description: 'Record and track attendance for official activities and events.',
            icon: CalendarIcon,
            route: 'https://hrattendance.leaveportal.site/login',
            enabled: true,
            status: 'Active',
            statusColor: 'green',
            buttonText: 'Access Module',
            external: true,
        },
        {
            id: 'leave',
            title: 'Leave Management System',
            description: 'Apply for and manage leave requests, balances, and approvals.',
            icon: UserGroupIcon,
            route: null,
            enabled: false,
            status: 'Coming Soon',
            statusColor: 'yellow',
            buttonText: 'Unavailable',
        },
        {
            id: 'passslip',
            title: 'Digital Pass Slip Management',
            description: 'Create, approve, and track digital pass slips for official business.',
            icon: DocumentDuplicateIcon,
            route: null,
            enabled: false,
            status: 'Coming Soon',
            statusColor: 'yellow',
            buttonText: 'Unavailable',
        },
        {
            id: 'travel',
            title: 'Travel Order Management',
            description: 'Request and manage travel orders, itineraries, and expenses.',
            icon: TruckIcon,
            route: null,
            enabled: false,
            status: 'Coming Soon',
            statusColor: 'yellow',
            buttonText: 'Unavailable',
        },
        {
            id: 'cto',
            title: 'Compensatory Time-Off (CTO) Management',
            description: 'Track and manage compensatory time-off credits and usage.',
            icon: ClockIcon,
            route: null,
            enabled: false,
            status: 'Coming Soon',
            statusColor: 'yellow',
            buttonText: 'Unavailable',
        },
    ];

    return (
        <>
            <Head title="HRIS - Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
                            <ShieldCheckIcon className="h-8 w-8 text-blue-700" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            Human Resource Information System
                            <span className="block text-2xl md:text-3xl font-light text-blue-700 mt-2">
                                Unified Employee Services Portal
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                            A centralized platform for employees to access HR services efficiently.
                            Manage attendance, leave, pass slips, and more—all in one place.
                        </p>

                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map((module) => {
                            const Icon = module.icon;
                            const isExternal = module.external && module.route;

                            return (
                                <div
                                    key={module.id}
                                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                                        module.enabled ? 'hover:border-blue-400' : 'opacity-80'
                                    }`}
                                >
                                    {/* Status badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            module.statusColor === 'green'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {module.status}
                                        </span>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-start">
                                            <div className={`flex-shrink-0 p-3 rounded-xl ${
                                                module.enabled
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                <Icon className="h-8 w-8" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {module.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                            {module.description}
                                        </p>

                                        <div className="mt-6">
                                            {module.enabled ? (
                                                isExternal ? (
                                                    <a
                                                        href={module.route}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm group"
                                                    >
                                                        {module.buttonText}
                                                        <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={module.route}
                                                        className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm group"
                                                    >
                                                        {module.buttonText}
                                                        <ArrowRightIcon className="ml-2 -mr-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                )
                                            ) : (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
                                                >
                                                    {module.buttonText}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer note */}
                    <div className="mt-12 text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
                        <p>© {new Date().getFullYear()} HRIS. All rights reserved.</p>
                        <p className="mt-1">Only Employee Activity Attendance is currently available. Other modules are under development.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
