<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\MarkAbsentAttendance;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');




Schedule::command('locations:deactivate-expired')->everyMinute();
Schedule::job(new MarkAbsentAttendance)->everyFiveMinutes();

