import React, { useState } from 'react';
import logoHeader from '../../assets/images/common/logo-header.jpeg';
import { Menu, X, Home, Users, BookText, CalendarDays, Calculator, LogIn } from 'lucide-react';

export default function Header({ activePage = 'beranda', onNavigate, onDarurat }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleClick = (e, pageId) => {
    e.preventDefault();
    setSidebarOpen(false);

    if (onNavigate) {
      onNavigate(pageId);
    } else {
      window.location.hash = pageId;
    }
  };

  return (
    <>
      <header className="header-navbar">
        <div className="header-content">
          {/* KIRI: Logo & Title */}
          <div className="header-left">
            <div
              className="header-brand"
              onClick={(e) => handleClick(e, 'beranda')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <img
                src={logoHeader}
                className="header-logo"
                alt="Logo Posyandu Loa Duri Ulu"
                loading="lazy"
                style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div>
                <div className="brand-title" style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>
                  Posyandu Loa Duri Ulu
                </div>
                <div className="brand-subtitle" style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 500 }}>
                  Layanan Kesehatan Masyarakat
                </div>
              </div>
            </div>
          </div>

          {/* TENGAH: Menu Navigasi Desktop */}
          <nav className="header-nav">
            <a
              href="#beranda"
              className={`nav-item ${activePage === 'beranda' ? 'active' : ''}`}
              onClick={(e) => handleClick(e, 'beranda')}
              style={{ fontSize: '15.5px', fontWeight: activePage === 'beranda' ? 700 : 600, padding: '10px 16px' }}
            >
              Beranda
            </a>
            <a
              href="#profil"
              className={`nav-item ${activePage === 'profil' ? 'active' : ''}`}
              onClick={(e) => handleClick(e, 'profil')}
              style={{ fontSize: '15px', padding: '10px 16px' }}
            >
              Profil
            </a>
            <a
              href="#artikel"
              className={`nav-item ${activePage === 'artikel' ? 'active' : ''}`}
              onClick={(e) => handleClick(e, 'artikel')}
              style={{ fontSize: '15px', padding: '10px 16px' }}
            >
              Artikel
            </a>
            <a
              href="#jadwal"
              className={`nav-item ${activePage === 'jadwal' ? 'active' : ''}`}
              onClick={(e) => handleClick(e, 'jadwal')}
              style={{ fontSize: '15px', padding: '10px 16px' }}
            >
              Jadwal
            </a>
            <a
              href="#kalkulator"
              className={`nav-item ${activePage === 'kalkulator' ? 'active' : ''}`}
              onClick={(e) => handleClick(e, 'kalkulator')}
              style={{ fontSize: '15px', padding: '10px 16px' }}
            >
              Kalkulator
            </a>
          </nav>

          {/* KANAN: Tombol Masuk (Desktop) & Hamburger Menu (Mobile) */}
          <div className="header-actions">
            <button
              type="button"
              className="signin-btn desktop-only"
              onClick={() => onNavigate && onNavigate('login')}
              style={{
                minHeight: '44px',
                padding: '0 24px',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <LogIn size={16} />
              Masuk
            </button>
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
              style={{
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10001
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Background Gelap saat Menu Terbuka */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`mobile-dropdown-menu ${sidebarOpen ? 'show' : ''}`}>
        <div className="mobile-dropdown-content" style={{ padding: '24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <img src={logoHeader} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
            <div>
              <strong style={{ fontSize: '15px', color: '#0f172a' }}>Posyandu Loa Duri Ulu</strong>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Menu Navigasi</div>
            </div>
          </div>

          <button
            className={`mobile-nav-btn ${activePage === 'beranda' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'beranda')}
            style={{ minHeight: '48px', fontSize: '16px', fontWeight: 600, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px' }}
          >
            <Home size={18} /> Beranda
          </button>
          <button
            className={`mobile-nav-btn ${activePage === 'profil' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'profil')}
            style={{ minHeight: '48px', fontSize: '16px', fontWeight: 600, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px' }}
          >
            <Users size={18} /> Profil 9 Posyandu
          </button>
          <button
            className={`mobile-nav-btn ${activePage === 'artikel' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'artikel')}
            style={{ minHeight: '48px', fontSize: '16px', fontWeight: 600, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px' }}
          >
            <BookText size={18} /> Artikel Kesehatan
          </button>
          <button
            className={`mobile-nav-btn ${activePage === 'jadwal' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'jadwal')}
            style={{ minHeight: '48px', fontSize: '16px', fontWeight: 600, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px' }}
          >
            <CalendarDays size={18} /> Jadwal Kegiatan
          </button>
          <button
            className={`mobile-nav-btn ${activePage === 'kalkulator' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'kalkulator')}
            style={{ minHeight: '48px', fontSize: '16px', fontWeight: 600, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px' }}
          >
            <Calculator size={18} /> Kalkulator Gizi
          </button>

          <div className="mobile-dropdown-divider" style={{ margin: '16px 0', borderTop: '1px solid #e2e8f0' }}></div>

          <button
            className="mobile-login-btn"
            onClick={() => {
              setSidebarOpen(false);
              if (onNavigate) onNavigate('login');
            }}
            style={{
              minHeight: '48px',
              width: '100%',
              borderRadius: '12px',
              background: 'var(--primary-teal, #008080)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <LogIn size={18} /> Masuk Akun Petugas / Warga
          </button>
        </div>
      </aside>
    </>
  );
}
