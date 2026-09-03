import React, { useState } from 'react';
import IconSprite from '../components/common/IconSprite';
import logo from '../assets/images/common/logo-header.jpeg';
import DataTambahanIndividuView from '../components/dashboard/DataTambahanIndividuView';
import DashboardPageHeader from '../components/dashboard/DashboardPageHeader';

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

import {
  LogOut,
  Home,
  Activity,
  Megaphone,
  FileSpreadsheet,
  ClipboardList,
  ActivitySquare,
  Users,
  Utensils,
  BookText,
  Key,
  Building,
  MapPin,
  FileSignature,
  BarChart3,
  FolderCheck,
  UserCheck,
  Calculator,
  User
} from 'lucide-react';

const NAV = {
  kader: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'dashboard', label: 'Beranda', ico: Home },
        { id: 'kesehatan', label: 'Pencatatan Kesehatan', ico: Activity },
        { id: 'pengaduan', label: 'Formulir & Pengaduan', ico: Megaphone },
        { id: 'rekap-kegiatan', label: 'Rekap Kegiatan Bulanan', ico: FileSpreadsheet },
        { id: 'data-umum', label: 'Data Umum Posyandu', ico: ClipboardList },
        { id: 'data-tambahan', label: 'Data Tambahan', ico: ActivitySquare },
      ]
    },
    {
      group: 'Kelola Data',
      items: [
        { id: 'kelolawarga', label: 'Kelola Warga', ico: Users },
        { id: 'kelola-makanan', label: 'Kelola Data Makanan', ico: Utensils },
        { id: 'artikel', label: 'Artikel & Berita', ico: BookText },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key },
      ]
    }
  ],
  ketua: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'dashboard', label: 'Beranda', ico: Home },
        { id: 'kesehatan', label: 'Pencatatan Kesehatan', ico: Activity },
        { id: 'pengaduan', label: 'Formulir & Pengaduan', ico: Megaphone },
        { id: 'rekap-kegiatan', label: 'Rekap Kegiatan Bulanan', ico: FileSpreadsheet },
        { id: 'pencatatan-kegiatan', label: 'Laporan 13 Poin', ico: ClipboardList },
        { id: 'data-umum', label: 'Data Umum Posyandu', ico: ClipboardList },
        { id: 'data-tambahan', label: 'Data Tambahan', ico: ActivitySquare },
      ]
    },
    {
      group: 'Kelola Posyandu',
      items: [
        { id: 'profil', label: 'Profil & Sarana', ico: Building },
        { id: 'daftar', label: 'Daftar 9 Posyandu', ico: MapPin },
        { id: 'kelolawarga', label: 'Kelola Warga', ico: Users },
        { id: 'kelola-makanan', label: 'Kelola Data Makanan', ico: Utensils },
        { id: 'artikel', label: 'Artikel & Berita', ico: BookText },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key },
      ]
    }
  ],
  puskesmas: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'puskesmas-dashboard', label: 'Laporan per Posyandu', ico: FileSignature },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key },
      ]
    }
  ],
  superadmin: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'superadmin-dashboard', label: 'Transparansi Pelaporan', ico: Home },
        { id: 'superadmin-analitik', label: 'Dashboard Analitik 6 Bidang', ico: BarChart3 },
        { id: 'superadmin-ekspor', label: 'Ekspor Gabungan 9 Posyandu', ico: FileSpreadsheet },
        { id: 'admin-arsip', label: 'Arsip Laporan Posyandu', ico: FolderCheck }
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key },
      ]
    }
  ],
  warga: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'warga-anak', label: 'Rapor Kesehatan Keluarga', ico: UserCheck },
        { id: 'warga-kalkulator', label: 'Kalkulator Gizi Mandiri', ico: Calculator },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key },
      ]
    }
  ]
};

