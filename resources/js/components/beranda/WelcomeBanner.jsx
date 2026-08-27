import React from 'react';
import heroImg from '../../assets/images/common/hero-beranda.png';

export default function WelcomeBanner({ onNavigate }) {
  return (
    <section className="medical-hero">

      {/* =========================
          HERO BACKGROUND
          ========================= */}
      <div className="medical-hero__background">
        <img
          src={heroImg}
          alt=""
          className="medical-hero__background-image"
        />

        <div className="medical-hero__overlay"></div>
        <div className="medical-hero__gradient"></div>
      </div>


      {/* =========================
          HERO CONTENT
          ========================= */}
      <div className="medical-hero__content">

        <div className="medical-hero__badge">
          <i className="bi bi-heart-pulse-fill"></i>
          <span>Portal Kesehatan Masyarakat</span>
        </div>

        <h1 className="medical-hero__title">
          Tempat Nyaman untuk
          <br />
          Menjaga Kesehatan
          <br />
          <span>Keluarga Anda</span>
        </h1>

        <p className="medical-hero__description">
          Temukan informasi layanan Posyandu, jadwal kegiatan,
          edukasi kesehatan, serta layanan pendukung masyarakat
          Loa Duri Ulu dalam satu portal.
        </p>

        <div className="medical-hero__buttons">

          <button
            type="button"
            className="medical-hero__primary-button"
            onClick={() => onNavigate && onNavigate('jadwal')}
          >
            Lihat Jadwal Posyandu

            <span className="medical-hero__button-icon">
              <i className="bi bi-arrow-right"></i>
            </span>
          </button>

          <button
            type="button"
            className="medical-hero__secondary-button"
            onClick={() => onNavigate && onNavigate('profil')}
          >
            Kenali Posyandu
          </button>

        </div>

      </div>


      {/* =========================
          BOTTOM INFORMATION PANEL
          ========================= */}
      <div className="medical-hero__service-panel">

        <div className="medical-hero__service-item">

          <div className="medical-hero__service-icon">
            <i className="bi bi-calendar2-check"></i>
          </div>

          <div className="medical-hero__service-text">
            <span className="medical-hero__service-label">
              Jadwal Layanan
            </span>

            <strong>
              Lihat kegiatan Posyandu
            </strong>
          </div>

        </div>


        <div className="medical-hero__divider"></div>


        <div className="medical-hero__service-item">

          <div className="medical-hero__service-icon">
            <i className="bi bi-journal-medical"></i>
          </div>

          <div className="medical-hero__service-text">
            <span className="medical-hero__service-label">
              Edukasi Kesehatan
            </span>

            <strong>
              Informasi untuk keluarga
            </strong>
          </div>

        </div>


        <div className="medical-hero__divider"></div>


        <div className="medical-hero__service-item">

          <div className="medical-hero__service-icon">
            <i className="bi bi-geo-alt"></i>
          </div>

          <div className="medical-hero__service-text">
            <span className="medical-hero__service-label">
              Wilayah Layanan
            </span>

            <strong>
              Loa Duri Ulu
            </strong>
          </div>

        </div>


        <button
          type="button"
          className="medical-hero__panel-button"
          onClick={() => onNavigate && onNavigate('profil')}
        >
          Lihat Informasi

          <i className="bi bi-arrow-up-right"></i>
        </button>

      </div>

    </section>
  );
}