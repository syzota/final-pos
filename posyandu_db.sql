-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 27, 2026 at 03:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `posyandu_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `artikel`
--

CREATE TABLE `artikel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED DEFAULT NULL,
  `penulis_id` bigint(20) UNSIGNED NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `isi_artikel` longtext NOT NULL,
  `path_foto` varchar(255) DEFAULT NULL,
  `status` enum('draf','dipublikasikan') NOT NULL DEFAULT 'draf',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `artikel`
--

INSERT INTO `artikel` (`id`, `posyandu_id`, `penulis_id`, `kategori`, `judul`, `slug`, `isi_artikel`, `path_foto`, `status`, `published_at`, `created_at`, `updated_at`) VALUES
(1, NULL, 6, 'Sosial', 'Puskesmas Loa Duri Gelar Workshop Kedua 25 Kompetensi Kader Posyandu di Desa Loa Duri Ulu', 'puskesmas-loa-duri-gelar-workshop-kedua-25-kompetensi-kader-posyandu-di-desa-loa-duri-ulu-1787797567', 'Loa Janan – Puskesmas Loa Duri kembali menggelar kegiatan Workshop 25 Kompetensi Keterampilan Kader Posyandu, kali ini diadakan di Desa Loa Duri Ulu pada Senin, 25 Agustus 2025. Workshop ini merupakan lanjutan dari kegiatan serupa yang sebelumnya sukses digelar di Desa Loa Duri Ilir.\r\n\r\nAcara ini diikuti oleh para kader posyandu Desa Loa Duri Ulu yang hadir dengan penuh antusias untuk meningkatkan kapasitas dan keterampilan mereka dalam memberikan pelayanan kesehatan dasar kepada masyarakat.\r\n\r\nHadir mewakili Camat Loa Janan, Bapak Didi Haryanto selaku Kepala Seksi Kesejahteraan Sosial Kecamatan Loa Janan, yang menyampaikan apresiasi terhadap terselenggaranya workshop ini. Dalam sambutannya, beliau menekankan peran penting kader posyandu sebagai garda terdepan dalam pelayanan kesehatan masyarakat.\r\n\r\nWorkshop kedua ini membahas secara lebih mendalam 25 kompetensi dasar kader posyandu, di antaranya keterampilan menimbang bayi dan balita, mengukur tinggi badan, mencatat perkembangan kesehatan, konseling ibu hamil, pemantauan gizi keluarga, serta penyuluhan perilaku hidup bersih dan sehat (PHBS).\r\n\r\nKepala Puskesmas Loa Duri menjelaskan bahwa kegiatan ini merupakan program berkelanjutan yang dirancang untuk memperkuat kapasitas kader posyandu di seluruh desa wilayah kerja Puskesmas Loa Duri. Diharapkan dengan adanya pelatihan ini, kader dapat lebih profesional dalam menjalankan tugasnya serta mampu menjadi perpanjangan tangan pemerintah dalam meningkatkan derajat kesehatan masyarakat.\r\n\r\nMasyarakat Desa Loa Duri Ulu menyambut positif kegiatan ini karena kader posyandu memiliki peran vital dalam memberikan pelayanan langsung kepada warga. Dengan meningkatnya kompetensi kader, diharapkan kualitas layanan kesehatan dasar dapat semakin baik, terutama bagi ibu dan balita yang menjadi kelompok prioritas.\r\n\r\nPemerintah Kecamatan Loa Janan memberikan dukungan penuh terhadap kegiatan workshop ini dan mendorong agar kegiatan serupa terus dilakukan secara berkala di desa-desa lain. Dengan kolaborasi antara pemerintah, tenaga kesehatan, dan masyarakat, cita-cita mewujudkan masyarakat yang sehat, mandiri, dan sejahtera dapat lebih mudah tercapai.', 'images/artikel/lC9ltzRg6K5fUk202it6JPlzldT9UBpkL7pLi8QD.jpg', 'dipublikasikan', '2026-08-27 02:26:07', '2026-08-27 02:26:07', '2026-08-27 02:26:07');

-- --------------------------------------------------------

--
-- Table structure for table `artikels`
--

CREATE TABLE `artikels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_tambahans`
--

CREATE TABLE `data_tambahans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `periode` varchar(7) NOT NULL,
  `ibu_hamil_total` int(11) NOT NULL DEFAULT 0,
  `ibu_hamil_periksa` int(11) NOT NULL DEFAULT 0,
  `ibu_hamil_risiko` int(11) NOT NULL DEFAULT 0,
  `nifas_total` int(11) NOT NULL DEFAULT 0,
  `nifas_vit_a` int(11) NOT NULL DEFAULT 0,
  `nifas_fe` int(11) NOT NULL DEFAULT 0,
  `kematian_ibu_hamil` int(11) NOT NULL DEFAULT 0,
  `kematian_ibu_bersalin` int(11) NOT NULL DEFAULT 0,
  `kematian_ibu_nifas` int(11) NOT NULL DEFAULT 0,
  `diare_total` int(11) NOT NULL DEFAULT 0,
  `diare_oralit` int(11) NOT NULL DEFAULT 0,
  `diare_rujuk` int(11) NOT NULL DEFAULT 0,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_tambahan_individu`
--

CREATE TABLE `data_tambahan_individu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `jenis` enum('ibu_hamil','nifas','kematian_nifas','diare') NOT NULL,
  `nama` varchar(255) NOT NULL,
  `umur` tinyint(3) UNSIGNED NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `detail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detail`)),
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_umums`
--

