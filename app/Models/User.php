<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
 protected $fillable = [
    'employee_id',
    'name',
    'username',
    'email',
    'password',
    'department_id',   // changed from 'department'
    'position',
    'photo',
    'role',
    'birthdate', // added birthdate
];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


     const ROLE_EMPLOYEE = 'employee';
    const ROLE_HR = 'hr';

    // Helper methods
    public function isEmployee()
    {
        return $this->role === self::ROLE_EMPLOYEE;
    }

    public function isHr()
    {
        return $this->role === self::ROLE_HR;
    }

    // Add relationship for attendance records (if not already present)
public function attendanceRecords()
{
    return $this->hasMany(AttendanceRecord::class);
}


// Relationship
public function department()
{
    return $this->belongsTo(Department::class);
}

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
