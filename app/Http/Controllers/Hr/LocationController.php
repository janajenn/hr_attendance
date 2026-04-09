<?php

namespace App\Http\Controllers\Hr;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\LocationActivityLog;
use App\Jobs\ProcessAttendance;
use Carbon\CarbonPeriod;
use League\Csv\Writer;

use App\Models\AttendanceRecord;


class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::orderBy('name')->get();
        return Inertia::render('HR/Locations/Index', [
            'locations' => $locations,
        ]);
    }

    public function create()
    {
        return Inertia::render('HR/Locations/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|integer|min:10',
            'image' => 'nullable|image|max:2048',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'late_threshold' => 'nullable|integer|min:0',
        ]);

        $data = $request->only(['name', 'description', 'latitude', 'longitude', 'radius', 'start_time', 'end_time', 'late_threshold']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('location-images', 'public');
            $data['image'] = $path;
        }

        $data['is_active'] = $request->boolean('is_active');

        $location = Location::create($data);

        // Generate a unique token for QR code
        $token = Str::random(32);
        $location->qr_code_token = $token;
        $location->save();

        if ($data['is_active']) {
    $others = Location::where('is_active', true)->get();
    foreach ($others as $other) {
        $other->update(['is_active' => false]);
    }
}

        return redirect()->route('hr.locations.index')
            ->with('success', 'Location created successfully.');
    }






    public function edit(Location $location)
    {
        return Inertia::render('HR/Locations/Edit', [
            'location' => $location,
        ]);
    }

    public function update(Request $request, Location $location)
{
    $data = [];

    // Validate and add fields only if they exist in the request
    if ($request->has('name')) {
        $request->validate(['name' => 'required|string|max:255']);
        $data['name'] = $request->name;
    }

    if ($request->has('description')) {
        $request->validate(['description' => 'nullable|string']);
        $data['description'] = $request->description;
    }

    if ($request->has('latitude')) {
        $request->validate(['latitude' => 'required|numeric']);
        $data['latitude'] = $request->latitude;
    }

    if ($request->has('longitude')) {
        $request->validate(['longitude' => 'required|numeric']);
        $data['longitude'] = $request->longitude;
    }

    if ($request->has('radius')) {
        $request->validate(['radius' => 'required|integer|min:10']);
        $data['radius'] = $request->radius;
    }

    // Handle start_time – only if provided and not empty
    if ($request->filled('start_time')) {
        $request->validate(['start_time' => 'date']);
        $data['start_time'] = $request->start_time;
    } elseif ($request->has('start_time') && $request->start_time === '') {
        // If empty string is sent, set to null
        $data['start_time'] = null;
    }

    // Handle end_time similarly
    if ($request->filled('end_time')) {
        $request->validate(['end_time' => 'date|after_or_equal:start_time']);
        $data['end_time'] = $request->end_time;
    } elseif ($request->has('end_time') && $request->end_time === '') {
        $data['end_time'] = null;
    }

    // Handle late_threshold
    if ($request->has('late_threshold')) {
        if ($request->late_threshold === '' || $request->late_threshold === null) {
            $data['late_threshold'] = null;
        } else {
            $request->validate(['late_threshold' => 'integer|min:0']);
            $data['late_threshold'] = $request->late_threshold;
        }
    }

    // Handle is_active (checkbox)
    if ($request->has('is_active')) {
        $data['is_active'] = $request->boolean('is_active');
    }

    // Handle image upload
    if ($request->hasFile('image')) {
        $request->validate(['image' => 'image|max:2048']);
        if ($location->image) {
            \Storage::disk('public')->delete($location->image);
        }
        $data['image'] = $request->file('image')->store('location-images', 'public');
    }

    // Perform update only if there are changes
    if (!empty($data)) {
        $location->update($data);

        // If this location was set active, deactivate others
      // If this location was set active, deactivate others one by one
if (isset($data['is_active']) && $data['is_active'] && !$location->wasChanged('is_active')) {
    $others = Location::where('id', '!=', $location->id)->where('is_active', true)->get();
    foreach ($others as $other) {
        $other->update(['is_active' => false]);
    }
}
    }

    return redirect()->route('hr.locations.index')
        ->with('success', 'Location updated successfully.');
}



    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->route('hr.locations.index')
            ->with('success', 'Location deleted.');
    }



   public function activate(Location $location)
{
    // Deactivate all other active locations one by one (to trigger logs)
    $others = Location::where('id', '!=', $location->id)->where('is_active', true)->get();
    foreach ($others as $other) {
        $other->update(['is_active' => false]);
    }

    // Activate this location (log will be triggered by model event)
    $location->update(['is_active' => true]);

    return back()->with('success', "{$location->name} is now active.");
}

