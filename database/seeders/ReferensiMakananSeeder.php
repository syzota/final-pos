<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReferensiMakananSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['id' => 2, 'nama_makanan' => 'Nasi putih matang (100 g)', 'kalori_per_porsi' => 180],
            ['id' => 3, 'nama_makanan' => 'Nasi beras merah (100 g)', 'kalori_per_porsi' => 149],
            ['id' => 4, 'nama_makanan' => 'Kentang segar (100 g)', 'kalori_per_porsi' => 62],
            ['id' => 5, 'nama_makanan' => 'Singkong segar (100 g)', 'kalori_per_porsi' => 154],
            ['id' => 6, 'nama_makanan' => 'Singkong kukus (100 g)', 'kalori_per_porsi' => 153],
            ['id' => 7, 'nama_makanan' => 'Ubi jalar kuning segar (100 g)', 'kalori_per_porsi' => 119],
            ['id' => 8, 'nama_makanan' => 'Tahu mentah (100 g)', 'kalori_per_porsi' => 80],
            ['id' => 9, 'nama_makanan' => 'Tahu goreng (100 g)', 'kalori_per_porsi' => 115],
            ['id' => 10, 'nama_makanan' => 'Tempe kedelai murni mentah (100 g)', 'kalori_per_porsi' => 201],
            ['id' => 11, 'nama_makanan' => 'Tempe kedelai murni goreng (100 g)', 'kalori_per_porsi' => 350],
            ['id' => 12, 'nama_makanan' => 'Telur ayam ras segar (100 g)', 'kalori_per_porsi' => 154],
            ['id' => 13, 'nama_makanan' => 'Telur ayam kampung segar (100 g)', 'kalori_per_porsi' => 174],
            ['id' => 14, 'nama_makanan' => 'Ikan kembung segar (100 g)', 'kalori_per_porsi' => 111],
            ['id' => 15, 'nama_makanan' => 'Daging sapi kurus segar (100 g)', 'kalori_per_porsi' => 174],
            ['id' => 16, 'nama_makanan' => 'Kangkung segar (100 g)', 'kalori_per_porsi' => 28],
            ['id' => 17, 'nama_makanan' => 'Kangkung rebus (100 g)', 'kalori_per_porsi' => 22],
            ['id' => 18, 'nama_makanan' => 'Bayam rebus (100 g)', 'kalori_per_porsi' => 23],
            ['id' => 19, 'nama_makanan' => 'Wortel segar (100 g)', 'kalori_per_porsi' => 36],
            ['id' => 20, 'nama_makanan' => 'Wortel rebus (100 g)', 'kalori_per_porsi' => 28],
            ['id' => 21, 'nama_makanan' => 'Kacang panjang segar (100 g)', 'kalori_per_porsi' => 31],
            ['id' => 22, 'nama_makanan' => 'Pepaya segar (100 g)', 'kalori_per_porsi' => 46],
            ['id' => 23, 'nama_makanan' => 'Pisang ambon segar (100 g)', 'kalori_per_porsi' => 108],
            ['id' => 24, 'nama_makanan' => 'Jeruk manis segar (100 g)', 'kalori_per_porsi' => 45],
            ['id' => 25, 'nama_makanan' => 'Apel segar (100 g)', 'kalori_per_porsi' => 58],
            ['id' => 26, 'nama_makanan' => 'Buah naga merah segar (100 g)', 'kalori_per_porsi' => 71],
            ['id' => 27, 'nama_makanan' => 'Melon segar (100 g)', 'kalori_per_porsi' => 37],
            ['id' => 28, 'nama_makanan' => 'Mangga segar (100 g)', 'kalori_per_porsi' => 52],
            ['id' => 29, 'nama_makanan' => 'Nanas segar (100 g)', 'kalori_per_porsi' => 40],
        ];

        foreach ($items as $item) {
            DB::table('referensi_makanan')->updateOrInsert(
                ['id' => $item['id']],
                [
                    'nama_makanan' => $item['nama_makanan'],
                    'kalori_per_porsi' => $item['kalori_per_porsi'],
                    'dibuat_oleh_posyandu' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
