<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PosyanduController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArtikelController;
use App\Http\Middleware\CheckRole; // Import Middleware baru kita

/**
 * @title API Posyandu LDU
 * @version 1.0.0
 * @description Dokumentasi resmi API untuk Web Posyandu
 */

// ==========================================
// 1. PUBLIC ROUTES (Bisa diakses siapa saja)
// ==========================================
Route::get('/ping', function () {
    return response()->json([
        'status' => 'sukses',
        'pesan' => 'API Aktif'
    ]);
});

// Login dibatasi maksimal 5 request per menit
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::get('/profil-posyandu', [PosyanduController::class, 'index']);
Route::get('/artikels', [ArtikelController::class, 'index']);
Route::get('/artikels/{id}', [ArtikelController::class, 'show']);
Route::get('/makanan', [\App\Http\Controllers\Api\ReferensiMakananController::class, 'index']);


// ==========================================
// 2. PROTECTED ROUTES (Wajib punya token/login)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    Route::post(
        '/formulir-identifikasi',
        [\App\Http\Controllers\Api\FormulirIdentifikasiController::class, 'store']
    );

    Route::get(
        '/formulir-identifikasi',
        [\App\Http\Controllers\Api\FormulirIdentifikasiController::class, 'index']
    );

    Route::post(
        '/pengaduan-masyarakat',
        [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'store']
    );

    Route::get(
        '/pengaduan-masyarakat',
        [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'index']
    );


    // ==========================================
    // RUTE UMUM UNTUK SEMUA USER YANG SUDAH LOGIN
    // ==========================================

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', function (\Illuminate\Http\Request $request) {
        return response()->json([
            'status' => 'sukses',

            // Gunakan ->load() untuk mengambil relasi
            // pada data user yang sedang login
            'data' => $request->user()->load('posyandu')
        ]);
    });

    Route::put(
        '/akun/ganti-password',
        [AuthController::class, 'updatePassword']
    );


    // ----------------------------------------------------
    // GRUP A: Khusus KADER dan KETUA POSYANDU
    // (Akses operasional posyandu harian & Artikel)
    // ----------------------------------------------------
    Route::middleware(CheckRole::class . ':kader,ketua')->group(function () {

        // CRUD Artikel
        Route::post(
            '/artikels',
            [ArtikelController::class, 'store']
        );

        Route::post(
            '/artikels/{id}',
            [ArtikelController::class, 'update']
        );

        Route::delete(
            '/artikels/{id}',
            [ArtikelController::class, 'destroy']
        );


        // ==========================================
        // PENGELOLAAN WARGA
        // ==========================================

        Route::post(
            '/warga',
            [\App\Http\Controllers\Api\WargaController::class, 'store']
        );

        // Mengambil daftar warga
        Route::get(
            '/warga',
            [\App\Http\Controllers\Api\WargaController::class, 'index']
        );

        // Reset password warga
        Route::put(
            '/warga/{id}/reset-password',
            [\App\Http\Controllers\Api\WargaController::class, 'resetPassword']
        );

        Route::delete(
            '/warga/{id}',
            [\App\Http\Controllers\Api\WargaController::class, 'destroy']
        );


        // ==========================================
        // PENCATATAN KESEHATAN - BALITA
        // ==========================================

        Route::post(
            '/pemeriksaan-balita',
            [\App\Http\Controllers\Api\PemeriksaanBalitaController::class, 'store']
        );

        // Mengambil daftar nama anak untuk Dropdown form pemeriksaan
        Route::get(
            '/warga/anak',
            [\App\Http\Controllers\Api\WargaController::class, 'getListAnak']
        );


        // ==========================================
        // PENCATATAN KESEHATAN - REMAJA
        // ==========================================

        // Dropdown nama remaja
        Route::get(
            '/warga/remaja',
            [\App\Http\Controllers\Api\WargaController::class, 'getListRemaja']
        );

        Route::post(
            '/pemeriksaan-remaja',
            [\App\Http\Controllers\Api\PemeriksaanRemajaController::class, 'store']
        );


        // ==========================================
        // PENCATATAN KESEHATAN - IBU HAMIL
        // ==========================================

        // Dropdown nama Ibu
        Route::get(
            '/warga/ibu',
            [\App\Http\Controllers\Api\WargaController::class, 'getListIbu']
        );

        Route::post(
            '/pemeriksaan-hamil',
            [\App\Http\Controllers\Api\PemeriksaanHamilController::class, 'store']
        );


        // ==========================================
        // PENCATATAN KESEHATAN - LANSIA
        // ==========================================

        // Dropdown nama Lansia
        Route::get(
            '/warga/lansia',
            [\App\Http\Controllers\Api\WargaController::class, 'getListLansia']
        );

        Route::post(
            '/pemeriksaan-lansia',
            [\App\Http\Controllers\Api\PemeriksaanLansiaController::class, 'store']
        );


        // ==========================================
        // DRAFT PEMERIKSAAN
        // ==========================================

        Route::get(
            '/draf-pemeriksaan/{kelompok}',
            [\App\Http\Controllers\Api\DraftController::class, 'getDrafts']
        );


        // ==========================================
        // REFERENSI MAKANAN
        // ==========================================

        Route::post(
            '/makanan',
            [\App\Http\Controllers\Api\ReferensiMakananController::class, 'store']
        );

        Route::put(
            '/makanan/{id}',
            [\App\Http\Controllers\Api\ReferensiMakananController::class, 'update']
        );

        Route::delete(
            '/makanan/{id}',
            [\App\Http\Controllers\Api\ReferensiMakananController::class, 'destroy']
        );


        // ==========================================
        // REKAP KEGIATAN
        // ==========================================

        Route::get(
            '/rekap-kegiatan',
            [\App\Http\Controllers\Api\RekapKegiatanController::class, 'index']
        );

        Route::post(
            '/rekap-kegiatan',
            [\App\Http\Controllers\Api\RekapKegiatanController::class, 'store']
        );

        Route::delete(
            '/rekap-kegiatan/{id}',
            [\App\Http\Controllers\Api\RekapKegiatanController::class, 'destroy']
        );


        // ==========================================
        // PENCATATAN KEGIATAN
        // ==========================================

        Route::get(
            '/pencatatan-kegiatan',
            [\App\Http\Controllers\Api\PencatatanKegiatanController::class, 'index']
        );

        Route::post(
            '/pencatatan-kegiatan',
            [\App\Http\Controllers\Api\PencatatanKegiatanController::class, 'store']
        );

        Route::delete(
            '/pencatatan-kegiatan/{id}',
            [\App\Http\Controllers\Api\PencatatanKegiatanController::class, 'destroy']
        );


        // ==========================================
        // DATA UMUM
        // ==========================================

        Route::get(
            '/data-umum',
            [\App\Http\Controllers\Api\DataUmumController::class, 'index']
        );

        Route::post(
            '/data-umum',
            [\App\Http\Controllers\Api\DataUmumController::class, 'store']
        );

        Route::delete(
            '/data-umum/{id}',
            [\App\Http\Controllers\Api\DataUmumController::class, 'destroy']
        );


        // ==========================================
        // DATA TAMBAHAN
        // Ibu Hamil, Nifas, Kematian Ibu, Diare
        // ==========================================

        Route::get(
            '/data-tambahan-individu',
            [\App\Http\Controllers\Api\DataTambahanIndividuController::class, 'index']
        );

        Route::post(
            '/data-tambahan-individu',
            [\App\Http\Controllers\Api\DataTambahanIndividuController::class, 'store']
        );

        Route::delete(
            '/data-tambahan-individu/{id}',
            [\App\Http\Controllers\Api\DataTambahanIndividuController::class, 'destroy']
        );


        // ==========================================
        // DASHBOARD
        // ==========================================

        Route::get(
            '/dashboard/stats',
            [\App\Http\Controllers\Api\DashboardController::class, 'getStats']
        );
    });


    // ----------------------------------------------------
    // GRUP B: Khusus KETUA POSYANDU
    // (Akses manajerial profil posyandu)
    // ----------------------------------------------------
    Route::middleware(CheckRole::class . ':ketua')->group(function () {

        // Nanti rute untuk edit profil & jadwal posyandu ditaruh di sini
        Route::get(
            '/posyandu/me',
            [\App\Http\Controllers\Api\PosyanduController::class, 'getMe']
        );

        Route::post(
            '/posyandu/me/update',
            [\App\Http\Controllers\Api\PosyanduController::class, 'updateMe']
        );
    });


    // ----------------------------------------------------
    // GRUP C: Khusus WARGA
    // ----------------------------------------------------
    Route::middleware(CheckRole::class . ':warga')->group(function () {

        // Hanya role warga yang boleh mengubah akun warga
        Route::put(
            '/warga/update-akun',
            [\App\Http\Controllers\Api\AuthController::class, 'updateAkunWarga']
        );

        Route::get(
            '/warga/rapor-keluarga',
            [\App\Http\Controllers\Api\WargaController::class, 'getRaporKeluarga']
        );

        Route::post(
            '/warga/anak',
            [\App\Http\Controllers\Api\WargaController::class, 'tambahAnakWarga']
        );
    });


    // ----------------------------------------------------
    // GRUP D: Khusus SUPERADMIN (Desa)
    // (Akses mata elang / analitik)
    // ----------------------------------------------------
    Route::middleware(CheckRole::class . ':superadmin')->group(function () {

        Route::get(
            '/admin/pengaduan',
            [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'getAllForAdmin']
        );

        Route::patch(
            '/admin/pengaduan/{id}/status',
            [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'updateStatus']
        );

        Route::get(
            '/admin/posyandu-updates',
            [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'getLatestUpdateTiapPosyandu']
        );

        Route::get(
            '/admin/formulir',
            [\App\Http\Controllers\Api\FormulirIdentifikasiController::class, 'getAllForAdmin']
        );

        Route::get(
            '/admin/statistik',
            [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'getStatistik']
        );

        Route::delete(
            '/admin/formulir/{id}',
            [\App\Http\Controllers\Api\FormulirIdentifikasiController::class, 'destroyForAdmin']
        );

        Route::delete(
            '/admin/pengaduan/{id}',
            [\App\Http\Controllers\Api\PengaduanMasyarakatController::class, 'destroyForAdmin']
        );


        // ==========================================
        // DATA KESEHATAN BERDASARKAN POSYANDU
        // ==========================================

        Route::get(
            '/admin/pemeriksaan/balita',
            [\App\Http\Controllers\Api\PemeriksaanBalitaController::class, 'getForAdmin']
        );

        Route::get(
            '/admin/pemeriksaan/remaja',
            [\App\Http\Controllers\Api\PemeriksaanRemajaController::class, 'getForAdmin']
        );

        Route::get(
            '/admin/pemeriksaan/ibu-hamil',
            [\App\Http\Controllers\Api\PemeriksaanHamilController::class, 'getForAdmin']
        );

        Route::get(
            '/admin/pemeriksaan/lansia',
            [\App\Http\Controllers\Api\PemeriksaanLansiaController::class, 'getForAdmin']
        );


        // ==========================================
        // HAPUS DATA KESEHATAN
        // ==========================================

        Route::delete(
            '/admin/pemeriksaan/balita/{id}',
            [\App\Http\Controllers\Api\PemeriksaanBalitaController::class, 'destroyForAdmin']
        );

        Route::delete(
            '/admin/pemeriksaan/remaja/{id}',
            [\App\Http\Controllers\Api\PemeriksaanRemajaController::class, 'destroyForAdmin']
        );

        Route::delete(
            '/admin/pemeriksaan/ibu-hamil/{id}',
            [\App\Http\Controllers\Api\PemeriksaanHamilController::class, 'destroyForAdmin']
        );

        Route::delete(
            '/admin/pemeriksaan/lansia/{id}',
            [\App\Http\Controllers\Api\PemeriksaanLansiaController::class, 'destroyForAdmin']
        );


        Route::get(
            '/admin/laporan-posyandu/{posyandu_id}',
            [\App\Http\Controllers\Api\AdminLaporanController::class, 'getLaporanPosyandu']
        );

        Route::get(
            '/admin/dashboard-analitik',
            [\App\Http\Controllers\Api\AdminAnalitikController::class, 'getDashboardData']
        );
    });


    // ----------------------------------------------------
    // GRUP E: Khusus PETUGAS PUSKESMAS
    // (Akses read-only laporan kesehatan 9 posyandu)
    // ----------------------------------------------------
    Route::middleware(CheckRole::class . ':puskesmas')->group(function () {

        Route::get(
            '/puskesmas/pemeriksaan/balita',
            [\App\Http\Controllers\Api\PemeriksaanBalitaController::class, 'getForAdmin']
        );

        Route::get(
            '/puskesmas/pemeriksaan/remaja',
            [\App\Http\Controllers\Api\PemeriksaanRemajaController::class, 'getForAdmin']
        );

        Route::get(
            '/puskesmas/pemeriksaan/ibu-hamil',
            [\App\Http\Controllers\Api\PemeriksaanHamilController::class, 'getForAdmin']
        );

        Route::get(
            '/puskesmas/pemeriksaan/lansia',
            [\App\Http\Controllers\Api\PemeriksaanLansiaController::class, 'getForAdmin']
        );
    });

});
