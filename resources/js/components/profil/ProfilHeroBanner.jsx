import React from 'react';
import heroBgPattern from '../../assets/images/profil/hero-bg-pattern.jpg';
import { Heart, Users } from 'lucide-react';

export default function ProfilHeroBanner() {
  return (
    <div className="profil-hero-card" style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
      <div className="hero-bg-wrapper">
        <img src={heroBgPattern} alt="Posyandu Loa Duri Ulu" className="hero-bg-img" loading="lazy" />
      </div>
      <div className="hero-content" style={{ padding: '40px 24px', maxWidth: '800px' }}>
        <div className="hero-title-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'rgba(0, 128, 128, 0.1)', color: 'var(--primary-teal, #008080)', padding: '6px 14px', borderRadius: '20px' }}>
            Profil Kelembagaan
          </span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', lineHeight: '1.25', marginBottom: '16px' }}>
          Melayani dengan Hati untuk Keluarga Sehat di Desa Loa Duri Ulu
        </h1>
        <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
          Posyandu Loa Duri Ulu hadir di tengah masyarakat sebagai garda terdepan pendampingan kesehatan. Kami mendampingi para ibu sejak masa kehamilan, memantau gizi buah hati, dan merawat kesehatan lansia dengan penuh kepedulian.
        </p>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13.5px', color: '#0f172a', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart size={16} color="#008080" />
            <span>9 Posyandu Aktif</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="#008080" />
            <span>Kader & Tenaga Medis Siaga</span>
          </div>
        </div>
      </div>
    </div>
  );
}