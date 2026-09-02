<?php

namespace Database\Seeders;

use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Kredensial Resmi Sesuai File Excel (KREDENSIAL) Password Akun Posyandu Loa Duri Ulu.xlsx
        $kredensial = [
            'Melati' => [
                'ketua' => ['username' => 'ketua.melati', 'pin' => '528369'],
                'kader' => ['username' => 'kader.melati', 'pin' => '466136'],
            ],
            'Rukun Lestari' => [
                'ketua' => ['username' => 'ketua.rukunlestari', 'pin' => '801608'],
                'kader' => ['username' => 'kader.rukunlestari', 'pin' => '484106'],
            ],
            'Mawar' => [
                'ketua' => ['username' => 'ketua.mawar', 'pin' => '309093'],
                'kader' => ['username' => 'kader.mawar', 'pin' => '123456'],
            ],
            'Bina Putra' => [
                'ketua' => ['username' => 'ketua.binaputra', 'pin' => '869853'],
                'kader' => ['username' => 'kader.binaputra', 'pin' => '480300'],
            ],
            'Nusa Indah' => [
                'ketua' => ['username' => 'ketua.nusaindah', 'pin' => '523637'],
                'kader' => ['username' => 'kader.nusaindah', 'pin' => '745041'],
            ],
            'Cempaka' => [
                'ketua' => ['username' => 'ketua.cempaka', 'pin' => '541143'],
                'kader' => ['username' => 'kader.cempaka', 'pin' => '686417'],
            ],
            'Tunas Mulya' => [
                'ketua' => ['username' => 'ketua.tunasmulya', 'pin' => '185530'],
                'kader' => ['username' => 'kader.tunasmulya', 'pin' => '864263'],
            ],
            'Surya' => [
                'ketua' => ['username' => 'ketua.surya', 'pin' => '633891'],
                'kader' => ['username' => 'kader.surya', 'pin' => '578135'],
            ],
            'Terkini' => [
                'ketua' => ['username' => 'ketua.terkini', 'pin' => '356014'],
                'kader' => ['username' => 'kader.terkini', 'pin' => '314554'],
            ],
        ];

        $posyanduData = [];

        // 1. Loop 9 Posyandu
        foreach ($kredensial as $nama => $roles) {
            $posyandu = Posyandu::updateOrCreate(
                ['nama' => $nama],
                ['alamat' => 'Desa Loa Duri Ulu']
            );
            $posyanduData[$nama] = $posyandu->id;

            // Akun Ketua (User model otomatis mem-bcrypt password via casts ['password' => 'hashed'])
            User::updateOrCreate(
                ['username' => $roles['ketua']['username']],
                [
                    'name' => 'Ketua '.$nama,
                    'role' => 'ketua',
                    'posyandu_id' => $posyandu->id,
                    'password' => $roles['ketua']['pin'],
                ]
            );

            // Akun Kader
            User::updateOrCreate(
                ['username' => $roles['kader']['username']],
                [
                    'name' => 'Kader '.$nama,
                    'role' => 'kader',
                    'posyandu_id' => $posyandu->id,
                    'password' => $roles['kader']['pin'],
                ]
            );
        }

        // 2. Akun Superadmin (Perangkat Desa)
        User::updateOrCreate(
            ['username' => 'admin.desa'],
            [
                'name' => 'Admin Desa Loa Duri Ulu',
                'role' => 'superadmin',
                'posyandu_id' => null,
                'password' => '887201',
            ]
        );

        // 3. Akun Petugas Puskesmas
        User::updateOrCreate(
            ['username' => 'petugas.puskesmas'],
            [
                'name' => 'Bidan Fitri',
                'role' => 'puskesmas',
                'posyandu_id' => null,
                'password' => '889148',
            ]
        );

        // 4. Akun Warga Contoh (Terdaftar di Posyandu Melati)
        if (isset($posyanduData['Melati'])) {
            User::updateOrCreate(
                ['username' => 'warga.budi'],
                [
                    'name' => 'Budi Santoso',
                    'role' => 'warga',
                    'posyandu_id' => $posyanduData['Melati'],
                    'password' => '123456',
                ]
            );
        }
    }
}
