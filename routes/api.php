<?php

use App\Http\Controllers\Api\AdminAnalitikController;
use App\Http\Controllers\Api\AdminLaporanController;
use App\Http\Controllers\Api\ArtikelController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DataTambahanIndividuController;
use App\Http\Controllers\Api\DataUmumController;
use App\Http\Controllers\Api\DraftController;
use App\Http\Controllers\Api\FormulirIdentifikasiController;
use App\Http\Controllers\Api\PemeriksaanBalitaController;
use App\Http\Controllers\Api\PemeriksaanHamilController;
use App\Http\Controllers\Api\PemeriksaanLansiaController;
use App\Http\Controllers\Api\PemeriksaanRemajaController;
use App\Http\Controllers\Api\PencatatanKegiatanController;
use App\Http\Controllers\Api\PengaduanMasyarakatController;
use App\Http\Controllers\Api\PosyanduController;
use App\Http\Controllers\Api\ReferensiMakananController;
use App\Http\Controllers\Api\RekapKegiatanController;
use App\Http\Controllers\Api\WargaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * @title API Posyandu LDU
 *
 * @version 1.0.0
 *
 * @description Dokumentasi resmi API untuk Web Posyandu
 */

// ==========================================
// 1. PUBLIC ROUTES (Bisa diakses siapa saja)
// ==========================================
Route::get('/ping', function () {
    return response()->json(['status' => 'sukses', 'pesan' => 'API Aktif']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::get('/profil-posyandu', [PosyanduController::class, 'index']);
Route::get('/artikels', [ArtikelController::class, 'index']);
Route::get('/artikels/{id}', [ArtikelController::class, 'show']);
Route::get('/makanan', [ReferensiMakananController::class, 'index']);

// ==========================================
// 2. PROTECTED ROUTES (Wajib punya token/login)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    // Formulir & Pengaduan (Warga / Kader)
    Route::post('/formulir-identifikasi', [FormulirIdentifikasiController::class, 'store']);
    Route::get('/formulir-identifikasi', [FormulirIdentifikasiController::class, 'index']);
    Route::post('/pengaduan-masyarakat', [PengaduanMasyarakatController::class, 'store']);
    Route::get('/pengaduan-masyarakat', [PengaduanMasyarakatController::class, 'index']);

    // Akun & Sesi Pengguna
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (Request $request) {
        return response()->json([
            'status' => 'sukses',
            'data' => $request->user()->load('posyandu'),
        ]);
    });
    Route::put('/akun/ganti-password', [AuthController::class, 'updatePassword']);
    Route::put('/warga/update-akun', [AuthController::class, 'updateAkunWarga']);

    // ----------------------------------------------------
    // GRUP A: Khusus KADER dan KETUA POSYANDU
    // (Akses operasional posyandu harian & Artikel)
    // ----------------------------------------------------
    Route::middleware('role:kader,ketua')->group(function () {
        // Kelola Artikel
        Route::post('/artikels', [ArtikelController::class, 'store']);
        Route::post('/artikels/{id}', [ArtikelController::class, 'update']);
        Route::delete('/artikels/{id}', [ArtikelController::class, 'destroy']);

        // Kelola Data Warga
        Route::get('/warga', [WargaController::class, 'index']);
        Route::post('/warga', [WargaController::class, 'store']);
        Route::delete('/warga/{id}', [WargaController::class, 'destroy']);
        Route::put('/warga/{id}/reset-password', [WargaController::class, 'resetPassword']);

        // Dropdown Sasaran Warga
        Route::get('/warga/anak', [WargaController::class, 'getListAnak']);
        Route::get('/warga/remaja', [WargaController::class, 'getListRemaja']);
        Route::get('/warga/ibu', [WargaController::class, 'getListIbu']);
        Route::get('/warga/lansia', [WargaController::class, 'getListLansia']);

        // Pencatatan Pemeriksaan Kesehatan
        Route::post('/pemeriksaan-balita', [PemeriksaanBalitaController::class, 'store']);
        Route::post('/pemeriksaan-remaja', [PemeriksaanRemajaController::class, 'store']);
        Route::post('/pemeriksaan-hamil', [PemeriksaanHamilController::class, 'store']);
        Route::post('/pemeriksaan-lansia', [PemeriksaanLansiaController::class, 'store']);
        Route::get('/draf-pemeriksaan/{kelompok}', [DraftController::class, 'getDrafts']);

        // Referensi Makanan
        Route::post('/makanan', [ReferensiMakananController::class, 'store']);
        Route::put('/makanan/{id}', [ReferensiMakananController::class, 'update']);
        Route::delete('/makanan/{id}', [ReferensiMakananController::class, 'destroy']);

        // Rekap Kegiatan
        Route::get('/rekap-kegiatan', [RekapKegiatanController::class, 'index']);
        Route::post('/rekap-kegiatan', [RekapKegiatanController::class, 'store']);
        Route::delete('/rekap-kegiatan/{id}', [RekapKegiatanController::class, 'destroy']);

        // Pencatatan Kegiatan
        Route::get('/pencatatan-kegiatan', [PencatatanKegiatanController::class, 'index']);
        Route::post('/pencatatan-kegiatan', [PencatatanKegiatanController::class, 'store']);
        Route::delete('/pencatatan-kegiatan/{id}', [PencatatanKegiatanController::class, 'destroy']);

        // Data Umum
        Route::get('/data-umum', [DataUmumController::class, 'index']);
        Route::post('/data-umum', [DataUmumController::class, 'store']);
        Route::delete('/data-umum/{id}', [DataUmumController::class, 'destroy']);

        // Data Tambahan Individu
        Route::get('/data-tambahan-individu', [DataTambahanIndividuController::class, 'index']);
        Route::post('/data-tambahan-individu', [DataTambahanIndividuController::class, 'store']);
        Route::delete('/data-tambahan-individu/{id}', [DataTambahanIndividuController::class, 'destroy']);

        // Dashboard Stats
        Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    });

    // ----------------------------------------------------
    // GRUP B: Khusus KETUA POSYANDU
    // (Akses manajerial profil posyandu)
    // ----------------------------------------------------
    Route::middleware('role:ketua')->group(function () {
        Route::get('/posyandu/me', [PosyanduController::class, 'getMe']);
        Route::post('/posyandu/me/update', [PosyanduController::class, 'updateMe']);
    });

    // ----------------------------------------------------
    // GRUP C: Khusus WARGA
    // (Akses read-only rapor keluarga)
    // ----------------------------------------------------
    Route::middleware('role:warga')->group(function () {
        Route::get('/warga/rapor-keluarga', [WargaController::class, 'getRaporKeluarga']);
        Route::post('/warga/anak', [WargaController::class, 'tambahAnakWarga']);
    });

    // ----------------------------------------------------
    // GRUP D: Khusus SUPERADMIN (Desa)
    // (Akses mata elang / analitik)
    // ----------------------------------------------------
    Route::middleware('role:superadmin')->group(function () {
        Route::get('/admin/pengaduan', [PengaduanMasyarakatController::class, 'getAllForAdmin']);
        Route::patch('/admin/pengaduan/{id}/status', [PengaduanMasyarakatController::class, 'updateStatus']);
        Route::delete('/admin/pengaduan/{id}', [PengaduanMasyarakatController::class, 'destroyForAdmin']);
        Route::get('/admin/posyandu-updates', [PengaduanMasyarakatController::class, 'getLatestUpdateTiapPosyandu']);
        Route::get('/admin/formulir', [FormulirIdentifikasiController::class, 'getAllForAdmin']);
        Route::delete('/admin/formulir/{id}', [FormulirIdentifikasiController::class, 'destroyForAdmin']);
        Route::get('/admin/statistik', [PengaduanMasyarakatController::class, 'getStatistik']);

        // Data Pemeriksaan Kesehatan Per Posyandu
        Route::get('/admin/pemeriksaan/balita', [PemeriksaanBalitaController::class, 'getForAdmin']);
        Route::get('/admin/pemeriksaan/remaja', [PemeriksaanRemajaController::class, 'getForAdmin']);
        Route::get('/admin/pemeriksaan/ibu-hamil', [PemeriksaanHamilController::class, 'getForAdmin']);
        Route::get('/admin/pemeriksaan/lansia', [PemeriksaanLansiaController::class, 'getForAdmin']);

        Route::delete('/admin/pemeriksaan/balita/{id}', [PemeriksaanBalitaController::class, 'destroyForAdmin']);
        Route::delete('/admin/pemeriksaan/remaja/{id}', [PemeriksaanRemajaController::class, 'destroyForAdmin']);
        Route::delete('/admin/pemeriksaan/ibu-hamil/{id}', [PemeriksaanHamilController::class, 'destroyForAdmin']);
        Route::delete('/admin/pemeriksaan/lansia/{id}', [PemeriksaanLansiaController::class, 'destroyForAdmin']);

        Route::get('/admin/laporan-posyandu/{posyandu_id}', [AdminLaporanController::class, 'getLaporanPosyandu']);
        Route::get('/admin/dashboard-analitik', [AdminAnalitikController::class, 'getDashboardData']);
    });

    // ----------------------------------------------------
    // GRUP E: Khusus PETUGAS PUSKESMAS
    // (Akses read-only laporan kesehatan 9 posyandu)
    // ----------------------------------------------------
    Route::middleware('role:puskesmas')->group(function () {
        Route::get('/puskesmas/pemeriksaan/balita', [PemeriksaanBalitaController::class, 'getForAdmin']);
        Route::get('/puskesmas/pemeriksaan/remaja', [PemeriksaanRemajaController::class, 'getForAdmin']);
        Route::get('/puskesmas/pemeriksaan/ibu-hamil', [PemeriksaanHamilController::class, 'getForAdmin']);
        Route::get('/puskesmas/pemeriksaan/lansia', [PemeriksaanLansiaController::class, 'getForAdmin']);
    });
});
