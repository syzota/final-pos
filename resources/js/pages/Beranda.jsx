import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WelcomeBanner from '../components/beranda/WelcomeBanner';
import FeatureCards from '../components/beranda/FeatureCards';
import ArticleCard from '../components/beranda/ArticleCard';
import SectionHeader from '../components/common/SectionHeader';
import Button from '../components/common/Button';
import { ArrowRight01Icon } from '@theexperiencecompany/gaia-icons/solid-rounded';
import useScrollReveal from '../utils/useScrollReveal';

export default function Beranda({ activePage = 'beranda', onNavigate, onDarurat }) {
  useScrollReveal();

  return (
    <div className="beranda-wrapper beranda-page">
      <Navbar activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="beranda-container">
        {/* Top Hero Section */}
        <section className="hero-grid reveal-section">
          <WelcomeBanner onNavigate={onNavigate} />
        </section>

        {/* Fitur Akses Cepat */}
        <section className="indicators-section reveal-section reveal-delay-1" style={{ marginTop: '24px' }}>
          <FeatureCards onNavigate={onNavigate} onDarurat={onDarurat} />
        </section>

        {/* Artikel Kesehatan Terbaru */}
        <section className="content-grid reveal-on-scroll" style={{ marginTop: '48px', marginBottom: '64px' }}>
          <SectionHeader
            eyebrow="Edukasi & Informasi Terkini"
            title="Artikel Kesehatan Terbaru"
            description="Informasi terpercaya seputar tumbuh kembang balita, pola gizi keluarga, dan tips kesehatan dari kader Posyandu terpercaya."
          />

          {/* Grid Kartu Artikel */}
          <ArticleCard onNavigate={onNavigate} />

          {/* Tombol Lihat Semua Artikel */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight01Icon}
              onClick={() => onNavigate && onNavigate('artikel')}
            >
              Lihat Semua Artikel Kesehatan
            </Button>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}