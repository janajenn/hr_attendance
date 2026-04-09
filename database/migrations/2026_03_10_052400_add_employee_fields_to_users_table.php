<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Add columns (nullable for now)
            $table->string('employee_id')->nullable()->after('id');
            $table->string('department')->nullable()->after('name');
            $table->string('position')->nullable()->after('department');
            $table->string('username')->nullable()->after('name');
            $table->string('photo')->nullable()->after('password');
            // Ensure role has a default
            $table->string('role')->default('employee')->change();
        });

        // Populate existing users with unique employee_id and username
        DB::table('users')->orderBy('id')->each(function ($user) {
            // Generate employee_id based on user id
            $employeeId = 'EMP-' . str_pad($user->id, 3, '0', STR_PAD_LEFT);
            // Use email as username (or generate if email missing)
            $username = $user->email ?? 'user' . $user->id;
            DB::table('users')->where('id', $user->id)->update([
                'employee_id' => $employeeId,
                'username' => $username,
            ]);
        });

        // Now add unique constraints and make columns required
        Schema::table('users', function (Blueprint $table) {
            $table->unique('employee_id');
            $table->unique('username');
            $table->string('employee_id')->nullable(false)->change();
            $table->string('username')->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['employee_id', 'department', 'position', 'username', 'photo']);
        });
    }
};
