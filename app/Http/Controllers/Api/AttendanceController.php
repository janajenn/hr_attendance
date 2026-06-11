<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Location;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function storeFromQr(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'token' => 'required|string|exists:locations,qr_code_token',
            'client_timestamp' => 'nullable|date',
        ]);

        $location = Location::where('qr_code_token', $request->token)->first();

        // Check if location is active
        if (!$location->is_active) {
            return response()->json(['message' => 'This attendance location is not active.'], 403);
        }

        // Duplicate check (prevent multiple submissions for the same location/date)
        $today = Carbon::now('Asia/Manila')->toDateString();
        $exists = AttendanceRecord::where('user_id', auth()->id())
            ->where('location_id', $location->id)
            ->whereDate('attendance_timestamp', $today)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You have already recorded attendance for this location today.'], 409);
        }

        // Distance check (reuse your distance method)
        $distance = $this->distance(
            $request->latitude,
            $request->longitude,
            $location->latitude,
            $location->longitude
        );

        if ($distance > $location->radius) {
            return response()->json(['message' => 'You are outside the allowed area.'], 403);
        }

        $now = Carbon::now('Asia/Manila');
        $status = 'present';

        // Time window & late threshold logic (copy from your existing storeFromQr)
        if ($location->start_time && $location->end_time) {
            $start = Carbon::parse($location->start_time, 'Asia/Manila');
            $end = Carbon::parse($location->end_time, 'Asia/Manila');
            if ($now->lt($start)) {
                return response()->json(['message' => 'Attendance has not started yet.'], 403);
            }
            if ($now->gt($end)) {
                return response()->json(['message' => 'Attendance period has ended.'], 403);
            }
            if ($location->late_threshold && $now->gt($start->copy()->addMinutes($location->late_threshold))) {
                $status = 'late';
            }
        }

        $record = AttendanceRecord::create([
            'user_id' => auth()->id(),
            'location_id' => $location->id,
            'attendance_timestamp' => $now,
            'photo_path' => null, // optional – you can handle photo later if needed
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'status' => $status,
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully.',
            'record' => $record,
        ], 201);
    }

    public function history(Request $request)
    {
        $records = AttendanceRecord::with('location')
            ->where('user_id', auth()->id())
            ->orderBy('attendance_timestamp', 'desc')
            ->get();

        return response()->json($records);
    }

    private function distance($lat1, $lon1, $lat2, $lon2)
    {
        // your distance calculation (copy from existing controller)
        $earthRadius = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }
}
