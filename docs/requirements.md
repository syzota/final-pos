# System Requirements & Specifications - Posyandu Loa Duri Ulu

## 1. Project Overview
Website Posyandu Loa Duri Ulu merupakan platform digital terpadu untuk pelayanan kesehatan masyarakat desa, mencakup pencatatan pemeriksaan rutin 9 posyandu, pelaporan bidang non-kesehatan (Standar Pelayanan Minimal Desa), edukasi gizi & artikel, jadwal posyandu, kalkulator gizi, serta sistem pengaduan masyarakat.

---

## 2. User Personas & Roles

| Role | Deskripsi & Hak Akses |
|---|---|
| **Publik / Warga Tamu** | Melihat profil posyandu, membaca artikel kesehatan, melihat jadwal posyandu, menggunakan kalkulator kesehatan, melihat kontak darurat. |
| **Warga Terdaftar** | Login dengan NIK/Akun, melihat buku rapor kesehatan keluarga (anak, ibu hamil, lansia), mengajukan pengaduan warga & formulir SPM. |
| **Kader Posyandu** | Mencatat pemeriksaan bulanan (Balita, Remaja, Ibu Hamil, Lansia), mengelola draf pemeriksaan, mencatat kegiatan posyandu, mengunggah dokumentasi. |
| **Ketua Posyandu** | Mengelola profil posyandu binaannya, mengedit susunan pengurus dan jadwal kegiatan, verifikasi pencatatan kesehatan kader. |
| **Petugas Puskesmas** | Akses read-only terhadap data kesehatan 9 posyandu untuk keperluan audit medis dan monitoring gizi lintas wilayah desa. |
| **Superadmin (Pemerintah Desa)** | Dashboard analitik desa (mata elang), monitoring pengaduan masyarakat 5 bidang SPM, manajemen posyandu dan ekspor data laporan. |

---

## 3. Functional Requirements (FR)

### FR-01: Public Portal
- FR-01.1: Beranda informatif dengan ringkasan posyandu, akses cepat, dan artikel terkini.
- FR-01.2: Profil 9 Posyandu Loa Duri Ulu lengkap dengan kontak, pengurus, dan peta lokasi.
- FR-01.3: Jadwal kegiatan posyandu dengan filter posyandu dan status tanggal.
- FR-01.4: Kalkulator gizi (IMT Balita/Dewasa, Kebutuhan Kalori Harian, dan Estimasi Makanan).
- FR-01.5: Portal Artikel Kesehatan dengan filter kategori dan pencarian.

### FR-02: Authentication & Authorization
- FR-02.1: Login berbasis Laravel Sanctum Token dengan session persistence (`localStorage`).
- FR-02.2: Role-based access control (RBAC) via middleware `role:kader,ketua,superadmin,puskesmas,warga`.
- FR-02.3: Manajemen ubah password mandiri dan reset password warga oleh kader.

### FR-03: Pencatatan Kesehatan & Rekapitulasi
- FR-03.1: Form pemeriksaan Balita, Remaja, Ibu Hamil, dan Lansia dengan mode Draf & Final.
- FR-03.2: Multi-upload foto dokumentasi kegiatan (maks 5 foto @ 2MB).
- FR-03.3: Integrasi riwayat pemeriksaan ke Rapor Kesehatan Keluarga warga.

### FR-04: Pengaduan & Identifikasi 5 Bidang Non-Kesehatan
- FR-04.1: Pengajuan pengaduan masyarakat pada bidang: Pendidikan, PU, Perumahan Rakyat, Trantibumlinmas, Sosial.
- FR-04.2: Pelacakan status pengaduan (menunggu, diproses, selesai) dan tindak lanjut oleh perangkat desa.

---

## 4. Non-Functional Requirements (NFR)
- **NFR-01 (Performance)**: First Contentful Paint < 1.2 detik, loading interaksi < 200ms.
- **NFR-02 (Mobile Responsiveness)**: 100% responsif pada viewport mulai dari 320px hingga 4K display.
- **NFR-03 (Security)**: Proteksi CSRF, sanitasi input, password hashing BCRYPT rounds 12, token Sanctum bearer.
- **NFR-04 (Compatibility)**: Kompatibel dengan semua browser modern (Chromium, Firefox, Safari, Edge).
