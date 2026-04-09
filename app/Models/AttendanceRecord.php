<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Location;

class AttendanceRecord extends Model
{
    protected $fillable = [
        'user_id',
         'location_id',
        'attendance_timestamp',
        'photo_path',
        'latitude',
        'longitude',
        'status',
    ];

    protected $casts = [
    'attendance_timestamp' => 'datetime',


];

protected $appends = ['formatted_time'];

public function getFormattedTimeAttribute()
{
    return $this->attendance_timestamp->timezone('Asia/Manila')->format('l, F j, Y g:i A');
}

    /**
     * Get the user that owns the attendance record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

  public function location()
{
    return $this->belongsTo(Location::class);
}


}
