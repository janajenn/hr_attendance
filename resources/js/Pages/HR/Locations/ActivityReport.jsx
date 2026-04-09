import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { ArrowLeftIcon, XMarkIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import {
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  getYear,
  getMonth,
} from 'date-fns';

export default function ActivityReport({ report }) {
    const [hoveredDay, setHoveredDay] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        // Default to current month (YYYY-MM)
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });

    // Build lookup for quick access
    const activityByDate = report.reduce((acc, day) => {
        acc[day.date] = { count: day.count, locations: day.locations };
        return acc;
    }, {});

    // Determine available months from report data
    const availableMonths = useMemo(() => {
        const monthsSet = new Set();
        report.forEach(day => {
            const [year, month] = day.date.split('-');
            monthsSet.add(`${year}-${month}`);
        });
        return Array.from(monthsSet).sort();
    }, [report]);

    // Filter dates for the selected month
    const filteredDates = useMemo(() => {
        return report.filter(day => day.date.startsWith(selectedMonth));
    }, [report, selectedMonth]);

    // Compute start and end dates from filtered data
    const dates = filteredDates.map(d => new Date(d.date));
    const start = dates.length ? new Date(Math.min(...dates)) : new Date();
    const end = dates.length ? new Date(Math.max(...dates)) : new Date();

    // Today (Manila) for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate all months between start and end (only one month if filtered)
    const months = eachMonthOfInterval({ start, end });

    const getWeeksForMonth = (monthDate) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        return eachWeekOfInterval(
            { start: monthStart, end: monthEnd },
            { weekStartsOn: 0 }
        ).map((weekStart) => {
            const days = [];
            for (let i = 0; i < 7; i++) {
                days.push(addDays(weekStart, i));
            }
            return days;
        });
    };

    const getBgColor = (count) => {
        if (count === 0) return 'bg-gray-800';
        if (count <= 2) return 'bg-green-900';
        if (count <= 4) return 'bg-green-700';
        if (count <= 6) return 'bg-green-600';
        return 'bg-green-500';
    };

    const handleDayClick = (dateStr) => {
        const dayDate = new Date(dateStr);
        dayDate.setHours(0, 0, 0, 0);
        if (dayDate > today) return;
        const activity = activityByDate[dateStr];
        setSelectedDay({
            date: dateStr,
            locations: activity?.locations || [],
        });
    };

    const closeModal = () => setSelectedDay(null);

    // Compute summary for the selected month
    const totalActiveDays = filteredDates.length;
    const totalActivities = filteredDates.reduce((sum, d) => sum + d.count, 0);
    const avgActivitiesPerDay = totalActiveDays ? (totalActivities / totalActiveDays).toFixed(1) : 0;

    return (
        <HRLayout>
            <Head title="Location Activity Report" />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Location Activity Calendar</h1>
                    <Link
                        href={route('hr.locations.index')}
                        className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Locations
                    </Link>
                </div>

                {/* Info Card */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-200">
                        <p className="font-semibold text-blue-300">About this report</p>
                        <p>
                            This calendar shows the days when each location was active based on activation/deactivation logs.
                            Each cell indicates how many locations were active on that day. Click on a day to see the list of active locations.
                            Future dates are shown as semi‑transparent – they have no recorded activity yet.
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-green-400" />
                            <span className="text-gray-300">Select month</span>
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
                        >
                            {availableMonths.map(ym => (
                                <option key={ym} value={ym}>
                                    {new Date(ym + '-01').toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    {totalActiveDays > 0 && (
                        <div className="mt-3 text-sm text-gray-400 border-t border-gray-700 pt-3">
                            <span className="font-semibold text-green-400">{totalActiveDays} active days</span> in this month,
                            with a total of <span className="font-semibold text-green-400">{totalActivities} active location‑days</span>
                            (avg. <span className="font-semibold text-green-400">{avgActivitiesPerDay}</span> per day).
                        </div>
                    )}
                </div>

                {/* Calendar */}
                <div className="space-y-8">
                    {months.map((month) => {
                        const monthStr = format(month, 'MMMM yyyy');
                        const weeks = getWeeksForMonth(month);

                        return (
                            <div key={monthStr} className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">{monthStr}</h2>
                                <div className="grid grid-cols-7 gap-1">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                        <div key={d} className="text-center text-sm font-medium text-gray-400 py-2">
                                            {d}
                                        </div>
                                    ))}

                                    {weeks.flat().map((day, idx) => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const activity = activityByDate[dateStr] || { count: 0, locations: [] };
                                        const dayDate = new Date(day);
                                        dayDate.setHours(0, 0, 0, 0);
                                        const isFuture = dayDate > today;
                                        const bgColor = getBgColor(activity.count);
                                        const isHovered = hoveredDay === dateStr;

                                        return (
                                            <div
                                                key={idx}
                                                className={`relative p-3 rounded-lg ${bgColor} ${isFuture ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} text-white text-center transition-all hover:ring-2 hover:ring-green-400`}
                                                onMouseEnter={() => setHoveredDay(dateStr)}
                                                onMouseLeave={() => setHoveredDay(null)}
                                                onClick={() => handleDayClick(dateStr)}
                                            >
                                                <span className="text-sm">{format(day, 'd')}</span>
                                                {!isFuture && activity.count > 0 && (
                                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-green-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                        {activity.count}
                                                    </span>
                                                )}

                                                {/* Tooltip */}
                                                {isHovered && (
                                                    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                                                        {isFuture ? (
                                                            'Future date – no activity recorded yet'
                                                        ) : activity.count > 0 ? (
                                                            <>
                                                                <div className="font-semibold mb-1">Active locations:</div>
                                                                <ul className="list-disc list-inside">
                                                                    {activity.locations.slice(0, 5).map((loc, i) => (
                                                                        <li key={i}>{loc}</li>
                                                                    ))}
                                                                    {activity.locations.length > 5 && (
                                                                        <li className="text-gray-400">+ {activity.locations.length - 5} more</li>
                                                                    )}
                                                                </ul>
                                                            </>
                                                        ) : (
                                                            'No locations active on this day'
                                                        )}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modern Modal for Selected Day */}
            {selectedDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-200">
                    <div className="relative bg-gray-800 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
                        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {format(new Date(selectedDay.date), 'EEEE, MMMM d, yyyy')}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {selectedDay.locations.length === 0 ? (
                                <p className="text-gray-400 text-center py-6">No locations were active on this day.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {selectedDay.locations.map((loc, index) => (
                                        <li key={index} className="bg-gray-700/50 rounded-lg px-4 py-2 text-white flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                            {loc}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="bg-gray-900/50 px-6 py-3 border-t border-white/10 text-xs text-gray-400 flex justify-end">
                            Total: {selectedDay.locations.length} active {selectedDay.locations.length === 1 ? 'location' : 'locations'}
                        </div>
                    </div>
                </div>
            )}
        </HRLayout>
    );
}