const TITLES = {
  dashboard: ['Beranda Analitik Posyandu', 'Pantau rekapitulasi data penimbangan kesehatan, laporan pengaduan masyarakat, serta progres register bulanan desa.', 'RINGKASAN OPERASIONAL'],
  kesehatan: ['Pencatatan Kesehatan Warga', 'Input dan kelola hasil pemeriksaan kesehatan 4 sasaran (Balita, Remaja, Ibu Hamil, Lansia)', 'LAYANAN POSYANDU'],
  pengaduan: ['Formulir & Pengaduan Warga', 'Identifikasi kebutuhan 5 bidang SPM non-kesehatan dan penyaluran aspirasi masyarakat', 'PARTISIPASI WARGA'],
  'rekap-kegiatan': ['Rekap Kegiatan Bulanan Posyandu', 'Pencatatan data hasil kegiatan bulanan sesuai format Register Standar (46 Kolom)', 'LAPORAN BULANAN'],
  'kelola-makanan': ['Kelola Basis Data Makanan', 'Daftar referensi kalori makanan lokal dan simulasi gizi seimbang', 'BASIS DATA GIZI'],
  profil: ['Profil & Sarana Posyandu', 'Kelola informasi profil, sarana prasarana, dan inventaris posyandu', 'SARANA & PRASARANA'],
  daftar: ['Daftar 9 Posyandu Desa', 'Direktori resmi lokasi dan kontak 9 Posyandu di Desa Loa Duri Ulu', 'WILAYAH PELAYANAN'],
  artikel: ['Artikel & Edukasi Kesehatan', 'Publikasi artikel, berita posyandu, dan panduan kesehatan keluarga', 'MEDIA EDUKASI'],
  kelolawarga: ['Manajemen Data Kependudukan', 'Kelola data kartu keluarga, anggota keluarga, dan sasaran posyandu', 'DATA KEPENDUDUKAN'],
  'puskesmas-dashboard': ['Laporan Terpadu Puskesmas', 'Rekapitulasi dan verifikasi laporan bulanan seluruh posyandu binaan', 'MONITORING PUSKESMAS'],
  'superadmin-dashboard': ['Transparansi Progres Pelaporan', 'Monitoring kepatuhan pelaporan berkala dan progres register desa', 'TRANSPARANSI DESA'],
  'superadmin-analitik': ['Dashboard Analitik 6 Bidang SPM', 'Visualisasi data tren kesehatan, pendidikan, dan kesejahteraan masyarakat', 'ANALITIK DESA'],
  'superadmin-ekspor': ['Ekspor Data Gabungan 9 Posyandu', 'Unduh berkas rekapitulasi format Excel/CSV untuk arsip kedinasan', 'EKSPOR LAPORAN'],
  'warga-anak': ['Rapor Kesehatan Keluarga', 'Pantau grafik pertumbuhan balita, status imunisasi, dan riwayat kesehatan keluarga', 'RAPOR KESEHATAN'],
  'warga-kalkulator': ['Kalkulator Gizi & Energi Mandiri', 'Hitung indeks massa tubuh (IMT) dan estimasi kebutuhan kalori harian', 'LAYANAN MANDIRI'],
  'pencatatan-kegiatan': ['Laporan 13 Poin Kegiatan', 'Formulir evaluasi pencatatan kegiatan rutin posyandu tingkat desa', 'LAPORAN BULANAN'],
  'data-umum': ['Data Umum Posyandu', 'Statistik kependudukan, sarana, dan profil posyandu setempat', 'STATISTIK POSYANDU'],
  'data-tambahan': ['Data Sasaran Tambahan', 'Rekapitulasi kondisi sasaran khusus ibu hamil risiko tinggi dan nifas', 'DATA KHUSUS'],
  'admin-arsip': ['Arsip Digital Laporan Posyandu', 'Riwayat rekapitulasi bulanan yang tersimpan secara terpusat', 'ARSIP DIGITAL'],
  'ganti-password': ['Keamanan Akun & Ganti PIN', 'Perbarui kode PIN atau kata sandi akun Anda secara berkala untuk menjaga keamanan data', 'KEAMANAN AKUN'],
};

const ROLE_HOME = {
  kader: 'dashboard',
  ketua: 'dashboard',
  puskesmas: 'puskesmas-dashboard',
  superadmin: 'superadmin-dashboard',
  warga: 'warga-anak'
};

