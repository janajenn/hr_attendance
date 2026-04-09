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
    Schema::table('users', function (Blueprint $table) {
        // Add foreign key column (nullable for now, but we'll make it required after populating)
        $table->foreignId('department_id')->nullable()->after('position')->constrained()->nullOnDelete();
        // Remove the old string column
        $table->dropColumn('department');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('department')->nullable()->after('position');
        $table->dropForeign(['department_id']);
        $table->dropColumn('department_id');
    });
}
};