CREATE TABLE `data_umums` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `nama_posyandu` varchar(255) DEFAULT NULL,
  `rukun_warga` varchar(255) DEFAULT NULL,
  `desa` varchar(255) DEFAULT NULL,
  `kecamatan` varchar(255) DEFAULT NULL,
  `tahun` varchar(255) DEFAULT NULL,
  `bulan` varchar(255) DEFAULT NULL,
  `pengunjung_bayi` int(11) NOT NULL DEFAULT 0,
  `pengunjung_baduta` int(11) NOT NULL DEFAULT 0,
  `pengunjung_balita` int(11) NOT NULL DEFAULT 0,
  `pengunjung_wus` int(11) NOT NULL DEFAULT 0,
  `pengunjung_pus` int(11) NOT NULL DEFAULT 0,
  `pengunjung_ibu_hamil` int(11) NOT NULL DEFAULT 0,
  `pengunjung_ibu_menyusui` int(11) NOT NULL DEFAULT 0,
  `bayi_lahir` int(11) NOT NULL DEFAULT 0,
  `bayi_meninggal` int(11) NOT NULL DEFAULT 0,
  `mati_ibu_hamil_salin_nifas` int(11) NOT NULL DEFAULT 0,
  `petugas_kader` int(11) NOT NULL DEFAULT 0,
  `petugas_plkb` int(11) NOT NULL DEFAULT 0,
  `petugas_medis` int(11) NOT NULL DEFAULT 0,
  `nifas_fe` int(11) NOT NULL DEFAULT 0,
  `nifas_vit_a` int(11) NOT NULL DEFAULT 0,
  `hamil_kek` int(11) NOT NULL DEFAULT 0,
  `hamil_anemia` int(11) NOT NULL DEFAULT 0,
  `pengunjung_l` int(11) NOT NULL DEFAULT 0,
  `pengunjung_p` int(11) NOT NULL DEFAULT 0,
  `jml_kk` int(11) NOT NULL DEFAULT 0,
  `jml_ibu_melahirkan` int(11) NOT NULL DEFAULT 0,
  `mati_ibu_hamil` int(11) NOT NULL DEFAULT 0,
  `mati_ibu_melahirkan` int(11) NOT NULL DEFAULT 0,
  `mati_ibu_nifas` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumentasi_foto`
--

CREATE TABLE `dokumentasi_foto` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `imageable_type` varchar(255) NOT NULL,
  `imageable_id` bigint(20) UNSIGNED NOT NULL,
  `path_foto` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `formulir_identifikasi`
--

CREATE TABLE `formulir_identifikasi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `kader_id` bigint(20) UNSIGNED NOT NULL,
  `bidang` enum('pendidikan','pekerjaan_umum','perumahan_rakyat','trantibumlinmas','sosial') NOT NULL,
  `sub_bidang` varchar(255) NOT NULL,
  `data_formulir` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data_formulir`)),
  `dokumentasi_foto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi_foto`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `imunisasi_anak`
--

CREATE TABLE `imunisasi_anak` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pemeriksaan_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_vaksin` varchar(255) NOT NULL,
  `status` enum('diberikan','ditunda','dirujuk') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `keterangan_waktu` varchar(255) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id`, `posyandu_id`, `keterangan_waktu`, `catatan`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tanggal 3', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(2, 2, 'Tanggal 4', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(3, 3, 'Tanggal 6', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(4, 4, 'Tanggal 9', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(5, 5, 'Tanggal 10', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(6, 6, 'Tanggal 12', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(7, 7, 'Tanggal 14', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(8, 8, 'Tanggal 16', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01'),
(9, 9, 'Tanggal 19', 'Jadwal rutin Posyandu setiap bulan', '2026-08-27 02:23:01', '2026-08-27 02:23:01');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kontak_darurat`
--

CREATE TABLE `kontak_darurat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_layanan` varchar(255) NOT NULL,
  `jenis` enum('ambulans','rumah_sakit','bidan') NOT NULL,
  `no_telepon` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kontak_darurat`
--

INSERT INTO `kontak_darurat` (`id`, `nama_layanan`, `jenis`, `no_telepon`, `created_at`, `updated_at`) VALUES
(1, 'Ambulance Desa Loa Duri Ulu', 'ambulans', '081250221210', '2026-08-26 07:57:31', '2026-08-26 07:57:31');

-- --------------------------------------------------------

--
-- Table structure for table `laporan_posyandu`
--

CREATE TABLE `laporan_posyandu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `jenis_laporan` enum('bulanan_puskesmas','bulanan_desa','triwulan') NOT NULL,
  `bulan` tinyint(4) NOT NULL,
  `tahun` year(4) NOT NULL,
  `data_rekap` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data_rekap`)),
  `status` enum('draf','siap_dilaporkan','terkirim') NOT NULL DEFAULT 'draf',
  `dikoreksi_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `dikoreksi_pada` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0000_00_00_000000_create_posyandus_table', 1),
(2, '0001_01_01_000000_create_users_table', 1),
(3, '0001_01_01_000001_create_cache_table', 1),
(4, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_08_06_093654_create_personal_access_tokens_table', 1),
(6, '2026_08_06_094038_create_artikels_table', 1),
(7, '2026_08_06_112755_create_pengurus_table', 1),
(8, '2026_08_06_112756_create_jadwal_table', 1),
(9, '2026_08_06_112757_create_kontak_darurat_table', 1),
(10, '2026_08_06_112758_create_warga_keluarga_table', 1),
(11, '2026_08_06_112759_create_warga_anak_table', 1),
(12, '2026_08_06_112800_create_pemeriksaan_balita_table', 1),
(13, '2026_08_06_112801_create_imunisasi_anak_table', 1),
(14, '2026_08_06_112802_create_pengaduan_masyarakat_table', 1),
(15, '2026_08_06_112803_create_formulir_identifikasi_table', 1),
(16, '2026_08_06_112804_create_artikel_table', 1),
(17, '2026_08_06_112805_create_referensi_makanan_table', 1),
(18, '2026_08_06_112806_create_dokumentasi_foto_table', 1),
(19, '2026_08_06_112807_create_laporan_posyandu_table', 1),
(20, '2026_08_07_135659_add_columns_to_users_table', 1),
(21, '2026_08_07_135957_alter_role_column_in_users_table', 1),
(22, '2026_08_07_183818_add_columns_to_pemeriksaan_balita_table', 1),
(23, '2026_08_08_082829_create_warga_remajas_table', 1),
(24, '2026_08_08_082919_create_pemeriksaan_remajas_table', 1),
(25, '2026_08_08_085840_create_warga_dewasas_table', 1),
(26, '2026_08_08_085920_create_pemeriksaan_hamils_table', 1),
(27, '2026_08_08_090807_create_pemeriksaan_lansias_table', 1),
(28, '2026_08_09_104425_add_kolom_file_ke_pengaduan_dan_formulir', 1),
(29, '2026_08_15_215245_create_rekap_kegiatans_table', 2),
(30, '2026_08_16_001231_create_pencatatan_kegiatans_table', 2),
(31, '2026_08_16_004558_create_data_umums_table', 2),
(32, '2026_08_26_120000_create_data_tambahans_table', 3),
(33, '2026_08_26_121500_create_data_tambahan_individu_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemeriksaan_balita`
--

CREATE TABLE `pemeriksaan_balita` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `anak_id` bigint(20) UNSIGNED NOT NULL,
  `kader_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_periksa` date NOT NULL,
  `umur_bulan` int(11) NOT NULL,
  `berat_badan` decimal(5,2) NOT NULL,
  `tinggi_badan` decimal(5,2) NOT NULL,
  `lingkar_kepala` decimal(5,2) DEFAULT NULL,
  `lingkar_lengan` decimal(5,2) DEFAULT NULL,
  `catatan_perkembangan` text DEFAULT NULL,
  `status_gizi` varchar(255) DEFAULT NULL,
  `imunisasi` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imunisasi`)),
  `dokumentasi_foto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi_foto`)),
  `status_form` enum('draft','final') NOT NULL DEFAULT 'final',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemeriksaan_hamil`
--

CREATE TABLE `pemeriksaan_hamil` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ibu_id` bigint(20) UNSIGNED NOT NULL,
  `kader_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_periksa` date NOT NULL,
  `usia_kehamilan_minggu` int(11) NOT NULL,
  `berat_badan` decimal(5,2) NOT NULL,
  `tinggi_badan` decimal(5,2) NOT NULL,
  `tekanan_darah` varchar(255) DEFAULT NULL,
  `lingkar_perut` decimal(5,2) DEFAULT NULL,
  `lingkar_lengan` decimal(5,2) DEFAULT NULL,
  `status_kek` enum('Ya','Tidak') NOT NULL DEFAULT 'Tidak',
  `anemia` enum('Ya','Tidak') NOT NULL DEFAULT 'Tidak',
  `status_imt` varchar(255) DEFAULT NULL,
  `dokumentasi_foto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi_foto`)),
  `status_form` enum('draft','final') NOT NULL DEFAULT 'final',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemeriksaan_lansia`
--

CREATE TABLE `pemeriksaan_lansia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lansia_id` bigint(20) UNSIGNED NOT NULL,
  `kader_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_periksa` date NOT NULL,
  `berat_badan` decimal(5,2) NOT NULL,
  `tinggi_badan` decimal(5,2) NOT NULL,
  `lingkar_pinggang` decimal(5,2) DEFAULT NULL,
  `tekanan_darah` varchar(255) DEFAULT NULL,
  `tensi` enum('Rendah','Normal','Tinggi') NOT NULL DEFAULT 'Normal',
  `gula_darah` int(11) DEFAULT NULL,
  `nadi` int(11) DEFAULT NULL,
  `status_imt` varchar(255) DEFAULT NULL,
  `dokumentasi_foto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi_foto`)),
  `status_form` enum('draft','final') NOT NULL DEFAULT 'final',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemeriksaan_remaja`
--

CREATE TABLE `pemeriksaan_remaja` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `remaja_id` bigint(20) UNSIGNED NOT NULL,
  `kader_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal_periksa` date NOT NULL,
  `umur_tahun` int(11) NOT NULL,
  `berat_badan` decimal(5,2) NOT NULL,
  `tinggi_badan` decimal(5,2) NOT NULL,
  `tekanan_darah` varchar(255) DEFAULT NULL,
  `status_imt` varchar(255) DEFAULT NULL,
  `dokumentasi_foto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dokumentasi_foto`)),
  `status_form` enum('draft','final') NOT NULL DEFAULT 'final',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pencatatan_kegiatans`
