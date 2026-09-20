<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_umums', function (Blueprint $table) {
            $table->renameColumn('rukun_warga', 'wilayah_rt');
        });
    }

    public function down(): void
    {
        Schema::table('data_umums', function (Blueprint $table) {
            $table->renameColumn('wilayah_rt', 'rukun_warga');
        });
    }
};