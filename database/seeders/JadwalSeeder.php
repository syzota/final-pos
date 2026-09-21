<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JadwalSeeder extends Seeder
{
    public function run(): void
    {
        $jadwals = [
            ['posyandu_id' => 1, 'keterangan_waktu' => 'Tanggal 3', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 2, 'keterangan_waktu' => 'Tanggal 4', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 3, 'keterangan_waktu' => 'Tanggal 6', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 4, 'keterangan_waktu' => 'Tanggal 9', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 5, 'keterangan_waktu' => 'Tanggal 10', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 6, 'keterangan_waktu' => 'Tanggal 12', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 7, 'keterangan_waktu' => 'Tanggal 14', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 8, 'keterangan_waktu' => 'Tanggal 16', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
            ['posyandu_id' => 9, 'keterangan_waktu' => 'Tanggal 19', 'catatan' => 'Jadwal rutin Posyandu setiap bulan'],
        ];

        foreach ($jadwals as $j) {
            DB::table('jadwal')->updateOrInsert(
                ['posyandu_id' => $j['posyandu_id']],
                [
                    'keterangan_waktu' => $j['keterangan_waktu'],
                    'catatan' => $j['catatan'],
                    'updated_at' => now(),
                ]
            );
        }

        DB::table('kontak_darurat')->updateOrInsert(
            ['id' => 1],
            [
                'nama_layanan' => 'Ambulance Desa Loa Duri Ulu',
                'jenis' => 'ambulans',
                'no_telepon' => '081250221210',
                'updated_at' => now(),
            ]
        );
    }
}
