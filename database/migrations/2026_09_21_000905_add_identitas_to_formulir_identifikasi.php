<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formulir_identifikasi', function (Blueprint $table) {
            $table->string('identitas')->nullable()->after('sub_bidang');
        });
    }

    public function down(): void
    {
        Schema::table('formulir_identifikasi', function (Blueprint $table) {
            $table->dropColumn('identitas');
        });
    }
};