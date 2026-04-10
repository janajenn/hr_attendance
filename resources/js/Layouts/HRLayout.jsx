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
        { name: 'Departments', href: route('hr.departments.index'), icon: BuildingOfficeIcon },
        { name: 'Locations', href: route('hr.locations.index'), icon: MapPinIcon },
        { name: 'Location Percentages', href: route('hr.locations.percentages'), icon: ChartBarIcon },
        { name: 'Location Activity', href: route('hr.locations.activity'), icon: CalendarIcon },
        { name: 'HR Users', href: route('hr.hr-users.index'), icon: UserPlusIcon },
    ];

    
    return (
        <div className="min-h-screen bg-gray-900 text-white font-['Inter',system-ui,sans-serif]">
            {/* Desktop sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
                <div className="flex flex-col flex-1 min-h-0 bg-gray-800/40 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-all duration-300">
                    {/* Header with tech icon */}
                    <div className="flex items-center h-20 px-6 border-b border-white/10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-green-400 rounded-xl blur-md opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-cyan-500 to-green-600 rounded-xl p-2 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <span className="ml-3 text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            HR Portal
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-300 hover:text-white transition-all duration-200 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/10 group-hover:via-green-500/5 group-hover:to-transparent transition-all duration-500"></div>
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-green-500/20 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all duration-200">
                                        <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="ml-3 group-hover:translate-x-1 transition-transform">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User profile – modern card with glow */}
                    <div className="flex-shrink-0 border-t border-white/10 p-4">
                        <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10 shadow-lg transition-all hover:bg-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative">
                                        {user.photo ? (
                                            <img
                                                className="h-10 w-10 rounded-xl object-cover ring-2 ring-green-500/50 shadow-md"
                                                src={`/storage/${user.photo}`}
                                                alt=""
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ring-2 ring-green-500/50 shadow-md">
                                                <span className="text-lg font-bold text-green-400">
                                                    {user.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-800 animate-pulse"></div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-xs text-green-400 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-105"
                                    title="Logout"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-72 flex flex-col flex-1">
                {/* Mobile header – sleek */}
                <div className="sticky top-0 z-10 md:hidden bg-gray-800/80 backdrop-blur-xl border-b border-white/10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="bg-gradient-to-br from-cyan-500 to-green-600 rounded-lg p-1.5 shadow">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="ml-2 font-bold text-white">HR Portal</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 bg-white/10 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 bg-gray-900">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
