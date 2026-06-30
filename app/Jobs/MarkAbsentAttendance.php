<?php

// app/Jobs/MarkAbsentAttendance.php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Location;
use App\Models\AttendanceRecord;
use App\Models\User;
use Carbon\Carbon;

class MarkAbsentAttendance implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $now = Carbon::now('Asia/Manila');

        // Find location windows that have ended and haven't been processed
        $locations = Location::where('is_active', true)
            ->where('absent_processed', false)
            ->where('end_time', '<=', $now)
            ->get();

        if ($locations->isEmpty()) {
            return;
        }

        foreach ($locations as $location) {
            $this->processLocation($location);
            $location->absent_processed = true;
            $location->save();
        }
    }

    private function processLocation(Location $location): void
    {
        // Get all active employees (adjust scope as needed)
       $users = User::where('role', 'employee')->get();

        $date = Carbon::parse($location->start_time, 'Asia/Manila')->toDateString();

        foreach ($users as $user) {
            // Check if already has a record for this location/date
            $existing = AttendanceRecord::where('user_id', $user->id)
                ->where('location_id', $location->id)
                ->whereDate('attendance_timestamp', $date)
                ->first();

            if (!$existing) {
                AttendanceRecord::create([
                    'user_id'               => $user->id,
                    'location_id'           => $location->id,
                    'attendance_timestamp'  => Carbon::now('Asia/Manila'),
                    'photo_path'            => null,
                    'latitude'              => null,
                    'longitude'             => null,
                    'status'                => 'absent',
                ]);
            }
        }
    }
}
