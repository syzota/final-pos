<?php

namespace Database\Seeders;

use App\Models\Artikel;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtikelSeeder extends Seeder
{
    public function run(): void
    {
        $bidan = User::where('role', 'puskesmas')->first() ?? User::first();
        $kader = User::where('role', 'kader')->first() ?? User::first();
        $admin = User::where('role', 'superadmin')->first() ?? User::first();

        $posyandu1 = Posyandu::find(1);
        $posyandu2 = Posyandu::find(2);
        $posyandu4 = Posyandu::find(4);
        $posyandu5 = Posyandu::find(5);
        $posyandu6 = Posyandu::find(6);

        $artikels = [
            [
                'posyandu_id' => $posyandu1?->id ?? 1,
                'penulis_id' => $bidan->id,
                'kategori' => 'Nutrisi',
                'judul' => 'Pentingnya MPASI Bergizi Kaya Protein Hewani untuk Mencegah Stunting',
                'slug' => 'pentingnya-mpasi-bergizi-kaya-protein-hewani-cegah-stunting',
                'isi_artikel' => "Stunting merupakan masalah kurang gizi kronis yang disebabkan oleh asupan gizi yang kurang dalam waktu lama, umumnya terjadi sejak janin dalam kandungan sampai awal kehidupan anak (1000 Hari Pertama Kehidupan).

Salah satu strategi paling efektif dalam mencegah stunting saat bayi berusia 6 bulan ke atas adalah pemberian Makanan Pendamping ASI (MPASI) yang kaya akan protein hewani. Protein hewani seperti telur, ikan lokal (misalnya ikan gabus dan lele), hati ayam, dan daging mengandung asam amino esensial lengkap yang sangat dibutuhkan untuk pembentukan sel dan pertumbuhan tulang optimal.

Tips Pemberian MPASI untuk Warga:
1. Berikan telur ayam atau ikan segar minimal 1 butir atau 1 porsi setiap hari.
2. Pastikan tekstur makanan sesuai dengan tahapan usia bayi (lumat, cincang, hingga makanan keluarga).
3. Jaga kebersihan alat makan dan cuci tangan sebelum mengolah makanan.
4. Lakukan penimbangan rutin setiap bulan di Posyandu terdekat untuk memantau kenaikan kurva berat badan.",
                'path_foto' => 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80',
                'status' => 'dipublikasikan',
                'published_at' => now()->subDays(2),
            ],
            [
                'posyandu_id' => $posyandu4?->id ?? 4,
                'penulis_id' => $bidan->id,
                'kategori' => 'Imunisasi',
                'judul' => 'Jadwal Imunisasi Lengkap Bayi 0-11 Bulan: Perlindungan Terbaik Penyakit Menular',
                'slug' => 'jadwal-imunisasi-lengkap-bayi-perlindungan-penyakit-menular',
                'isi_artikel' => "Imunisasi dasar lengkap merupakan hak setiap anak untuk mendapatkan kekebalan tubuh dari berbagai penyakit menular berbahaya seperti hepatitis B, TBC, polio, difteri, pertusis, tetanus, dan campak.

Pemerintah melalui Posyandu dan Puskesmas menyediakan vaksinasi gratis dan aman bagi seluruh masyarakat.

Panduan Waktu Imunisasi Bayi:
- Usia 0 Bulan: Hepatitis B (HB0) segera setelah lahir.
- Usia 1 Bulan: BCG dan Polio 1.
- Usia 2 Bulan: DPT-HB-Hib 1, Polio 2, dan PCV 1.
- Usia 3 Bulan: DPT-HB-Hib 2, Polio 3, dan PCV 2.
- Usia 4 Bulan: DPT-HB-Hib 3, Polio 4, dan IPV (suntik).
- Usia 9 Bulan: Campak / MR 1.

Jangan ragu untuk membawa buku KIA saat jadwal Posyandu bulanan tiba agar kader dan bidan dapat mencatat riwayat vaksinasi si kecil.",
                'path_foto' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80',
                'status' => 'dipublikasikan',
                'published_at' => now()->subDays(5),
            ],
            [
                'posyandu_id' => $posyandu1?->id ?? 1,
                'penulis_id' => $kader->id,
                'kategori' => 'Kehamilan',
                'judul' => 'Panduan Menjaga Kesehatan Fisik dan Ketenangan Pikiran Ibu Hamil',
                'slug' => 'panduan-menjaga-kesehatan-fisik-dan-ketenangan-ibu-hamil',
                'isi_artikel' => "Masa kehamilan adalah periode istimewa yang membutuhkan perhatian menyeluruh, baik dari segi asupan nutrisi maupun kestabilan emosi ibu.

Selama masa kehamilan, ibu disarankan untuk:
1. Memeriksakan kehamilan minimal 6 kali selama masa mengandung (2 kali pada trimester 1, 1 kali pada trimester 2, dan 3 kali pada trimester 3).
2. Meminum tablet tambah darah (TTD) secara rutin minimal 90 tablet selama kehamilan untuk mencegah anemia.
3. Mengonsumsi makanan bergizi seimbang, perbanyak sayuran hijau, buah-buahan, serta cairan yang cukup.
4. Menghindari stres berlebih dengan istirahat cukup dan dukungan penuh dari suami serta keluarga.

Bila mengalami tanda bahaya seperti perdarahan, sakit kepala hebat, atau gerakan janin berkurang, segera hubungi bidan desa atau layanan darurat Posyandu.",
                'path_foto' => 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=700&auto=format&fit=crop&q=80',
                'status' => 'dipublikasikan',
                'published_at' => now()->subDays(9),
            ],
            [
                'posyandu_id' => $posyandu2?->id ?? 2,
                'penulis_id' => $admin->id,
                'kategori' => 'Kesehatan',
                'judul' => 'Pola Hidup Bersih & Sehat (PHBS) di Lingkungan Rumah Tangga Desa Loa Duri Ulu',
                'slug' => 'pola-hidup-bersih-sehat-phbs-lingkungan-desa-loa-duri-ulu',
                'isi_artikel' => "Penerapan Perilaku Hidup Bersih dan Sehat (PHBS) di lingkungan keluarga merupakan pondasi utama terwujudnya desa yang tangguh dan bebas penyakit.

10 Indikator Utama PHBS Rumah Tangga:
1. Persalinan ditolong oleh tenaga kesehatan.
2. Memberi bayi ASI eksklusif sejak lahir hingga 6 bulan.
3. Menimbang balita setiap bulan di Posyandu.
4. Menggunakan air bersih untuk kebutuhan minum dan memasak.
5. Mencuci tangan dengan air bersih mengalir dan sabun.
6. Menggunakan jamban sehat.
7. Memberantas jentik nyamuk di bak penampungan air secara rutin seminggu sekali.
8. Makan buah dan sayur setiap hari.
9. Melakukan aktivitas fisik minimal 30 menit sehari.
10. Tidak merokok di dalam rumah.

Mari bersama kita ciptakan lingkungan Loa Duri Ulu yang sehat, asri, dan nyaman untuk tumbuh kembang anak-anak kita.",
                'path_foto' => 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=700&auto=format&fit=crop&q=80',
                'status' => 'dipublikasikan',
                'published_at' => now()->subDays(14),
            ],
            [
                'posyandu_id' => $posyandu4?->id ?? 4,
                'penulis_id' => $kader->id,
                'kategori' => 'Kesehatan',
                'judul' => 'Aktivitas Fisik Ringan & Pemeriksaan Tensi Rutin untuk Kebugaran Lansia',
                'slug' => 'aktivitas-fisik-ringan-dan-pemeriksaan-tensi-rutin-lansia',
                'isi_artikel' => "Menjaga kebugaran di usia senja sangat penting agar para lansia tetap mandiri, aktif, dan bahagia dalam menjalani keseharian.

Posyandu Lansia di Desa Loa Duri Ulu memfasilitasi pemeriksaan rutin meliputi tensi darah, penimbangan berat badan, pemeriksaan gula darah, kolesterol, dan asam urat.

Tips Bugar untuk Lansia:
- Lakukan jalan kaki santai di pagi hari selama 15-20 menit.
- Kurangi asupan garam berlebih untuk menjaga tekanan darah tetap stabil.
- Perbanyak minum air putih hangat dan hindari minuman terlalu manis.
- Tetap bersosialisasi dengan tetangga dan keluarga untuk menjaga keceriaan pikiran.

Ajak orang tua dan kakek-nenek kita ke Posyandu Lansia setiap bulan untuk pemantauan kesehatan berkala bersama tenaga medis.",
                'path_foto' => 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=700&auto=format&fit=crop&q=80',
                'status' => 'dipublikasikan',
                'published_at' => now()->subDays(18),
            ],
            [
                'posyandu_id' => $posyandu5?->id ?? 5,
                'penulis_id' => $bidan->id,
                'kategori' => 'Nutrisi',
                'judul' => 'Solusi Menghadapi Anak Gerakan Tutup Mulut (GTM) dengan Menu Variatif',
                'slug' => 'solusi-anak-gerakan-tutup-mulut-gtm-menu-variatif',
                'isi_artikel' => "Fase Gerakan Tutup Mulut (GTM) pada anak balita seringkali membuat para orang tua cemas. GTM adalah kondisi di mana anak menolak makan, menyemburkan makanan, atau mengemut terlalu lama.

Penyebab umum GTM antara lain tumbuh gigi, bosan dengan menu yang monoton, tekstur makanan yang belum sesuai, atau suasana makan yang kurang menyenangkan.

Cara Mengatasi GTM:
1. Buat jadwal makan teratur (3 kali makan utama dan 2 kali snack sehat) serta hindari memberi susu berlebih menjelang jam makan.
2. Batasi waktu makan maksimal 30 menit. Jika anak menolak, sudahi tanpa memarahi.
3. Buat variasi menu yang menarik, seperti nugget ikan buatan sendiri atau nasi kepal warna-warni dari sayuran.
4. Ciptakan suasana makan bersama keluarga yang hangat tanpa distraksi gawai/gadget.",
                'path_foto' => 'https://images.unsplash.com/photo-1596464716127-f2a829822301?w=700&auto=format&fit=crop&q=80',
                'status' => 'dipublikasikan',
                'published_at' => now()->subDays(24),
            ],
        ];

        foreach ($artikels as $artikelData) {
            Artikel::updateOrCreate(
                ['slug' => $artikelData['slug']],
                $artikelData
            );
        }
    }
}
