import { Head, Link, usePage } from '@inertiajs/react';
import WelcomeMap from '@/Components/WelcomeMap';

export default function Welcome({ laravelVersion, phpVersion }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />

            {/* Full‑screen map background */}
            <div className="fixed inset-0 -z-10">
                <WelcomeMap />
            </div>

            {/* Overlay content */}
            <div className="relative min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            LGU Opol
                        </h1>
                        <p className="text-lg text-gray-300 mb-8">
                            Activities Attendance System for HRMO
                        </p>

                        {auth.user ? (
                            <Link
                                href={auth.user.role === 'hr'
                                    ? route('hr.dashboard')
                                    : route('attendance.create')}
                                className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl transition shadow-lg shadow-green-500/50"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <div className="space-y-4">
                                <Link
                                    href={route('login')}
                                    className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-xl border border-white/30 transition"
                                >
                                    Log in
                                </Link>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-8">
                        Developed by HRMO Interns
                    </p>
                </div>
            </div>
        </>
    );
}
