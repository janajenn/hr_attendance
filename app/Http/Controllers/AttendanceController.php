<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Jobs\ProcessAttendance;
use App\Models\Location;
use Carbon\Carbon;

class AttendanceController extends Controller
{
public function create()
{
    $activeLocation = Location::where('is_active', true)->first();
    $canTakeAttendance = false;

    if ($activeLocation) {
        $now = Carbon::now('Asia/Manila');
        $start = $activeLocation->start_time ? Carbon::parse($activeLocation->start_time, 'Asia/Manila') : null;
        $end = $activeLocation->end_time ? Carbon::parse($activeLocation->end_time, 'Asia/Manila') : null;

        if (!$start && !$end) {
            // No time window → always allowed if active
            $canTakeAttendance = true;
        } else {
            if ($start && $now->lt($start)) {
                $canTakeAttendance = false;
            } elseif ($end && $now->gt($end)) {
                $canTakeAttendance = false;
            } else {
                $canTakeAttendance = true;
            }
        }
    }

    return Inertia::render('Attendance/Create', [
        'activeLocation' => $activeLocation,
        'canTakeAttendance' => $canTakeAttendance,
    ]);
}


    public function store(Request $request)
    {
        $activeLocation = Location::where('is_active', true)->first();
        if (!$activeLocation) {
            return back()->withErrors(['location' => 'No active attendance location.']);
        }

        $request->validate([
            'photo' => 'required|image|max:5120',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'client_timestamp' => 'nullable|date',
        ]);

        $distance = $this->distance(
            $request->latitude,
            $request->longitude,
            $activeLocation->latitude,
            $activeLocation->longitude
        );

        if ($distance > $activeLocation->radius) {
            return back()->withErrors(['location' => 'You are outside the allowed area.']);
        }

        $nowManila = Carbon::now('Asia/Manila');
        $status = 'present';

        if ($activeLocation->start_time && $activeLocation->end_time) {
            $start = Carbon::parse($activeLocation->start_time, 'Asia/Manila');
            $end = Carbon::parse($activeLocation->end_time, 'Asia/Manila');

            if ($nowManila->lt($start)) {
                return back()->withErrors(['location' => 'Attendance has not started yet.']);
            }
            if ($nowManila->gt($end)) {
                return back()->withErrors(['location' => 'Attendance period has ended.']);
            }
            if ($activeLocation->late_threshold && $nowManila->gt($start->copy()->addMinutes($activeLocation->late_threshold))) {
                $status = 'late';
            }
        }

        $path = $request->file('photo')->store('attendance', 'public');
        $now = Carbon::now(); // stored in Asia/Manila (app timezone)

        // Prepare data for queue job
        $data = [
            'user_id' => auth()->id(),
            'attendance_timestamp' => $now,
            'photo_path' => $path,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => $status,
        ];

        // Dispatch job (asynchronous insert)
        ProcessAttendance::dispatch($data);

        return redirect()->route('attendance.create')->with('success', 'Attendance recorded.');
    }

