<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'is_active',
        'changed_at',
        'changed_by',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
