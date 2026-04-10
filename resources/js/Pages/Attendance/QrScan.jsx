import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    ClockIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    MapPinIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Modern person icon – no circle, just the person silhouette
const createPersonIcon = () => {
    return L.divIcon({
        className: 'custom-person-marker',
        html: `<div class="flex items-center justify-center w-5 h-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-400 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
    });
};

// Custom Leaflet control for the info box
const MapInfoControl = () => {
    const map = useMap();
    useEffect(() => {
        const controlDiv = L.DomUtil.create('div', 'info-control');
        controlDiv.innerHTML = `
            <div class="flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 text-xs text-white shadow-lg pointer-events-none">
                <div class="flex items-center gap-1">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Allowed area</span>
                </div>
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Your location</span>
                </div>
            </div>
        `;
        const control = L.control({ position: 'topright' });
        control.onAdd = () => controlDiv;
        control.addTo(map);
        return () => control.remove();
    }, [map]);
    return null;
};

// Custom control for the re‑center button
const RecenterControl = ({ onRecenter }) => {
    const map = useMap();
    useEffect(() => {
        const btn = L.DomUtil.create('button', 'recenter-btn');
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>`;
        btn.className = 'bg-black/60 backdrop-blur-md rounded-full p-2 border border-white/20 hover:bg-black/80 transition cursor-pointer';
        btn.style.width = '36px';
        btn.style.height = '36px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.onclick = () => onRecenter();
        const control = L.control({ position: 'topright' });
        control.onAdd = () => btn;
        control.addTo(map);
        return () => control.remove();
    }, [map, onRecenter]);
    return null;
};

