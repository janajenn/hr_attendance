import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { MapPinIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import LocationMapPicker from '@/Components/LocationMapPicker';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        latitude: 8.521279,
        longitude: 124.574188,
        radius: 100,
        image: null,
        start_time: '',
        end_time: '',
        late_threshold: 0,
        is_active: false,
    });

    const handlePositionChange = (lat, lng) => {
        setData('latitude', lat);
        setData('longitude', lng);
    };

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('hr.locations.store'), {
            forceFormData: true,
        });
    };

    return (
        <HRLayout>
            <Head title="Add Location" />
            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-600 rounded-xl p-2">
                        <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Add New Location</h1>
                </div>

                <div className="bg-gray-800 rounded-2xl border border-green-900/30 p-5">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                        {/* Two-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Location Name <span className="text-green-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g., Main Hall"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                            </div>

                            {/* Description (short textarea) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                                    placeholder="Optional – brief description"
                                />
                            </div>

                            {/* Map – spans both columns */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Location on Map <span className="text-green-400">*</span>
                                </label>
                                <div className="rounded-lg overflow-hidden border border-gray-700">
                                    <LocationMapPicker
                                        lat={data.latitude}
                                        lng={data.longitude}
                                        radius={data.radius}
                                        onPositionChange={handlePositionChange}
                                    />
                                </div>
                                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                    <span>Lat: {data.latitude.toFixed(6)}</span>
                                    <span>Lng: {data.longitude.toFixed(6)}</span>
                                </div>
                                {errors.latitude && <p className="mt-1 text-sm text-red-400">{errors.latitude}</p>}
                                {errors.longitude && <p className="mt-1 text-sm text-red-400">{errors.longitude}</p>}
                            </div>

                            {/* GPS Info Card */}
                            <div className="md:col-span-2 bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 flex items-start gap-2">
                                <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-200 leading-relaxed">
                                    <span className="font-semibold text-blue-300">GPS accuracy note:</span> Because GPS signals can be inconsistent, we recommend setting the radius slightly larger than the physical area. Attendance is primarily verified by scanning the QR code; the geofence acts as an additional security layer. A radius of <span className="text-white font-mono">40-70 m</span> is usually sufficient for most locations.
                                </p>
                            </div>

                            {/* Radius Slider */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Radius (meters) <span className="text-green-400">*</span>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={data.radius}
                                    onChange={e => setData('radius', parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>10 m</span>
                                    <span className="text-white font-medium">{data.radius} m</span>
                                    <span>500 m</span>
                                </div>
                                <input
                                    type="number"
                                    value={data.radius}
                                    onChange={e => setData('radius', parseInt(e.target.value))}
                                    min="10"
                                    max="500"
                                    className="w-full mt-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                                />
                                {errors.radius && <p className="mt-1 text-sm text-red-400">{errors.radius}</p>}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Location Image (optional)
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 transition text-sm">
                                        Choose File
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {data.image && <span className="text-sm text-gray-300 truncate">{data.image.name}</span>}
                                </div>
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                {errors.start_time && <p className="mt-1 text-sm text-red-400">{errors.start_time}</p>}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                {errors.end_time && <p className="mt-1 text-sm text-red-400">{errors.end_time}</p>}
                            </div>

{/* Late Threshold */}
<div>
    <div className="flex items-center gap-1 mb-1">
        <label className="block text-sm font-medium text-gray-300">
            Late Threshold (minutes)
        </label>
        <div className="relative group">
            <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-green-400 cursor-help transition" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-xs text-gray-200 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-gray-700">
                <span className="font-semibold text-green-400">Example:</span> If start time is 8:00 AM and this is 15,
                <br />employees checking in at 8:16 AM will be marked <span className="text-yellow-400">"late"</span>.
                <br />Set to <span className="text-white">0</span> to always mark as <span className="text-green-400">"present"</span> (if within time window).
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    </div>
    <input
        type="number"
        value={data.late_threshold}
        onChange={e => setData('late_threshold', parseInt(e.target.value) || 0)}
        min="0"
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
    />
    <p className="text-xs text-gray-400 mt-1">
        After start time + this many minutes → status becomes <span className="text-yellow-400">"late"</span>
    </p>
    {errors.late_threshold && <p className="mt-1 text-sm text-red-400">{errors.late_threshold}</p>}
</div>

                            {/* Activate Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-green-600 focus:ring-green-500"
                                />
                                <label className="ml-2 text-sm text-gray-300">Activate this location immediately</label>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
                            >
                                {processing ? 'Creating...' : 'Create Location'}
                            </button>
                            <Link
                                href={route('hr.locations.index')}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </HRLayout>
    );
}
