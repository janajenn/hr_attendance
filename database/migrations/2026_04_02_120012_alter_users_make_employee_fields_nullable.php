<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id')->nullable()->change();
            $table->unsignedBigInteger('department_id')->nullable()->change();
            $table->string('position')->nullable()->change();
            $table->date('birthdate')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('employee_id')->nullable(false)->change();
            $table->unsignedBigInteger('department_id')->nullable(false)->change();
            $table->string('position')->nullable(false)->change();
            $table->date('birthdate')->nullable(false)->change();
        });
    }
};
