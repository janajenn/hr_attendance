import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { MapPinIcon } from '@heroicons/react/24/outline';
import LocationMapPicker from '@/Components/LocationMapPicker';
import { router } from '@inertiajs/react'; // add

export default function Edit({ location }) {
    // Format datetime for input[type="datetime-local"]
    const formatDateTime = (datetime) => {
        if (!datetime) return '';
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { data, setData,  processing, errors } = useForm({
        name: location.name || '',
        description: location.description || '',
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        radius: location.radius || 100,
        image: null, // new image file (if changed)
        start_time: formatDateTime(location.start_time),
        end_time: formatDateTime(location.end_time),
        late_threshold: location.late_threshold || '',
        is_active: Boolean(location.is_active),
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [hasExistingImage] = useState(!!location.image);

    const handlePositionChange = (lat, lng) => {
        setData('latitude', lat);
        setData('longitude', lng);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

   const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route('hr.locations.update', location.id), {
        ...data,
        _method: 'PUT'
    }, {
        forceFormData: true,
    });

    };

    return (
        <HRLayout>
            <Head title="Edit Location" />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <MapPinIcon className="h-8 w-8 text-green-400" />
                    <h1 className="text-3xl font-bold text-white">Edit Location</h1>
                </div>

                <div className="bg-gray-800 rounded-2xl border border-green-900/30 p-6">
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Location Name <span className="text-green-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., Main Hall, Point A"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                                placeholder="Optional description"
                            />
                        </div>

                        {/* Map with draggable marker and radius circle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Select Location on Map <span className="text-green-400">*</span>
                            </label>
                            <LocationMapPicker
                                lat={data.latitude}
                                lng={data.longitude}
                                radius={data.radius}
                                onPositionChange={handlePositionChange}
                            />
                            <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                <span>Lat: {data.latitude.toFixed(6)}</span>
                                <span>Lng: {data.longitude.toFixed(6)}</span>
                            </div>
                            {errors.latitude && <p className="mt-1 text-sm text-red-400">{errors.latitude}</p>}
                            {errors.longitude && <p className="mt-1 text-sm text-red-400">{errors.longitude}</p>}
                        </div>

                        {/* Radius input with slider */}
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
                                name="radius"
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
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400 mb-1">New preview:</p>
                                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded border border-green-900/30" />
                                </div>
                            )}
                            {!imagePreview && hasExistingImage && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400 mb-1">Current image:</p>
                                    <img src={`/storage/${location.image}`} alt={location.name} className="h-20 w-20 object-cover rounded border border-green-900/30" />
                                </div>
                            )}
                            {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                        </div>

                        {/* Start & End Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Start Time (optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                {errors.start_time && <p className="mt-1 text-sm text-red-400">{errors.start_time}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    End Time (optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                {errors.end_time && <p className="mt-1 text-sm text-red-400">{errors.end_time}</p>}
                            </div>
                        </div>

                        {/* Late Threshold */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Late Threshold (minutes after start time, optional)
                            </label>
                            <input
                                type="number"
                                name="late_threshold"
                                value={data.late_threshold}
                                onChange={e => setData('late_threshold', parseInt(e.target.value) || '')}
                                min="0"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                If employee checks in after start time + this many minutes, they will be marked "late".
                            </p>
                            {errors.late_threshold && <p className="mt-1 text-sm text-red-400">{errors.late_threshold}</p>}
                        </div>

                        {/* Activate checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-green-600 focus:ring-green-500"
                            />
                            <label className="ml-2 text-sm text-gray-300">Activate this location</label>
                        </div>

{/* QR Code Display */}
{location.qr_code_token && (
    <div className="mt-4 border-t border-green-900/30 pt-4">
        <p className="text-sm text-gray-400 mb-2">Current QR Code (employees scan this):</p>
        <img
            src={`/hr/qr/${location.qr_code_token}`}
            alt={`QR Code for ${location.name}`}
            className="w-32 h-32 border-2 border-green-500/30 rounded-lg shadow-lg"
        />
    </div>
)}

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                            >
                                {processing ? 'Updating...' : 'Update Location'}
                            </button>
                            <Link
                                href={route('hr.locations.index')}
                                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
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
