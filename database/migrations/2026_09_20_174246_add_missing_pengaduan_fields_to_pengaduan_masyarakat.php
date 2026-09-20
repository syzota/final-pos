<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('pengaduan_masyarakat', 'tanggal_penyampaian')) {
            Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
                $table->date('tanggal_penyampaian')->nullable();
            });
        }

        if (! Schema::hasColumn('pengaduan_masyarakat', 'penerima_aspirasi')) {
            Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
                $table->string('penerima_aspirasi')->nullable();
            });
        }

        if (! Schema::hasColumn('pengaduan_masyarakat', 'jenis_aspirasi')) {
            Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
                $table->string('jenis_aspirasi')->nullable();
            });
        }

        if (! Schema::hasColumn('pengaduan_masyarakat', 'urgensi')) {
            Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
                $table->string('urgensi')->nullable();
            });
        }

        if (! Schema::hasColumn('pengaduan_masyarakat', 'rekomendasi')) {
            Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
                $table->text('rekomendasi')->nullable();
            });
        }

        if (! Schema::hasColumn('pengaduan_masyarakat', 'tindak_lanjut')) {
            Schema::table('pengaduan_masyarakat', function (Blueprint $table) {
                $table->text('tindak_lanjut')->nullable();
            });
        }
    }

    public function down(): void
    {
        $columns = [
            'tanggal_penyampaian',
            'penerima_aspirasi',
            'jenis_aspirasi',
            'urgensi',
            'rekomendasi',
            'tindak_lanjut',
        ];

        foreach ($columns as $column) {
            if (Schema::hasColumn('pengaduan_masyarakat', $column)) {
                Schema::table('pengaduan_masyarakat', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
};