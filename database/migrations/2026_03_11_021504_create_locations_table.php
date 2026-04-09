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
    Schema::create('locations', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // e.g., "Point A", "Main Venue"
        $table->text('description')->nullable();
        $table->decimal('latitude', 10, 8);
        $table->decimal('longitude', 11, 8);
        $table->integer('radius')->default(100); // meters
        $table->boolean('is_active')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
