import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WelcomeBanner from '../components/beranda/WelcomeBanner';
import FeatureCards from '../components/beranda/FeatureCards';
import ArticleCard from '../components/beranda/ArticleCard';
import { ArrowRight } from 'lucide-react';

export default function Beranda({ activePage = 'beranda', onNavigate, onDarurat }) {
  return (
    <div className="beranda-wrapper beranda-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="beranda-container">
        {/* Top Hero Section */}
        <section className="hero-grid">
          <WelcomeBanner onNavigate={onNavigate} />
        </section>

        {/* Fitur Akses Cepat */}
        <section className="indicators-section" style={{ marginTop: '24px' }}>
          <FeatureCards onNavigate={onNavigate} onDarurat={onDarurat} />
        </section>

        {/* Artikel Kesehatan Terbaru */}
        <section className="content-grid" style={{ marginTop: '48px', marginBottom: '64px' }}>
          <div className="article-section-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Edukasi & Informasi Terkini
            </span>
            <h2 className="article-section-title" style={{ fontSize: '26px', fontWeight: 800, marginTop: '4px', color: '#0f172a' }}>
              Artikel Kesehatan Terbaru
            </h2>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '600px', margin: '6px auto 0' }}>
              Informasi terpercaya seputar tumbuh kembang balita, pola gizi keluarga, dan tips kesehatan dari kader terpercaya.
            </p>
          </div>

          {/* Grid Kartu Artikel */}
          <ArticleCard onNavigate={onNavigate} />

          {/* Tombol Lihat Semua Artikel di Bagian Bawah (Model See More) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onNavigate && onNavigate('artikel')}
              style={{
                minHeight: '46px',
                padding: '0 32px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--primary-teal, #008080)',
                borderColor: 'var(--primary-teal, #008080)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Lihat Semua Artikel Kesehatan
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}