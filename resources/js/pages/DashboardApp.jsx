import React, { useState } from 'react';
import IconSprite from '../components/common/IconSprite';
import logo from '../assets/images/common/logo-header.jpeg';
import userAvatarFallback from '../assets/images/common/kristin-cooper.jpeg';
import DataTambahanIndividuView from '../components/dashboard/DataTambahanIndividuView';

// Import views
import DashboardHome from '../components/dashboard/DashboardHome';
import KesehatanView from '../components/dashboard/KesehatanView';
import PengaduanView from '../components/dashboard/PengaduanView';
import ProfilView from '../components/dashboard/ProfilView';
import DaftarView from '../components/dashboard/DaftarView';
import ArtikelView from '../components/dashboard/ArtikelView';
import KelolaWargaView from '../components/dashboard/KelolaWargaView';
import KelolaMakananView from '../components/dashboard/KelolaMakananView';
import PuskesmasView from '../components/dashboard/PuskesmasView';
import AdminDashboardView from '../components/dashboard/AdminDashboardView';
import AdminAnalitikView from '../components/dashboard/AdminAnalitikView';
import AdminEksporView from '../components/dashboard/AdminEksporView';
import WargaAnakView from '../components/dashboard/WargaAnakView';
import WargaKalkulatorView from '../components/dashboard/WargaKalkulatorView';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import RekapKegiatanView from '../components/dashboard/RekapKegiatanView';
import PencatatanKegiatanView from '../components/dashboard/PencatatanKegiatanView';
import PencatatanDataUmumView from '../components/dashboard/PencatatanDataUmumView';
import AdminArsipLaporanView from '../components/dashboard/AdminArsipLaporanView';
import GantiPasswordView from '../components/dashboard/GantiPasswordView';

const NAV = {
    kader: [
        {
            group: 'Menu Utama', items: [
                { id: 'dashboard', label: 'Beranda', ico: 'bi bi-house-door-fill' },
                { id: 'kesehatan', label: 'Pencatatan Kesehatan', ico: 'bi bi-activity' },
                { id: 'pengaduan', label: 'Formulir & Pengaduan', ico: 'bi bi-megaphone-fill' },
                { id: 'rekap-kegiatan', label: 'Rekap Kegiatan Bulanan', ico: 'bi bi-file-earmark-spreadsheet-fill' },
                { id: 'data-umum', label: 'Data Umum Posyandu', ico: 'bi bi-clipboard-data' },
                { id: 'data-tambahan', label: 'Data Tambahan', ico: 'bi bi-clipboard2-pulse-fill' },
            ]
        },
        {
            group: 'Lainnya', items: [
                { id: 'kelolawarga', label: 'Kelola Warga', ico: 'bi bi-people-fill' },
                { id: 'kelola-makanan', label: 'Kelola Data Makanan', ico: 'bi bi-egg-fried' },
                { id: 'artikel', label: 'Artikel & Berita', ico: 'bi bi-journal-text' },
            ]
        },
        {
            group: 'Akun', items: [
                { id: 'ganti-password', label: 'Ganti PIN', ico: 'bi bi-key-fill' },
            ]
        }

    ],
    ketua: [
        {
            group: 'Menu Utama', items: [
                { id: 'dashboard', label: 'Beranda', ico: 'bi bi-house-door-fill' },
                { id: 'kesehatan', label: 'Pencatatan Kesehatan', ico: 'bi bi-activity' },
                { id: 'pengaduan', label: 'Formulir & Pengaduan', ico: 'bi bi-megaphone-fill' },
                { id: 'rekap-kegiatan', label: 'Rekap Kegiatan Bulanan', ico: 'bi bi-file-earmark-spreadsheet-fill' },
                { id: 'pencatatan-kegiatan', label: 'Pencatatan Kegiatan (13 Poin)', ico: 'bi bi-card-checklist' },
                { id: 'data-umum', label: 'Data Umum Posyandu', ico: 'bi bi-clipboard-data' },
                { id: 'data-tambahan', label: 'Data Tambahan', ico: 'bi bi-clipboard2-pulse-fill' },
            ]
        },
        {
            group: 'Kelola Posyandu', items: [
                { id: 'profil', label: 'Profil & Sarana', ico: 'bi bi-building' },
                { id: 'daftar', label: 'Daftar 9 Posyandu', ico: 'bi bi-geo-alt-fill' },
                { id: 'kelolawarga', label: 'Kelola Warga', ico: 'bi bi-people-fill' },
                { id: 'kelola-makanan', label: 'Kelola Data Makanan', ico: 'bi bi-egg-fried' },
                { id: 'artikel', label: 'Artikel & Berita', ico: 'bi bi-journal-text' },
            ]
        },
        {
            group: 'Akun', items: [
                { id: 'ganti-password', label: 'Ganti PIN', ico: 'bi bi-key-fill' },
            ]
        }
    ],
    puskesmas: [
        {
            group: 'Menu Utama', items: [
                { id: 'puskesmas-dashboard', label: 'Laporan per Posyandu', ico: 'bi bi-file-earmark-medical-fill' },
            ]
        },
        {
            group: 'Akun', items: [
                { id: 'ganti-password', label: 'Ganti PIN', ico: 'bi bi-key-fill' },
            ]
        }
    ],
    superadmin: [
        {
            group: 'Menu Utama', items: [
                { id: 'superadmin-dashboard', label: 'Transparansi Pelaporan', ico: 'bi bi-house-door-fill' },
                { id: 'superadmin-analitik', label: 'Dashboard Analitik 6 Bidang', ico: 'bi bi-bar-chart-line-fill' },
                { id: 'superadmin-ekspor', label: 'Ekspor Gabungan 9 Posyandu', ico: 'bi bi-file-earmark-excel-fill' },
                { id: 'admin-arsip', label: 'Arsip Laporan Posyandu', ico: 'bi bi-folder-check' }
            ]
        },
        {
            group: 'Akun', items: [
                { id: 'ganti-password', label: 'Ganti PIN', ico: 'bi bi-key-fill' },
            ]
        }
    ],
    warga: [
        {
            group: 'Menu Utama', items: [
                { id: 'warga-anak', label: 'Rapor Kesehatan Keluarga', ico: 'bi bi-person-heart' },
                { id: 'warga-kalkulator', label: 'Kalkulator Kesehatan', ico: 'bi bi-calculator-fill' },
            ]
        },
        {
            group: 'Akun', items: [
                { id: 'ganti-password', label: 'Ganti PIN', ico: 'bi bi-key-fill' },
            ]
        }
    ]
};

