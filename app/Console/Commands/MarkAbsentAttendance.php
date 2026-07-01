<?php

// app/Console/Commands/MarkAbsentAttendance.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Location;
use App\Models\AttendanceRecord;
use App\Models\User;
use Carbon\Carbon;

class MarkAbsentAttendance extends Command
{
    protected $signature = 'attendance:mark-absent';
    protected $description = 'Mark absent for users who did not attend active location windows that have ended.';

    public function handle()
    {
        $now = Carbon::now('Asia/Manila');

        // Find location windows that have ended and haven't been processed
        $locations = Location::where('absent_processed', false)
    ->where('end_time', '<=', $now)
    ->get();

        if ($locations->isEmpty()) {
            $this->info('No location windows to process.');
            return 0;
        }

        foreach ($locations as $location) {
            $this->processLocation($location);
            $location->absent_processed = true;
            $location->save();
        }

        $this->info('Absent records created for ' . $locations->count() . ' location window(s).');
        return 0;
    }

    private function processLocation(Location $location)
    {
        // Get all active employees (adjust as needed – e.g., only users with role 'employee')
       $users = User::where('role', 'employee')->get();

        $date = Carbon::parse($location->start_time, 'Asia/Manila')->toDateString();

        foreach ($users as $user) {
            // Check if this user already has an attendance record for this location on this date
            $existing = AttendanceRecord::where('user_id', $user->id)
                ->where('location_id', $location->id)
                ->whereDate('attendance_timestamp', $date)
                ->first();

            if (!$existing) {
                // Create absent record
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
