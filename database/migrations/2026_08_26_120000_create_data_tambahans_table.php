<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_tambahans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('posyandu_id')->constrained('posyandus')->cascadeOnDelete();

            // Periode laporan, contoh: 2026-08
            $table->string('periode', 7);

            // 1. Data Ibu Hamil
            $table->integer('ibu_hamil_total')->default(0);
            $table->integer('ibu_hamil_periksa')->default(0);
            $table->integer('ibu_hamil_risiko')->default(0);

            // 2. Data Nifas
            $table->integer('nifas_total')->default(0);
            $table->integer('nifas_vit_a')->default(0);
            $table->integer('nifas_fe')->default(0);

            // 3. Data Kematian Ibu
            $table->integer('kematian_ibu_hamil')->default(0);
            $table->integer('kematian_ibu_bersalin')->default(0);
            $table->integer('kematian_ibu_nifas')->default(0);

            // 4. Data Diare
            $table->integer('diare_total')->default(0);
            $table->integer('diare_oralit')->default(0);
            $table->integer('diare_rujuk')->default(0);

            $table->text('catatan')->nullable();

            $table->timestamps();

            // Satu Posyandu cukup satu rekap per bulan.
            $table->unique(['posyandu_id', 'periode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_tambahans');
    }
};
