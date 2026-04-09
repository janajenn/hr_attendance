import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Percentages({ locations }) {
    const { flash } = usePage().props;
    const [percentages, setPercentages] = useState(
        locations.map(loc => ({ id: loc.id, percentage: loc.percentage }))
    );
    const [saving, setSaving] = useState(false);

    const handlePercentageChange = (id, value) => {
        setPercentages(prev =>
            prev.map(item =>
                item.id === id ? { ...item, percentage: parseInt(value) || 0 } : item
            )
        );
    };

    const total = percentages.reduce((sum, item) => sum + item.percentage, 0);
    const isValid = total === 100;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid) return;

        setSaving(true);
        router.post(route('hr.locations.percentages.update'), { locations: percentages }, {
            preserveScroll: true,
            onSuccess: () => setSaving(false),
            onError: () => setSaving(false),
        });
    };

    return (
        <HRLayout>
            <Head title="Location Percentages" />
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">Location Percentages</h1>
                    </div>
                    <Link
                        href={route('hr.locations.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Locations
                    </Link>
                </div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="mb-4 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6 text-blue-200">
                    <p className="text-sm">
                        Assign a percentage weight to each location. The total must equal 100%.
                        These percentages can be used in reports to weigh attendance by location importance.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-800 rounded-2xl border border-green-900/30 overflow-hidden">
                        <div className="divide-y divide-gray-700">
                            {locations.map((loc, index) => {
                                const currentPercentage = percentages.find(p => p.id === loc.id)?.percentage || 0;
                                return (
                                    <div key={loc.id} className="flex items-center justify-between p-4 hover:bg-gray-700/50">
                                        <label className="text-white font-medium">{loc.name}</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={currentPercentage}
                                                onChange={(e) => handlePercentageChange(loc.id, e.target.value)}
                                                min="0"
                                                max="100"
                                                className="w-20 px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="text-gray-400">%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total and submit */}
                    <div className="flex items-center justify-between bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300 font-medium">Total:</span>
                            <span className={`text-2xl font-bold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                                {total}%
                            </span>
                            {!isValid && (
                                <span className="text-sm text-red-400">(must be 100%)</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={saving || !isValid}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Percentages'
                            )}
                        </button>
                    </div>

                    {/* Server-side error */}
                    {usePage().props.errors?.total && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded">
                            {usePage().props.errors.total}
                        </div>
                    )}
                </form>
            </div>
        </HRLayout>
    );
}
