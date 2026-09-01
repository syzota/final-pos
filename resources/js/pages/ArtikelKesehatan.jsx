import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import '../styles/artikel.css';

import heroBgImg from '../assets/images/common/hero-artikel.png';
import authorImg from '../assets/images/artikel/author-sarah.jpeg';

import {
  BookHeart,
  ArrowDown,
  HeartPulse,
  Users,
  ShieldCheck,
  ListFilter,
  ChevronRight,
  Clock,
  CircleAlert,
  Hourglass,
  BookX,
  Calendar,
  ArrowUpRight,
  ArrowRight
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

export default function ArtikelKesehatan({
  activePage,
  onNavigate,
  onDarurat
}) {
  const [activeTopik, setActiveTopik] = useState('Semua Topik');
  const [artikels, setArtikels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtikels = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/artikels');
        setArtikels(response.data.data);
      } catch (err) {
        console.error('Gagal mengambil data artikel:', err);
        setError(
          'Gagal memuat artikel dari server. Pastikan server Laravel sedang berjalan.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtikels();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    return new Date(dateString).toLocaleDateString(
      'id-ID',
      options
    );
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    return `/storage/${path}`;
  };

  const filteredArtikels = artikels.filter((artikel) => {
    if (activeTopik === 'Semua Topik') return true;

    return (
      artikel.kategori.toLowerCase() ===
      activeTopik.toLowerCase()
    );
  });

  const featuredArticle =
    filteredArtikels.length > 0
      ? filteredArtikels[0]
      : null;

  const regularArticles =
    filteredArtikels.length > 1
      ? filteredArtikels.slice(1)
      : [];

  const openArticle = (id) => {
    localStorage.setItem('active_article_id', id);

    if (onNavigate) {
      onNavigate('detail-artikel');
    }
  };

  return (
    <div className="artikel-page">
      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        onDarurat={onDarurat}
      />

      <main className="artikel-main">

        <section className="artikel-hero">
          <div className="artikel-hero__media">
            <img
              src={heroBgImg}
              alt=""
              aria-hidden="true"
              className="artikel-hero__image"
            />
            <div className="artikel-hero__overlay"></div>
            <div className="artikel-hero__glow"></div>
          </div>

          <div className="artikel-hero__content">
            <div className="artikel-hero__badge">
              <BookHeart />
              <span>Ruang Edukasi Posyandu</span>
            </div>

            <h1 className="artikel-hero-title">
              Pengetahuan Kesehatan
              <span> untuk Keluarga yang Lebih Siap</span>
            </h1>

            <p className="artikel-hero-subtitle">
              Baca informasi seputar kesehatan ibu, anak,
              nutrisi, vaksinasi, dan tumbuh kembang yang
              disiapkan untuk masyarakat Loa Duri Ulu.
            </p>

            <div className="artikel-hero__actions">
              <button
                type="button"
                className="artikel-hero__primary"
                onClick={() =>
                  document
                    .getElementById('artikel-list')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    })
                }
              >
                Jelajahi Artikel
                <span>
                  <ArrowDown />
                </span>
              </button>

              <button
                type="button"
                className="artikel-hero__secondary"
                onClick={() => setActiveTopik('Semua Topik')}
              >
                Semua Topik
              </button>
            </div>

            <div className="artikel-hero__facts">
              <div>
                <HeartPulse />
                <span>Informasi kesehatan keluarga</span>
              </div>

              <div>
                <Users />
                <span>Untuk masyarakat Loa Duri Ulu</span>
              </div>
            </div>
          </div>

          <div className="artikel-hero__floating-card">
            <div className="artikel-hero__floating-icon">
              <ShieldCheck />
            </div>

            <div>
              <span>Informasi Kesehatan</span>
              <strong>
                Ringkas, relevan, dan mudah dibaca
              </strong>
            </div>
          </div>
        </section>

        <section
          id="artikel-list"
          className="artikel-content-section"
        >
          <div className="artikel-section-heading">
            <div>
              <span className="artikel-eyebrow">
                ARTIKEL TERBARU
              </span>

              <h2>
                Temukan informasi yang Anda butuhkan
              </h2>

              <p>
                Pilih topik untuk menampilkan artikel sesuai
                kebutuhan.
              </p>
            </div>

            <button
              type="button"
              className="sort-btn"
            >
              <ListFilter />
              Terbaru
            </button>
          </div>

          <div className="artikel-filter-bar">
            <div className="topik-chips">
              {topikList.map((topik) => (
                <button
                  type="button"
                  key={topik}
                  className={`chip ${
                    activeTopik === topik
                      ? 'active'
                      : 'inactive'
                  }`}
                  onClick={() => setActiveTopik(topik)}
                >
                  {topik}
                </button>
              ))}
            </div>
          </div>
          {isLoading && (
            <div className="artikel-grid" style={{ marginTop: '32px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={`skel-art-${i}`} type="card" />
              ))}
            </div>
          )}

          {error && (
            <div className="artikel-state artikel-state--error">
              <div className="artikel-state__icon">
                <CircleAlert />
              </div>
              <p>{error}</p>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredArtikels.length === 0 && (
              <div className="artikel-state">
                <div className="artikel-state__icon">
                  <BookX />
                </div>
                <p>Belum ada artikel untuk topik ini.</p>
              </div>
            )}

          {!isLoading && !error && (
            <div className="artikel-grid">

              {featuredArticle && (
                <div className="featured-article-wrapper">
                  <article className="featured-article-card">
                    <div className="featured-article-image">
                      <img
                        src={getImageUrl(featuredArticle.path_foto)}
                        alt={featuredArticle.judul}
                      />

                      <div className="featured-image-overlay"></div>

                      <span className="featured-label">
                        Pilihan Terbaru
                      </span>
                    </div>

                    <div className="featured-article-body">
                      <div className="featured-article-meta">
                        <span className="artikel-category-badge">
                          {featuredArticle.kategori}
                        </span>

                        <div className="artikel-read-time">
                          <Calendar />
                          {formatDate(featuredArticle.published_at)}
                        </div>
                      </div>

                      <div className="featured-article-title-block">
                        <h2 className="featured-article-title">
                          {featuredArticle.judul}
                        </h2>
                      </div>

                      <div className="featured-article-excerpt-block">
                        <p className="featured-article-excerpt">
                          {featuredArticle.isi_artikel}
                        </p>
                      </div>

                      <div className="featured-article-footer">
                        <div className="author-info">
                          <img
                            src={authorImg}
                            alt="Avatar Penulis"
                            className="author-avatar"
                          />

                          <div className="author-text">
                            <span>Ditulis oleh</span>

                            <strong className="author-name">
                              {featuredArticle.penulis?.name ||
                                'Admin Posyandu'}
                            </strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="baca-artikel-link"
                          onClick={() =>
                            openArticle(featuredArticle.id)
                          }
                        >
                          Baca Artikel
                          <span>
                            <ArrowUpRight />
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {regularArticles.map((artikel) => (
                <div
                  className="article-card-wrapper"
                  key={artikel.id}
                >
                  <article className="article-card">
                    <button
                      type="button"
                      className="article-card-img"
                      onClick={() => openArticle(artikel.id)}
                      aria-label={`Buka artikel ${artikel.judul}`}
                    >
                      <img
                        src={getImageUrl(artikel.path_foto)}
                        alt={artikel.judul}
                      />

                      <div className="article-card-img__overlay"></div>

                      <span className="article-card-category">
                        {artikel.kategori}
                      </span>
                    </button>

                    <div className="article-card-body">
                      <div className="article-card-meta">
                        <span>
                          <Calendar />
                          {formatDate(artikel.published_at)}
                        </span>
                      </div>

                      <h3 className="article-card-title">
                        {artikel.judul}
                      </h3>

                      <p className="article-card-excerpt">
                        {artikel.isi_artikel}
                      </p>

                      <div className="article-card-footer">
                        <span className="article-card-author">
                          {artikel.penulis?.name ||
                            'Admin Posyandu'}
                        </span>

                        <button
                          type="button"
                          className="bookmark-icon"
                          onClick={() => openArticle(artikel.id)}
                        >
                          Baca
                          <ArrowRight />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}

            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
