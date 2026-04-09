import React, { useRef, useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import jsQR from 'jsqr';
import {
    ClockIcon,
    ArrowRightOnRectangleIcon,
    CameraIcon,
    XCircleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function Create() {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    useEffect(() => {
        let animationFrame;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    animationFrame = requestAnimationFrame(tick);
                }
            } catch (err) {
                setError('Camera access denied: ' + err.message);
            }
        };

        startCamera();

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const tick = () => {
    if (!videoRef.current || !scanning) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code && code.data && code.data.trim() !== '') {
            setScanning(false);
            try {
                const url = new URL(code.data);
                router.visit(url.pathname);
            } catch {
                router.visit(route('attendance.scan', code.data));
            }
            return;
        }
    }
    requestAnimationFrame(tick);
};

    const formattedTime = currentTime.toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const formattedDate = currentTime.toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <Head title="Scan QR Code" />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                {/* Header */}
                <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-600 rounded-lg p-1.5">
                                    <CameraIcon className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-lg font-semibold tracking-tight">Scan Attendance QR</h1>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Link
                                    href={route('attendance.history')}
                                    className="inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
                                >
                                    <ClockIcon className="h-4 w-4 mr-1.5" />
                                    <span className="hidden sm:inline">History</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium text-red-300 transition"
                                >
                                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-8">
                    {/* Scanner Card */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-6">
                        <p className="text-center text-gray-300 mb-4">
                            Position the QR code within the frame to scan
                        </p>

                        {error ? (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                                <XCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-3" />
                                <p className="text-red-300">{error}</p>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-w-md mx-auto">
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    playsInline
                                />
                                <div className="absolute inset-0 border-4 border-green-500/30 rounded-xl pointer-events-none" />
                                {!scanning && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="text-white">Redirecting...</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Time and Info Card */}
                    <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <ClockIcon className="h-6 w-6 text-blue-400" />
                            <div>
                                <p className="text-2xl font-semibold tracking-tight">{formattedTime}</p>
                                <p className="text-sm text-gray-400">{formattedDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm text-gray-300 border-t border-white/10 pt-4">
                            <InformationCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <p>
                                You can scan this QR code, but your attendance won't be recorded if you're outside the allowed range.
                                Make sure you are within the designated geofence before scanning.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
