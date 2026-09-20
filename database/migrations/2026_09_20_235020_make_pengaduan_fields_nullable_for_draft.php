<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
            $table->string('nama_pelapor')->nullable()->change();
            $table->text('alamat')->nullable()->change();
            $table->text('isi_keluhan')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
            $table->string('nama_pelapor')->nullable(false)->change();
            $table->text('alamat')->nullable(false)->change();
            $table->text('isi_keluhan')->nullable(false)->change();
        });
    }
};