const TITLES = {
    dashboard: ['Beranda', 'Ringkasan kegiatan bulan ini'],
    kesehatan: ['Pencatatan Kesehatan', 'Input hasil pemeriksaan 4 kelompok sasaran'],
    pengaduan: ['Formulir & Pengaduan', 'Identifikasi, pengaduan & rekap 5 bidang non-kesehatan'],
    laporan: ['Laporan', 'Susun, tinjau & ekspor laporan Posyandu'],
    'kelola-makanan': ['Kelola Data Makanan', 'Tambah, ubah, atau hapus daftar makanan untuk Kalkulator Kalori'],
    profil: ['Profil & Sarana Posyandu', 'Kelola data profil & sarana yang dapat diperbarui sewaktu-waktu'],
    daftar: ['Daftar Posyandu', 'Referensi 9 Posyandu di Desa Loa Duri Ulu'],
    artikel: ['Artikel & Berita', 'Tulis dan kelola informasi untuk warga desa'],
    kelolawarga: ['Kelola Warga', 'Buat akun & kelola data keluarga warga terdaftar'],
    'puskesmas-dashboard': ['Laporan Bulanan Kesehatan per Posyandu', 'Tinjau & ekspor laporan salah satu dari 9 Posyandu'],
    'superadmin-dashboard': ['Transparansi Progres Pelaporan', 'Status laporan bulanan Kesehatan & 3 bulanan 9 Posyandu'],
    'superadmin-analitik': ['Dashboard Analitik 6 Bidang SPM', 'Tren bulanan/triwulanan & keaktifan kehadiran warga lintas Posyandu'],
    'superadmin-ekspor': ['Ekspor Gabungan 9 Posyandu', 'Ekspor rekap gabungan format khusus internal Puskesmas'],
    'warga-anak': ['Rapor Kesehatan Keluarga', 'Riwayat pemeriksaan anak (read-only)'],
    'warga-kalkulator': ['Kalkulator Kesehatan', '4 jenis kalkulator mandiri — lebih lengkap dari kalkulator publik'],
    'warga-password': ['Ganti Password', 'Perbarui kata sandi akun Anda kapan saja'],
    'pencatatan-kegiatan': ['Pencatatan Kegiatan', 'Formulir 13 Poin & Cetak PDF Vertikal TTD Digital'],
    'data-umum': ['Data Umum Posyandu', 'Pencatatan demografi sasaran dan pengunjung'],
    'data-tambahan': ['Data Tambahan', 'Rekap ibu hamil, nifas, kematian ibu, dan diare'],
    'admin-arsip': ['Arsip Laporan Posyandu', 'Pantau dan Ekspor Laporan Bulanan (F1/F2, 13 Poin, Data Umum)'],
    'ganti-password': ['Ganti PIN', 'Perbarui PIN 6 digit akun Anda'],
};

const ROLE_AVATARS = { kader: 'K', ketua: 'KP', puskesmas: 'PK', superadmin: 'PD', warga: 'W' };
const ROLE_HOME = { kader: 'dashboard', ketua: 'dashboard', puskesmas: 'puskesmas-dashboard', superadmin: 'superadmin-dashboard', warga: 'warga-anak' };