--

CREATE TABLE `pencatatan_kegiatans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `nama_posyandu` varchar(255) DEFAULT NULL,
  `ketua_pelaksana` varchar(255) DEFAULT NULL,
  `ibu_hamil` int(11) NOT NULL DEFAULT 0,
  `ibu_hamil_periksa` int(11) NOT NULL DEFAULT 0,
  `ibu_hamil_fe` int(11) NOT NULL DEFAULT 0,
  `ibu_menyusui` int(11) NOT NULL DEFAULT 0,
  `kb_kondom` int(11) NOT NULL DEFAULT 0,
  `kb_pil` int(11) NOT NULL DEFAULT 0,
  `kb_suntik` int(11) NOT NULL DEFAULT 0,
  `skdn_s` int(11) NOT NULL DEFAULT 0,
  `skdn_k` int(11) NOT NULL DEFAULT 0,
  `skdn_d` int(11) NOT NULL DEFAULT 0,
  `skdn_n` int(11) NOT NULL DEFAULT 0,
  `skdn_bgm` int(11) NOT NULL DEFAULT 0,
  `bgm_l` int(11) NOT NULL DEFAULT 0,
  `bgm_p` int(11) NOT NULL DEFAULT 0,
  `vit_a` int(11) NOT NULL DEFAULT 0,
  `kms_keluar` int(11) NOT NULL DEFAULT 0,
  `fe_1` int(11) NOT NULL DEFAULT 0,
  `fe_2` int(11) NOT NULL DEFAULT 0,
  `pmt` int(11) NOT NULL DEFAULT 0,
  `hep_0_7` int(11) NOT NULL DEFAULT 0,
  `dpt_hb` int(11) NOT NULL DEFAULT 0,
  `polio_1` int(11) NOT NULL DEFAULT 0,
  `polio_2` int(11) NOT NULL DEFAULT 0,
  `polio_3` int(11) NOT NULL DEFAULT 0,
  `polio_4` int(11) NOT NULL DEFAULT 0,
  `campak` int(11) NOT NULL DEFAULT 0,
  `hep_1` int(11) NOT NULL DEFAULT 0,
  `hep_2` int(11) NOT NULL DEFAULT 0,
  `hep_3` int(11) NOT NULL DEFAULT 0,
  `tt_1` int(11) NOT NULL DEFAULT 0,
  `tt_2` int(11) NOT NULL DEFAULT 0,
  `diare_jml` int(11) NOT NULL DEFAULT 0,
  `diare_oralit` int(11) NOT NULL DEFAULT 0,
  `layanan_kesehatan` int(11) NOT NULL DEFAULT 0,
  `sosialisasi` int(11) NOT NULL DEFAULT 0,
  `bayi_kms` int(11) NOT NULL DEFAULT 0,
  `balita_imunisasi` int(11) NOT NULL DEFAULT 0,
  `balita_kurang_gizi` int(11) NOT NULL DEFAULT 0,
  `kematian_balita` int(11) NOT NULL DEFAULT 0,
  `signature_data` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaduan_masyarakat`
--

CREATE TABLE `pengaduan_masyarakat` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `bidang` enum('pendidikan','pekerjaan_umum','perumahan_rakyat','trantibumlinmas','sosial') NOT NULL,
  `nama_pelapor` varchar(255) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `nik` varchar(16) NOT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `alamat` text NOT NULL,
  `isi_keluhan` text NOT NULL,
  `lokasi_masalah` varchar(255) DEFAULT NULL,
  `status` enum('menunggu','diproses','selesai') NOT NULL DEFAULT 'menunggu',
  `lampiran` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`lampiran`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengurus`
--

CREATE TABLE `pengurus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 21, 'auth-token', '5dd492751970eb021c17d566f91295eb3c6c19bdcab6cf0ffcbd2687cb2010d7', '[\"*\"]', '2026-08-10 06:21:41', NULL, '2026-08-10 05:26:03', '2026-08-10 06:21:41'),
(4, 'App\\Models\\User', 6, 'auth-token', '3d604f881334fcdc5c9abeba1c1c38c1d4c1c08ee04622f08b3a1bc634ece9c4', '[\"*\"]', '2026-08-26 07:11:14', NULL, '2026-08-26 03:58:37', '2026-08-26 07:11:14'),
(5, 'App\\Models\\User', 6, 'auth-token', 'fc2b8e91c47aca325001f46f22a310845258da3515b13a89792afa5e9950793c', '[\"*\"]', '2026-08-26 07:15:53', NULL, '2026-08-26 07:12:01', '2026-08-26 07:15:53');

