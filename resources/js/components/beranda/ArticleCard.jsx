import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ArticleCard({ onNavigate }) {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Menarik data artikel dari backend Laravel
    axios.get('/api/artikels')
      .then(res => {
        // Karena ini Beranda, kita hanya ambil 3 artikel paling baru
        const terbaru = res.data.data.slice(0, 3);
        setArtikels(terbaru);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal memuat artikel beranda:", err);
        setLoading(false);
      });
  }, []);

  // Fungsi untuk melompat ke halaman detail
  const handleReadMore = (id) => {
    localStorage.setItem('active_article_id', id);
    if (onNavigate) {
      // Pastikan 'detail-artikel' sesuai dengan nama rute navigasimu
      onNavigate('detail-artikel');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>Memuat artikel terbaru... ⏳</div>;
  }

  if (artikels.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px', width: '100%', color: '#666' }}>Belum ada artikel yang dipublikasikan.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
      {artikels.map(artikel => (
        <div key={artikel.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          {/* Gambar Artikel */}
          <img
            src={artikel.path_foto ? `/storage/${artikel.path_foto}` : 'https://via.placeholder.com/400x200?text=Artikel+Kesehatan'}
            alt={artikel.judul}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {/* Meta Kategori & Tanggal */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', fontSize: '12px', fontWeight: 'bold' }}>
              <span className="badge badge-cyan" style={{ textTransform: 'uppercase' }}>{artikel.kategori}</span>
              <span style={{ color: '#888' }}><i className="bi bi-clock me-1"></i> {formatDate(artikel.published_at)}</span>
            </div>

            {/* Judul & Cuplikan Isi */}
            <h3 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '12px', lineHeight: '1.4' }}>
              {artikel.judul}
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {artikel.isi_artikel}
            </p>

            {/* Footer Card: Penulis & Tombol Baca */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--violet-deep)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                  {artikel.penulis?.name?.charAt(0) || 'A'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#444' }}>
                  {artikel.penulis?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={() => handleReadMore(artikel.id)}
                style={{ background: 'none', border: 'none', color: 'var(--violet-deep)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center' }}
              >
                Baca Artikel <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}