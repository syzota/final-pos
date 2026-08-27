import React from 'react';
import heroBgPattern from '../../assets/images/profil/hero-bg-pattern.jpg';

export default function ProfilHeroBanner() {
  return (
    <div className="profil-hero-card">
      <div className="hero-bg-wrapper">
        <img src={heroBgPattern} alt="Decoration Pattern" className="hero-bg-img" />
      </div>
      <div className="hero-content">
        <div className="hero-title-row">
          <span className="hero-title-main">Profil </span>
          <span className="hero-badge">Posyandu Loa Duri Ulu</span>
        </div>
        <p className="hero-quote">
          "Selamat datang di halaman resmi Posyandu Loa Duri Ulu. Kami berkomitmen memberikan pelayanan kesehatan primer yang berkualitas, proaktif, dan berkelanjutan bagi ibu hamil, bayi, balita, serta seluruh anggota keluarga untuk mewujudkan generasi sehat dan berkualitas."
        </p>
        <p className="hero-desc">
          Garda terdepan pelayanan kesehatan masyarakat desa, menerapkan transformasi pelayanan kesehatan primer melalui 6 SPM agar setiap warga mendapatkan hak dasarnya secara merata.
        </p>
      </div>
    </div>
  );
}