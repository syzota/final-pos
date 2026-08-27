import React, { useEffect } from 'react';
import mapImg from '../../assets/images/kontak/54243392f51f09bbc2ff0fcd22e5e5364ef2c9ac.jpeg';
import '../../styles/kontak.css';

export default function KontakDaruratModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="kontak-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="kontak-modal" role="dialog" aria-modal="true" aria-label="Kontak Darurat">
        {/* Close Button */}
        <button className="kontak-close-btn" onClick={onClose} aria-label="Tutup">✕</button>

        <div className="kontak-content">
          {/* Header */}
          <div className="kontak-header">
            <h1 className="kontak-main-title">Bantuan Segera</h1>
            <p className="kontak-main-subtitle">
              Klik tombol di bawah ini untuk segera terhubung dengan layanan darurat atau
              fasilitas kesehatan terdekat.
            </p>
          </div>

          {/* Emergency Number */}
          <div className="kontak-emergency-card">
            <div className="kontak-phone-icon">
              <svg width="80" height="70" viewBox="0 0 124 109" fill="none">
                <path
                  d="M110.2222 54.349C110.2222 42.5734 105.5435 32.5843 96.1861 24.3816 86.8287 16.1789 75.4333 12.0776 62 12.0776V0C70.6111 0 78.6768 1.4342 86.1972 4.3026 93.7176 7.1711 100.262 11.0459 105.8306 15.9273 111.3991 20.8086 115.8194 26.5455 119.0917 33.1378 122.3639 39.7301 124 46.8006 124 54.349H110.2222ZM82.6667 54.349C82.6667 49.3167 80.6574 45.0392 76.6389 41.5166 72.6204 37.994 67.7407 36.2327 62 36.2327V24.1551C71.5296 24.1551 79.6528 27.099 86.3694 32.9868 93.0861 38.8747 96.4444 45.9954 96.4444 54.349H82.6667ZM116.7667 109C102.4148 109 88.2352 106.2574 74.2278 100.7722 60.2204 95.2869 47.4759 87.512 35.9944 77.4474 24.513 67.3827 15.6435 56.211 9.3861 43.9321 3.1287 31.6533 0 19.2235 0 6.6427 0 4.831 0.6889 3.3213 2.0667 2.1136 3.4444 0.9058 5.1667 0.3019 7.2333 0.3019H35.1333C36.7407 0.3019 38.1759 0.78 39.4389 1.7361 40.7019 2.6923 41.4481 3.8246 41.6778 5.133L46.1556 26.2687C46.3852 27.879 46.3278 29.2378 45.9833 30.3449 45.6389 31.452 45.0074 32.4081 44.0889 33.2133L27.3833 48.0083C29.6796 51.7322 32.4065 55.3303 35.5639 58.8026 38.7213 62.2749 42.1944 65.6214 45.9833 68.8421 49.5426 71.9621 53.2741 74.8557 57.1778 77.5229 61.0815 80.19 65.2148 82.6307 69.5778 84.8449L85.7667 70.6537C86.8 69.7479 88.1491 69.0686 89.8139 68.6157 91.4787 68.1627 93.1148 68.0369 94.7222 68.2382L118.4889 72.4654C120.0963 72.868 121.4167 73.5976 122.45 74.6544 123.4833 75.7112 124 76.8938 124 78.2022V102.6593C124 104.4709 123.3111 105.9806 121.9333 107.1884 120.5556 108.3961 118.8333 109 116.7667 109Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <div className="kontak-emergency-number">112 / 119</div>
              <div className="kontak-emergency-desc">Layanan Darurat Nasional (Bebas Pulsa)</div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="kontak-cards-grid">
            {/* Ambulans */}
            <div className="kontak-service-card">
              <div className="kontak-service-icon ambulans">🚑</div>
              <div className="kontak-service-info">
                <div className="kontak-service-name">Ambulans</div>
                <div className="kontak-service-desc">Tim Respon Loa Duri Ulu</div>
              </div>
              <button className="kontak-service-btn ambulans">Hubungi Ambulans</button>
            </div>

            {/* Rumah Sakit */}
            <div className="kontak-service-card">
              <div className="kontak-service-icon rumahsakit">🏥</div>
              <div className="kontak-service-info">
                <div className="kontak-service-name">Rumah Sakit UD</div>
                <div className="kontak-service-desc">Pusat Rujukan Terdekat</div>
              </div>
              <button className="kontak-service-btn rumahsakit">Hubungi IGD</button>
            </div>

            {/* Bidan Desa */}
            <div className="kontak-service-card">
              <div className="kontak-service-icon bidan">👩‍⚕️</div>
              <div className="kontak-service-info">
                <div className="kontak-service-name">Bidan Desa</div>
                <div className="kontak-service-desc">Layanan Kesehatan Ibu &amp; Bayi</div>
              </div>
              <button className="kontak-service-btn bidan">Hubungi Bidan</button>
            </div>
          </div>

          {/* Prosedur + GPS */}
          <div className="kontak-bottom-grid">
            {/* Prosedur Darurat */}
            <div className="kontak-prosedur-card">
              <div className="kontak-prosedur-header">
                <span className="kontak-prosedur-badge">ℹ️</span>
                <span className="kontak-prosedur-title">PROSEDUR DARURAT</span>
              </div>
              <div className="kontak-prosedur-steps">
                <div className="kontak-step">
                  <span className="kontak-step-check">✅</span>
                  <p className="kontak-step-text">
                    <strong>Tetap Tenang:</strong> Ambil napas dalam dan jelaskan lokasi kejadian dengan sejelas-jelasnya.
                  </p>
                </div>
                <div className="kontak-step">
                  <span className="kontak-step-check">✅</span>
                  <p className="kontak-step-text">
                    <strong>Informasi Penting:</strong> Sebutkan jenis keadaan darurat (kecelakaan, sakit mendadak, persalinan, dll).
                  </p>
                </div>
                <div className="kontak-step">
                  <span className="kontak-step-check">✅</span>
                  <p className="kontak-step-text">
                    <strong>Jangan Tutup:</strong> Biarkan telepon tetap terhubung sampai petugas meminta Anda untuk menutupnya.
                  </p>
                </div>
              </div>
            </div>

            {/* GPS Share */}
            <div className="kontak-gps-card">
              <div className="kontak-gps-bg" />
              <div className="kontak-gps-icon">📍</div>
              <div className="kontak-gps-badge">BANTU PETUGAS MENEMUKAN ANDA</div>
              <div className="kontak-gps-title">Bagikan Lokasi GPS Akurat</div>
              <p className="kontak-gps-desc">
                Lokasi Anda hanya akan dibagikan dengan petugas respon darurat saat Anda
                mengaktifkan fitur ini.
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="kontak-map-section">
            <img src={mapImg} alt="Peta Desa Loa Duri Ulu" className="kontak-map-img" />
            <div className="kontak-map-badge">
              <span className="kontak-map-badge-icon">📍</span>
              <span>
                <strong>Cakupan Wilayah:</strong> Loa Duri Ulu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
