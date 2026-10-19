<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_id')->constrained('offres')->restrictOnDelete();
            $table->string('nom_client');
            $table->string('email');
            $table->string('telephone', 40);
            $table->unsignedSmallInteger('nombre_personnes');
            $table->date('date_reservation');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
