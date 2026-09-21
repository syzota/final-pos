import React, { useState, useEffect } from 'react';
import logoHeader from '../../assets/images/common/logo-header.jpeg';
import { 
  Home01Icon, 
  UserGroupIcon, 
  Book02Icon, 
  Calendar01Icon, 
  Calculator01Icon, 
  Call02Icon, 
  Login01Icon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';
import { 
  Menu01Icon, 
  Cancel01Icon 
} from '@theexperiencecompany/gaia-icons/stroke-rounded';

const NAV_ITEMS = [
  { id: 'beranda', label: 'Beranda', icon: Home01Icon },
  { id: 'profil', label: 'Profil', fullLabel: 'Profil Posyandu', icon: UserGroupIcon },
  { id: 'artikel', label: 'Artikel', fullLabel: 'Artikel Kesehatan', icon: Book02Icon },
  { id: 'jadwal', label: 'Jadwal', fullLabel: 'Jadwal Kegiatan', icon: Calendar01Icon },
  { id: 'kalkulator', label: 'Kalkulator', fullLabel: 'Kalkulator Gizi', icon: Calculator01Icon },
  { id: 'kontak', label: 'Kontak', fullLabel: 'Kontak & Bantuan', icon: Call02Icon },
];

export default function Navbar({ activePage = 'beranda', onNavigate, onDarurat }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          {/* Brand Logo & Title */}
          <div className="header-left">
            <div
              className="header-brand"
              onClick={(e) => handleClick(e, 'beranda')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', height: '100%' }}
            >
              <img
                src={logoHeader}
                className="header-logo"
                alt="Logo Posyandu Loa Duri Ulu"
                loading="lazy"
                style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, display: 'block' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="brand-title" style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink, #0f172a)', lineHeight: 1.2, margin: 0, display: 'flex', alignItems: 'center' }}>
                  Posyandu Loa Duri Ulu
                </div>
                <div className="brand-subtitle" style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)', fontWeight: 500, lineHeight: 1.2, marginTop: '2px', display: 'flex', alignItems: 'center' }}>
                  Layanan Kesehatan Masyarakat
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
            {NAV_ITEMS.map((item) => {
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
                    height: '40px',
                    padding: '0 18px',
                    borderRadius: '999px',
                    backgroundColor: isActive ? 'var(--secondary-200)' : 'transparent',
                    color: isActive ? 'var(--primary-900)' : 'var(--neutral-600)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    boxSizing: 'border-box',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Actions: Sign In (Desktop) & Hamburger (Mobile/Tablet) */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '100%' }}>
            <button
              type="button"
              className="signin-btn desktop-only"
              onClick={() => onNavigate && onNavigate('login')}
              style={{
                height: '40px',
                minHeight: '40px',
                padding: '0 20px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: 'var(--primary-500)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 8px rgba(0, 128, 128, 0.2)',
                lineHeight: 1,
                boxSizing: 'border-box',
              }}
            >
              <Login01Icon size={16} />
              <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Masuk</span>
            </button>

            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
              style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10001,
                padding: 0,
                border: 'none',
                background: 'transparent',
                lineHeight: 1,
                boxSizing: 'border-box',
              }}
            >
              {sidebarOpen ? <Cancel01Icon size={24} /> : <Menu01Icon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Dropdown Menu seamlessly attached to header */}
        <aside className={`mobile-dropdown-menu ${sidebarOpen ? 'show' : ''}`}>
          <div className="mobile-dropdown-content" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {NAV_ITEMS.map((item) => {
                const isActive = activePage === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleClick(e, item.id)}
                    style={{
                      height: '48px',
                      minHeight: '48px',
                      fontSize: '15px',
                      fontWeight: isActive ? 700 : 600,
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '0 16px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--secondary-200)' : 'transparent',
                      color: isActive ? 'var(--primary-900)' : 'var(--neutral-700)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      lineHeight: 1,
                      boxSizing: 'border-box',
                    }}
                  >
                    <IconComp size={18} color={isActive ? 'var(--primary-700)' : 'var(--neutral-500)'} style={{ flexShrink: 0 }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
                      {item.fullLabel || item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mobile-dropdown-divider" style={{ margin: '14px 0', borderTop: '1px solid var(--neutral-200)' }}></div>

            <button
              className="mobile-login-btn"
              onClick={() => {
                setSidebarOpen(false);
                if (onNavigate) onNavigate('login');
              }}
              style={{
                height: '48px',
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
                boxShadow: '0 4px 12px rgba(0, 128, 128, 0.25)',
                lineHeight: 1,
                boxSizing: 'border-box',
              }}
            >
              <Login01Icon size={18} />
              <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Masuk ke Akun</span>
            </button>
          </div>
        </aside>
      </header>

      {/* Spacer to preserve document layout since navbar is fixed */}
      <div className="header-navbar-spacer" aria-hidden="true" />

      {/* Dark Overlay when mobile menu is open */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
        onTouchMove={(e) => e.preventDefault()}
      />
    </>
  );
}
