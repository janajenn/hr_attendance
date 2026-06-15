<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // First, add a generated column for the date (if not already present)
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->date('attendance_date')->storedAs('DATE(attendance_timestamp)')->nullable();
        });

        // Then add the unique index
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->unique(['user_id', 'location_id', 'attendance_date'], 'unique_user_location_date');
        });
    }

    public function down()
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropUnique('unique_user_location_date');
            $table->dropColumn('attendance_date');
        });
    }
};
