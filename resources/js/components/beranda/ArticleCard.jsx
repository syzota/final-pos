import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock01Icon, ArrowRight01Icon, BookOpen01Icon } from '@theexperiencecompany/gaia-icons/solid-rounded';
import Skeleton from '../common/Skeleton';
import { getInitials } from '../../utils/helpers';

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

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
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
        <BookOpen01Icon size={32} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
        <p style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>Belum ada artikel yang dipublikasikan saat ini.</p>
        <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Kader posyandu akan segera menambahkan edukasi kesehatan terbaru.</p>
      </div>
    );
  }

  return (
    <div className="article-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
      {artikels.map(artikel => (
        <article
          key={artikel.id}
          className="article-card"
          style={{
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
              src={getImageUrl(artikel.path_foto)}
              alt={artikel.judul}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            />
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                backgroundColor: 'var(--secondary-50)',
                color: 'var(--primary-800)',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: '1px solid var(--secondary-200)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              {artikel.kategori}
            </span>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {/* Meta Tanggal & Posyandu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '10px', fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 500 }}>
              <span style={{ color: 'var(--primary-teal, #008080)', fontWeight: 700 }}>
                {artikel.posyandu?.nama ? `Posyandu ${artikel.posyandu.nama}` : 'Desa Loa Duri Ulu'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock01Icon size={14} />
                <span>{formatDate(artikel.published_at || artikel.created_at)}</span>
              </div>
            </div>

            {/* Judul Artikel */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--neutral-900)',
                marginBottom: '10px',
                lineHeight: '1.4',
                cursor: 'pointer'
              }}
              onClick={() => handleReadMore(artikel.id)}
            >
              {artikel.judul}
            </h3>

            {/* Ringkasan Konten */}
            <p
              style={{
                fontSize: '14px',
                color: 'var(--neutral-600)',
                lineHeight: '1.6',
                marginBottom: '20px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1
              }}
            >
              {artikel.isi_artikel}
            </p>

            {/* Penulis & Tombol Selengkapnya */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--neutral-200)',
                marginTop: 'auto',
                gap: '12px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: 0,
                  flex: 1
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--secondary-200)',
                    color: 'var(--primary-900)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {getInitials(artikel.penulis?.name)}
                </div>
                <span
                  title={artikel.penulis?.name || 'Kader Posyandu'}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--neutral-700)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {artikel.penulis?.name || 'Kader Posyandu'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleReadMore(artikel.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-600)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 0',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                Baca Lengkap
                <ArrowRight01Icon size={16} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}