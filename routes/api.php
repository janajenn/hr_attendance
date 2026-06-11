<?php


use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/attendance/qr', [AttendanceController::class, 'storeFromQr']);
    Route::get('/attendance/history', [AttendanceController::class, 'history']);
});
