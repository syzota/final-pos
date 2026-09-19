# Component Inventory & Interface Specification - Posyandu Loa Duri Ulu

## 1. Common Components (`resources/js/components/common/`)

### `Header.jsx`
- **Tujuan**: Navigasi utama portal publik dengan menu responsif mobile drawer.
- **Props**: `activePage: string`, `onNavigate: (page: string) => void`, `onDarurat: () => void`.
- **Fitur**: Highlight menu aktif, toggle mobile menu, tombol kontak darurat, tombol masuk akun.

### `Footer.jsx`
- **Tujuan**: Footer terstandarisasi dengan identitas Desa Loa Duri Ulu, peta pintas, media sosial, dan hak cipta.
- **Props**: Tidak ada (statik mandiri).
- **Fitur**: Rata kiri teks copyright, link media sosial (Instagram, Facebook, WhatsApp Desa).

### `MobileNav.jsx`
- **Tujuan**: Bottom navigation bar untuk kemudahan akses jempol pada layar mobile (< 768px).
- **Props**: `activePage: string`, `onNavigate: (page: string) => void`.

### `KontakDaruratModal.jsx`
- **Tujuan**: Dialog modal popup berisi nomor telepon cepat Ambulans Desa, Bidan Desa, Puskesmas, dan Call Center Darurat.
- **Props**: `isOpen: boolean`, `onClose: () => void`.
- **Fitur**: Body scroll lock saat terbuka (`overflow: hidden`), tombol cepat panggil langsung (`tel:`).

### `Skeleton.jsx`
- **Tujuan**: Placeholder loading skeleton efek shimmer.
- **Props**: `type: string`, `width?: string|number`, `height?: string|number`, `rows?: number`.

---

## 2. Public Components (`resources/js/components/beranda/` & `profil/`)

### `WelcomeBanner.jsx`
- **Tujuan**: Hero section beranda dengan background foto lokal Loa Duri, tipografi kuat, dan CTA aksi cepat.

### `FeatureCards.jsx`
- **Tujuan**: 4 Card akses cepat (Jadwal, Edukasi Gizi, Rapor Keluarga, Kontak Darurat) dengan touch target > 44px.

### `ArticleCard.jsx`
- **Tujuan**: Grid artikel edukasi kesehatan terbaru dengan layout modern, tag kategori, penulis, dan tombol "Lihat Semua Artikel" di bagian bawah.

### `PosyanduLocationsSection.jsx`
- **Tujuan**: Daftar 9 posyandu dengan badge warna, info kontak pengurus, dan trigger modal detail sarana.

---

## 3. Operational Dashboard Components (`resources/js/components/dashboard/`)

### `DashboardHome.jsx`
- **Tujuan**: Beranda analitik posyandu dengan susunan Bento Grid 4x4 compact untuk metrik utama (Total Sasaran, Pemeriksaan Bulan Ini, Status Gizi Normal, dan Pengaduan).

### `KesehatanView.jsx`
- **Tujuan**: Modul utama pencatatan kesehatan (Balita, Remaja, Ibu Hamil, Lansia) dengan selector dropdown sasaran hemat ruang dan manajemen draf.

### `PengaduanView.jsx`
- **Tujuan**: Formulir pengaduan masyarakat 5 bidang dan rekap riwayat laporan dengan filter status.

### `KelolaWargaView.jsx`
- **Tujuan**: Manajemen data kepala keluarga, anak, dan akun warga dengan input pencarian jelas dan aksi reset password.
