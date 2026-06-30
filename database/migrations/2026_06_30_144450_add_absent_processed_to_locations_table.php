<?php

// database/migrations/xxxx_add_absent_processed_to_locations_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->boolean('absent_processed')->default(false)->after('is_active');
        });
    }

    public function down()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('absent_processed');
        });
    }
};
