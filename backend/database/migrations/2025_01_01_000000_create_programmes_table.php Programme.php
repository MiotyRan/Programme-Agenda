<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programmes', function (Blueprint $table) {
            $table->id();
            $table->string('volana');           // Mois
            $table->unsignedTinyInteger('daty');// Jour (1-31)
            $table->string('andro')->nullable();// Jour de semaine
            $table->time('ora')->nullable();    // Heure
            $table->text('asa');                // Activité
            $table->string('mpanatanteraka')->nullable(); // Responsable
            $table->string('toerana')->nullable();        // Lieu
            $table->string('taona')->default(date('Y')); // Année
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};