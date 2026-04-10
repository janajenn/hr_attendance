<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\HrDashboardController;
use App\Http\Controllers\Hr\EmployeeController;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Renderer\Image\GdImageBackEnd;
use BaconQrCode\Writer;// only needed for QR route


use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;


use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware(['auth'])->group(function () {
    // Employee routes
    Route::middleware(['auth', 'employee'])->group(function () {
        Route::get('/attendance', [AttendanceController::class, 'create'])->name('attendance.create');
        Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
        Route::get('/attendance/history', [AttendanceController::class, 'history'])->name('attendance.history');

        Route::get('/scan/{token}', [AttendanceController::class, 'scan'])->name('attendance.scan');
        Route::post('/attendance/qr', [AttendanceController::class, 'storeFromQr'])->name('attendance.qr.store');
    });

    // HR routes
    Route::middleware(['auth', 'hr'])->prefix('hr')->name('hr.')->group(function () {
        Route::get('/dashboard', [HrDashboardController::class, 'index'])->name('dashboard');
        Route::resource('employees', \App\Http\Controllers\Hr\EmployeeController::class)
            ->parameters(['employees' => 'user'])
            ->except(['show']);
        Route::post('/employees/{user}/reset-password', [\App\Http\Controllers\Hr\EmployeeController::class, 'resetPassword'])
            ->name('employees.reset-password');

            Route::get('/locations/{location}/attendance', [\App\Http\Controllers\Hr\LocationController::class, 'attendance'])->name('locations.attendance');

Route::get('/qr/{token}', function ($token) {
    try {
        $location = \App\Models\Location::where('qr_code_token', $token)->firstOrFail();

        $qrCode = QrCode::create(route('attendance.scan', $token));
        $writer = new PngWriter();
        $result = $writer->write($qrCode);

        return response($result->getString())->header('Content-Type', 'image/png');
    } catch (\Exception $e) {
        \Log::error('QR Code error: ' . $e->getMessage());
        return response('QR generation failed: ' . $e->getMessage(), 500);
    }
})->name('qr.show');


Route::post('/locations/{location}/attendance/manual', [\App\Http\Controllers\Hr\LocationController::class, 'manualAttendance'])->name('locations.attendance.manual');
Route::get('/locations/{location}/attendance/export', [\App\Http\Controllers\Hr\LocationController::class, 'exportAttendance'])->name('locations.attendance.export');


Route::get('/dashboard/export', [\App\Http\Controllers\HrDashboardController::class, 'export'])->name('dashboard.export');


        // Department routes
        Route::resource('departments', \App\Http\Controllers\Hr\DepartmentController::class)
            ->except(['show']);

            Route::get('/departments/{department}/employees', [\App\Http\Controllers\Hr\DepartmentController::class, 'employees'])->name('departments.employees');

        // Location routes
        Route::resource('locations', \App\Http\Controllers\Hr\LocationController::class)
            ->except(['show']);
        Route::post('/locations/{location}/activate', [\App\Http\Controllers\Hr\LocationController::class, 'activate'])
            ->name('locations.activate');

            Route::get('/locations/percentages', [\App\Http\Controllers\Hr\LocationController::class, 'percentages'])->name('locations.percentages');
Route::post('/locations/percentages', [\App\Http\Controllers\Hr\LocationController::class, 'updatePercentages'])->name('locations.percentages.update');

 Route::get('/locations/{location}/absent', [\App\Http\Controllers\Hr\LocationController::class, 'absentees'])->name('locations.absent');

Route::get('/locations/activity-report', [\App\Http\Controllers\Hr\LocationController::class, 'activityReport'])->name('locations.activity');

Route::post('/locations/{location}/deactivate', [\App\Http\Controllers\Hr\LocationController::class, 'deactivate'])->name('locations.deactivate');


Route::get('/employees/{user}/memo', [\App\Http\Controllers\Hr\EmployeeController::class, 'memo'])->name('employees.memo');

Route::get('/locations/{location}/attendance/duplicates', [\App\Http\Controllers\Hr\LocationController::class, 'checkDuplicates'])->name('locations.attendance.duplicates');
Route::delete('/locations/{location}/attendance/duplicates', [\App\Http\Controllers\Hr\LocationController::class, 'resolveDuplicates'])->name('locations.attendance.duplicates.resolve');



Route::resource('hr-users', \App\Http\Controllers\Hr\HrUserController::class)
    ->only(['index', 'create', 'store', 'destroy']);

    });


});


Route::get('/test-gd', function () {
    if (!extension_loaded('gd')) {
        return 'GD not loaded';
    }
    $im = imagecreatetruecolor(100, 100);
    $green = imagecolorallocate($im, 0, 255, 0);
    imagefill($im, 0, 0, $green);
    ob_start();
    imagepng($im);
    $png = ob_get_clean();
    imagedestroy($im);
    return response($png)->header('Content-Type', 'image/png');
});

require __DIR__ . '/auth.php';
