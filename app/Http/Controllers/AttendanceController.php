<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\AttendanceRecord;
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
            'client_timestamp' => 'nullable|date',
            'token' => 'required|string|exists:locations,qr_code_token',
        ]);

        $location = Location::where('qr_code_token', $request->token)->first();

        if (!$location->is_active) {
            return back()->withErrors(['location' => 'This attendance location is not active.']);
        }

        // Duplicate check (use Manila date)
        $todayManila = Carbon::now('Asia/Manila')->toDateString();
        $existing = AttendanceRecord::where('user_id', auth()->id())
            ->where('location_id', $location->id)
            ->whereDate('attendance_timestamp', $todayManila)
            ->exists();

        if ($existing) {
            return back()->withErrors(['location' => 'You have already recorded attendance for this location today.']);
        }

        $distance = $this->distance(
            $request->latitude,
            $request->longitude,
            $location->latitude,
            $location->longitude
        );

        if ($distance > $location->radius) {
            return back()->withErrors(['location' => 'You are outside the allowed area.']);
        }

        $nowManila = Carbon::now('Asia/Manila');
        $status = 'present';

        if ($location->start_time && $location->end_time) {
            $start = Carbon::parse($location->start_time, 'Asia/Manila');
            $end = Carbon::parse($location->end_time, 'Asia/Manila');
            if ($nowManila->lt($start)) {
                return back()->withErrors(['location' => 'Attendance has not started yet.']);
            }
            if ($nowManila->gt($end)) {
                return back()->withErrors(['location' => 'Attendance period has ended.']);
            }
            if ($location->late_threshold && $nowManila->gt($start->copy()->addMinutes($location->late_threshold))) {
                $status = 'late';
            }
        }

        $now = Carbon::now(); // stored in Asia/Manila

        $data = [
            'user_id' => auth()->id(),
            'location_id' => $location->id,
            'attendance_timestamp' => $now,
            'photo_path' => null,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => $status,
        ];

        ProcessAttendance::dispatch($data);

        return redirect()->back()->with('success', 'Attendance recorded successfully.');
    }


    private function distance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // meters
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }

public function history(Request $request)
{
    $query = AttendanceRecord::with('location')
        ->where('user_id', auth()->id())
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
    ]);
}





public function scan($token)
{
    $location = Location::where('qr_code_token', $token)->firstOrFail();

    // Check if the location is active
    if (!$location->is_active) {
        return redirect()->route('attendance.create')
            ->withErrors(['location' => 'This attendance location is not currently active.']);
    }

    // Determine if attendance can be taken based on time window
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
    ]);
}
}
