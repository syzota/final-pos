<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_tambahan_individu', function (Blueprint $table) {
            $table->id();
            $table->foreignId('posyandu_id')->constrained('posyandus')->cascadeOnDelete();

            $table->enum('jenis', [
                'ibu_hamil',
                'nifas',
                'kematian_nifas',
                'diare',
            ]);

            // Data umum orang
            $table->string('nama');
            $table->unsignedTinyInteger('umur');
            $table->string('alamat')->nullable();
            $table->date('tanggal');

            // Detail tiap jenis disimpan fleksibel agar tabel tetap sederhana
            $table->json('detail')->nullable();

            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index(['posyandu_id', 'jenis']);
            $table->index(['posyandu_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_tambahan_individu');
    }
};
