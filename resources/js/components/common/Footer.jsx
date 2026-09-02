import React from 'react';
import '../../styles/footer.css';
import logoFooter from '../../assets/images/common/logo-footer.jpeg';
import { Phone, MapPin, Mail, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-top">
          {/* Brand & Description */}
          <div className="footer-brand">
            <div className="footer-brand-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <img
                src={logoFooter}
                alt="Posyandu Loa Duri Ulu"
                className="footer-logo"
                loading="lazy"
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '18px', fontWeight: 800 }}>Posyandu Loa Duri Ulu</span>
            </div>
            <p className="footer-desc" style={{ maxWidth: '420px', lineHeight: '1.6', color: '#94a3b8' }}>
              Pusat pelayanan kesehatan primer terpadu bagi keluarga di Desa Loa Duri Ulu, Kecamatan Kutai Kartanegara. Melayani balita, remaja, ibu hamil, hingga lansia.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <a
                href="https://wa.me/6281250001001"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="WhatsApp Posyandu"
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
                <MessageCircle size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Facebook Posyandu"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  transition: 'background 0.2s ease'
                }}
              >
                <Globe size={18} />
              </a>
              <a
                href="tel:081250001001"
                className="footer-social-btn"
                aria-label="Telepon Layanan"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  transition: 'background 0.2s ease'
                }}
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links-group" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div className="footer-col">
              <div className="footer-col-title" style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                Layanan & Informasi
              </div>
              <a href="#profil" className="footer-link">Profil 9 Posyandu</a>
              <a href="#artikel" className="footer-link">Artikel & Edukasi</a>
              <a href="#jadwal" className="footer-link">Jadwal Penimbangan</a>
              <a href="#kalkulator" className="footer-link">Kalkulator Gizi</a>
              <a href="#kontak" className="footer-link">Kontak Darurat Medis</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title" style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                Wilayah Pelayanan
              </div>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 8px 0' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Desa Loa Duri Ulu, Kutai Kartanegara
              </p>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 8px 0' }}>
                <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} />
                posyanduloaduriulu@gmail.com
              </p>
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
