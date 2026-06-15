<?php

namespace App\Jobs;

use App\Models\AttendanceRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class ProcessAttendance implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function handle(): void
{
    AttendanceRecord::create($this->data);

    // Clear the processing flag
    $userId = $this->data['user_id'];
    $locationId = $this->data['location_id'];
    $date = Carbon::parse($this->data['attendance_timestamp'])->toDateString();
    $cacheKey = "attendance_processing_{$userId}_{$locationId}_{$date}";
    Cache::forget($cacheKey);
}
}