-- --------------------------------------------------------

--
-- Table structure for table `posyandus`
--

CREATE TABLE `posyandus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `alamat` text DEFAULT NULL,
  `no_telepon` varchar(255) DEFAULT NULL,
  `kontak_darurat` varchar(255) DEFAULT NULL,
  `link_gmaps` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `strata` varchar(255) DEFAULT 'Purnama',
  `program_terintegrasi` varchar(255) DEFAULT NULL,
  `pj_umum` varchar(255) DEFAULT NULL,
  `pj_operasional` varchar(255) DEFAULT NULL,
  `ketua_pelaksana` varchar(255) DEFAULT NULL,
  `sekretaris` varchar(255) DEFAULT NULL,
  `bendahara` varchar(255) DEFAULT NULL,
  `jml_kader_aktif` int(11) NOT NULL DEFAULT 0,
  `jml_kader_tidak_aktif` int(11) NOT NULL DEFAULT 0,
  `bidan_desa` varchar(255) DEFAULT NULL,
  `petugas_kb` varchar(255) DEFAULT NULL,
  `tempat_pelayanan` varchar(255) DEFAULT 'Gedung Sendiri',
  `timbangan` varchar(255) DEFAULT 'Tersedia',
  `buku_kia` varchar(255) DEFAULT 'Tersedia',
  `formulir_sip` varchar(255) DEFAULT 'Tersedia',
  `blanko_skdn` varchar(255) DEFAULT 'Tersedia',
  `ape` varchar(255) DEFAULT 'Tersedia',
  `sarana_lain` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posyandus`
--

