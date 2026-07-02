import React, { lazy, Suspense } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import ErrorBoundary from '@/Components/ErrorBoundary';

const WelcomeMap = lazy(() => import('@/Components/WelcomeMap'));

export default function Welcome() {
    const { auth } = usePage().props;

    const getDashboardRoute = () => {
        if (!auth.user) return route('login');
        if (auth.user.role === 'employee') return route('attendance.create');
        if (auth.user.role === 'hr') return route('hr.dashboard');
        return route('dashboard');
    };

    const buttonHref = auth.user ? getDashboardRoute() : route('login');

    return (
        <ErrorBoundary>
            <Head title="Employee Attendance System">
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
            </Head>

            {/* Map background – full viewport */}
            <div className="fixed inset-0 -z-10">
                <Suspense fallback={<div className="h-full bg-gray-800/50 animate-pulse" />}>
                    <WelcomeMap />
                </Suspense>
            </div>

            {/* Content – centered with max width */}
            <div className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
                <div className="max-w-3xl w-full">
                    {/* Glass card – reduced padding on mobile */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-5 sm:p-8 md:p-12 border border-white/20 text-center">
                        {/* Icon – smaller on mobile */}
                        <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-green-500/20 rounded-full mb-3 sm:mb-6">
                            <CalendarIcon className="h-8 w-8 sm:h-12 sm:w-12 text-green-400" />
                        </div>

                        {/* Title – responsive sizes */}
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            Employee Activity Attendance
                        </h1>

                        <p className="mt-2 sm:mt-4 text-sm sm:text-xl text-gray-300 max-w-2xl mx-auto px-2">
                            Record and track attendance for official activities and events.
                        </p>

                        {/* Feature highlights – better grid on mobile */}
                        <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="text-green-400 font-semibold text-xs sm:text-base">Clock In / Out</div>
                                <div className="text-xs sm:text-sm text-gray-300">Log attendance with GPS</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="text-green-400 font-semibold text-xs sm:text-base">History</div>
                                <div className="text-xs sm:text-sm text-gray-300">View your records</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                                <div className="text-green-400 font-semibold text-xs sm:text-base">Reports</div>
                                <div className="text-xs sm:text-sm text-gray-300">Generate summaries</div>
                            </div>
                        </div>

                        {/* CTA button – full width on mobile */}
                        <div className="mt-6 sm:mt-10">
                            <Link
                                href={buttonHref}
                                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-sm sm:text-lg font-semibold rounded-xl shadow-lg transition-colors duration-200 group"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Get Started'}
                                <ArrowRightIcon className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
                                Secure &bull; Reliable &bull; LGU Opol
                            </p>
                        </div>
                    </div>

                    {/* Footer – smaller text on mobile */}
                    <div className="mt-4 sm:mt-8 text-center text-[10px] sm:text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} HRIS – Developed by HRMO Team</p>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
