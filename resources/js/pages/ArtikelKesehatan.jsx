import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import '../styles/artikel.css';
import heroBgImg from '../assets/images/common/hero-artikel.png';
import authorImg from '../assets/images/artikel/author-sarah.jpeg';

import {
  BookHeart,
  ArrowDown,
  ListFilter,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  CircleAlert,
  BookX
} from 'lucide-react';
import Skeleton from '../components/common/Skeleton';

const topikList = [
  'Semua Topik',
  'Kesehatan',
  'Nutrisi',
  'Imunisasi',
  'Kesehatan Mental',
  'Kehamilan',
  'Pendidikan',
  'Sosial',
  'Lainnya'
];

export default function ArtikelKesehatan({ activePage, onNavigate, onDarurat }) {
  const [activeTopik, setActiveTopik] = useState('Semua Topik');
  const [artikels, setArtikels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = terbaru, 'asc' = terlama

  useEffect(() => {
    const fetchArtikels = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/artikels');
        setArtikels(response.data.data || []);
      } catch (err) {
        console.error('Gagal mengambil data artikel:', err);
        setError('Gagal memuat artikel dari server. Pastikan koneksi aktif.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtikels();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  // Filter topik & sorting
  const filteredArtikels = artikels
    .filter((artikel) => {
      if (activeTopik === 'Semua Topik') return true;
      return (artikel.kategori || '').toLowerCase() === activeTopik.toLowerCase();
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || 0);
      const dateB = new Date(b.published_at || b.created_at || 0);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const featuredArticle = filteredArtikels.length > 0 ? filteredArtikels[0] : null;
  const regularArticles = filteredArtikels.length > 1 ? filteredArtikels.slice(1) : [];

  const openArticle = (id) => {
    localStorage.setItem('active_article_id', id);
    if (onNavigate) {
      onNavigate('detail-artikel');
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="artikel-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="artikel-main">
        {/* UNIFIED HERO SECTION */}
        <PageHero
          badgeIcon={BookHeart}
          badgeText="Edukasi Kesehatan"
          title="Pengetahuan Kesehatan"
          titleHighlight="untuk Keluarga yang Lebih Sehat"
          description="Panduan praktis nutrisi, imunisasi, dan pola hidup sehat untuk keluarga."
          primaryAction={{
            label: 'Jelajahi Artikel',
            icon: ArrowDown,
            onClick: () =>
              document.getElementById('artikel-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          }}
          secondaryAction={{
            label: 'Semua Topik',
            onClick: () => {
              setActiveTopik('Semua Topik');
              document.getElementById('artikel-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
          }}
          bgImage={heroBgImg}
        />

        {/* SECTION DAFTAR ARTIKEL */}
        <section id="artikel-list" className="artikel-content-section" style={{ padding: '40px 16px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <SectionHeader
              eyebrow="KATALOG ARTIKEL"
              title="Temukan Informasi Sesuai Kebutuhan Anda"
              description="Pilih topik artikel atau gunakan pencarian untuk menemukan edukasi yang tepat."
              align="left"
              style={{ marginBottom: 0 }}
            />

            {/* Fungsionalitas Tombol Sortir */}
            <button
              type="button"
              className="sort-btn"
              onClick={toggleSort}
              style={{
                minHeight: '44px',
                padding: '0 18px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
              title="Klik untuk mengubah urutan artikel"
            >
              <ListFilter size={16} />
              Urutkan: {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
            </button>
          </div>

          {/* Chips Topik */}
          <div className="artikel-filter-bar" style={{ marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
            <div className="topik-chips" style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
              {topikList.map((topik) => (
                <button
                  type="button"
                  key={topik}
                  className={`chip ${activeTopik === topik ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTopik(topik)}
                  style={{
                    minHeight: '40px',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: activeTopik === topik ? 'var(--primary-500)' : 'var(--neutral-200)',
                    backgroundColor: activeTopik === topik ? 'var(--primary-500)' : '#ffffff',
                    color: activeTopik === topik ? '#ffffff' : 'var(--neutral-700)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: activeTopik === topik ? '0 2px 8px rgba(0, 128, 128, 0.25)' : 'none',
                  }}
                >
                  {topik}
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="artikel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={`skel-art-${i}`} type="card" />
              ))}
            </div>
          )}

          {error && (
            <div className="artikel-state artikel-state--error" style={{ textAlign: 'center', padding: '48px 20px', background: '#fef2f2', borderRadius: '16px', color: '#b91c1c' }}>
              <CircleAlert size={32} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 600, margin: 0 }}>{error}</p>
            </div>
          )}

          {!isLoading && !error && filteredArtikels.length === 0 && (
            <div className="artikel-state" style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              <BookX size={32} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
              <p style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>Belum ada artikel untuk topik "{activeTopik}".</p>
              <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Silakan pilih topik lainnya atau kembali lagi nanti.</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="artikel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Featured Article Card */}
              {featuredArticle && (
                <div className="featured-article-wrapper" style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
                  <article
                    className="featured-article-card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ position: 'relative', minHeight: '260px', overflow: 'hidden' }}>
                      <img
                        src={getImageUrl(featuredArticle.path_foto)}
                        alt={featuredArticle.judul}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: '#008080',
                          color: '#ffffff',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}
                      >
                        Pilihan Utama
                      </span>
                    </div>

                    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
                        <span style={{ color: 'var(--primary-teal, #008080)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {featuredArticle.kategori}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {formatDate(featuredArticle.published_at)}
                        </span>
                      </div>

                      <h2
                        style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: '1.35', cursor: 'pointer' }}
                        onClick={() => openArticle(featuredArticle.id)}
                      >
                        {featuredArticle.judul}
                      </h2>

                      <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.6', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {featuredArticle.isi_artikel}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={authorImg} alt="Penulis" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                            {featuredArticle.penulis?.name || 'Kader Posyandu'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => openArticle(featuredArticle.id)}
                          style={{
                            minHeight: '44px',
                            padding: '0 20px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary-teal, #008080)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '13.5px',
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Baca Artikel
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Regular Articles Grid */}
              {regularArticles.map((artikel) => (
                <article
                  key={artikel.id}
                  className="article-card"
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => openArticle(artikel.id)}
                  >
                    <img
                      src={getImageUrl(artikel.path_foto)}
                      alt={artikel.judul}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        color: 'var(--primary-teal, #008080)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}
                    >
                      {artikel.kategori}
                    </span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      <span>{formatDate(artikel.published_at)}</span>
                    </div>

                    <h3
                      style={{ fontSize: '16.5px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: '1.4', cursor: 'pointer' }}
                      onClick={() => openArticle(artikel.id)}
                    >
                      {artikel.judul}
                    </h3>

                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.5', marginBottom: '16px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {artikel.isi_artikel}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: 'auto' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>
                        {artikel.penulis?.name || 'Kader Posyandu'}
                      </span>

                      <button
                        type="button"
                        onClick={() => openArticle(artikel.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-teal, #008080)',
                          fontWeight: 700,
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Baca <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
