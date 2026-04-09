import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import Swal from 'sweetalert2';
import {
    MapPinIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    PrinterIcon,
    XMarkIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

export default function Index({ locations }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Filter by search term
    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        (loc.description && loc.description.toLowerCase().includes(search.toLowerCase()))
    );

    // Sort: active locations first, then alphabetically by name
    const sortedLocations = [...filteredLocations].sort((a, b) => {
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;
        return a.name.localeCompare(b.name);
    });

    const handleActivate = (location) => {
        router.post(route('hr.locations.activate', location.id));
    };

    const handleDeactivate = (location) => {
        router.post(route('hr.locations.deactivate', location.id));
    };

    const openModal = (location) => {
        setSelectedLocation(location);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedLocation(null);
    };

    const handleDelete = (locationId, locationName) => {
        Swal.fire({
            title: 'Delete Location?',
            text: `Are you sure you want to delete "${locationName}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1f2937',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('hr.locations.destroy', locationId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Location has been deleted.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            background: '#1f2937',
                            color: '#fff',
                        });
                    },
                });
            }
        });
    };

    const printQR = (token, locationName) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>QR Code - ${locationName}</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: white;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }
                    .container {
                        text-align: center;
                        padding: 30px;
                        max-width: 600px;
                    }
                    h2 {
                        color: #333;
                        font-size: 28px;
                        margin-bottom: 30px;
                        font-weight: 500;
                    }
                    img {
                        width: 450px;
                        height: 450px;
                        border: 2px solid #e0e0e0;
                        border-radius: 12px;
                        background: white;
                        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                    }
                    @media print {
                        body { background: white; }
                        img { box-shadow: none; border: 1px solid #ccc; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>${locationName} – Attendance QR Code</h2>
                    <img src="/hr/qr/${token}" alt="QR Code for ${locationName}">
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    return (
        <HRLayout>
            <Head title="Manage Locations" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white">Attendance Locations</h1>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-green-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <Link
                            href={route('hr.locations.create')}
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
                        >
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            Add Location
                        </Link>
                    </div>
                </div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="mb-6 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-lg flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Locations grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedLocations.map((loc) => (
                        <div
                            key={loc.id}
                            className="relative group bg-gray-800 rounded-xl border border-green-900/30 overflow-hidden hover:shadow-xl hover:shadow-green-900/20 transition-all duration-300"
                        >
                            {/* Background image with overlay */}
                            {loc.image ? (
                                <>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
                                        style={{ backgroundImage: `url(/storage/${loc.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                            )}

                            {/* Content */}
                            <div className="relative p-5 flex flex-col h-full z-10">
                                {/* Header: name + actions */}
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <MapPinIcon className="h-5 w-5 text-green-400" />
                                        {loc.name}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('hr.locations.edit', loc.id)}
                                            className="text-green-400 hover:text-green-300 transition"
                                            title="Edit"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={route('hr.locations.attendance', loc.id)}
                                            className="text-blue-400 hover:text-blue-300 transition"
                                            title="View Attendance"
                                        >
                                            <UsersIcon className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(loc.id, loc.name)}
                                            className="text-red-400 hover:text-red-300 transition"
                                            title="Delete"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                {loc.description && (
                                    <p className="text-sm text-gray-300 mb-4">{loc.description}</p>
                                )}

                                {/* Coordinates and radius */}
                                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/10">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-400 block text-xs">Latitude</span>
                                            <span className="text-white font-mono">{Number(loc.latitude).toFixed(6)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-xs">Longitude</span>
                                            <span className="text-white font-mono">{Number(loc.longitude).toFixed(6)}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-400 block text-xs">Radius</span>
                                            <span className="text-white font-mono">{loc.radius} meters</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Time info */}
                                <div className="space-y-2 mb-4">
                                    {loc.start_time_formatted && (
                                        <div className="flex items-center text-sm text-gray-200">
                                            <CalendarIcon className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-400 mr-2">Start:</span>
                                            <span>{loc.start_time_formatted}</span>
                                        </div>
                                    )}
                                    {loc.end_time_formatted && (
                                        <div className="flex items-center text-sm text-gray-200">
                                            <CalendarIcon className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-400 mr-2">End:</span>
                                            <span>{loc.end_time_formatted}</span>
                                        </div>
                                    )}
                                    {loc.late_threshold && (
                                        <div className="flex items-center text-sm text-gray-200">
                                            <ClockIcon className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                                            <span className="text-gray-400 mr-2">Late after:</span>
                                            <span>{loc.late_threshold} minutes</span>
                                        </div>
                                    )}
                                </div>

                                {/* QR Code - smaller and clickable */}
                                {loc.qr_code_token && (
                                    <div className="mt-4 border-t border-green-900/30 pt-4 flex items-center justify-between">
                                        <p className="text-sm text-gray-400">QR Code</p>
                                        <img
                                            src={`/hr/qr/${loc.qr_code_token}`}
                                            alt={`QR Code for ${loc.name}`}
                                            className="w-16 h-16 border-2 border-green-500/30 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() => openModal(loc)}
                                        />
                                    </div>
                                )}

                                {/* Active status */}
                                <div className="mt-auto flex items-center justify-between">
                                    {loc.is_active ? (
                                        <button
                                            onClick={() => handleDeactivate(loc)}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                                        >
                                            <XCircleIcon className="h-4 w-4 mr-2" />
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleActivate(loc)}
                                            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
                                        >
                                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {sortedLocations.length === 0 && (
                    <div className="text-center py-12">
                        <XCircleIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No locations match your search.</p>
                    </div>
                )}
            </div>

            {/* Modal for larger QR view */}
            {modalOpen && selectedLocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
                    <div className="relative bg-gray-800 rounded-xl border border-green-900/30 p-6 max-w-md w-full">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-4">{selectedLocation.name} QR Code</h3>

                        <div className="flex justify-center mb-6">
                            <img
                                src={`/hr/qr/${selectedLocation.qr_code_token}`}
                                alt={`QR Code for ${selectedLocation.name}`}
                                className="w-64 h-64 border-4 border-green-500/30 rounded-lg shadow-xl"
                            />
                        </div>

                        <button
                            onClick={() => printQR(selectedLocation.qr_code_token, selectedLocation.name)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                        >
                            <PrinterIcon className="h-5 w-5" />
                            Print QR Code
                        </button>
                    </div>
                </div>
            )}
        </HRLayout>
    );
}
