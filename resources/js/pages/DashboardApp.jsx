import React, { useState, useEffect } from 'react';
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
  Logout01Icon,
  Home01Icon,
  Activity01Icon,
  Megaphone01Icon,
  File01Icon,
  CheckListIcon,
  UserGroupIcon,
  KitchenUtensilsIcon,
  Book02Icon,
  Key01Icon,
  Building01Icon,
  Location01Icon,
  DocumentValidationIcon,
  BarChartIcon,
  FolderCheckIcon,
  UserCheck01Icon,
  Calculator01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const NAV = {
  kader: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'dashboard', label: 'Beranda', ico: Home01Icon },
        { id: 'kelolawarga', label: 'Kelola Data Warga', ico: UserGroupIcon },
        { id: 'kesehatan', label: 'Pencatatan Kesehatan', ico: Activity01Icon },
        { id: 'pengaduan', label: 'Formulir & Pengaduan', ico: Megaphone01Icon },
        { id: 'rekap-kegiatan', label: 'Rekap Kegiatan Bulanan', ico: File01Icon },
        { id: 'data-umum', label: 'Data Umum Posyandu', ico: CheckListIcon },
        { id: 'data-tambahan', label: 'Data Tambahan', ico: Activity01Icon },
      ]
    },
    {
      group: 'Kelola Data',
      items: [
        { id: 'kelola-makanan', label: 'Kelola Data Makanan', ico: KitchenUtensilsIcon },
        { id: 'artikel', label: 'Artikel & Berita', ico: Book02Icon },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key01Icon },
      ]
    }
  ],
  ketua: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'dashboard', label: 'Beranda', ico: Home01Icon },
        { id: 'kelolawarga', label: 'Kelola Data Warga', ico: UserGroupIcon },
        { id: 'kesehatan', label: 'Pencatatan Kesehatan', ico: Activity01Icon },
        { id: 'pengaduan', label: 'Formulir & Pengaduan', ico: Megaphone01Icon },
        { id: 'rekap-kegiatan', label: 'Rekap Kegiatan Bulanan', ico: File01Icon },
        { id: 'pencatatan-kegiatan', label: 'Laporan 13 Poin', ico: CheckListIcon },
        { id: 'data-umum', label: 'Data Umum Posyandu', ico: CheckListIcon },
        { id: 'data-tambahan', label: 'Data Tambahan', ico: Activity01Icon },
      ]
    },
    {
      group: 'Kelola Posyandu',
      items: [
        { id: 'profil', label: 'Profil & Sarana', ico: Building01Icon },
        { id: 'daftar', label: 'Daftar 9 Posyandu', ico: Location01Icon },
        { id: 'kelola-makanan', label: 'Kelola Data Makanan', ico: KitchenUtensilsIcon },
        { id: 'artikel', label: 'Artikel & Berita', ico: Book02Icon },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key01Icon },
      ]
    }
  ],
  puskesmas: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'puskesmas-dashboard', label: 'Laporan per Posyandu', ico: DocumentValidationIcon },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key01Icon },
      ]
    }
  ],
  superadmin: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'superadmin-dashboard', label: 'Transparansi Pelaporan', ico: Home01Icon },
        { id: 'superadmin-analitik', label: 'Dashboard Analitik 6 Bidang', ico: BarChartIcon },
        { id: 'superadmin-ekspor', label: 'Ekspor Gabungan 9 Posyandu', ico: File01Icon },
        { id: 'admin-arsip', label: 'Arsip Laporan Posyandu', ico: FolderCheckIcon }
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key01Icon },
      ]
    }
  ],
  warga: [
    {
      group: 'Posyandu Loa Duri Ulu',
      items: [
        { id: 'warga-anak', label: 'Rapor Kesehatan Keluarga', ico: UserCheck01Icon },
        { id: 'warga-kalkulator', label: 'Kalkulator Kesehatan', ico: Calculator01Icon },
      ]
    },
    {
      group: 'Pengaturan',
      items: [
        { id: 'ganti-password', label: 'Ganti PIN / Sandi', ico: Key01Icon },
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
  'warga-kalkulator': ['Kalkulator Kesehatan', 'Hitung indeks massa tubuh (IMT), estimasi kalori harian, dan pantau kesehatan', 'LAYANAN MANDIRI'],
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

  const getViewFromHash = () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (rawHash.startsWith('dashboard/')) {
      const v = rawHash.replace('dashboard/', '').trim();
      if (v && TITLES[v]) return v;
    }
    return ROLE_HOME[role] || 'dashboard';
  };

  const [currentView, setCurrentView] = useState(getViewFromHash());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper untuk reset scroll ke paling atas secara instan & menyeluruh
  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainEl = document.querySelector('.main');
    if (mainEl) mainEl.scrollTop = 0;
    const contentEl = document.querySelector('.content');
    if (contentEl) contentEl.scrollTop = 0;
    const shellEl = document.querySelector('.shell');
    if (shellEl) shellEl.scrollTop = 0;
  };

  const handleNavClick = (id) => {
    setCurrentView(id);
    window.location.hash = `dashboard/${id}`;
    setSidebarOpen(false);
    scrollToTop();
  };

  useEffect(() => {
    const handleHash = () => {
      const raw = window.location.hash.replace('#', '').trim();
      if (raw.startsWith('dashboard/')) {
        const v = raw.replace('dashboard/', '').trim();
        if (v && TITLES[v]) setCurrentView(v);
      } else if (raw === 'dashboard') {
        setCurrentView(ROLE_HOME[role] || 'dashboard');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [role]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('sidebar-open');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('sidebar-open');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('sidebar-open');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    scrollToTop();
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });
    const timer = setTimeout(() => {
      scrollToTop();
    }, 50);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [currentView]);

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
    const rawName = (namaPosyandu || '').trim();
    const cleanPosName = rawName.replace(/^Posyandu\s+/i, '').trim();
    const displayName = cleanPosName || 'Melati';
    if (role === 'ketua') return `Ketua Posyandu ${displayName}`;
    if (role === 'kader') return `Kader Posyandu ${displayName}`;
    return 'Warga Terdaftar';
  };

  return (
    <div id="app" style={{ display: 'block' }}>
      <style>{`
        #sidebar {
          display: flex;
          flex-direction: column;
          width: 284px;
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
          padding: 10px 14px 28px !important;
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
          margin: 10px 14px 4px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%);
          border: 1px solid #ccfbf1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          box-shadow: 0 1px 4px rgba(0, 128, 128, 0.04);
        }
        .sidebar-nav-item {
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 3px;
          transition: all 0.15s ease-in-out;
          text-decoration: none;
          line-height: 1.35;
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
        body.sidebar-open {
          overflow: hidden !important;
          height: 100vh !important;
          touch-action: none !important;
        }
        body.sidebar-open .main {
          pointer-events: none !important;
          user-select: none !important;
        }
        .sidebar {
          overscroll-behavior: contain !important;
        }
        .sidebar-backdrop {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          touch-action: none;
          overscroll-behavior: contain;
        }
        .sidebar-backdrop.show {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          z-index: 1040;
          touch-action: none;
        }
      `}</style>

      <IconSprite />
      <div className="shell">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
          {/* Brand Header */}
          <div 
            className="brand" 
            onClick={() => handleNavClick('dashboard')}
            style={{ flexShrink: 0, padding: '16px 14px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            title="Ke Beranda Dashboard"
          >
            <div className="mark" style={{ width: '38px', height: '38px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'transparent' }}>
              <img src={logo} alt="Logo Posyandu" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="brand-name" style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, letterSpacing: '-0.01em', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                Posyandu Loa Duri Ulu
              </div>
              <div className="brand-sub" style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {namaPosyandu ? `Posyandu ${namaPosyandu.replace(/^Posyandu\s+/i, '')}` : 'Sistem Pelayanan Terpadu'}
              </div>
            </div>
          </div>

          {/* User Profile Card di bagian paling atas Sidebar */}
          <div className="sidebar-user-card" style={{ flexShrink: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {userAuth.name || userAuth.username}
            </div>
            <div style={{ fontSize: '11.5px', color: '#008080', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', flexShrink: 0 }}></span>
              <span style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {getRoleLabel()}
              </span>
            </div>
          </div>

          {/* Nav Items Container */}
          <div id="navContainer">
            {NAV[role]?.map(group => (
              <React.Fragment key={group.group}>
                <div className="nav-group-label" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', padding: '14px 10px 6px', letterSpacing: '0.06em' }}>
                  {group.group}
                </div>
                {group.items.map(item => (
                  <div
                    key={item.id}
                    className={`sidebar-nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="ico" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', flexShrink: 0, color: currentView === item.id ? 'var(--primary-teal, #008080)' : '#64748b' }}>
                      {item.ico && <item.ico size={18} />}
                    </span>
                    <span style={{ minWidth: 0, flex: 1, whiteSpace: 'normal', wordBreak: 'normal', overflow: 'visible', lineHeight: 1.35, textAlign: 'left' }}>
                      {item.label}
                    </span>
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
                <Logout01Icon size={16} />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        <div
          className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
          onTouchMove={(e) => e.preventDefault()}
        />

        {/* MAIN AREA */}
        <div className="main">
          <DashboardNavbar
            title={TITLES[currentView] ? TITLES[currentView][0] : 'Beranda'}
            desc={TITLES[currentView] ? TITLES[currentView][1] : ''}
            userAuth={userAuth}
            roleLabel={getRoleLabel()}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          <div className="content">
            <div key={currentView} className="view active dashboard-view-reveal">
              <DashboardPageHeader
                eyebrow={TITLES[currentView]?.[2] || 'LAYANAN POSYANDU'}
                title={TITLES[currentView]?.[0] || 'Posyandu Loa Duri Ulu'}
                description={TITLES[currentView]?.[1] || ''}
              />
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
