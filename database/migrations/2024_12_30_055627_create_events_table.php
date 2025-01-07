<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * 
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id(); 
            $table->string('name');
            $table->text('description')->nullable(); 
            $table->dateTime('start_time'); 
            $table->dateTime('end_time'); 
            $table->string('location'); 
            $table->string('image_path')->nullable(); 
            $table->timestamps(); 
             DB::statement("ALTER TABLE events AUTO_INCREMENT = 1;");
        });
    }

    /**
     * 
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
};
