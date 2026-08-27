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
              <a href="#tumbuh-kembang" className="footer-link">Tumbuh Kembang</a>
              <a href="#imunisasi" className="footer-link">Imunisasi</a>
              <a href="#ibu-hamil" className="footer-link">Ibu Hamil</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Informasi</div>
              <a href="#artikel" className="footer-link">Artikel Kesehatan</a>
              <a href="#jadwal" className="footer-link">Jadwal Kegiatan</a>
              <a href="#kontak" className="footer-link">Kontak Kami</a>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Internal</div>
              <a href="#ketentuan" className="footer-link">Ketentuan Layanan</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="copyright">
            © 2026 Posyandu Loa Duri Ulu. Website by Information System Association (INFORSA) University of Mulawarman. All rights reserved.
          </div>

          {/* Social Icons */}
          <div className="social-icons">

            <button
              className="social-icon-btn"
              aria-label="Website"
            >
              <i
                className="bi bi-globe2"
                style={{ fontSize: '15px' }}
              ></i>
            </button>

            <button
              className="social-icon-btn"
              aria-label="Bagikan"
            >
              <i
                className="bi bi-share-fill"
                style={{ fontSize: '14px' }}
              ></i>
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}
