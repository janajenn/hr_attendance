<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->string('image')->nullable()->after('radius');
            $table->datetime('start_time')->nullable()->after('image');
            $table->datetime('end_time')->nullable()->after('start_time');
            $table->integer('late_threshold')->nullable()->after('end_time'); // minutes
        });
    }

    public function down()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['image', 'start_time', 'end_time', 'late_threshold']);
        });
    }
};
