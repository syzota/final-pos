import React, { useState, useEffect } from 'react';
import axiosClient from './api/axiosClient';
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

  // State pelindung untuk mencegah render sebelum tiket divalidasi
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);

    // FUNGSI BARU: Pemulihan Sesi (Session Persistence)
    const verifySession = async () => {
      const token = localStorage.getItem('auth_token');

      if (token) {
        try {
          // Inspeksi token ke backend untuk memastikan belum expired/diblokir
          const response = await axiosClient.get('/me');
          setUserAuth(response.data.data);
        } catch (error) {
          console.error("Token tidak valid / expired:", error);
          localStorage.removeItem('auth_token'); // Buang token palsu/usang
        }
      }
      setIsCheckingAuth(false); // Buka layar setelah pemeriksaan selesai
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
      console.error("Gagal logout dari server:", error);
    } finally {
      localStorage.removeItem('auth_token');
      setUserAuth(null);
      handleNavigate('login');
    }
  };

  const pageProps = { activePage, onNavigate: handleNavigate, onDarurat: handleOpenDarurat };

  // Tampilkan layar loading putih (atau animasi) selama proses inspeksi berlangsung
  if (isCheckingAuth) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Memverifikasi keamanan sesi...</div>;
  }

  return (
    <>
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
    </>
  );
}

export default App;