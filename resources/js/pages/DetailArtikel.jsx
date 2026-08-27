import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/detail-artikel.css';

export default function DetailArtikel({ activePage, onNavigate, onDarurat }) {
  const [artikel, setArtikel] = useState(null);

  // STATE BARU: Untuk menampung daftar artikel lainnya di sidebar
  const [artikelLainnya, setArtikelLainnya] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtikelData = async () => {
      const articleId = localStorage.getItem('active_article_id');

      if (!articleId) {
        setError('Artikel tidak ditemukan atau ID tidak valid.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 1. Tembak API untuk ambil detail artikel yang sedang dibaca
        const detailResponse = await axios.get(`/api/artikels/${articleId}`);
        setArtikel(detailResponse.data.data);

        // 2. Tembak API untuk ambil SEMUA artikel (buat sidebar)
        const allArticlesResponse = await axios.get('/api/artikels');
        const semuaArtikel = allArticlesResponse.data.data;

        // 3. Filter: Buang artikel yang sedang dibaca, lalu ambil maksimal 3 buah
        const filteredLainnya = semuaArtikel
          .filter(item => item.id !== parseInt(articleId))
          .slice(0, 3);

        setArtikelLainnya(filteredLainnya);

      } catch (err) {
        console.error('Gagal mengambil data artikel:', err);
        setError('Gagal memuat isi artikel dari server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtikelData();
  }, []);

  // FUNGSI BARU: Untuk melompat ke artikel lain dari sidebar tanpa reload penuh
  const handleBacaArtikelLain = (id) => {
    localStorage.setItem('active_article_id', id);
    // Refresh window/halaman ke atas agar useEffect narik ulang data baru
    window.location.reload();
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x200?text=Artikel+Kesehatan';
    return `/storage/${path}`;
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="detail-artikel-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="detail-artikel-main">
        <button type="button" className="back-link" onClick={() => onNavigate && onNavigate('artikel')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.825 9H16V7H3.825L9.425 1.4 8 0 0 8 8 16 9.425 14.6 3.825 9V9" fill="currentColor" />
          </svg>
          Kembali ke Artikel
        </button>

        <div className="detail-artikel-layout">
          {/* Main Column */}
          <article className="detail-artikel-body">
            {isLoading && <div style={{ padding: '40px 0' }}>Memuat isi artikel... ⏳</div>}
            {error && <div style={{ padding: '40px 0', color: 'red' }}>{error}</div>}

            {!isLoading && !error && artikel && (
              <>
                <h1 className="detail-artikel-title">{artikel.judul}</h1>

                <div className="detail-artikel-meta">
                  <div className="meta-author-avatar">{getInitials(artikel.penulis?.name)}</div>
                  <div className="meta-author-info">
                    <span className="meta-author-name">{artikel.penulis?.name || 'Admin Posyandu'}</span>
                    <span className="meta-author-role" style={{ textTransform: 'capitalize' }}>
                      {artikel.penulis?.role || 'Pengelola'}
                    </span>
                  </div>
                  <span className="meta-dot">•</span>
                  <span className="meta-date">{formatDate(artikel.published_at)}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-readtime" style={{ textTransform: 'uppercase' }}>{artikel.kategori}</span>
                </div>

                {/* Body Text */}
                <div
                  className="detail-artikel-paragraph"
                  style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
                >
                  {artikel.isi_artikel}
                </div>

                {artikel.path_foto && (
                  <div className="detail-artikel-closing-img" style={{ marginTop: '32px' }}>
                    <img src={getImageUrl(artikel.path_foto)} alt={artikel.judul} />
                    <span className="closing-img-tag">{artikel.kategori}</span>
                  </div>
                )}
              </>
            )}
          </article>

          {/* Sidebar Column */}
          <aside className="detail-artikel-sidebar">
            <div className="related-articles-card">
              <h3 className="sidebar-title">ARTIKEL LAINNYA</h3>

              {artikelLainnya.length > 0 ? (
                artikelLainnya.map(item => (
                  <a
                    key={item.id}
                    href="#baca"
                    className="related-article-item"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBacaArtikelLain(item.id);
                    }}
                  >
                    <div className="related-article-img">
                      <img src={getImageUrl(item.path_foto)} alt={item.judul} />
                    </div>
                    <div className="related-article-info">
                      <p className="related-article-title" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.judul}
                      </p>
                      <span className="related-article-readtime">{formatDate(item.published_at)}</span>
                    </div>
                  </a>
                ))
              ) : (
                <p style={{ color: '#888', fontSize: '13px', fontStyle: 'italic' }}>Tidak ada artikel lain yang diterbitkan saat ini.</p>
              )}
            </div>

            <div className="progress-cta-card">
              <h3 className="progress-cta-title">Pantau Progres</h3>
              <p className="progress-cta-desc">
                Gunakan kalkulator pertumbuhan kami untuk melacak status nutrisi anak Anda secara
                rutin.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate && onNavigate('kalkulator')}
              >
                Buka Kalkulator
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}