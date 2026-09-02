# Sitemap & Navigation Architecture - Posyandu Loa Duri Ulu

## 1. Public Portal (Tanpa Login)
```text
/ (Beranda)
├── #profil (Profil 9 Posyandu Loa Duri Ulu)
│   ├── Detail Profil & Sarana Tiap Posyandu (Modal Popup)
│   ├── Struktur Organisasi & Pengurus
│   └── Peta Lokasi 9 Posyandu
├── #artikel (Pusat Edukasi & Artikel Kesehatan)
│   └── #detail-artikel?id={id} (Halaman Baca Artikel Lengkap)
├── #jadwal (Kalender Kegiatan Rutin Posyandu)
├── #kalkulator (Kalkulator Gizi & Kebutuhan Kalori)
│   ├── Kalkulator IMT Balita & Dewasa
│   └── Estimasi Kebutuhan Kalori Harian
├── #kontak (Kontak Darurat Ambulans, Bidan Desa, & Puskesmas)
└── #login (Portal Masuk Petugas, Kader, & Warga)
```

---

## 2. Protected Dashboard Portal (`#dashboard`)

### A. Role: Warga (`role:warga`)
```text
#dashboard
├── Rapor Kesehatan Keluarga
│   ├── Riwayat Tumbuh Kembang Balita
│   ├── Riwayat Pemeriksaan Ibu Hamil
│   └── Riwayat Pemeriksaan Lansia
├── Tambah Data Anggota Keluarga (Anak/Balita)
├── Ajukan Pengaduan Masyarakat (5 Bidang SPM)
└── Pengaturan Akun & Kata Sandi
```

### B. Role: Kader Posyandu (`role:kader`)
```text
#dashboard
├── Dashboard Utama & Statistik Cepat Posyandu
├── Pencatatan Pemeriksaan Kesehatan (Form & Draf)
│   ├── Sasaran Balita (Antropometri & Imunisasi)
│   ├── Sasaran Remaja (IMT & Tensi)
│   ├── Sasaran Ibu Hamil (LILA, Tensi, Anemia, KEK)
│   └── Sasaran Lansia (Tensi, Gula Darah, IMT)
├── Kelola Data Warga (Pendaftaran Warga & Reset Password)
├── Rekapitulasi Kegiatan & Data Umum Posyandu
├── Data Tambahan Individu (Ibu Hamil, Nifas, Kematian, Diare)
├── Kelola Referensi Makanan & Kalori
└── Tulis & Kelola Artikel Kesehatan
```

### C. Role: Ketua Posyandu (`role:ketua`)
```text
#dashboard
├── Hak Akses Penuh Kader (Pencatatan, Warga, Artikel, dll.)
└── Kelola Profil & Jadwal Posyandu Binaan
```

### D. Role: Petugas Puskesmas (`role:puskesmas`)
```text
#dashboard
└── Monitoring Rekapitulasi Kesehatan Terpadu 9 Posyandu
    ├── Laporan Gizi Balita & Stunting
    ├── Pemantauan Remaja
    ├── Pemantauan Ibu Hamil Risiko Tinggi
    └── Pemantauan Kesehatan Lansia
```

### E. Role: Superadmin / Pemerintah Desa (`role:superadmin`)
```text
#dashboard
├── Dashboard Analitik Desa (Mata Elang)
├── Pusat Layanan Pengaduan Masyarakat (Verifikasi & Disposisi)
├── Rekap Formulir Identifikasi SPM Desa (5 Bidang Non-Kesehatan)
├── Rekap & Ekspor Laporan Bulanan 9 Posyandu
└── Audit Seluruh Data Pemeriksaan Kesehatan
```
