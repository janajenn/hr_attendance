<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('attendance_records', function (Blueprint $table) {
        $table->index(['user_id', 'location_id', 'attendance_timestamp'], 'idx_user_location_date');
    });
}

public function down()
{
    Schema::table('attendance_records', function (Blueprint $table) {
        $table->dropIndex('idx_user_location_date');
    });
}
};
