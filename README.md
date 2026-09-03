# Web Posyandu Desa Loa Duri Ulu
**Program Pengabdian Masyarakat 2026 — Kutai Kartanegara**

Aplikasi Web Terpadu dan Sistem Informasi Pelayanan Posyandu untuk 9 Posyandu di Desa Loa Duri Ulu berbasis **Laravel** (RESTful API) dan **React SPA** (Vite).

---

## Daftar Isi
- [Struktur Folder Repositori](#struktur-folder-repositori)
- [Pilihan Cara Menjalankan Aplikasi](#pilihan-cara-menjalankan-aplikasi)
  - [Opsi A: Menggunakan Docker (Sangat Direkomendasikan)](#opsi-a-menggunakan-docker-sangat-direkomendasikan)
  - [Opsi B: Menjalankan Secara Manual / Lokal (Native)](#opsi-b-menjalankan-secara-manual--lokal-native)
- [Akses Layanan & Port URL](#akses-layanan--port-url)
- [Daftar Akun Login Uji Coba](#daftar-akun-login-uji-coba)
- [Dokumentasi Lengkap Proyek](#dokumentasi-lengkap-proyek)
- [Troubleshooting / Solusi Kendala Umum](#troubleshooting--solusi-kendala-umum)

---

## Struktur Folder Repositori

```text
Revisi/
├── database/                   # Dump SQL database & berkas kredensial
│   ├── (KREDENSIAL) Password Akun Posyandu Loa Duri Ulu.xlsx
│   ├── posyandu_db.sql         # Dump SQL basis data terbaru
│   └── posyandu_db old.sql     # Cadangan dump SQL sebelumnya
│
├── final-pos/                  # Source code aplikasi web utama
│   ├── app/                    # Controller, Models, Middleware API
│   ├── docker/                 # Konfigurasi Nginx, PHP, dan entrypoint Docker
│   ├── docs/                   # 9 Berkas Dokumentasi & Spesifikasi Teknis
│   ├── public/                 # Asset publik dan bundle frontend
│   ├── resources/              # Kode sumber React SPA (Pages, Components, Styles)
│   ├── routes/                 # Rute Laravel (api.php & web.php)
│   ├── Dockerfile              # Definisi container image aplikasi
│   ├── docker-compose.yml      # Konfigurasi Docker Compose lokal app
│   ├── .env.docker             # Template environment siap pakai untuk Docker
│   ├── .env.example            # Template environment untuk lokal native
│   └── package.json & composer.json
│
├── docker-compose.yml          # Konfigurasi Docker Compose tingkat root workspace
└── README.md                   # Dokumentasi panduan utama ini
```

---

## Pilihan Cara Menjalankan Aplikasi

---

### Opsi A: Menggunakan Docker (Sangat Direkomendasikan)

Dengan Docker, Anda **tidak perlu menginstal PHP, Composer, Node.js, atau MySQL secara manual** di komputer Anda. Cukup pastikan **Docker Desktop** sudah terpasang dan berjalan.

#### 1. Buka Terminal di Folder Utama (`Revisi/`)

#### 2. Jalankan Seluruh Container Docker
```bash
docker compose up -d --build
```
> *Perintah ini akan otomatis menyalakan container PHP 8.3 FPM, Web Server Nginx, MySQL 8.0, dan phpMyAdmin. Database `posyandu_db.sql` akan di-import secara otomatis saat pertama kali container dibuat.*

#### 3. Inisialisasi Aplikasi (Hanya Dilakukan Pertama Kali)
Jalankan rangkaian perintah setup berikut:
```bash
# 1. Generate Application Key Laravel
docker compose exec app php artisan key:generate

# 2. Setup database (migrasi & seeder akun)
docker compose exec app php artisan migrate --seed

# 3. Hubungkan penyimpanan storage publik (foto & berkas)
docker compose exec app php artisan storage:link

# 4. Pasang paket npm & build asset frontend
docker compose exec app npm install
docker compose exec app npm run build
```

#### 4. Aplikasi Siap Digunakan!
Buka peramban (browser) dan akses:
- 🌐 **Web Posyandu:** [http://localhost:8000](http://localhost:8000)
- 🗄️ **phpMyAdmin:** [http://localhost:8081](http://localhost:8081)

#### 5. Perintah Manajemen Docker yang Sering Digunakan
```bash
# Melihat log aktivitas container
docker compose logs -f

# Masuk ke dalam terminal container Laravel
docker compose exec app bash

# Menghentikan container sementara
docker compose stop

# Menghentikan & menghapus container
docker compose down
```

---

### Opsi B: Menjalankan Secara Manual / Lokal (Native)

Gunakan opsi ini jika Anda ingin menjalankan langsung di sistem lokal Anda (misal: menggunakan XAMPP, Laragon, atau PHP native).

#### Prasyarat Lingkungan Lokal
- **PHP** >= 8.3 (dengan ekstensi `pdo_mysql`, `mbstring`, `gd`, `zip`, `bcmath`, `fileinfo`)
- **Composer** >= 2.x
- **Node.js** >= 20.x & **NPM**
- **MySQL Database Server** (XAMPP / Laragon / MariaDB)

#### Langkah-langkah:

1. **Masuk ke folder aplikasi `final-pos`:**
   ```bash
   cd final-pos
   ```

2. **Salin berkas konfigurasi `.env`:**
   ```bash
   cp .env.example .env
   ```

3. **Sesuaikan kredensial database di berkas `.env`:**
   Buka berkas `.env` dan sesuaikan koneksi database Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=posyandu_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Buat Database di MySQL:**
   - Buat database baru bernama `posyandu_db` melalui phpMyAdmin lokal atau CLI MySQL.
   - *(Opsional)* Anda dapat mengimpor file `database/posyandu_db.sql` ke database `posyandu_db`.

5. **Pasang Dependensi Backend & Frontend:**
   ```bash
   # Dependensi PHP
   composer install

   # Dependensi JavaScript / React
   npm install
   ```

6. **Generate Key, Migrasi, & Storage Link:**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```

7. **Jalankan Server Aplikasi:**
   Buka dua jendela terminal terpisah:
   ```bash
   # Terminal 1 — Menjalankan Backend Laravel
   php artisan serve

   # Terminal 2 — Menjalankan Frontend Vite Dev Server
   npm run dev
   ```

8. **Buka Aplikasi di Browser:**
   Akses [http://localhost:8000](http://localhost:8000)

---

## Akses Layanan & Port URL

| Layanan | URL / Endpoint | Keterangan |
|---|---|---|
| **Web Utama Posyandu** | [http://localhost:8000](http://localhost:8000) | Antarmuka publik & dashboard aplikasi |
| **phpMyAdmin (Docker)** | [http://localhost:8081](http://localhost:8081) | Panel manajemen MySQL (User: `posyandu_user`, Pass: `posyandu_pass` atau Root: `root_password`) |
| **MySQL Server** | `localhost:3306` | Host database server |

---

## Daftar Akun Login Uji Coba

Gunakan akun-akun berikut untuk menguji 5 tingkatan hak akses pada halaman **Masuk Petugas / Warga** (`#login`):

| Tingkatan Role | Username / ID | Password / PIN | Cakupan Akses |
|---|---|---|---|
| **Admin Desa (Superadmin)** | `admin.desa` | `887201` | Dashboard Analitik 6 Bidang, Rekapitulasi & Ekspor Gabungan 9 Posyandu, Manajemen Aspirasi Warga. |
| **Petugas Puskesmas** | `petugas.puskesmas` | `889148` | Monitoring Laporan Bulanan Kesehatan & Rekapitulasi Pemeriksaan 9 Posyandu. |
| **Ketua Posyandu** | `ketua.melati` | `528369` | Profil & Sarana Posyandu, Laporan 13 Poin Kegiatan, Kelola Data Warga & Makanan. |
| **Kader Posyandu** | `kader.melati` | `466136` | Pencatatan Pemeriksaan 4 Sasaran (Balita, Remaja, Ibu Hamil, Lansia), Rekap Bulanan, Formulir Non-Kesehatan. |
| **Warga Terdaftar** | `warga.budi` | `123456` | Rapor Kesehatan Keluarga Mandiri, Riwayat Tumbuh Kembang, Kalkulator Gizi. |

> *Catatan: Akun untuk 8 posyandu lainnya (Rukun Lestari, Mawar, Bina Putra, Nusa Indah, Cempaka, Tunas Mulya, Surya, Terkini) dapat dilihat pada berkas `database/(KREDENSIAL) Password Akun Posyandu Loa Duri Ulu.xlsx`.*

---

## Dokumentasi Lengkap Proyek

Seluruh spesifikasi teknis dan panduan arsitektur sistem tersusun rapi di folder [`final-pos/docs/`](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/README.md):

- 📐 [Arsitektur Sistem (`architecture.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/architecture.md)
- 🔌 [Spesifikasi API Endpoint (`api.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/api.md)
- 🗄️ [Struktur Basis Data & Relasi (`database.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/database.md)
- 📋 [Kebutuhan Fungsional & Non-Fungsional (`requirements.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/requirements.md)
- 🧩 [Struktur Komponen Frontend (`component.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/component.md)
- 🎨 [Design System & UI Guidelines (`design.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/design.md)
- 🗺️ [Peta Situs Navigasi (`sitemap.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/sitemap.md)
- 🧪 [Rencana Pengujian (`testing.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/testing.md)
- ✍️ [Standarisasi Teks UX (`ux-copy.md`)](file:///f:/Pengabdian%20Masyarakat%202026/Web/Revisi/final-pos/docs/ux-copy.md)

---

## Troubleshooting / Solusi Kendala Umum

1. **Port 8000 atau 3306 sudah terpakai oleh aplikasi lain (misal XAMPP/Apache):**
   - Matikan service Apache/MySQL di control panel XAMPP Anda sebelum menjalankan `docker compose up`, atau
   - Ubah mapping port di `docker-compose.yml` (misal `"8080:80"` untuk web).

2. **Foto/Aset Upload tidak muncul:**
   - Pastikan perintah `php artisan storage:link` (atau `docker compose exec app php artisan storage:link`) telah dijalankan.

3. **Perubahan style frontend tidak tampil:**
   - Jalankan `npm run build` (atau `docker compose exec app npm run build`) untuk memperbarui asset produksi.
