import React, { useEffect, useState } from 'react';
import '../../styles/mobile-nav.css';

export default function MobileNav({ activePage, onNavigate, onDarurat }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-item ${activePage === 'beranda' ? 'active' : ''}`}
        onClick={() => onNavigate && onNavigate('beranda')}
      >
        <div className="mobile-nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <span className="mobile-nav-label">Beranda</span>
      </button>

      <button 
        className={`mobile-nav-item ${activePage === 'kalkulator' ? 'active' : ''}`}
        onClick={() => onNavigate && onNavigate('kalkulator')}
      >
        <div className="mobile-nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="14" x2="16" y2="14.01"></line>
            <line x1="12" y1="14" x2="12" y2="14.01"></line>
            <line x1="8" y1="14" x2="8" y2="14.01"></line>
            <line x1="16" y1="18" x2="16" y2="18.01"></line>
            <line x1="12" y1="18" x2="12" y2="18.01"></line>
            <line x1="8" y1="18" x2="8" y2="18.01"></line>
          </svg>
        </div>
        <span className="mobile-nav-label">Kalkulator</span>
      </button>

      <button 
        className={`mobile-nav-item ${activePage === 'artikel' ? 'active' : ''}`}
        onClick={() => onNavigate && onNavigate('artikel')}
      >
        <div className="mobile-nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <span className="mobile-nav-label">Artikel</span>
      </button>

      <button 
        className={`mobile-nav-item ${activePage === 'jadwal' ? 'active' : ''}`}
        onClick={() => onNavigate && onNavigate('jadwal')}
      >
        <div className="mobile-nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <span className="mobile-nav-label">Jadwal</span>
      </button>

      <button 
        className="mobile-nav-item darurat"
        onClick={onDarurat}
      >
        <div className="mobile-nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <span className="mobile-nav-label">Darurat</span>
      </button>
    </nav>
  );
}
