import React from 'react';
import '../../styles/footer.css';
import logoFooter from '../../assets/images/common/logo-footer.jpeg';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-top">
          {/* Brand & Description */}
          <div className="footer-brand">
            <div className="footer-brand-title">
              <img src={logoFooter} alt="Posyandu Loa Duri Ulu" className="footer-logo" />
              <span>Posyandu Loa Duri Ulu</span>
            </div>
            <p className="footer-desc">
              Mewujudkan masyarakat Loa Duri Ulu yang sehat, cerdas, dan sejahtera melalui layanan kesehatan terpadu.
            </p>
          </div>

          {/* Links Columns */}
          <div className="footer-links-group">
            <div className="footer-col">
              <div className="footer-col-title">Layanan</div>
              <a href="#profil" className="footer-link">Profil Posyandu</a>
              <a href="#artikel" className="footer-link">Artikel</a>
              <a href="#jadwal" className="footer-link">Jadwal Kegiatan</a>
              <a href="#kalkulator" className="footer-link">Kalkulator</a>
              <a href="#kontak" className="footer-link">Kontak Kami</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright text-center" style={{ width: '100%', textAlign: 'center' }}>
            © 2026 Posyandu Loa Duri Ulu. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
