<?php

namespace App\Jobs;

use App\Models\AttendanceRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\UniqueConstraintViolationException;

class ProcessAttendance implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [1, 5, 10];

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function handle(): void
    {
        try {
            AttendanceRecord::create($this->data);
        } catch (UniqueConstraintViolationException $e) {
            // Duplicate entry – already exists, ignore silently
            Log::info('Duplicate attendance skipped', $this->data);
        } catch (\Exception $e) {
            Log::error('Attendance job failed: ' . $e->getMessage(), $this->data);
            throw $e;
        }
    }
}
