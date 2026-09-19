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

        $posyanduMeta = [
            'Melati' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => '082254785400',
                'link_gmaps' => 'https://www.google.com/maps?q=-0.587910,117.061170',
                'foto' => 'profil_posyandu/posyandu-melati.png',
                'jml_kader_aktif' => 5,
            ],
            'Rukun Lestari' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => '082220917146',
                'link_gmaps' => 'https://www.google.com/maps?q=-0.590050,117.053150',
                'foto' => 'profil_posyandu/posyandu-rukun-lestari.png',
                'jml_kader_aktif' => 5,
            ],
            'Mawar' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => '081352749095',
                'link_gmaps' => 'https://www.google.com/maps?q=-0.605280,117.048430',
                'foto' => 'profil_posyandu/posyandu-mawar.png',
                'jml_kader_aktif' => 5,
            ],
            'Bina Putra' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => '081350272329',
                'link_gmaps' => 'https://www.google.com/maps?q=-0.591351,117.063864',
                'foto' => 'profil_posyandu/posyandu-bina-putra.png',
                'jml_kader_aktif' => 5,
            ],
            'Nusa Indah' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => '081254231480',
                'link_gmaps' => 'https://www.google.com/maps?q=-0.588640,117.055510',
                'foto' => 'profil_posyandu/posyandu-nusa-indah.png',
                'jml_kader_aktif' => 5,
            ],
            'Cempaka' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => null,
                'link_gmaps' => 'https://www.google.com/maps?q=-0.575500,117.043630',
                'foto' => 'profil_posyandu/posyandu-cempaka.png',
                'jml_kader_aktif' => 5,
            ],
            'Tunas Mulya' => [
                'alamat' => 'Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391',
                'no_telepon' => '08115567967',
                'kontak_darurat' => null,
                'link_gmaps' => 'https://www.google.com/maps?q=-0.587190,117.048890',
                'foto' => 'profil_posyandu/posyandu-tunas-mulia.png',
                'jml_kader_aktif' => 5,
            ],
            'Surya' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => '082137618893',
                'link_gmaps' => 'https://www.google.com/maps?q=-0.579550,117.057760',
                'foto' => 'profil_posyandu/posyandu-surya.png',
                'jml_kader_aktif' => 5,
            ],
            'Terkini' => [
                'alamat' => 'Desa Loa Duri Ulu',
                'no_telepon' => '08115567967',
                'kontak_darurat' => null,
                'link_gmaps' => 'https://www.google.com/maps?q=-0.589430,117.061800',
                'foto' => 'profil_posyandu/posyandu-terkini.png',
                'jml_kader_aktif' => 5,
            ],
        ];

        // 1. Loop 9 Posyandu
        foreach ($kredensial as $nama => $roles) {
            $meta = $posyanduMeta[$nama] ?? ['alamat' => 'Desa Loa Duri Ulu'];
            $posyandu = Posyandu::updateOrCreate(
                ['nama' => $nama],
                $meta
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