INSERT INTO `posyandus` (`id`, `nama`, `alamat`, `no_telepon`, `kontak_darurat`, `link_gmaps`, `foto`, `strata`, `program_terintegrasi`, `pj_umum`, `pj_operasional`, `ketua_pelaksana`, `sekretaris`, `bendahara`, `jml_kader_aktif`, `jml_kader_tidak_aktif`, `bidan_desa`, `petugas_kb`, `tempat_pelayanan`, `timbangan`, `buku_kia`, `formulir_sip`, `blanko_skdn`, `ape`, `sarana_lain`, `created_at`, `updated_at`) VALUES
(1, 'Melati', 'Belakang Pos Polisi Loa Duri Ulu, Kabupaten Kutai Kartanegara, Kalimantan Timur', '08115567967', '082254785400', 'https://www.google.com/maps?q=-0.587910,117.061170', 'profil_posyandu/posyandu-melati.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:53', '2026-08-26 07:57:30'),
(2, 'Rukun Lestari', 'C353+X7V, Jl. Padat Karya, Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391', '08115567967', '082220917146', 'https://www.google.com/maps?q=-0.590050,117.053150', 'profil_posyandu/posyandu-rukun-lestari.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:54', '2026-08-26 07:57:30'),
(3, 'Mawar', 'Gintung RT 10, Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur', '08115567967', '081352749095', 'https://www.google.com/maps?q=-0.605280,117.048430', 'profil_posyandu/posyandu-mawar.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:55', '2026-08-26 07:57:30'),
(4, 'Bina Putra', 'Gg. Melati 6 No.5, Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391', '08115567967', '081350272329', 'https://www.google.com/maps?q=-0.591351,117.063864', 'profil_posyandu/posyandu-bina-putra.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:56', '2026-08-26 07:57:30'),
(5, 'Nusa Indah', 'Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391', '08115567967', '081254231480', 'https://www.google.com/maps?q=-0.588640,117.055510', 'profil_posyandu/posyandu-nusa-indah.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:56', '2026-08-26 07:57:30'),
(6, 'Cempaka', 'RT 17 Sei Pimping, Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur', '08115567967', NULL, 'https://www.google.com/maps?q=-0.575500,117.043630', 'profil_posyandu/posyandu-cempaka.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:57', '2026-08-26 07:57:30'),
(7, 'Tunas Mulia', 'Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391', '08115567967', NULL, 'https://www.google.com/maps?q=-0.587190,117.048890', 'profil_posyandu/posyandu-tunas-mulia.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:58', '2026-08-26 07:57:30'),
(8, 'Surya', 'RT 14 C3C5+542, Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391', '08115567967', '082137618893', 'https://www.google.com/maps?q=-0.579550,117.057760', 'profil_posyandu/posyandu-surya.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:44:59', '2026-08-26 07:57:31'),
(9, 'Terkini', 'Gg. Nangka, Loa Duri Ulu, Kec. Loa Janan, Kabupaten Kutai Kartanegara, Kalimantan Timur 75391', '08115567967', NULL, 'https://www.google.com/maps?q=-0.589430,117.061800', 'profil_posyandu/posyandu-terkini.png', 'Purnama', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'Gedung Sendiri', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', 'Tersedia', NULL, '2026-08-10 04:45:00', '2026-08-26 07:57:31');

-- --------------------------------------------------------

--
-- Table structure for table `referensi_makanan`
--

CREATE TABLE `referensi_makanan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_makanan` varchar(255) NOT NULL,
  `kalori_per_porsi` int(11) NOT NULL,
  `dibuat_oleh_posyandu` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referensi_makanan`
--

INSERT INTO `referensi_makanan` (`id`, `nama_makanan`, `kalori_per_porsi`, `dibuat_oleh_posyandu`, `created_at`, `updated_at`) VALUES
(2, 'Nasi putih matang (100 g)', 180, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(3, 'Nasi beras merah (100 g)', 149, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(4, 'Kentang segar (100 g)', 62, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(5, 'Singkong segar (100 g)', 154, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(6, 'Singkong kukus (100 g)', 153, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(7, 'Ubi jalar kuning segar (100 g)', 119, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(8, 'Tahu mentah (100 g)', 80, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(9, 'Tahu goreng (100 g)', 115, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(10, 'Tempe kedelai murni mentah (100 g)', 201, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(11, 'Tempe kedelai murni goreng (100 g)', 350, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(12, 'Telur ayam ras segar (100 g)', 154, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(13, 'Telur ayam kampung segar (100 g)', 174, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(14, 'Ikan kembung segar (100 g)', 111, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(15, 'Daging sapi kurus segar (100 g)', 174, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(16, 'Kangkung segar (100 g)', 28, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(17, 'Kangkung rebus (100 g)', 22, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(18, 'Bayam rebus (100 g)', 23, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(19, 'Wortel segar (100 g)', 36, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(20, 'Wortel rebus (100 g)', 28, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(21, 'Kacang panjang segar (100 g)', 31, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(22, 'Pepaya segar (100 g)', 46, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(23, 'Pisang ambon segar (100 g)', 108, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(24, 'Jeruk manis segar (100 g)', 45, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(25, 'Apel segar (100 g)', 58, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(26, 'Buah naga merah segar (100 g)', 71, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(27, 'Melon segar (100 g)', 37, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(28, 'Mangga segar (100 g)', 52, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31'),
(29, 'Nanas segar (100 g)', 40, NULL, '2026-08-26 07:57:31', '2026-08-26 07:57:31');

-- --------------------------------------------------------

--
-- Table structure for table `rekap_kegiatans`
--

CREATE TABLE `rekap_kegiatans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `kd_kec` varchar(255) DEFAULT NULL,
  `kd_desa` varchar(255) DEFAULT NULL,
  `rt` varchar(255) DEFAULT NULL,
  `no_posyandu` varchar(255) DEFAULT NULL,
  `bulan_pendataan` varchar(255) DEFAULT NULL,
  `jumlah` int(11) NOT NULL DEFAULT 0,
  `ibu_hamil_periksa` int(11) NOT NULL DEFAULT 0,
  `ibu_hamil_fe` int(11) NOT NULL DEFAULT 0,
  `ibu_menyusui` int(11) NOT NULL DEFAULT 0,
  `kb_kondom` int(11) NOT NULL DEFAULT 0,
  `kb_pil` int(11) NOT NULL DEFAULT 0,
  `kb_suntik` int(11) NOT NULL DEFAULT 0,
  `skdn_s` int(11) NOT NULL DEFAULT 0,
  `skdn_k` int(11) NOT NULL DEFAULT 0,
  `skdn_d` int(11) NOT NULL DEFAULT 0,
  `skdn_n` int(11) NOT NULL DEFAULT 0,
  `skdn_bgm` int(11) NOT NULL DEFAULT 0,
  `bgm_l` int(11) NOT NULL DEFAULT 0,
  `bgm_p` int(11) NOT NULL DEFAULT 0,
  `vit_a` int(11) NOT NULL DEFAULT 0,
  `kms_keluar` int(11) NOT NULL DEFAULT 0,
  `fe_1` int(11) NOT NULL DEFAULT 0,
  `fe_2` int(11) NOT NULL DEFAULT 0,
  `pmt` int(11) NOT NULL DEFAULT 0,
  `hep_0_7` int(11) NOT NULL DEFAULT 0,
  `bcg` int(11) NOT NULL DEFAULT 0,
  `dpt_1` int(11) NOT NULL DEFAULT 0,
  `dpt_2` int(11) NOT NULL DEFAULT 0,
  `dpt_3` int(11) NOT NULL DEFAULT 0,
  `polio_1` int(11) NOT NULL DEFAULT 0,
  `polio_2` int(11) NOT NULL DEFAULT 0,
  `polio_3` int(11) NOT NULL DEFAULT 0,
  `polio_4` int(11) NOT NULL DEFAULT 0,
  `campak` int(11) NOT NULL DEFAULT 0,
  `hep_1` int(11) NOT NULL DEFAULT 0,
  `hep_2` int(11) NOT NULL DEFAULT 0,
  `hep_3` int(11) NOT NULL DEFAULT 0,
  `tt_1` int(11) NOT NULL DEFAULT 0,
  `tt_2` int(11) NOT NULL DEFAULT 0,
  `diare_jml` int(11) NOT NULL DEFAULT 0,
  `diare_oralit` int(11) NOT NULL DEFAULT 0,
  `sosialisasi` int(11) NOT NULL DEFAULT 0,
  `bayi_kms` int(11) NOT NULL DEFAULT 0,
  `balita_imunisasi` int(11) NOT NULL DEFAULT 0,
  `balita_kurang_gizi` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('aEWH3PyHkrxao3YQynOQzEThgzHHLADyNoDf8zT2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ2aGtWZkg1RWhKWHRqUVJNaXBFaGEzeVJxRXFnNFdyWXUzQ3JoSTFCIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787713743),
('alkHNiGzzH3zkaYxq6cYL4U0E0Gpf21GGDppyMxY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJackRESGtGbGEyVDdaYk9qNEM0dFNhVTNJOFFlaGFrOHpCVnRPNFBlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787813678),
('BMSNJ64GEykItPTwBvqmAYcbB0TJCIg0bIlNIidX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJxUUtSNmVjMVJzZUhabm1KaWNzSFBuVFlPWDQwVEZvM1FWZ0NBcW9DIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787731058),
('i2IEeEtakd2qfQNSuuhj38ym68rCl5WXxciI7ifK', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI3UUY5bVFQeHlJaVBQUFZGa2E3NkRtQWxFWTJFalU0WlBVanVHbVpmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787728262),
('lhvX3Nh6CGhYJbc7BOiAAjv6adZGzBv6TCbi0zPu', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI3V3VUYzZURDNUOGhQTGFvTHludnlGTm5KZkNIWm0yNWJpOHdKelJmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787719476),
('PPK78Pa3Avk6Lbo7amFUxbHTRAi9B5x7VaaU0C0x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJUMVVGeXdSeURUS3RheTRVT0lBV0dxN0NNTHFtRGNTRHd2bm9VQnZkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787803711),
('ZSrrLoMheCJbkcxgrcsyJVoVS0LRO5bLcsRpPTUg', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJPeWQzaEhiRWcybEVYQmhneWI3S0dLQ0tkRjlpR3hIeXpsR0NYbUtCIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1787744114);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'warga',
  `posyandu` varchar(255) DEFAULT NULL,
  `posyandu_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `role`, `posyandu`, `posyandu_id`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Ketua Melati', 'ketua.melati', 'ketua', NULL, 1, NULL, NULL, '$2y$12$t8JuW.mH58BmMOgJKxT27eviCqI2dZT76qjZPNToU7lDK6P5omMjG', NULL, '2026-08-10 04:44:53', '2026-08-27 02:46:51'),
(2, 'Kader Melati', 'kader.melati', 'kader', NULL, 1, NULL, NULL, '$2y$12$sAA0QUu5efOd1vpsJbEUaO0Y54aADzvpku2WrtAqrp9qV36/V11wO', NULL, '2026-08-10 04:44:54', '2026-08-27 02:46:51'),
(3, 'Ketua Rukun Lestari', 'ketua.rukunlestari', 'ketua', NULL, 2, NULL, NULL, '$2y$12$nb55eNty7m31orrSLe6DEe12FmLCEOQz1HH4ZzMZgVCgV0Qf6Jm.6', NULL, '2026-08-10 04:44:54', '2026-08-27 02:46:51'),
(4, 'Kader Rukun Lestari', 'kader.rukunlestari', 'kader', NULL, 2, NULL, NULL, '$2y$12$PQ2Pwfsx1HHCM8XS/VDoOeUcpF2FYKdYEdlPUXx6DSqINvHcLqv0.', NULL, '2026-08-10 04:44:55', '2026-08-27 02:46:51'),
(5, 'Ketua Mawar', 'ketua.mawar', 'ketua', NULL, 3, NULL, NULL, '$2y$12$3ufzpbHCAhJd3s53LgivSePq6prk7QqWkMiixxvfB7xFf44DfkrTS', NULL, '2026-08-10 04:44:55', '2026-08-27 02:46:51'),
(6, 'Kader Mawar', 'kader.mawar', 'kader', NULL, 3, NULL, NULL, '$2y$12$WQJWtii4Q9f2qDnm7urQ7e5Lq9zDwMxATay8OqfJ/vgaNeqd.bGK.', NULL, '2026-08-10 04:44:56', '2026-08-27 03:29:10'),
(7, 'Ketua Bina Putra', 'ketua.binaputra', 'ketua', NULL, 4, NULL, NULL, '$2y$12$gbnUEALGiEuMl2mQYb8XKeaH636K7KSv42ATrfDgcsxBZoBcUjEZ2', NULL, '2026-08-10 04:44:56', '2026-08-27 02:46:51'),
(8, 'Kader Bina Putra', 'kader.binaputra', 'kader', NULL, 4, NULL, NULL, '$2y$12$xS3qKzScS6ZV4IvlxEOxv.mukzCVrm7ESqRuVQ/DDgrl81P8PpR8K', NULL, '2026-08-10 04:44:56', '2026-08-27 02:46:51'),
(9, 'Ketua Nusa Indah', 'ketua.nusaindah', 'ketua', NULL, 5, NULL, NULL, '$2y$12$PFLUQGCD72ryPiw42mfbTuBcn52xOacI/W2UnSZo8eAg.Q/ySkehe', NULL, '2026-08-10 04:44:57', '2026-08-27 02:46:51'),
(10, 'Kader Nusa Indah', 'kader.nusaindah', 'kader', NULL, 5, NULL, NULL, '$2y$12$kHm8KBgw7GWAEVgpNSEtweLVrSuhkwO1KZ7T.G8478JtN7TRCA42y', NULL, '2026-08-10 04:44:57', '2026-08-27 02:46:52'),
(11, 'Ketua Cempaka', 'ketua.cempaka', 'ketua', NULL, 6, NULL, NULL, '$2y$12$9kOplahFFizAykVVeD3UguS5zwRGXdNw8DnX/dvbzKR5.BQrGUO7e', NULL, '2026-08-10 04:44:58', '2026-08-27 02:46:52'),
(12, 'Kader Cempaka', 'kader.cempaka', 'kader', NULL, 6, NULL, NULL, '$2y$12$/.VlbseVs6yI0rK1ySg5rONuxAWGmFIO6habBZMZ6JqrGdw.i4H1a', NULL, '2026-08-10 04:44:58', '2026-08-27 02:46:52'),
(13, 'Ketua Tunas Mulia', 'ketua.tunasmulya', 'ketua', NULL, 7, NULL, NULL, '$2y$12$YE.slb900qPjk6JIP/F7wOpiP9te3v4xrAsC3.Ns5KrFXhRrBZCT2', NULL, '2026-08-10 04:44:59', '2026-08-27 02:46:52'),
(14, 'Kader Tunas Mulia', 'kader.tunasmulya', 'kader', NULL, 7, NULL, NULL, '$2y$12$OxLMemq7CK4ikAly8WF/Oe02jC9INTrBBK9spp3VvDUIh6sNGP9ZK', NULL, '2026-08-10 04:44:59', '2026-08-27 02:46:52'),
(15, 'Ketua Surya', 'ketua.surya', 'ketua', NULL, 8, NULL, NULL, '$2y$12$GIFVREzJRRDB45wPhf.1X.55WGtCJIFxx0Oc59yK5T6xRbvbQrlYW', NULL, '2026-08-10 04:45:00', '2026-08-27 02:46:52'),
(16, 'Kader Surya', 'kader.surya', 'kader', NULL, 8, NULL, NULL, '$2y$12$LQu4He7h86ItMYUBbZiLYu5kVEu127M2/Qwm/1oO775ia6dGdJKOO', NULL, '2026-08-10 04:45:00', '2026-08-27 02:46:52'),
(17, 'Ketua Terkini', 'ketua.terkini', 'ketua', NULL, 9, NULL, NULL, '$2y$12$uWqnYkFjj3HGy0txkoPCq.XjQz1zqFKJRog15m23.TjF6nzSqJJhm', NULL, '2026-08-10 04:45:01', '2026-08-27 02:46:52'),
(18, 'Kader Terkini', 'kader.terkini', 'kader', NULL, 9, NULL, NULL, '$2y$12$5nDKhS3PNg4hLfvU8rYFleLRwcXbEvRHldhoU72.oWTDvvmwq/TKW', NULL, '2026-08-10 04:45:01', '2026-08-27 02:46:52'),
(19, 'Admin Desa Loa Duri Ulu', 'admin.desa', 'superadmin', NULL, NULL, NULL, NULL, '$2y$12$5wLkgu1Yx7ERHodvAJQFcuxrhs8/LOORrGHRl0jkzPdo4nklgKTZe', NULL, '2026-08-10 04:45:02', '2026-08-27 02:46:52'),
(20, 'Bidan Fitri', 'petugas.puskesmas', 'puskesmas', NULL, NULL, NULL, NULL, '$2y$12$7vTK5E1Edu6OJUZq2oHFDO20F4U5B4Dy.yWOZceTPyHgICqH.eHny', NULL, '2026-08-10 04:45:02', '2026-08-27 02:46:52'),
(21, 'Budi Santoso', 'warga.budi', 'warga', NULL, 1, NULL, NULL, '$2y$12$NoeWoGlqlQWEilFmMGuFTe3b3qCU6bAM0Y/msiskyF7u125A5Ry9.', NULL, '2026-08-10 04:45:03', '2026-08-26 03:36:40'),
(22, 'Herman', '1234567891234567', 'warga', NULL, NULL, NULL, NULL, '$2y$12$9aRDP.BTFasVyFmSO792O.gtFs7D8bcD.2Lq2SJvaZNKpT5psVrRG', NULL, '2026-08-26 07:58:48', '2026-08-26 07:58:48');

-- --------------------------------------------------------

--
-- Table structure for table `warga_anak`
--

CREATE TABLE `warga_anak` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `keluarga_id` bigint(20) UNSIGNED NOT NULL,
  `nama_anak` varchar(255) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warga_dewasa`
--

CREATE TABLE `warga_dewasa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `keluarga_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warga_dewasa`
--

INSERT INTO `warga_dewasa` (`id`, `keluarga_id`, `nama_lengkap`, `tanggal_lahir`, `jenis_kelamin`, `created_at`, `updated_at`) VALUES
(1, 1, 'Herman', '1996-08-26', 'L', '2026-08-26 07:58:48', '2026-08-26 07:58:48'),
(2, 1, 'Ibu Siti', '2001-08-26', 'P', '2026-08-26 07:58:48', '2026-08-26 07:58:48');

-- --------------------------------------------------------

--
-- Table structure for table `warga_keluarga`
--

CREATE TABLE `warga_keluarga` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `posyandu_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nama_kepala_keluarga` varchar(255) NOT NULL,
  `no_kk` varchar(16) NOT NULL,
  `nik_kepala_keluarga` varchar(16) NOT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warga_keluarga`
--

INSERT INTO `warga_keluarga` (`id`, `posyandu_id`, `user_id`, `nama_kepala_keluarga`, `no_kk`, `nik_kepala_keluarga`, `no_hp`, `created_at`, `updated_at`) VALUES
(1, 3, 22, 'Herman', '1234567891234567', '1234567891234567', '085252626262', '2026-08-26 07:58:48', '2026-08-26 07:58:48');

-- --------------------------------------------------------

--
-- Table structure for table `warga_remaja`
--

CREATE TABLE `warga_remaja` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `keluarga_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nama_remaja` varchar(255) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `artikel_slug_unique` (`slug`),
  ADD KEY `artikel_posyandu_id_foreign` (`posyandu_id`),
  ADD KEY `artikel_penulis_id_foreign` (`penulis_id`);

--
-- Indexes for table `artikels`
--
ALTER TABLE `artikels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `data_tambahans`
--
ALTER TABLE `data_tambahans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `data_tambahans_posyandu_id_periode_unique` (`posyandu_id`,`periode`);

--
-- Indexes for table `data_tambahan_individu`
--
ALTER TABLE `data_tambahan_individu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `data_tambahan_individu_posyandu_id_jenis_index` (`posyandu_id`,`jenis`),
  ADD KEY `data_tambahan_individu_posyandu_id_tanggal_index` (`posyandu_id`,`tanggal`);

--
-- Indexes for table `data_umums`
--
ALTER TABLE `data_umums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `data_umums_posyandu_id_foreign` (`posyandu_id`);

--
-- Indexes for table `dokumentasi_foto`
--
ALTER TABLE `dokumentasi_foto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dokumentasi_foto_imageable_type_imageable_id_index` (`imageable_type`,`imageable_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `formulir_identifikasi`
--
ALTER TABLE `formulir_identifikasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `formulir_identifikasi_posyandu_id_foreign` (`posyandu_id`),
  ADD KEY `formulir_identifikasi_kader_id_foreign` (`kader_id`);

--
-- Indexes for table `imunisasi_anak`
--
ALTER TABLE `imunisasi_anak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `imunisasi_anak_pemeriksaan_id_foreign` (`pemeriksaan_id`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jadwal_posyandu_id_foreign` (`posyandu_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kontak_darurat`
--
ALTER TABLE `kontak_darurat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `laporan_posyandu`
--
ALTER TABLE `laporan_posyandu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `laporan_posyandu_posyandu_id_foreign` (`posyandu_id`),
  ADD KEY `laporan_posyandu_dikoreksi_oleh_foreign` (`dikoreksi_oleh`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pemeriksaan_balita`
--
ALTER TABLE `pemeriksaan_balita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemeriksaan_balita_anak_id_foreign` (`anak_id`),
  ADD KEY `pemeriksaan_balita_kader_id_foreign` (`kader_id`);

--
-- Indexes for table `pemeriksaan_hamil`
--
ALTER TABLE `pemeriksaan_hamil`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemeriksaan_hamil_ibu_id_foreign` (`ibu_id`),
  ADD KEY `pemeriksaan_hamil_kader_id_foreign` (`kader_id`);

--
-- Indexes for table `pemeriksaan_lansia`
--
ALTER TABLE `pemeriksaan_lansia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemeriksaan_lansia_lansia_id_foreign` (`lansia_id`),
  ADD KEY `pemeriksaan_lansia_kader_id_foreign` (`kader_id`);

--
-- Indexes for table `pemeriksaan_remaja`
--
ALTER TABLE `pemeriksaan_remaja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemeriksaan_remaja_remaja_id_foreign` (`remaja_id`),
  ADD KEY `pemeriksaan_remaja_kader_id_foreign` (`kader_id`);

--
-- Indexes for table `pencatatan_kegiatans`
--
ALTER TABLE `pencatatan_kegiatans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pencatatan_kegiatans_posyandu_id_foreign` (`posyandu_id`);

--
-- Indexes for table `pengaduan_masyarakat`
--
ALTER TABLE `pengaduan_masyarakat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengaduan_masyarakat_posyandu_id_foreign` (`posyandu_id`);

--
-- Indexes for table `pengurus`
--
ALTER TABLE `pengurus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengurus_posyandu_id_foreign` (`posyandu_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `posyandus`
--
ALTER TABLE `posyandus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referensi_makanan`
--
ALTER TABLE `referensi_makanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `referensi_makanan_dibuat_oleh_posyandu_foreign` (`dibuat_oleh_posyandu`);

--
-- Indexes for table `rekap_kegiatans`
--
ALTER TABLE `rekap_kegiatans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rekap_kegiatans_posyandu_id_foreign` (`posyandu_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `warga_anak`
--
ALTER TABLE `warga_anak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warga_anak_keluarga_id_foreign` (`keluarga_id`);

--
-- Indexes for table `warga_dewasa`
--
ALTER TABLE `warga_dewasa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warga_dewasa_keluarga_id_foreign` (`keluarga_id`);

--
-- Indexes for table `warga_keluarga`
--
ALTER TABLE `warga_keluarga`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `warga_keluarga_no_kk_unique` (`no_kk`),
  ADD UNIQUE KEY `warga_keluarga_nik_kepala_keluarga_unique` (`nik_kepala_keluarga`),
  ADD KEY `warga_keluarga_posyandu_id_foreign` (`posyandu_id`),
  ADD KEY `warga_keluarga_user_id_foreign` (`user_id`);

--
-- Indexes for table `warga_remaja`
--
ALTER TABLE `warga_remaja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warga_remaja_keluarga_id_foreign` (`keluarga_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `artikels`
--
ALTER TABLE `artikels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_tambahans`
--
ALTER TABLE `data_tambahans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_tambahan_individu`
--
ALTER TABLE `data_tambahan_individu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `data_umums`
--
ALTER TABLE `data_umums`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumentasi_foto`
--
ALTER TABLE `dokumentasi_foto`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formulir_identifikasi`
--
ALTER TABLE `formulir_identifikasi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `imunisasi_anak`
--
ALTER TABLE `imunisasi_anak`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kontak_darurat`
--
ALTER TABLE `kontak_darurat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `laporan_posyandu`
--
ALTER TABLE `laporan_posyandu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `pemeriksaan_balita`
--
ALTER TABLE `pemeriksaan_balita`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pemeriksaan_hamil`
--
ALTER TABLE `pemeriksaan_hamil`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pemeriksaan_lansia`
--
ALTER TABLE `pemeriksaan_lansia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pemeriksaan_remaja`
--
ALTER TABLE `pemeriksaan_remaja`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pencatatan_kegiatans`
--
ALTER TABLE `pencatatan_kegiatans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaduan_masyarakat`
--
ALTER TABLE `pengaduan_masyarakat`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengurus`
--
ALTER TABLE `pengurus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `posyandus`
--
ALTER TABLE `posyandus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `referensi_makanan`
--
ALTER TABLE `referensi_makanan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `rekap_kegiatans`
--
ALTER TABLE `rekap_kegiatans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `warga_anak`
--
ALTER TABLE `warga_anak`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warga_dewasa`
--
ALTER TABLE `warga_dewasa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `warga_keluarga`
--
ALTER TABLE `warga_keluarga`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `warga_remaja`
--
ALTER TABLE `warga_remaja`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artikel`
--
ALTER TABLE `artikel`
  ADD CONSTRAINT `artikel_penulis_id_foreign` FOREIGN KEY (`penulis_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artikel_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `data_tambahans`
--
ALTER TABLE `data_tambahans`
  ADD CONSTRAINT `data_tambahans_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `data_tambahan_individu`
--
ALTER TABLE `data_tambahan_individu`
  ADD CONSTRAINT `data_tambahan_individu_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `data_umums`
--
ALTER TABLE `data_umums`
  ADD CONSTRAINT `data_umums_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `formulir_identifikasi`
--
ALTER TABLE `formulir_identifikasi`
  ADD CONSTRAINT `formulir_identifikasi_kader_id_foreign` FOREIGN KEY (`kader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `formulir_identifikasi_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `imunisasi_anak`
--
ALTER TABLE `imunisasi_anak`
  ADD CONSTRAINT `imunisasi_anak_pemeriksaan_id_foreign` FOREIGN KEY (`pemeriksaan_id`) REFERENCES `pemeriksaan_balita` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `laporan_posyandu`
--
ALTER TABLE `laporan_posyandu`
  ADD CONSTRAINT `laporan_posyandu_dikoreksi_oleh_foreign` FOREIGN KEY (`dikoreksi_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `laporan_posyandu_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pemeriksaan_balita`
--
ALTER TABLE `pemeriksaan_balita`
  ADD CONSTRAINT `pemeriksaan_balita_anak_id_foreign` FOREIGN KEY (`anak_id`) REFERENCES `warga_anak` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemeriksaan_balita_kader_id_foreign` FOREIGN KEY (`kader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pemeriksaan_hamil`
--
ALTER TABLE `pemeriksaan_hamil`
  ADD CONSTRAINT `pemeriksaan_hamil_ibu_id_foreign` FOREIGN KEY (`ibu_id`) REFERENCES `warga_dewasa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemeriksaan_hamil_kader_id_foreign` FOREIGN KEY (`kader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pemeriksaan_lansia`
--
ALTER TABLE `pemeriksaan_lansia`
  ADD CONSTRAINT `pemeriksaan_lansia_kader_id_foreign` FOREIGN KEY (`kader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemeriksaan_lansia_lansia_id_foreign` FOREIGN KEY (`lansia_id`) REFERENCES `warga_dewasa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pemeriksaan_remaja`
--
ALTER TABLE `pemeriksaan_remaja`
  ADD CONSTRAINT `pemeriksaan_remaja_kader_id_foreign` FOREIGN KEY (`kader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemeriksaan_remaja_remaja_id_foreign` FOREIGN KEY (`remaja_id`) REFERENCES `warga_remaja` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pencatatan_kegiatans`
--
ALTER TABLE `pencatatan_kegiatans`
  ADD CONSTRAINT `pencatatan_kegiatans_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaduan_masyarakat`
--
ALTER TABLE `pengaduan_masyarakat`
  ADD CONSTRAINT `pengaduan_masyarakat_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengurus`
--
ALTER TABLE `pengurus`
  ADD CONSTRAINT `pengurus_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `referensi_makanan`
--
ALTER TABLE `referensi_makanan`
  ADD CONSTRAINT `referensi_makanan_dibuat_oleh_posyandu_foreign` FOREIGN KEY (`dibuat_oleh_posyandu`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rekap_kegiatans`
--
ALTER TABLE `rekap_kegiatans`
  ADD CONSTRAINT `rekap_kegiatans_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `warga_anak`
--
ALTER TABLE `warga_anak`
  ADD CONSTRAINT `warga_anak_keluarga_id_foreign` FOREIGN KEY (`keluarga_id`) REFERENCES `warga_keluarga` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `warga_dewasa`
--
ALTER TABLE `warga_dewasa`
  ADD CONSTRAINT `warga_dewasa_keluarga_id_foreign` FOREIGN KEY (`keluarga_id`) REFERENCES `warga_keluarga` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `warga_keluarga`
--
ALTER TABLE `warga_keluarga`
  ADD CONSTRAINT `warga_keluarga_posyandu_id_foreign` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `warga_keluarga_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `warga_remaja`
--
ALTER TABLE `warga_remaja`
  ADD CONSTRAINT `warga_remaja_keluarga_id_foreign` FOREIGN KEY (`keluarga_id`) REFERENCES `warga_keluarga` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
