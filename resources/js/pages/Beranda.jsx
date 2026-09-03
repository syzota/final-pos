import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WelcomeBanner from '../components/beranda/WelcomeBanner';
import FeatureCards from '../components/beranda/FeatureCards';
import ArticleCard from '../components/beranda/ArticleCard';
import SectionHeader from '../components/common/SectionHeader';
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
          <SectionHeader
            eyebrow="Edukasi & Informasi Terkini"
            title="Artikel Kesehatan Terbaru"
            description="Informasi terpercaya seputar tumbuh kembang balita, pola gizi keluarga, dan tips kesehatan dari kader Posyandu terpercaya."
          />

          {/* Grid Kartu Artikel */}
          <ArticleCard onNavigate={onNavigate} />

          {/* Tombol Lihat Semua Artikel */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <button
              type="button"
              className="btn-lihat-artikel"
              onClick={() => onNavigate && onNavigate('artikel')}
              style={{
                minHeight: '48px',
                padding: '12px 34px',
                borderRadius: '999px',
                fontSize: '15px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: 'var(--primary-500, #008080)',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 6px 18px rgba(0, 128, 128, 0.22)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-600, #007373)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 128, 128, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-500, #008080)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 128, 128, 0.22)';
              }}
            >
              <span>Lihat Semua Artikel Kesehatan</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}