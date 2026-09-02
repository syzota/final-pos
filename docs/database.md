# Database Schema & Entity Relationship - Posyandu Loa Duri Ulu

## 1. Entity Overview

Database `posyandu_db` dirancang untuk mengelola ekosistem Posyandu Loa Duri Ulu secara komprehensif.

---

## 2. Table Catalog & Schema Definitions

### 1. `posyandus`
Menyimpan data master 9 posyandu di Desa Loa Duri Ulu.
- `id` (BIGINT, PK, Auto Increment)
- `nama` (VARCHAR(100)) — Contoh: Melati, Mawar, Anggrek
- `alamat` (VARCHAR(255))
- `tanggal_kegiatan` (INT) — Tanggal buka rutin setiap bulan (1-31)
- `ketua` (VARCHAR(100))
- `sekretaris` (VARCHAR(100))
- `bendahara` (VARCHAR(100))
- `no_telp` (VARCHAR(20))
- `latitude` (DECIMAL(10,8))
- `longitude` (DECIMAL(11,8))
- `sarana_prasarana` (JSON)
- `timestamps`

### 2. `users`
Menyimpan akun pengguna sistem (warga, kader, ketua, puskesmas, superadmin).
- `id` (BIGINT, PK, Auto Increment)
- `name` (VARCHAR(255))
- `username` (VARCHAR(100), Unique)
- `email` (VARCHAR(255), Nullable)
- `password` (VARCHAR(255), Hashed)
- `role` (ENUM: 'warga', 'kader', 'ketua', 'puskesmas', 'superadmin')
- `posyandu_id` (BIGINT, FK ke `posyandus.id`, Nullable)
- `posyandu` (VARCHAR(100), Nullable - Legacy name cache)
- `timestamps`

### 3. `artikel`
Menyimpan artikel edukasi kesehatan dan berita posyandu.
- `id` (BIGINT, PK, Auto Increment)
- `posyandu_id` (BIGINT, FK ke `posyandus.id`, Nullable)
- `penulis_id` (BIGINT, FK ke `users.id`)
- `kategori` (VARCHAR(100))
- `judul` (VARCHAR(255))
- `slug` (VARCHAR(255), Unique)
- `isi_artikel` (LONGTEXT)
- `path_foto` (VARCHAR(255), Nullable)
- `status` (ENUM: 'draf', 'dipublikasikan')
- `published_at` (TIMESTAMP, Nullable)
- `timestamps`

### 4. `pemeriksaan_balita`
Data pemeriksaan antropometri balita.
- `id` (BIGINT, PK, Auto Increment)
- `anak_id` (BIGINT, FK ke `warga_anak.id`)
- `kader_id` (BIGINT, FK ke `users.id`)
- `tanggal_periksa` (DATE)
- `umur_bulan` (INT)
- `berat_badan` (DECIMAL(5,2))
- `tinggi_badan` (DECIMAL(5,2))
- `lingkar_kepala` (DECIMAL(5,2), Nullable)
- `lingkar_lengan` (DECIMAL(5,2), Nullable)
- `status_gizi` (VARCHAR(100), Nullable)
- `catatan_perkembangan` (TEXT, Nullable)
- `imunisasi` (JSON, Nullable)
- `status_form` (ENUM: 'draft', 'final')
- `dokumentasi_foto` (JSON, Nullable)
- `timestamps`

### 5. `pemeriksaan_remajas`
Data pemeriksaan kesehatan remaja (10-18 tahun).
- `id` (BIGINT, PK, Auto Increment)
- `remaja_id` (BIGINT, FK ke `warga_remajas.id`)
- `kader_id` (BIGINT, FK ke `users.id`)
- `tanggal_periksa` (DATE)
- `umur_tahun` (INT)
- `berat_badan` (DECIMAL(5,2))
- `tinggi_badan` (DECIMAL(5,2))
- `tekanan_darah` (VARCHAR(50), Nullable)
- `status_imt` (VARCHAR(50), Nullable)
- `status_form` (ENUM: 'draft', 'final')
- `dokumentasi_foto` (JSON, Nullable)
- `timestamps`

### 6. `pemeriksaan_hamils`
Data pemeriksaan ibu hamil.
- `id` (BIGINT, PK, Auto Increment)
- `ibu_id` (BIGINT, FK ke `warga_dewasas.id`)
- `kader_id` (BIGINT, FK ke `users.id`)
- `tanggal_periksa` (DATE)
- `usia_kehamilan_minggu` (INT)
- `berat_badan` (DECIMAL(5,2))
- `tinggi_badan` (DECIMAL(5,2))
- `tekanan_darah` (VARCHAR(50), Nullable)
- `lingkar_perut` (DECIMAL(5,2), Nullable)
- `lingkar_lengan` (DECIMAL(5,2), Nullable)
- `status_kek` (ENUM: 'Ya', 'Tidak')
- `anemia` (ENUM: 'Ya', 'Tidak')
- `status_imt` (VARCHAR(50), Nullable)
- `status_form` (ENUM: 'draft', 'final')
- `dokumentasi_foto` (JSON, Nullable)
- `timestamps`

### 7. `pemeriksaan_lansias`
Data pemeriksaan kesehatan lansia (> 60 tahun).
- `id` (BIGINT, PK, Auto Increment)
- `lansia_id` (BIGINT, FK ke `warga_dewasas.id`)
- `kader_id` (BIGINT, FK ke `users.id`)
- `tanggal_periksa` (DATE)
- `berat_badan` (DECIMAL(5,2))
- `tinggi_badan` (DECIMAL(5,2))
- `lingkar_pinggang` (DECIMAL(5,2), Nullable)
- `tekanan_darah` (VARCHAR(50), Nullable)
- `tensi` (ENUM: 'Rendah', 'Normal', 'Tinggi', Nullable)
- `gula_darah` (INT, Nullable)
- `nadi` (INT, Nullable)
- `status_imt` (VARCHAR(50), Nullable)
- `status_form` (ENUM: 'draft', 'final')
- `dokumentasi_foto` (JSON, Nullable)
- `timestamps`

### 8. `pengaduan_masyarakat`
Data pengaduan masyarakat untuk 5 bidang Standar Pelayanan Minimal Desa.
- `id` (BIGINT, PK, Auto Increment)
- `posyandu_id` (BIGINT, FK ke `posyandus.id`, Nullable)
- `bidang` (ENUM: 'pendidikan', 'pekerjaan_umum', 'perumahan_rakyat', 'trantibumlinmas', 'sosial')
- `nama_pelapor` (VARCHAR(255))
- `jenis_kelamin` (ENUM: 'L', 'P')
- `nik` (CHAR(16))
- `no_hp` (VARCHAR(20), Nullable)
- `alamat` (TEXT)
- `isi_keluhan` (TEXT)
- `lokasi_masalah` (VARCHAR(255), Nullable)
- `lampiran` (JSON, Nullable)
- `status` (ENUM: 'menunggu', 'diproses', 'selesai')
- `timestamps`

### 9. `formulir_identifikasi`
Pencatatan data survei & identifikasi 5 bidang non-kesehatan oleh kader.
- `id` (BIGINT, PK, Auto Increment)
- `posyandu_id` (BIGINT, FK ke `posyandus.id`)
- `kader_id` (BIGINT, FK ke `users.id`)
- `bidang` (VARCHAR(100))
- `sub_bidang` (VARCHAR(100))
- `data_formulir` (JSON)
- `dokumentasi_foto` (JSON, Nullable)
- `timestamps`
