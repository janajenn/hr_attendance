<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [

            ['name' => 'Human Resources', 'code' => 'HR'],

            ['name' => 'Administration', 'code' => 'ADMIN'],
            ['name' => 'Engineering', 'code' => 'MEO'],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }
}
