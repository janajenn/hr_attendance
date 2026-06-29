import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import WelcomeMap from '@/Components/WelcomeMap';

export default function Welcome() {
    const { auth } = usePage().props;

    // Helper to get the correct dashboard route based on role
    const getDashboardRoute = () => {
        if (!auth.user) return route('login');

        if (auth.user.role === 'employee') {
            return route('attendance.create');
        } else if (auth.user.role === 'hr') {
            return route('hr.dashboard');
        } else {
            return route('dashboard'); // fallback
        }
    };

    // Determine the button's href
    const buttonHref = auth.user ? getDashboardRoute() : route('login');

    return (
        <>
            <Head title="Employee Attendance System" />

            {/* Map background */}
            <div className="fixed inset-0 -z-10">
                <WelcomeMap />
            </div>

            <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-3xl w-full">
                    {/* Glass card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 border border-white/20 text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-green-500/20 rounded-full mb-4 sm:mb-6">
                            <CalendarIcon className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" />
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Employee Activity Attendance
                        </h1>

                        <p className="mt-3 sm:mt-4 text-base sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                            Record and track attendance for official activities and events.
                        </p>

                        {/* Feature highlights */}
                        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4 max-w-2xl mx-auto">
                            <div className="sm:col-span-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="text-green-400 font-semibold text-sm sm:text-base">Clock In / Out</div>
                                <div className="text-xs sm:text-sm text-gray-300">Log attendance with GPS</div>
                            </div>
                            <div className="sm:col-span-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="text-green-400 font-semibold text-sm sm:text-base">History</div>
                                <div className="text-xs sm:text-sm text-gray-300">View your records</div>
                            </div>
                            <div className="sm:col-span-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="text-green-400 font-semibold text-sm sm:text-base">Reports</div>
                                <div className="text-xs sm:text-sm text-gray-300">Generate summaries</div>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div className="mt-8 sm:mt-10">
                            <Link
                                href={buttonHref}
                                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-colors duration-200 group"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Get Started'}
                                <ArrowRightIcon className="ml-2 sm:ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
                                Secure &bull; Reliable &bull; LGU Opol
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} HRIS – Employee Activity Attendance</p>
                    </div>
                </div>
            </div>
        </>
    );
}
