<?php

return [
    'location' => [
        'lat'    => env('ATTENDANCE_LAT', 8.5211),   // Replace with your actual latitude
        'lng'    => env('ATTENDANCE_LNG', 124.5714), // Replace with your actual longitude
        'radius' => env('ATTENDANCE_RADIUS', 100),   // in meters
    ],
];
