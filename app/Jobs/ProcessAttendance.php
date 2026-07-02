<?php

namespace App\Jobs;

use App\Models\AttendanceRecord;
use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\UniqueConstraintViolationException;

class ProcessAttendance implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [1, 5, 10];

    protected $userId;
    protected $locationId;
    protected $latitude;
    protected $longitude;

    public function __construct($userId, $locationId, $latitude, $longitude)
    {
        $this->userId = $userId;
        $this->locationId = $locationId;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
    }

    public function handle(): void
    {
        $location = Location::find($this->locationId);
        if (!$location || !$location->is_active) {
            Log::warning('Location inactive', ['location_id' => $this->locationId]);
            return;
        }

        // Geofence
        $distance = $this->distance($this->latitude, $this->longitude, $location->latitude, $location->longitude);
        if ($distance > $location->radius) {
            Log::warning('Outside geofence', ['user' => $this->userId]);
            return;
        }

        // Time window & status
        $now = Carbon::now('Asia/Manila');
        $status = 'present';

        if ($location->start_time && $location->end_time) {
            $start = Carbon::parse($location->start_time, 'Asia/Manila');
            $end = Carbon::parse($location->end_time, 'Asia/Manila');

            if ($now->lt($start) || $now->gt($end)) {
                Log::warning('Outside time window', ['user' => $this->userId]);
                return;
            }

            if ($location->late_threshold && $now->gt($start->copy()->addMinutes($location->late_threshold))) {
                $status = 'late';
            }
        }

        // Insert (unique constraint handles duplicates)
        try {
            AttendanceRecord::create([
                'user_id' => $this->userId,
                'location_id' => $this->locationId,
                'attendance_timestamp' => $now,
                'photo_path' => null,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'status' => $status,
            ]);
        } catch (UniqueConstraintViolationException $e) {
            // Duplicate – ignore
            Log::info('Duplicate attendance skipped', [
                'user' => $this->userId,
                'location' => $this->locationId,
            ]);
        }
    }

    private function distance($lat1, $lon1, $lat2, $lon2)
    {
        // Haversine formula (same as before)
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
