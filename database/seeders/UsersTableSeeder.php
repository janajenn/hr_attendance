<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'employee_id' => 'HR-001',
            'name' => 'HR Manager',
            'username' => 'hrmanager',
            'email' => 'hr@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'hr',
        ]);

        User::create([
            'employee_id' => 'EMP-001',
            'name' => 'John Employee',
            'username' => 'john',
            'email' => 'john@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);
    }
}