public function attendance(Request $request, Location $location)
{
    $date = $request->query('date', Carbon::now('Asia/Manila')->toDateString());
    $startOfDay = Carbon::parse($date, 'Asia/Manila')->startOfDay();
    $endOfDay = Carbon::parse($date, 'Asia/Manila')->endOfDay();

    // Get all logs for this location, ordered by changed_at
    $logs = LocationActivityLog::where('location_id', $location->id)
        ->orderBy('changed_at')
        ->get();

    // Build active intervals
    $intervals = [];
    $activeFrom = null;

    foreach ($logs as $log) {
        $logTime = $log->changed_at; // already in Asia/Manila
        if ($log->is_active && $activeFrom === null) {
            $activeFrom = $logTime;
        } elseif (!$log->is_active && $activeFrom !== null) {
            $intervals[] = ['start' => $activeFrom, 'end' => $logTime];
            $activeFrom = null;
        }
    }
    if ($activeFrom !== null) {
        $intervals[] = ['start' => $activeFrom, 'end' => null];
    }

    // Find interval that overlaps the selected day
    $activation = null;
    $deactivation = null;
    $activeOnDate = false;

    foreach ($intervals as $interval) {
        $intervalStart = $interval['start'];
        $intervalEnd = $interval['end'];

        // If interval ends before the day, skip
        if ($intervalEnd !== null && $intervalEnd < $startOfDay) {
            continue;
        }
        // If interval starts after the day, break (since intervals are ordered)
        if ($intervalStart > $endOfDay) {
            break;
        }
        // Overlap found
        $activeOnDate = true;
        // Activation time: if interval started before the day, use start of day, else use interval start
        $activation = ($intervalStart < $startOfDay) ? $startOfDay : $intervalStart;
        // Deactivation time: if interval ended after the day or is null, use null (still active at end of day), else use interval end
        $deactivation = ($intervalEnd === null || $intervalEnd > $endOfDay) ? null : $intervalEnd;
        break; // only first overlapping interval matters for a single location per day (since only one can be active at a time)
    }

    // Attendance records for this date (now stored in Asia/Manila)
    $records = AttendanceRecord::with(['user.department'])
        ->where('location_id', $location->id)
        ->whereDate('attendance_timestamp', $date)
        ->get();

    $grouped = $records->groupBy(function ($record) {
        return $record->user->department->name ?? 'No Department';
    });

    $employees = User::where('role', 'employee')->orderBy('name')->get(['id', 'name', 'department_id']);

    // Get IDs of employees who already attended
    $attendedIds = $records->pluck('user_id')->toArray();

    return Inertia::render('HR/Locations/Attendance', [
        'location' => $location,
        'grouped' => $grouped,
        'date' => $date,
        'employees' => $employees,
        'attendedIds' => $attendedIds,
        'activation' => $activation,
        'deactivation' => $deactivation,
        'active_on_date' => $activeOnDate,
    ]);
}

public function manualAttendance(Request $request, Location $location)
{
    $request->validate([
        'employee_id' => 'required|exists:users,id',
        'status' => 'required|in:present,late',
        'attendance_timestamp' => 'nullable|date',
    ]);

    $timestamp = $request->attendance_timestamp
        ? Carbon::parse($request->attendance_timestamp, 'Asia/Manila')
        : Carbon::now('Asia/Manila');

    $dateToCheck = $timestamp->toDateString();

    // Duplicate check
    $existing = AttendanceRecord::where('user_id', $request->employee_id)
        ->where('location_id', $location->id)
        ->whereDate('attendance_timestamp', $dateToCheck)
        ->exists();

    if ($existing) {
        return back()->withErrors(['employee' => 'This employee already has attendance for this date.']);
    }

    // Direct insert (synchronous)
    AttendanceRecord::create([
        'user_id' => $request->employee_id,
        'location_id' => $location->id,
        'attendance_timestamp' => $timestamp,
        'photo_path' => null,
        'latitude' => $location->latitude,
        'longitude' => $location->longitude,
        'status' => $request->status,
    ]);

    return redirect()->back()->with('success', 'Manual attendance added.');
}


public function exportAttendance(Request $request, Location $location)
{
    $date = $request->query('date', Carbon::now('Asia/Manila')->toDateString());

    $records = AttendanceRecord::with(['user.department'])
        ->where('location_id', $location->id)
        ->whereDate('attendance_timestamp', $date)
        ->get();

    $csv = Writer::createFromString('');

    // Add header rows
    $csv->insertOne(['Attendance Report']);
    $csv->insertOne(['Location:', $location->name]);
    $csv->insertOne(['Date:', $date]);
    $csv->insertOne([]); // blank line

    // Data headers
    $csv->insertOne(['Employee ID', 'Name', 'Department', 'Timestamp (Manila)', 'Status']);

    foreach ($records as $record) {
        $csv->insertOne([
            $record->user->employee_id,
            $record->user->name,
            $record->user->department->name ?? 'N/A',
            $record->attendance_timestamp->timezone('Asia/Manila')->format('Y-m-d H:i:s'),
            $record->status,
        ]);
    }

    $filename = "attendance_{$location->name}_{$date}.csv";
    return response((string) $csv)
        ->header('Content-Type', 'text/csv')
        ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
}


