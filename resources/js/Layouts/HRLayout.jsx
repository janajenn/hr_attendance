import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    ChartBarIcon,
    UserGroupIcon,
    CalendarIcon,
    ArrowRightOnRectangleIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function HRLayout({ children }) {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;
    const user = auth.user;
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to log out?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('logout'));
            }
        });
    };

    const navigation = [
        { name: 'Dashboard', href: route('hr.dashboard'), icon: ChartBarIcon },
        { name: 'Employees', href: route('hr.employees.index'), icon: UserGroupIcon },
        { name: 'Attendance Overview', href: route('hr.employee.attendance.overview'), icon: ChartBarIcon },
        { name: 'Departments', href: route('hr.departments.index'), icon: BuildingOfficeIcon },
        { name: 'Locations', href: route('hr.locations.index'), icon: MapPinIcon },
        { name: 'Location Percentages', href: route('hr.locations.percentages'), icon: ChartBarIcon },
        { name: 'Location Activity', href: route('hr.locations.activity'), icon: CalendarIcon },
        { name: 'HR Users', href: route('hr.hr-users.index'), icon: UserPlusIcon },
    ];

    const isActive = (href) => {
        if (!currentUrl || !href) return false;
        const getPath = (url) => {
            try {
                const urlObj = new URL(url, window.location.origin);
                return urlObj.pathname.replace(/\/$/, '');
            } catch {
                return url.replace(/\/$/, '');
            }
        };
        const currentPath = getPath(currentUrl);
        const targetPath = getPath(href);
        const dashboardPath = getPath(route('hr.dashboard'));
        if (targetPath === dashboardPath) return currentPath === dashboardPath;
        return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white font-['Inter',system-ui,sans-serif]">
            {/* Desktop sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-1 min-h-0 bg-gray-800/40 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center h-16 px-4 border-b border-white/10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-md opacity-60"></div>
                            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-1.5 shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <span className="ml-2 text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            HR Portal
                        </span>
                    </div>

                    {/* Navigation - compact */}
                    <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group relative flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 overflow-hidden ${
                                        active
                                            ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/10 text-white shadow-md shadow-green-500/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full shadow-glow" />
                                    )}
                                    <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                                        active
                                            ? 'bg-green-500/30 shadow-sm shadow-green-500/20'
                                            : 'bg-white/5 group-hover:bg-green-500/20 group-hover:shadow-sm group-hover:shadow-green-500/20'
                                    }`}>
                                        <Icon className={`h-4 w-4 transition-transform duration-200 ${
                                            active ? 'scale-105 text-green-300' : 'group-hover:scale-105'
                                        }`} />
                                    </div>
                                    <span className={`ml-2 transition-all duration-200 ${
                                        active ? 'translate-x-0.5 font-medium' : 'group-hover:translate-x-0.5'
                                    }`}>
                                        {item.name}
                                    </span>
                                    {active && (
                                        <div className="absolute right-2 w-1 h-1 rounded-full bg-green-400 shadow-glow" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User profile - compact */}
                    <div className="flex-shrink-0 border-t border-white/10 p-3">
                        <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-md transition-all hover:bg-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative">
                                        {user.photo ? (
                                            <img
                                                className="h-8 w-8 rounded-lg object-cover ring-2 ring-green-500/50 shadow-md"
                                                src={`/storage/${user.photo}`}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ring-2 ring-green-500/50 shadow-md">
                                                <span className="text-sm font-bold text-green-400">
                                                    {user.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-gray-800 animate-pulse"></div>
                                    </div>
                                    <div className="ml-2">
                                        <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user.name}</p>
                                        <p className="text-[10px] text-green-400 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 bg-white/10 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105"
                                    title="Logout"
                                >
                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <div className="sticky top-0 z-10 md:hidden bg-gray-800/80 backdrop-blur-xl border-b border-white/10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-14 items-center">
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-1 shadow">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold text-white text-sm">HR Portal</span>
                                    <p className="text-[10px] text-green-400">
                                        {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 bg-white/10 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-4 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
