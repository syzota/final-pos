import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WargaKieView() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  // === DATA CADANGAN JIKA API MATI/ERROR ===
  const dummyArticles = [
    {
      title: "Panduan Orang Tua Mendampingi Anak Bermain Gawai",
      description: "Literasi digital sangat penting bagi orang tua di era modern. Berikut langkah-langkah sehat mendampingi anak agar terhindar dari kecanduan gawai...",
      link: "#",
      pubDate: new Date().toISOString(),
      thumbnail: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80"
    },
    {
      title: "Langkah Siaga Menghadapi Banjir di Musim Hujan",
      description: "Kesiapsiagaan bencana dimulai dari lingkungan keluarga. Simak tips evakuasi dan persiapan tas siaga bencana untuk melindungi keluarga Anda.",
      link: "#",
      pubDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      thumbnail: "https://images.unsplash.com/photo-1547683905-f686c993b472?w=600&q=80"
    },
    {
      title: "Pentingnya Imunisasi Dasar Lengkap untuk Balita",
      description: "Imunisasi mencegah berbagai penyakit berbahaya. Pastikan jadwal imunisasi anak Anda terpenuhi tepat waktu dengan rutin mengunjungi Posyandu terdekat.",
      link: "#",
      pubDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      thumbnail: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80"
    },
    {
      title: "Resep MPASI Bergizi Anti Stunting untuk Usia 6-12 Bulan",
      description: "Mencegah stunting bisa dimulai dari dapur sendiri. Temukan berbagai resep mudah, murah, dan bergizi tinggi untuk Makanan Pendamping ASI buah hati Anda.",
      link: "#",
      pubDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Coba menarik berita dari endpoint Antara Lifestyle (lebih stabil dari CNN)
        const response = await axios.get('https://api-berita-indonesia.vercel.app/antara/lifestyle');
        
        // Mengambil 6 berita terbaru
        const fetchedArticles = response.data.data.posts.slice(0, 6);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Gagal mengambil berita dari API. Menggunakan data cadangan.", error);
        // JARING PENGAMAN: Gunakan data dummy jika gagal
        setArticles(dummyArticles);
        setIsFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ animation: 'fadein 0.4s ease' }}>
      
      {/* HEADER PORTAL */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--cyan-bg) 0%, #e0f2fe 100%)', border: 'none' }}>
        <h2 style={{ color: 'var(--cyan-deep)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="bi bi-journal-bookmark-fill"></i> Portal KIE Khusus
        </h2>
        <p style={{ color: '#0369a1', margin: 0, fontSize: '14px', fontWeight: '500' }}>
          Pusat Komunikasi, Informasi, dan Edukasi. Temukan artikel, literasi digital, dan berita terbaru seputar kesehatan keluarga secara otomatis.
        </p>
      </div>

      {/* NOTIFIKASI JIKA MENGGUNAKAN DATA CADANGAN */}
      {isFallback && !isLoading && (
        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '13px', fontWeight: '600' }}>
          <i className="bi bi-wifi-off me-2"></i> Mode Luring / Gangguan Server. Menampilkan artikel edukasi dasar yang tersimpan di sistem.
        </div>
      )}

      {/* KONDISI LOADING */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', marginBottom: '16px', color: 'var(--cyan-deep)' }}></div>
          <h4>Membuka Portal... ⏳</h4>
          <p style={{ fontSize: '13px' }}>Sedang menyesuaikan artikel terbaru untuk Anda.</p>
        </div>
      ) : (
        /* GRID BERITA */
        <div className="grid grid-3" style={{ gap: '24px' }}>
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                padding: 0,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
              }}
            >
              {/* Thumbnail Gambar Berita */}
              <div style={{ height: '180px', overflow: 'hidden', backgroundColor: '#f1f5f9', position: 'relative' }}>
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    // Jaring Pengaman Gambar: Jika gambar dari API rusak
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c522?w=600&q=80'; 
                  }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--cyan-deep)', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  Edukasi
                </div>
              </div>

              {/* Isi Konten Berita */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', lineHeight: '1.5', color: '#1e293b', fontWeight: '700' }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', flexGrow: 1, lineHeight: '1.6' }}>
                  {/* Memotong deskripsi jika terlalu panjang */}
                  {article.description.length > 110 ? `${article.description.substring(0, 110)}...` : article.description}
                </p>
                
                {/* Footer Kartu Berita */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                    <i className="bi bi-calendar-event me-1"></i>
                    {new Date(article.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--cyan-deep)', fontWeight: '700' }}>
                    Baca <i className="bi bi-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}