public function percentages()
{
    $locations = Location::orderBy('name')->get(['id', 'name', 'percentage']);
    return Inertia::render('HR/Locations/Percentages', [
        'locations' => $locations,
    ]);
}

/**
 * Update percentages for all locations.
 */
public function updatePercentages(Request $request)
{
    $data = $request->validate([
        'locations' => 'required|array',
        'locations.*.id' => 'required|exists:locations,id',
        'locations.*.percentage' => 'required|integer|min:0|max:100',
    ]);

    $total = collect($data['locations'])->sum('percentage');
    if ($total !== 100) {
        return back()->withErrors(['total' => 'Total percentage must equal 100%. Currently ' . $total . '%.']);
    }

    foreach ($data['locations'] as $item) {
        Location::where('id', $item['id'])->update(['percentage' => $item['percentage']]);
    }

    return redirect()->route('hr.locations.percentages')
        ->with('success', 'Location percentages updated successfully.');
}


public function absentees(Request $request, Location $location)
{
    $date = $request->query('date', Carbon::now('Asia/Manila')->toDateString());

    // Get all employees (only role = 'employee')
    $allEmployees = User::where('role', 'employee')
        ->with('department')
        ->orderBy('name')
        ->get(['id', 'name', 'department_id']);

    // Get IDs of employees who have attendance at this location on the given date
    $presentIds = AttendanceRecord::where('location_id', $location->id)
        ->whereDate('attendance_timestamp', $date)
        ->pluck('user_id')
        ->toArray();

    // Absent employees = all employees not in presentIds
    $absentEmployees = $allEmployees->reject(function ($employee) use ($presentIds) {
        return in_array($employee->id, $presentIds);
    })->values(); // reset keys

    return response()->json([
        'date' => $date,
        'location' => $location->name,
        'absent' => $absentEmployees,
    ]);
}


public function activityReport()
{
    $logs = LocationActivityLog::with('location')->orderBy('location_id')->orderBy('changed_at')->get();
    \Log::info('Logs count: ' . $logs->count());

    if ($logs->isEmpty()) {
        return Inertia::render('HR/Locations/ActivityReport', ['report' => []]);
    }

    $firstLog = $logs->first()->changed_at->timezone('Asia/Manila')->startOfDay();
    $start = $firstLog->copy()->startOfMonth();
    $end = Carbon::now('Asia/Manila')->endOfDay();

    \Log::info("Start: $start, End: $end");

    $intervals = [];
    foreach ($logs->groupBy('location_id') as $locId => $locLogs) {
        $locationName = $locLogs->first()->location->name;
        $activeFrom = null;
        foreach ($locLogs as $log) {
            $logDateManila = $log->changed_at->timezone('Asia/Manila');
            if ($log->is_active && $activeFrom === null) {
                $activeFrom = $logDateManila;
            } elseif (!$log->is_active && $activeFrom !== null) {
                $intervals[] = [
                    'location_id' => $locId,
                    'location_name' => $locationName,
                    'start' => $activeFrom,
                    'end' => $logDateManila,
                ];
                $activeFrom = null;
            }
        }
        if ($activeFrom !== null) {
            $intervals[] = [
                'location_id' => $locId,
                'location_name' => $locationName,
                'start' => $activeFrom,
                'end' => $end,
            ];
        }
    }

    \Log::info('Intervals count: ' . count($intervals));
    \Log::info('Intervals: ' . json_encode($intervals));

    $period = CarbonPeriod::create($start, $end);
    $report = [];
    foreach ($period as $date) {
        $dayStart = $date->copy()->startOfDay();
        $dayEnd = $date->copy()->endOfDay();
        $activeLocations = [];
        foreach ($intervals as $interval) {
            $intervalStart = $interval['start'];
            $intervalEnd = $interval['end'];
            // Check if the interval overlaps the day
            if ($intervalStart <= $dayEnd && ($intervalEnd === null || $intervalEnd >= $dayStart)) {
                $activeLocations[] = $interval['location_name'];
            }
        }
        $report[] = [
            'date' => $date->toDateString(),
            'count' => count($activeLocations),
            'locations' => $activeLocations,
        ];
    }

    \Log::info('Report sample: ' . json_encode(array_slice($report, 0, 5)));

    return Inertia::render('HR/Locations/ActivityReport', [
        'report' => $report,
    ]);
}

public function deactivate(Location $location)
{
    $location->update(['is_active' => false]);

    return back()->with('success', "{$location->name} is now inactive.");
}

}