    public function storeFromQr(Request $request)
{
    $request->validate([
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'token' => 'required|string|exists:locations,qr_code_token',
    ]);

    $location = Location::where('qr_code_token', $request->token)->first();

    // Dispatch job (no duplicate check, no geofence – all done in job)
    ProcessAttendance::dispatch(
        auth()->id(),
        $location->id,
        $request->latitude,
        $request->longitude
    );

    return redirect()->back()->with('success', 'Attendance is being processed.');
}



public function history(Request $request)
{
    $user = auth()->user()->load('department');
    $query = AttendanceRecord::with('location')
        ->where('user_id', $user->id)
        ->orderBy('attendance_timestamp', 'desc');

    if ($request->filled('location_id')) {
        $query->where('location_id', $request->location_id);
    }

    $records = $query->paginate(10);

    $locations = Location::orderBy('name')->get(['id', 'name']);

    return Inertia::render('Attendance/History', [
        'records' => $records,
        'locations' => $locations,
        'filters' => $request->only(['location_id']),
        'userDepartment' => $user->department->name ?? null, // new
    ]);
}







public function scan($token)
{
    $location = Location::where('qr_code_token', $token)->firstOrFail();
    $user = auth()->user();
    $todayManila = Carbon::now('Asia/Manila')->toDateString();

    // Check if location is active
    if (!$location->is_active) {
        return Inertia::render('Attendance/QrScan', [
            'location' => $location,
            'token' => $token,
            'canTakeAttendance' => false,
            'locationError' => 'This attendance location is not active.',
        ]);
    }

    // Check if user already attended this location today
    $alreadyAttended = AttendanceRecord::where('user_id', $user->id)
        ->where('location_id', $location->id)
        ->whereDate('attendance_timestamp', $todayManila)
        ->exists();

    if ($alreadyAttended) {
        return Inertia::render('Attendance/QrScan', [
            'location' => $location,
            'token' => $token,
            'canTakeAttendance' => false,
            'locationError' => 'You have already recorded attendance for this location today.',
        ]);
    }

    // Check time window
    $now = Carbon::now('Asia/Manila');
    $start = $location->start_time ? Carbon::parse($location->start_time, 'Asia/Manila') : null;
    $end = $location->end_time ? Carbon::parse($location->end_time, 'Asia/Manila') : null;
    $canTakeAttendance = false;

    if (!$start && !$end) {
        $canTakeAttendance = true;
    } else {
        if ($start && $now->lt($start)) {
            $canTakeAttendance = false;
        } elseif ($end && $now->gt($end)) {
            $canTakeAttendance = false;
        } else {
            $canTakeAttendance = true;
        }
    }

    return Inertia::render('Attendance/QrScan', [
        'location' => $location,
        'token' => $token,
        'canTakeAttendance' => $canTakeAttendance,
        'locationError' => null,
    ]);
}


public function checkStatus(Request $request)
{

\Log::info('checkStatus called', $request->all());
    $request->validate([
        'token' => 'required|string|exists:locations,qr_code_token',
    ]);

    $location = Location::where('qr_code_token', $request->token)->first();
    $userId = auth()->id();
    $todayManila = Carbon::now('Asia/Manila')->toDateString();

    $exists = AttendanceRecord::where('user_id', $userId)
        ->where('location_id', $location->id)
        ->whereDate('attendance_timestamp', $todayManila)
        ->exists();

    return response()->json(['recorded' => $exists]);
}


public function dashboard()
{
    $user = auth()->user();
    $now = Carbon::now('Asia/Manila');

    // ---- Overall stats (raw DB) ----
    $overall = DB::table('attendance_records')
        ->where('user_id', $user->id)
        ->selectRaw("
            COUNT(*) as total,
            SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) as attended,
            SUM(CASE WHEN status NOT IN ('present', 'late') THEN 1 ELSE 0 END) as missed
        ")
        ->first();

    // ---- Weekly stats ----
    $weekStart = $now->copy()->startOfWeek();
    $weekStats = DB::table('attendance_records')
        ->where('user_id', $user->id)
        ->whereBetween('attendance_timestamp', [$weekStart, $now])
        ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status IN ('present','late') THEN 1 ELSE 0 END) as attended")
        ->first();

    // ---- Monthly stats ----
    $monthStart = $now->copy()->startOfMonth();
    $monthStats = DB::table('attendance_records')
        ->where('user_id', $user->id)
        ->whereBetween('attendance_timestamp', [$monthStart, $now])
        ->selectRaw("COUNT(*) as total, SUM(CASE WHEN status IN ('present','late') THEN 1 ELSE 0 END) as attended")
        ->first();

    // ---- Recent 5 records (use Eloquent – fine because timestamp is selected) ----
    $recent = AttendanceRecord::with('location')
        ->where('user_id', $user->id)
        ->latest('attendance_timestamp')
        ->limit(5)
        ->get();

    // ---- Location breakdown ----
    $locationStats = DB::table('attendance_records')
        ->join('locations', 'attendance_records.location_id', '=', 'locations.id')
        ->where('attendance_records.user_id', $user->id)
        ->selectRaw('locations.id as location_id, locations.name as location_name, COUNT(*) as count')
        ->groupBy('locations.id', 'locations.name')
        ->get();

    // ---- 7‑day chart data ----
    $chartData = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = $now->copy()->subDays($i);
        $dayStart = $date->copy()->startOfDay();
        $dayEnd = $date->copy()->endOfDay();

        $records = DB::table('attendance_records')
            ->where('user_id', $user->id)
            ->whereBetween('attendance_timestamp', [$dayStart, $dayEnd])
            ->get();

        $present = $records->filter(fn($r) => $r->status === 'present')->count();
        $late    = $records->filter(fn($r) => $r->status === 'late')->count();
        $absent  = $records->filter(fn($r) => !in_array($r->status, ['present','late']))->count();

        $chartData[] = [
            'date'    => $date->format('D, M j'),
            'present' => $present,
            'late'    => $late,
            'absent'  => $absent,
        ];
    }

    // ---- Average check‑in time ----
    $avgTime = DB::table('attendance_records')
        ->where('user_id', $user->id)
        ->whereIn('status', ['present', 'late'])
        ->selectRaw("TIME_FORMAT(AVG(TIME(attendance_timestamp)), '%H:%i') as avg_time")
        ->first();

    // ---- Active location (for quick action) ----
    $activeLocation = Location::where('is_active', true)->first();

    return Inertia::render('Attendance/Dashboard', [
        'overall'        => $overall,
        'weekStats'      => $weekStats,
        'monthStats'     => $monthStats,
        'recent'         => $recent,
        'locationStats'  => $locationStats,
        'chartData'      => $chartData,
        'avgTime'        => $avgTime->avg_time ?? null,
        'activeLocation' => $activeLocation,
    ]);
}


}
