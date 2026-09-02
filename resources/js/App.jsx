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

function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'profil') return 'profil';
    if (hash === 'artikel') return 'artikel';
    if (hash === 'detail-artikel') return 'detail-artikel';
    if (hash === 'jadwal') return 'jadwal';
    if (hash === 'kalkulator') return 'kalkulator';
    if (hash === 'kontak') return 'kontak';
    if (hash === 'login') return 'login';
    if (hash === 'dashboard') return 'dashboard';
    return 'beranda';
  };

  const [activePage, setActivePage] = useState(getPageFromHash());
  const [userAuth, setUserAuth] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash());
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="app-container page-fade-in">
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
      ) : (
        <Beranda {...pageProps} />
      )}
    </div>
  );
}

export default App;