import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WelcomeBanner from '../components/beranda/WelcomeBanner';
import FeatureCards from '../components/beranda/FeatureCards';
import ArticleCard from '../components/beranda/ArticleCard';

export default function Beranda({ activePage = 'beranda', onNavigate, onDarurat }) {
  return (
    <div className="beranda-wrapper beranda-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="beranda-container">
        {/* Top Hero Section */}
        <section className="hero-grid">
          <WelcomeBanner onNavigate={onNavigate} />
        </section>

        {/* Fitur Kami */}
        <section className="indicators-section">
          <FeatureCards onNavigate={onNavigate} onDarurat={onDarurat} />
        </section>

        {/* Artikel Kesehatan Terbaru */}
        <section className="content-grid" style={{ marginTop: '40px', marginBottom: '60px' }}>
          <div className="article-section-header">
            <h2 className="article-section-title">Artikel Kesehatan Terbaru</h2>
            <button className="btn btn-outline" onClick={() => onNavigate && onNavigate('artikel')}>
              Lihat Semua Artikel
            </button>
          </div>

          {/* Meneruskan onNavigate agar kartu artikel bisa diklik */}
          <ArticleCard onNavigate={onNavigate} />
        </section>
      </main>

      <Footer />
    </div>
  );
}