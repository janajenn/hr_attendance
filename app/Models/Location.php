<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; // 👈 add this


class Location extends Model
{
    protected $fillable = [
        'name',
        'description',
        'latitude',
        'longitude',
        'radius',
        'image',
        'start_time',
        'end_time',
        'late_threshold',
         'percentage',
        'is_active',
        'qr_code_token',

    ];

    protected $appends = ['start_time_formatted', 'end_time_formatted'];

public function getStartTimeFormattedAttribute()
{
    if (!$this->start_time) return null;
    return \Carbon\Carbon::parse($this->start_time, 'Asia/Manila')->format('M j, Y g:i A');
}

public function getEndTimeFormattedAttribute()
{
    if (!$this->end_time) return null;
    return \Carbon\Carbon::parse($this->end_time, 'Asia/Manila')->format('M j, Y g:i A');
}

protected static function booted()
{
    static::created(function ($location) {
        \App\Models\LocationActivityLog::create([
            'location_id' => $location->id,
            'is_active' => $location->is_active,
            'changed_by' => auth()->id(),
        ]);
    });

    static::updated(function ($location) {
        if ($location->isDirty('is_active')) {
            \App\Models\LocationActivityLog::create([
                'location_id' => $location->id,
                'is_active' => $location->is_active,
                'changed_by' => auth()->id(),
            ]);
        }
    });
}
}
