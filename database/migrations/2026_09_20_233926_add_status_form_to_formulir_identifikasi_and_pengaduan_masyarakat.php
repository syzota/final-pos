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
        Schema::table('formulir_identifikasi', function (Blueprint $table) {
            $table->enum('status_form', ['draft', 'final'])
                ->default('final');
        });

        Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
            $table->enum('status_form', ['draft', 'final'])
                ->default('final');
        });
    }

    public function down(): void
    {
        Schema::table('formulir_identifikasi', function (Blueprint $table) {
            $table->dropColumn('status_form');
        });

        Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
            $table->dropColumn('status_form');
        });
    }
};