export default function DashboardApp({ userAuth, onLogout }) {
  if (!userAuth) {
    onLogout();
    return null;
  }

  const role = userAuth.role || 'kader';
  const namaPosyandu = userAuth.posyandu ? (userAuth.posyandu.nama || userAuth.posyandu) : '';
  const [currentView, setCurrentView] = useState(ROLE_HOME[role] || 'dashboard');
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
      default: return <DashboardHome role={role} onViewChange={handleNavClick} />;
    }
  };

  const getRoleLabel = () => {
    if (role === 'superadmin') return 'Admin Desa';
    if (role === 'puskesmas') return 'Petugas Puskesmas';
    if (role === 'ketua') return `Ketua Posyandu ${namaPosyandu ? namaPosyandu : ''}`;
    if (role === 'kader') return `Kader Posyandu ${namaPosyandu ? namaPosyandu : ''}`;
    return 'Warga Terdaftar';
  };

  return (
    <div id="app" style={{ display: 'block' }}>
      <style>{`
        #sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh !important;
          overflow: hidden !important;
          background-color: #ffffff;
          border-right: 1px solid #e2e8f0;
          box-shadow: 2px 0 16px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #navContainer {
          flex-grow: 1;
          overflow-y: auto !important;
          padding: 12px 14px 28px !important;
        }
        #navContainer::-webkit-scrollbar {
          display: none !important;
        }
        #navContainer {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .sidebar-user-card {
          padding: 12px 14px;
          margin: 12px 14px 6px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%);
          border: 1px solid #ccfbf1;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(0, 128, 128, 0.04);
        }
        .sidebar-nav-item {
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 3px;
          transition: all 0.15s ease-in-out;
          text-decoration: none;
        }
        .sidebar-nav-item.active {
          background-color: #f0fdfa !important;
          color: var(--primary-teal, #008080) !important;
          border: 1px solid #ccfbf1 !important;
          font-weight: 700 !important;
        }
        .sidebar-nav-item:not(.active) {
          color: #475569 !important;
          border: 1px solid transparent !important;
        }
        .sidebar-nav-item:not(.active):hover {
          background-color: #f8fafc !important;
          color: #0f172a !important;
        }
        .sidebar-backdrop {
          backdrop-filter: blur(4px);
        }
      `}</style>

      <IconSprite />
      <div className="shell">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
          {/* Brand Header */}
          <div className="brand" style={{ flexShrink: 0, padding: '20px 16px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="mark" style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <img src={logo} alt="Logo Posyandu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="brand-name" style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Posyandu Loa Duri Ulu
              </div>
              <div className="brand-sub" style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {namaPosyandu ? `Posyandu ${namaPosyandu}` : 'Sistem Pelayanan Terpadu'}
              </div>
            </div>
          </div>

          {/* User Profile Card di bagian paling atas Sidebar */}
          <div className="sidebar-user-card" style={{ flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0, boxShadow: '0 2px 6px rgba(0, 128, 128, 0.2)' }}>
              <User size={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userAuth.name || userAuth.username}
              </div>
              <div style={{ fontSize: '11.5px', color: '#008080', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                {getRoleLabel()}
              </div>
            </div>
          </div>

          {/* Nav Items Container */}
          <div id="navContainer">
            {NAV[role]?.map(group => (
              <React.Fragment key={group.group}>
                <div className="nav-group-label" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', padding: '14px 10px 6px', letterSpacing: '0.06em' }}>
                  {group.group}
                </div>
                {group.items.map(item => (
                  <div
                    key={item.id}
                    className={`sidebar-nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="ico" style={{ display: 'flex', alignItems: 'center', color: currentView === item.id ? 'var(--primary-teal, #008080)' : '#64748b' }}>
                      {item.ico && <item.ico size={17} />}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Logout Button */}
            <div className="sidebar-foot" style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                className="logout-btn"
                onClick={onLogout}
                style={{
                  minHeight: '44px',
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid #fee2e2',
                  backgroundColor: '#fff1f2',
                  color: '#e11d48',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffe4e6';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff1f2';
                  e.currentTarget.style.borderColor = '#fee2e2';
                }}
              >
                <LogOut size={16} />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>

        {/* MAIN AREA */}
        <div className="main">
          <DashboardNavbar
            title={TITLES[currentView] ? TITLES[currentView][0] : 'Beranda'}
            desc={TITLES[currentView] ? TITLES[currentView][1] : ''}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="content" style={{ padding: 'clamp(16px, 3vw, 28px) clamp(12px, 2.5vw, 24px)', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <div className="view active" style={{ animation: 'fadein .25s ease' }}>
              <DashboardPageHeader
                eyebrow={TITLES[currentView]?.[2] || 'LAYANAN POSYANDU'}
                title={TITLES[currentView]?.[0] || 'Posyandu Loa Duri Ulu'}
                description={TITLES[currentView]?.[1] || ''}
                posyanduName={namaPosyandu}
              />
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
