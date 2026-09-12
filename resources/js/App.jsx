import React, { useState, useEffect } from 'react';
import axiosClient from './api/axiosClient';
import logo from './assets/images/common/logo-header.jpeg';
import Beranda from './pages/Beranda';
import ProfilPosyandu from './pages/ProfilPosyandu';
import ArtikelKesehatan from './pages/ArtikelKesehatan';
import DetailArtikel from './pages/DetailArtikel';
import JadwalKegiatan from './pages/JadwalKegiatan';
import KalkulatorKesehatan from './pages/KalkulatorKesehatan';
import KontakDarurat from './pages/KontakDarurat';
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/NotFound';

const PAGE_TITLES = {
  beranda: 'Beranda | Posyandu Loa Duri Ulu',
  profil: 'Profil Posyandu | Posyandu Loa Duri Ulu',
  artikel: 'Artikel & Edukasi Kesehatan | Posyandu Loa Duri Ulu',
  'detail-artikel': 'Detail Artikel Kesehatan | Posyandu Loa Duri Ulu',
  jadwal: 'Jadwal Penimbangan & Kegiatan | Posyandu Loa Duri Ulu',
  kalkulator: 'Kalkulator Gizi & IMT | Posyandu Loa Duri Ulu',
  kontak: 'Kontak Darurat Medis | Posyandu Loa Duri Ulu',
  login: 'Masuk Akun Kader & Pengurus | Posyandu Loa Duri Ulu',
  dashboard: 'Dashboard Manajemen Posyandu | Posyandu Loa Duri Ulu',
  404: '404 - Halaman Tidak Ditemukan | Posyandu Loa Duri Ulu',
};

function App() {
  const getPageFromHash = () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (!rawHash || rawHash === '' || rawHash === 'beranda') return 'beranda';
    const VALID_PAGES = ['profil', 'artikel', 'detail-artikel', 'jadwal', 'kalkulator', 'kontak', 'login', 'dashboard'];
    if (VALID_PAGES.includes(rawHash)) return rawHash;
    return '404';
  };

  const [activePage, setActivePage] = useState(getPageFromHash());
  const [userAuth, setUserAuth] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Update dynamic page title on navigation
  useEffect(() => {
    document.title = PAGE_TITLES[activePage] || 'Posyandu Loa Duri Ulu | Layanan Kesehatan Masyarakat';
  }, [activePage]);

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
  }, [activePage]);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash());
      scrollToTop();
    };
    window.addEventListener('hashchange', handleHashChange);

    const verifySession = async () => {
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          const response = await axiosClient.get('/me');
          setUserAuth(response.data.data);
        } catch (error) {
          console.error('Token tidak valid / expired:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsCheckingAuth(false);
    };

    verifySession();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    scrollToTop();
  };

  const handleOpenDarurat = () => {
    handleNavigate('kontak');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await axiosClient.post('/logout');
      }
    } catch (error) {
      console.error('Gagal logout dari server:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUserAuth(null);
      handleNavigate('login');
    }
  };

  const pageProps = { activePage, onNavigate: handleNavigate, onDarurat: handleOpenDarurat };

  if (isCheckingAuth) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          boxShadow: '0 8px 24px rgba(0, 128, 128, 0.15)',
          overflow: 'hidden',
          marginBottom: '20px',
          animation: 'pulse 1.8s infinite ease-in-out'
        }}>
          <img src={logo} alt="Posyandu Loa Duri Ulu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#008080',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: '#475569', fontSize: '15px', fontWeight: 600, margin: 0 }}>
          Memverifikasi keamanan sesi...
        </p>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
          Posyandu Loa Duri Ulu
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div key={activePage} className="page-reveal" style={{ width: '100%' }}>
        {activePage === 'login' ? (
          <Login onNavigate={handleNavigate} onLogin={(user) => { setUserAuth(user); handleNavigate('dashboard'); }} />
        ) : activePage === 'dashboard' ? (
          <DashboardApp userAuth={userAuth} onLogout={handleLogout} />
        ) : activePage === 'profil' ? (
          <ProfilPosyandu {...pageProps} />
        ) : activePage === 'artikel' ? (
          <ArtikelKesehatan {...pageProps} />
        ) : activePage === 'detail-artikel' ? (
          <DetailArtikel {...pageProps} />
        ) : activePage === 'jadwal' ? (
          <JadwalKegiatan {...pageProps} />
        ) : activePage === 'kalkulator' ? (
          <KalkulatorKesehatan {...pageProps} />
        ) : activePage === 'kontak' ? (
          <KontakDarurat {...pageProps} />
        ) : activePage === '404' ? (
          <NotFound {...pageProps} />
        ) : (
          <Beranda {...pageProps} />
        )}
      </div>
    </div>
  );
}

export default App;