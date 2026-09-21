import React from 'react';
import '../../styles/footer.css';
import logoFooter from '../../assets/images/common/logo-footer.jpeg';
import { 
  Call02Icon, 
  Location01Icon, 
  BubbleChatIcon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (e, pageId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      window.location.hash = pageId;
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-top">
          {/* Brand & Description */}
          <div className="footer-brand">
            <div 
              className="footer-brand-title" 
              onClick={(e) => handleLinkClick(e, 'beranda')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
            >
              <img 
                src={logoFooter} 
                alt="Logo Posyandu" 
                style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#ffffff', padding: '4px' }} 
              />
              <div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', display: 'block', letterSpacing: '-0.01em' }}>
                  Posyandu Loa Duri Ulu
                </span>
                <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: 500 }}>
                  Kecamatan Kutai Kartanegara
                </span>
              </div>
            </div>
            <p className="footer-brand-desc" style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '340px', margin: 0 }}>
              Pusat layanan pemantauan tumbuh kembang balita, imunisasi, dan edukasi kesehatan keluarga di 9 Posyandu Desa Loa Duri Ulu.
            </p>
            
            <div className="footer-social-links" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <a
                href="https://wa.me/6281250001001"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="WhatsApp Posyandu"
                title="Hubungi via WhatsApp"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22c55e',
                  transition: 'background 0.2s ease'
                }}
              >
                <BubbleChatIcon size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links-group" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div className="footer-col">
              <div className="footer-col-title" style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                Layanan & Informasi
              </div>
              <a href="#profil" onClick={(e) => handleLinkClick(e, 'profil')} className="footer-link">Profil Posyandu</a>
              <a href="#artikel" onClick={(e) => handleLinkClick(e, 'artikel')} className="footer-link">Artikel & Edukasi</a>
              <a href="#jadwal" onClick={(e) => handleLinkClick(e, 'jadwal')} className="footer-link">Jadwal Penimbangan</a>
              <a href="#kalkulator" onClick={(e) => handleLinkClick(e, 'kalkulator')} className="footer-link">Kalkulator Gizi</a>
              <a href="#kontak" onClick={(e) => handleLinkClick(e, 'kontak')} className="footer-link">Kontak Darurat Medis</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title" style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                Wilayah Pelayanan
              </div>
              <div 
                style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Location01Icon size={16} style={{ flexShrink: 0, color: '#38bdf8' }} />
                <span>Desa Loa Duri Ulu, Kutai Kartanegara</span>
              </div>
              <a 
                href="tel:081250001001"
                style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Call02Icon size={16} style={{ flexShrink: 0, color: '#38bdf8' }} />
                <span>0812-5000-1001</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom: Left-aligned copyright */}
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '32px' }}>
          <div className="copyright" style={{ width: '100%', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>
            © {new Date().getFullYear()} Posyandu Desa Loa Duri Ulu. Seluruh hak cipta dilindungi undang-undang.
          </div>
        </div>
      </div>
    </footer>
  );
}
