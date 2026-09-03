import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/detail-artikel.css';
import { Loader2 } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';

export default function DetailArtikel({ activePage, onNavigate, onDarurat }) {
  const [artikel, setArtikel] = useState(null);

  // STATE BARU: Untuk menampung daftar artikel lainnya di sidebar
  const [artikelLainnya, setArtikelLainnya] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtikelData = async (targetId) => {
    const articleId = targetId || localStorage.getItem('active_article_id');

    if (!articleId) {
      setError('Artikel tidak ditemukan atau ID tidak valid.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      // 1. Tembak API untuk ambil detail artikel yang sedang dibaca
      const detailResponse = await axios.get(`/api/artikels/${articleId}`);
      setArtikel(detailResponse.data.data);

      // 2. Tembak API untuk ambil SEMUA artikel (buat sidebar)
      const allArticlesResponse = await axios.get('/api/artikels');
      const semuaArtikel = allArticlesResponse.data.data || [];

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

  useEffect(() => {
    fetchArtikelData();
  }, []);

  // Untuk melompat ke artikel lain dari sidebar secara halus (SPA) tanpa reload penuh
  const handleBacaArtikelLain = (id) => {
    localStorage.setItem('active_article_id', id);
    fetchArtikelData(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';
    if (path.startsWith('http')) return path;
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
            {isLoading && (
              <div style={{ paddingTop: '16px' }}>
                <Skeleton type="title" width="80%" height="40px" style={{ marginBottom: '32px' }} />
                <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', alignItems: 'center' }}>
                   <Skeleton type="circle" width="48px" height="48px" />
                   <div>
                     <Skeleton type="text" width="120px" style={{ marginBottom: '8px' }} />
                     <Skeleton type="text" width="80px" />
                   </div>
                </div>
                <Skeleton type="text" rows={6} />
                <Skeleton type="box" height="350px" style={{ marginTop: '40px' }} />
              </div>
            )}
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
                    <img
                      src={getImageUrl(artikel.path_foto)}
                      alt={artikel.judul}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
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
                      <img
                        src={getImageUrl(item.path_foto)}
                        alt={item.judul}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
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
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}