export default function QrScan({ location, token, canTakeAttendance }) {
    const { flash, errors } = usePage().props;
    const [userPosition, setUserPosition] = useState(null);
    const [distance, setDistance] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [withinRange, setWithinRange] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const mapRef = useRef(null);
    const submissionAttempted = useRef(false);

    useEffect(() => {
        if (flash?.success) setSubmitted(true);
    }, [flash]);

    useEffect(() => {
        if (errors?.location) setLocationError(errors.location);
    }, [errors]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    useEffect(() => {
        if (submitted || locationError) return;
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const pos = { lat: latitude, lng: longitude, accuracy };
                setUserPosition(pos);
                const dist = calculateDistance(latitude, longitude, location.latitude, location.longitude);
                setDistance(dist);
                const inside = dist <= location.radius;
                setWithinRange(inside);
                setLocationError(null);
                setIsLocating(false);
                if (inside && canTakeAttendance && !submitted && !submissionAttempted.current) {
                    submitAttendance(latitude, longitude);
                }
            },
            (error) => {
                setLocationError(error.message);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
    }, [location.latitude, location.longitude, location.radius, canTakeAttendance, submitted, locationError]);

    const submitAttendance = (lat, lng) => {
        submissionAttempted.current = true;
        setSubmitting(true);
        router.post(route('attendance.qr.store'), {
            token: token,
            latitude: lat,
            longitude: lng,
            client_timestamp: new Date().toISOString(),
        }, {
            forceFormData: true,
            onSuccess: () => setSubmitting(false),
            onError: (err) => {
                setLocationError(err.location || 'An error occurred');
                setSubmitting(false);
                submissionAttempted.current = false;
            },
        });
    };

    const retryLocation = () => {
        if (submitted) return;
        submissionAttempted.current = false;
        setLocationError(null);
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const pos = { lat: latitude, lng: longitude, accuracy };
                setUserPosition(pos);
                const dist = calculateDistance(latitude, longitude, location.latitude, location.longitude);
                setDistance(dist);
                const inside = dist <= location.radius;
                setWithinRange(inside);
                setLocationError(null);
                setIsLocating(false);
                if (inside && canTakeAttendance && !submitted && !submissionAttempted.current) {
                    submitAttendance(latitude, longitude);
                }
            },
            (error) => {
                setLocationError(error.message);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
        );
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const distancePercent = distance ? Math.min(100, (distance / location.radius) * 100) : 0;
    const isInside = withinRange;

    const handleRecenter = () => {
        if (userPosition) {
            mapRef.current?.setView([userPosition.lat, userPosition.lng], 18);
        }
    };

    return (
        <>
            <Head title="QR Attendance" />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-14 sm:h-16">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="bg-green-600 rounded-lg p-1.5">
                                    <MapPinIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-base sm:text-lg font-semibold tracking-tight">QR Attendance</h1>
                                    <p className="text-xs text-gray-400 hidden sm:block">{location.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Link
                                    href={route('attendance.history')}
                                    className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs sm:text-sm font-medium transition"
                                >
                                    <ClockIcon className="h-4 w-4 mr-1 sm:mr-1.5" />
                                    <span className="hidden xs:inline">History</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs sm:text-sm font-medium text-red-300 transition"
                                >
                                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1 sm:mr-1.5" />
                                    <span className="hidden xs:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 pb-8">
                    {submitted ? (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 sm:p-8 text-center">
                            <CheckCircleIcon className="h-16 w-16 sm:h-20 sm:w-20 text-green-400 mx-auto mb-4" />
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Attendance Recorded!</h2>
                            <p className="text-sm sm:text-base text-green-200 mb-4">
                                Your attendance has been successfully submitted.
                            </p>
                            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-6 text-left">
                                <p className="text-xs text-blue-200">
                                    <span className="font-semibold">📌 Note:</span> Your record may take up to 1 minute to appear in your history. This is because we process attendance in the background to keep the system fast. No need to rescan – your attendance is already saved.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href={route('attendance.history')}
                                    className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-center"
                                >
                                    View Attendance History
                                </Link>
                                <Link
                                    href={route('attendance.create')}
                                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-center"
                                >
                                    Scan Another QR
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <div className="h-48 xs:h-56 sm:h-64 md:h-80 w-full">
                                    <MapContainer
                                        center={[location.latitude, location.longitude]}
                                        zoom={18}
                                        style={{ height: '100%', width: '100%' }}
                                        zoomControl={false}
                                        attributionControl={false}
                                        ref={mapRef}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />
                                        <Circle
                                            center={[location.latitude, location.longitude]}
                                            radius={location.radius}
                                            pathOptions={{ color: '#20a708', fillColor: '#09de45', fillOpacity: 0.2, weight: 2 }}
                                        />
                                        {userPosition && (
                                            <>
                                                <Circle
                                                    center={[userPosition.lat, userPosition.lng]}
                                                    radius={userPosition.accuracy}
                                                    pathOptions={{ color: '#340be9', fillColor: '#1111e9', fillOpacity: 0.1, weight: 1, dashArray: '5' }}
                                                />
                                                <Marker position={[userPosition.lat, userPosition.lng]} icon={createPersonIcon()} />
                                            </>
                                        )}
                                        <MapInfoControl />
                                        <RecenterControl onRecenter={handleRecenter} />
                                    </MapContainer>
                                </div>
                            </div>

                            {/* Status card and other sections unchanged */}
                            <div className={`p-3 sm:p-4 rounded-2xl backdrop-blur-lg border transition-all duration-500 ${isInside && !submitting ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20' : 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/20'}`}>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${isInside ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                        <span className="text-sm sm:text-base font-medium">{isInside ? 'Inside allowed zone' : 'Outside allowed zone'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {userPosition && (
                                            <span className="text-xs bg-white/10 px-2 py-1 rounded inline-flex items-center">
                                                🎯 ±{userPosition.accuracy?.toFixed(0)}m
                                            </span>
                                        )}
                                        <button
                                            onClick={retryLocation}
                                            disabled={isLocating || submitting}
                                            className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded inline-flex items-center transition"
                                            title="Refresh location"
                                        >
                                            <ArrowPathIcon className={`h-3 w-3 mr-1 ${isLocating ? 'animate-spin' : ''}`} />
                                            {isLocating ? 'Locating...' : 'Refresh'}
                                        </button>
                                    </div>
                                </div>
                                {userPosition && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-white/70 mb-1">
                                            <span>Distance to center</span>
                                            <span>{distance?.toFixed(1)}m / {location.radius}m</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-500 ${isInside ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${distancePercent}%` }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {location.start_time_formatted && location.end_time_formatted && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4">
                                    <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-2" />
                                        Attendance Period
                                    </h3>
                                    <div className="space-y-1 text-xs sm:text-sm">
                                        <p><span className="text-gray-400">Start:</span> {location.start_time_formatted}</p>
                                        <p><span className="text-gray-400">End:</span> {location.end_time_formatted}</p>
                                        {location.late_threshold && (
                                            <p><span className="text-gray-400">Late after:</span> {location.late_threshold} minutes</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!canTakeAttendance && (
                                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-2xl p-4 sm:p-6 text-center">
                                    <ClockIcon className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400 mx-auto mb-3" />
                                    <p className="text-base sm:text-lg font-semibold text-yellow-300">Attendance Not Open</p>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                        Allowed period: {location.start_time_formatted} – {location.end_time_formatted}
                                    </p>
                                </div>
                            )}

                            {submitting && (
                                <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4 sm:p-6 text-center">
                                    <div className="flex justify-center mb-3">
                                        <ArrowPathIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400 animate-spin" />
                                    </div>
                                    <p className="text-base sm:text-lg font-semibold text-blue-300">Recording attendance...</p>
                                </div>
                            )}

                            {!isInside && !submitting && canTakeAttendance && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 sm:p-6 text-center">
                                    <XCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3" />
                                    <p className="text-base sm:text-lg font-semibold text-red-300">You are outside the allowed area</p>
                                    <p className="text-xs sm:text-sm text-red-200 mt-2">
                                        Please move inside the geofence to record attendance.
                                    </p>
                                    <button
                                        onClick={retryLocation}
                                        disabled={isLocating}
                                        className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center mx-auto w-full sm:w-auto text-sm"
                                    >
                                        <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                                        {isLocating ? 'Locating...' : 'Retry Location'}
                                    </button>
                                </div>
                            )}

                            {locationError && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 sm:p-4 text-sm flex items-start">
                                    <XCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="break-words">{locationError}</span>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
