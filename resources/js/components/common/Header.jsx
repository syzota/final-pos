import React, { useState, useEffect } from 'react';
import logoHeader from '../../assets/images/common/logo-header.jpeg';
import { Menu, X, Home, Users, BookText, CalendarDays, Calculator, LogIn } from 'lucide-react';

export default function Header({ activePage = 'beranda', onNavigate, onDarurat }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

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
          <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'profil', label: 'Profil' },
              { id: 'artikel', label: 'Artikel' },
              { id: 'jadwal', label: 'Jadwal' },
              { id: 'kalkulator', label: 'Kalkulator' },
              { id: 'kontak', label: 'Kontak' },
            ].map((item) => {
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleClick(e, item.id)}
                  style={{
                    fontSize: '14.5px',
                    fontWeight: isActive ? 700 : 600,
                    padding: '8px 16px',
                    borderRadius: '999px',
                    backgroundColor: isActive ? 'var(--secondary-200)' : 'transparent',
                    color: isActive ? 'var(--primary-900)' : 'var(--neutral-600)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* KANAN: Tombol Masuk (Desktop) & Hamburger Menu (Mobile) */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="signin-btn desktop-only"
              onClick={() => onNavigate && onNavigate('login')}
              style={{
                minHeight: '42px',
                padding: '0 20px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--primary-500)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(0, 128, 128, 0.2)'
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'beranda', label: 'Beranda', icon: Home },
              { id: 'profil', label: 'Profil Posyandu', icon: Users },
              { id: 'artikel', label: 'Artikel Kesehatan', icon: BookText },
              { id: 'jadwal', label: 'Jadwal Kegiatan', icon: CalendarDays },
              { id: 'kalkulator', label: 'Kalkulator Gizi', icon: Calculator },
              { id: 'kontak', label: 'Kontak & Bantuan', icon: Users },
            ].map((item) => {
              const isActive = activePage === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleClick(e, item.id)}
                  style={{
                    minHeight: '48px',
                    fontSize: '15px',
                    fontWeight: isActive ? 700 : 600,
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--secondary-200)' : 'transparent',
                    color: isActive ? 'var(--primary-900)' : 'var(--neutral-700)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <IconComp size={18} color={isActive ? 'var(--primary-700)' : 'var(--neutral-500)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mobile-dropdown-divider" style={{ margin: '16px 0', borderTop: '1px solid var(--neutral-200)' }}></div>

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
              background: 'var(--primary-500)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 128, 128, 0.25)'
            }}
          >
            <LogIn size={18} /> Masuk ke Akun
          </button>
        </div>
      </aside>
    </>
  );
}
