import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import Skeleton from '../common/Skeleton';

export default function ArticleCard({ onNavigate }) {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/artikels')
      .then(res => {
        const data = res.data.data || [];
        const terbaru = data.slice(0, 3);
        setArtikels(terbaru);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal memuat artikel beranda:', err);
        setLoading(false);
      });
  }, []);

  const handleReadMore = (id) => {
    localStorage.setItem('active_article_id', id);
    if (onNavigate) {
      onNavigate('detail-artikel');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
        <Skeleton type="card" />
        <Skeleton type="card" />
        <Skeleton type="card" />
      </div>
    );
  }

  if (artikels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 20px', width: '100%', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
        <BookOpen size={32} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
        <p style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>Belum ada artikel yang dipublikasikan saat ini.</p>
        <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Kader posyandu akan segera menambahkan edukasi kesehatan terbaru.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
      {artikels.map(artikel => (
        <article
          key={artikel.id}
          className="card article-hover-card"
          style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease'
          }}
        >
          {/* Gambar Artikel */}
          <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            <img
              src={artikel.path_foto ? `/storage/${artikel.path_foto}` : 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80'}
              alt={artikel.judul}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            />
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--primary-teal, #008080)',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {artikel.kategori}
            </span>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {/* Meta Tanggal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '12.5px', color: '#64748b', fontWeight: 500 }}>
              <Clock size={14} />
              <span>{formatDate(artikel.published_at)}</span>
            </div>

            {/* Judul Artikel */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '10px',
                lineHeight: '1.4',
                cursor: 'pointer'
              }}
              onClick={() => handleReadMore(artikel.id)}
            >
              {artikel.judul}
            </h3>

            {/* Cuplikan Isi */}
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '20px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {artikel.isi_artikel}
            </p>

            {/* Footer Card: Penulis & Tombol Baca */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#008080', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                  {artikel.penulis?.name?.charAt(0) || 'K'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  {artikel.penulis?.name || 'Kader Posyandu'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleReadMore(artikel.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-teal, #008080)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 0'
                }}
              >
                Baca Lengkap
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}