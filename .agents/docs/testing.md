# Testing & Quality Assurance Plan - Posyandu Loa Duri Ulu

## 1. Testing Strategy

Pengujian sistem dilakukan pada 3 tingkat:
1. **Backend Unit & Feature Testing (PHPUnit / Pest)**: Menguji logika bisnis, validasi request, autentikasi Sanctum, dan proteksi role middleware.
2. **Frontend Build & Linting (Vite / ESLint)**: Memastikan tidak ada syntax error, bundle size terkendali, dan struktur komponen modular.
3. **Manual User Journey & Mobile Emulation**: Memastikan pengalaman pengguna pada resolusi smartphone (360px, 390px, 412px, 768px) dan browser modern.

---

## 2. Automated Test Commands

### Backend Tests
```bash
# Menjalankan PHP Lint check
php -l bootstrap/app.php
php -l routes/api.php

# Menjalankan Laravel Pint (Code Standard PSR-12)
php vendor/bin/pint --test

# Menjalankan Unit & Feature Tests
php artisan test
```

### Frontend Verification
```bash
# Build produksi asset Vite
npm run build
```

---

## 3. Test Scenarios Matrix

| Kode | Skenario Pengujian | Hasil yang Diharapkan |
|---|---|---|
| **TC-01** | Akses halaman publik tanpa token (Beranda, Profil, Jadwal, Kalkulator) | Halaman terbuka lancar dengan status 200 OK |
| **TC-02** | Login dengan user terdaftar (Kader, Ketua, Warga, Superadmin) | Berhasil autentikasi, token tersimpan di `localStorage`, diarahkan ke dashboard sesuai role |
| **TC-03** | Percobaan akses route terproteksi tanpa token | Mengembalikan HTTP 401 Unauthorized / dialihkan ke halaman login |
| **TC-04** | Pencatatan pemeriksaan balita dengan parameter imunisasi & foto | Data tersimpan dengan status 201 Created |
| **TC-05** | Admin Desa memanggil `GET /api/admin/pemeriksaan/balita` tanpa `posyandu_id` | Mengembalikan seluruh data pemeriksaan dari ke-9 posyandu |
| **TC-06** | Submit Pengaduan Masyarakat dengan multi-upload lampiran | Lampiran tersimpan sebagai array JSON bersih tanpa double serialization |
| **TC-07** | Filter data tambahan individu berdasarkan bulan `YYYY-MM` | Mengembalikan data sesuai bulan dan tahun secara akurat |
| **TC-08** | Interaksi Mobile: Klik tombol menu, modal detail posyandu, dan bottom navigation | Tap target responsif (min 44px), scroll lock saat modal terbuka |
