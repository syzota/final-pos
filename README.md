# Posyandu Loa Duri Ulu — Web & RESTful API

Aplikasi Web Terpadu dan Layanan API Posyandu Desa Loa Duri Ulu dibangun menggunakan **Laravel** (Backend RESTful API) dan **React SPA** (Frontend Vite).

---

## Panduan Menjalankan Aplikasi

---

### Opsi 1: Menggunakan Docker (Direkomendasikan)

Pastikan **Docker Desktop** telah aktif di komputer Anda.

#### 1. Salin Konfigurasi Environment Docker
```bash
cp .env.docker .env
```

#### 2. Jalankan Seluruh Service Container
```bash
docker compose up -d --build
```

#### 3. Inisialisasi Aplikasi (Pertama Kali)
```bash
# 1. Generate Key Aplikasi
docker compose exec app php artisan key:generate

# 2. Setup Database & Akun Default
docker compose exec app php artisan migrate --seed

# 3. Hubungkan Storage Link
docker compose exec app php artisan storage:link

# 4. Install Dependensi & Build Asset React
docker compose exec app npm install
docker compose exec app npm run build
```

Aplikasi siap diakses di:
- 🌐 **Web Posyandu:** [http://localhost:8000](http://localhost:8000)
- 🗄️ **phpMyAdmin:** [http://localhost:8081](http://localhost:8081)

---

### Opsi 2: Menjalankan Secara Manual / Lokal (Native)

#### Prasyarat
- **PHP** >= 8.3
- **Composer** >= 2.x
- **Node.js** >= 20.x & **NPM**
- **MySQL Database Server**

#### Langkah-langkah
```bash
# 1. Setup file environment
cp .env.example .env

# 2. Pasang dependensi PHP & JavaScript
composer install
npm install

# 3. Setup key, migrasi database, dan storage link
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 4. Jalankan server pengembangan
# Terminal 1: Backend
php artisan serve

# Terminal 2: Frontend
npm run dev
```

Aplikasi dapat diakses di: [http://localhost:8000](http://localhost:8000)

---

## Akun Login Pengujian

| Role | Username | Password / PIN | Deskripsi |
|---|---|---|---|
| **Superadmin (Admin Desa)** | `admin.desa` | `887201` | Akses analitik 6 bidang & ekspor 9 posyandu |
| **Petugas Puskesmas** | `petugas.puskesmas` | `889148` | Akses monitoring laporan bulanan kesehatan |
| **Ketua Posyandu** | `ketua.melati` | `528369` | Akses profil posyandu & rekap laporan 13 poin |
| **Kader Posyandu** | `kader.melati` | `466136` | Akses pencatatan 4 sasaran pemeriksaan & formulir |
| **Warga** | `warga.budi` | `123456` | Akses rapor kesehatan keluarga & kalkulator gizi |

---

## Indeks Dokumentasi Teknis

Semua berkas spesifikasi teknis dapat dibaca pada direktori [`docs/`](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/README.md):

- [Arsitektur Sistem (`docs/architecture.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/architecture.md)
- [Spesifikasi API Endpoint (`docs/api.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/api.md)
- [Skema Basis Data (`docs/database.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/database.md)
- [Kebutuhan Fungsional & Non-Fungsional (`docs/requirements.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/requirements.md)
- [Struktur Komponen UI (`docs/component.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/component.md)
- [Design System & UI Guidelines (`docs/design.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/design.md)
- [Sitemap & Navigasi (`docs/sitemap.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/sitemap.md)
- [Rencana Pengujian (`docs/testing.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/testing.md)
- [Panduan UX Copy & Labeling (`docs/ux-copy.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/ux-copy.md)
