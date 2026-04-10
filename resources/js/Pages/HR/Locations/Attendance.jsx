import React, { useState, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import Swal from 'sweetalert2';
import {
    CalendarIcon,
    UserGroupIcon,
    ArrowLeftIcon,
    MapPinIcon,
    ClockIcon,
    PlusIcon,
    DocumentArrowDownIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

export default function Attendance({
    location,
    grouped,
    date,
    employees,
    attendedIds = [],
    activation,
    deactivation,
    active_on_date,
    hasDuplicates = false,
    duplicatesSummary = [],
}) {
    const { flash } = usePage().props;
    const [selectedDate, setSelectedDate] = useState(date);
    const [showManualModal, setShowManualModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [showAbsentModal, setShowAbsentModal] = useState(false);
    const [absentData, setAbsentData] = useState(null);
    const [loadingAbsent, setLoadingAbsent] = useState(false);
    const [absentSearch, setAbsentSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
    const [duplicatesData, setDuplicatesData] = useState(null);
    const [loadingDuplicates, setLoadingDuplicates] = useState(false);
    const [selectedKeepIds, setSelectedKeepIds] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        status: 'present',
        attendance_timestamp: '',
    });

    // Auto-notify about duplicates on page load
    useEffect(() => {
        if (hasDuplicates && duplicatesSummary.length > 0) {
            let message = '';
            if (duplicatesSummary.length === 1) {
                message = `⚠️ Duplicate attendance found for ${duplicatesSummary[0].user_name} (${duplicatesSummary[0].count} records).`;
            } else {
                message = `⚠️ Duplicate attendance found for ${duplicatesSummary.length} employees.`;
            }
            Swal.fire({
                title: 'Duplicate Records Detected',
                html: `${message}<br/><br/>Please use the "Check Duplicates" button to resolve.`,
                icon: 'warning',
                confirmButtonText: 'OK',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#3085d6',
            });
        }
    }, [hasDuplicates, duplicatesSummary]);

    const availableEmployees = employees.filter(emp => !attendedIds.includes(emp.id));
    const filteredEmployees = availableEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get(route('hr.locations.attendance', location.id), { date: newDate }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const goToToday = () => {
        setSelectedDate('');
        router.get(route('hr.locations.attendance', location.id), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        window.location.href = route('hr.locations.attendance.export', { location: location.id, date: selectedDate });
    };

    const openManualModal = () => {
        setShowManualModal(true);
        reset();
        setSearchTerm('');
        setSelectedEmployeeId(null);
        setShowAll(false);
    };

    const closeManualModal = () => {
        setShowManualModal(false);
    };

    const submitManual = (e) => {
        e.preventDefault();
        closeManualModal();
        const submitData = {
            employee_id: data.employee_id,
            status: data.status,
            attendance_timestamp: data.attendance_timestamp || null,
        };
        post(route('hr.locations.attendance.manual', location.id), submitData, {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (err) => {
                openManualModal();
                console.error('Manual attendance error:', err);
            },
        });
    };

    const fetchAbsentees = async () => {
        setLoadingAbsent(true);
        try {
            const response = await fetch(`/hr/locations/${location.id}/absent?date=${selectedDate}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setAbsentData(data);
            setShowAbsentModal(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAbsent(false);
        }
    };

    const fetchDuplicates = async () => {
        setLoadingDuplicates(true);
        try {
            const response = await fetch(`/hr/locations/${location.id}/attendance/duplicates?date=${selectedDate}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setDuplicatesData(data);
            if (data.has_duplicates) {
                const initialKeep = {};
                data.duplicates.forEach(dup => {
                    if (dup.records.length > 0) {
                        initialKeep[dup.user_id] = dup.records[0].id;
                    }
                });
                setSelectedKeepIds(initialKeep);
                setShowDuplicatesModal(true);
            } else {
                Swal.fire({
                    title: 'No Duplicates',
                    text: 'No duplicate attendance records found for this date.',
                    icon: 'info',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to check duplicates.',
                icon: 'error',
                background: '#1f2937',
                color: '#fff',
            });
        } finally {
            setLoadingDuplicates(false);
        }
    };

    const resolveDuplicates = () => {
    const keepIdsMap = selectedKeepIds; // object: { user_id: record_id, ... }
    if (Object.keys(keepIdsMap).length === 0) return;

    const totalDuplicates = duplicatesData.duplicates.reduce((sum, d) => sum + d.records.length - 1, 0);
    Swal.fire({
        title: 'Remove Duplicates?',
        text: `This will keep ${Object.keys(keepIdsMap).length} record(s) and delete ${totalDuplicates} duplicate(s).`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove duplicates',
        background: '#1f2937',
        color: '#fff',
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('hr.locations.attendance.duplicates.resolve', location.id), {
                data: { keep_ids_map: keepIdsMap, date: selectedDate },
                preserveScroll: true,
                onSuccess: () => {
                    router.get(route('hr.locations.attendance', location.id), { date: selectedDate }, {
                        preserveState: true,
                        preserveScroll: true,
                    });
                    setShowDuplicatesModal(false);
                    Swal.fire({
                        title: 'Done!',
                        text: 'Duplicate records have been removed.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        background: '#1f2937',
                        color: '#fff',
                    });
                },
                onError: (err) => {
                    console.error(err);
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to remove duplicates.',
                        icon: 'error',
                        background: '#1f2937',
                        color: '#fff',
                    });
                },
            });
        }
    });
};



    return (
        <HRLayout>
            <Head title={`${location.name} Attendance`} />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 rounded-lg p-1.5">
                            <MapPinIcon className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">{location.name}</h1>
                    </div>
                    <Link href={route('hr.locations.index')} className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
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

                {/* Date filter bar */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-blue-400 mr-2" />
                            <span className="text-lg text-gray-300 mr-2">Attendance for</span>
                            <input type="date" value={selectedDate} onChange={handleDateChange} className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={goToToday} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">Today</button>
                            <button onClick={handleExport} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition flex items-center gap-1"><DocumentArrowDownIcon className="h-4 w-4" /> Export CSV</button>
                            <button onClick={openManualModal} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition flex items-center gap-1"><PlusIcon className="h-4 w-4" /> Manual Add</button>
                            <button onClick={fetchAbsentees} disabled={loadingAbsent} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition flex items-center gap-1"><UserIcon className="h-4 w-4" /> {loadingAbsent ? 'Loading...' : 'View Absentees'}</button>
                            <button onClick={fetchDuplicates} disabled={loadingDuplicates} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm transition flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                {loadingDuplicates ? 'Checking...' : 'Check Duplicates'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2"><ClockIcon className="h-5 w-5 text-green-400" /><h3 className="text-sm font-semibold text-gray-300">Activity Log for {new Date(date).toLocaleDateString('en-PH')}</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {active_on_date ? (
                            <>
                                <div><span className="text-gray-400">Activated:</span> <span className="ml-2 text-white">{activation ? new Date(activation).toLocaleString('en-PH', { hour: '2-digit', minute: '2-digit' }) : 'start of day'}</span></div>
                                <div><span className="text-gray-400">Deactivated:</span> <span className="ml-2 text-white">{deactivation ? new Date(deactivation).toLocaleString('en-PH', { hour: '2-digit', minute: '2-digit' }) : 'still active'}</span></div>
                            </>
                        ) : (
                            <div className="col-span-2"><span className="text-gray-400">Location was not active on this date.</span></div>
                        )}
                    </div>
                </div>

                {/* Attendance list */}
                {Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-16 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                        <UserGroupIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No attendance records for this date.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([department, records]) => (
                            <div key={department} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                                <div className="bg-blue-600/20 px-6 py-3 border-b border-white/10">
                                    <h2 className="text-xl font-semibold text-blue-300 flex items-center"><UserGroupIcon className="h-5 w-5 mr-2" />{department}<span className="ml-2 text-sm bg-blue-600/30 px-2 py-0.5 rounded-full">{records.length}</span></h2>
                                </div>
                                <div className="divide-y divide-white/10">
                                    {records.map((record) => (
                                        <div key={record.id} className="px-6 py-3 flex items-center justify-between hover:bg-white/5">
                                            <div><p className="text-white font-medium">{record.user.name}</p><p className="text-sm text-gray-400">{record.user.email}</p></div>
                                            <div className="flex items-center text-sm">
                                                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-gray-300">{new Date(record.attendance_timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${record.status === 'present' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{record.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for manual attendance (same as before) */}
            {showManualModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
                    <div className="relative bg-gray-800 rounded-xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <button onClick={closeManualModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><XMarkIcon className="h-6 w-6" /></button>
                        <h3 className="text-xl font-bold text-white mb-4">Add Manual Attendance</h3>
                        <p className="text-sm text-gray-400 mb-4">Add attendance for {location.name} on {new Date(selectedDate).toLocaleDateString('en-PH')}</p>
                        <form onSubmit={submitManual} className="space-y-4">
                            {/* Employee search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Employee <span className="text-red-400">*</span></label>
                                <div className="relative mb-2">
                                    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowAll(false); if (selectedEmployeeId) { setSelectedEmployeeId(null); setData('employee_id', ''); } }} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white pl-10 focus:ring-2 focus:ring-purple-500" />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                                <div className="bg-gray-700 rounded-lg border border-gray-600 max-h-60 overflow-y-auto">
                                    {filteredEmployees.length === 0 ? <p className="text-gray-400 text-sm p-3">No employees found.</p> : (
                                        <>
                                            {(showAll ? filteredEmployees : filteredEmployees.slice(0, 5)).map(emp => (
                                                <button key={emp.id} type="button" onClick={() => { setData('employee_id', emp.id); setSelectedEmployeeId(emp.id); setSearchTerm(emp.name); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition ${selectedEmployeeId === emp.id ? 'bg-purple-600/30 text-purple-300' : 'text-white'}`}>{emp.name}</button>
                                            ))}
                                            {filteredEmployees.length > 5 && !showAll && <button type="button" onClick={() => setShowAll(true)} className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-600 transition border-t border-gray-600">+ See all ({filteredEmployees.length - 5} more)</button>}
                                            {showAll && filteredEmployees.length > 5 && <button type="button" onClick={() => setShowAll(false)} className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-600 transition border-t border-gray-600">Show less</button>}
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Type to search. Click on a name to select.</p>
                                {errors.employee_id && <p className="mt-1 text-sm text-red-400">{errors.employee_id}</p>}
                            </div>
                            {/* Status radio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center"><input type="radio" value="present" checked={data.status === 'present'} onChange={e => setData('status', e.target.value)} className="mr-2" /><span className="text-green-400">Present</span></label>
                                    <label className="flex items-center"><input type="radio" value="late" checked={data.status === 'late'} onChange={e => setData('status', e.target.value)} className="mr-2" /><span className="text-yellow-400">Late</span></label>
                                </div>
                            </div>
                            {/* Optional timestamp */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Time (optional, defaults to now)</label>
                                <input type="datetime-local" value={data.attendance_timestamp} onChange={e => setData('attendance_timestamp', e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500" />
                                <p className="text-xs text-gray-400 mt-1">Leave blank to use current date/time. You can set any date and time.</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={processing || !data.employee_id} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50">{processing ? 'Adding...' : 'Add Attendance'}</button>
                                <button type="button" onClick={closeManualModal} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for absentees */}
            {showAbsentModal && absentData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
                    <div className="relative bg-gray-800 rounded-xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowAbsentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><XMarkIcon className="h-6 w-6" /></button>
                        <h3 className="text-xl font-bold text-white mb-2">Absent Employees</h3>
                        <p className="text-sm text-gray-400 mb-4">{absentData.location} – {new Date(absentData.date).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })}</p>
                        <div className="mb-4"><input type="text" placeholder="Search by name..." value={absentSearch} onChange={(e) => { setAbsentSearch(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500" /></div>
                        {(() => {
                            const filtered = absentData.absent.filter(emp => emp.name.toLowerCase().includes(absentSearch.toLowerCase()));
                            const totalFiltered = filtered.length;
                            const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                            return (
                                <>
                                    <p className="text-sm text-gray-400 mb-2">Total absent: {absentData.absent.length}{absentSearch && ` (filtered: ${totalFiltered})`}</p>
                                    {totalFiltered === 0 ? <p className="text-gray-400 py-8 text-center">No absent employees match your search.</p> : (
                                        <>
                                            <div className="space-y-2 mb-4">{paginated.map(emp => <div key={emp.id} className="bg-gray-700/50 rounded-lg p-3"><p className="text-white font-medium">{emp.name}</p><p className="text-xs text-gray-400">{emp.department?.name || 'No Department'}</p></div>)}</div>
                                            <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition disabled:opacity-50">Previous</button>
                                                <span className="text-sm text-gray-400">Page {currentPage} of {Math.max(1, Math.ceil(totalFiltered / itemsPerPage))}</span>
                                                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(totalFiltered / itemsPerPage)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition disabled:opacity-50">Next</button>
                                            </div>
                                        </>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Modal for duplicates */}
            {showDuplicatesModal && duplicatesData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
                    <div className="relative bg-gray-800 rounded-xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowDuplicatesModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><XMarkIcon className="h-6 w-6" /></button>
                        <h3 className="text-xl font-bold text-white mb-2">Duplicate Attendance Records</h3>
                        <p className="text-sm text-gray-400 mb-4">{duplicatesData.date} – {location.name}</p>
                        <p className="text-xs text-yellow-400 mb-4">⚠️ Multiple records found for the same employee. Select which record to keep for each employee.</p>
                        <div className="space-y-6">
                            {duplicatesData.duplicates.map((dup) => (
                                <div key={dup.user_id} className="bg-gray-700/50 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-2">{dup.user_name}</h4>
                                    <div className="space-y-2">
                                        {dup.records.map((rec) => (
                                            <label key={rec.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
                                                <input type="radio" name={`keep_${dup.user_id}`} value={rec.id} checked={selectedKeepIds[dup.user_id] === rec.id} onChange={() => setSelectedKeepIds(prev => ({ ...prev, [dup.user_id]: rec.id }))} className="text-purple-600 focus:ring-purple-500" />
                                                <div className="flex-1"><p className="text-white text-sm">Time: {rec.timestamp}</p><p className="text-gray-400 text-xs">Status: {rec.status}</p></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={resolveDuplicates} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">Remove Duplicates</button>
                            <button onClick={() => setShowDuplicatesModal(false)} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </HRLayout>
    );
}