export default function DashboardApp({ userAuth, onLogout }) {
    if (!userAuth) {
        onLogout();
        return null;
    }

    const role = userAuth.role || 'kader';
    const namaPosyandu = userAuth.posyandu ? userAuth.posyandu.nama : '';
    const posyanduName = role === 'superadmin' ? 'Admin Loa Duri Ulu' : role === 'puskesmas' ? 'Petugas Puskesmas' : role === 'warga' ? `Warga Posyandu ${userAuth.posyandu}` : role === 'ketua' ? `Ketua Posyandu ${userAuth.posyandu}` : `Kader Posyandu ${userAuth.posyandu}`;
    const [currentView, setCurrentView] = useState(ROLE_HOME[role]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleNavClick = (id) => {
        setCurrentView(id);
        setSidebarOpen(false);
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardHome role={role} onViewChange={handleNavClick} />;
            case 'kesehatan': return <KesehatanView />;
            case 'pengaduan': return <PengaduanView />;
            case 'profil': return <ProfilView />;
            case 'daftar': return <DaftarView />;
            case 'artikel': return <ArtikelView />;
            case 'kelolawarga': return <KelolaWargaView posyandu={namaPosyandu} />;
            case 'kelola-makanan': return <KelolaMakananView />;
            case 'puskesmas-dashboard': return <PuskesmasView />;
            case 'superadmin-dashboard': return <AdminDashboardView />;
            case 'superadmin-analitik': return <AdminAnalitikView />;
            case 'superadmin-ekspor': return <AdminEksporView />;
            case 'warga-anak': return <WargaAnakView userAuth={userAuth} />;
            case 'warga-kalkulator': return <WargaKalkulatorView />;
            case 'ganti-password': return <GantiPasswordView />;
            case 'rekap-kegiatan': return <RekapKegiatanView />;
            case 'pencatatan-kegiatan': return <PencatatanKegiatanView />;
            case 'data-umum': return <PencatatanDataUmumView />;
            case 'data-tambahan': return <DataTambahanIndividuView posyandu={namaPosyandu} />;
            case 'admin-arsip': return <AdminArsipLaporanView />;
            case 'warga-password': return <GantiPasswordView />;
            default: return <DashboardHome role={role} onViewChange={handleNavClick} />;
        }
    };

    return (
        <div id="app" style={{ display: 'block' }}>

            {/* =========================================
          SUNTIKAN CSS: PERBAIKAN SCROLL SIDEBAR
          ========================================= */}
            <style>{`
        /* Pastikan pembungkus utama sidebar menyesuaikan tinggi layar */
        #sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh !important;
          overflow: hidden !important;
        }

        /* Area Menu dibuat fleksibel dan bisa di-scroll */
        #navContainer {
          flex-grow: 1;
          overflow-y: auto !important;
          padding-bottom: 30px !important; /* Ruang lega di bagian bawah */
        }

        /* Sembunyikan garis scrollbar agar tetap cantik */
        #navContainer::-webkit-scrollbar {
          display: none !important;
        }
        #navContainer {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

            <IconSprite />
            <div className="shell">
                {/* SIDEBAR */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                    {/* Logo akan tetap diam di atas */}
                    <div className="brand" style={{ flexShrink: 0 }}>
                        <div className="mark"><img src={logo} alt="Logo Posyandu" /></div>
                        <div>
                            <div className="brand-name">
                                {userAuth.posyandu ? `Posyandu ${userAuth.posyandu.nama}` : 'Posyandu Loa Duri Ulu'}
                            </div>
                            <div className="brand-sub">Loa Duri Ulu</div>
                        </div>
                    </div>

                    {/* Area ini yang akan bisa digulir ke bawah */}
                    <div id="navContainer">
                        {NAV[role]?.map(group => (
                            <React.Fragment key={group.group}>
                                <div className="nav-group-label">{group.group}</div>
                                {group.items.map(item => (
                                    <div
                                        key={item.id}
                                        className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                        onClick={() => handleNavClick(item.id)}
                                    >
                                        <span className="ico"><i className={item.ico} style={{ fontSize: '14px' }}></i></span>
                                        {item.label}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                        {/* Tombol Logout akan ikut turun bersama menu terbawah */}
                        <div className="sidebar-foot" style={{ marginTop: '20px' }}>
                            <button className="logout-btn" onClick={onLogout}>
                                <i className="bi bi-box-arrow-right" style={{ fontSize: '15px' }}></i>
                                <span>Keluar</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Backdrop for mobile */}
                <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>

                {/* MAIN */}
                <div className="main">
                    <DashboardNavbar
                        title={TITLES[currentView] ? TITLES[currentView][0] : 'Beranda'}
                        desc={TITLES[currentView] ? TITLES[currentView][1] : ''}
                        userAuth={userAuth}
                        role={role}
                        onOpenSidebar={() => setSidebarOpen(true)}
                    />

                    <div className="content">
                        <div className="view active" style={{ animation: 'fadein .25s ease' }}>
                            {renderView()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
