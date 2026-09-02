import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/jadwal.css';
import { ClipboardCheck, BookHeart, CalendarCheck, MessageSquareText, Info, MapPin, Clock } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';

export default function JadwalKegiatan({ activePage, onNavigate, onDarurat }) {
  const [posyanduList, setPosyanduList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/profil-posyandu')
      .then((res) => {
        setPosyanduList(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal mengambil jadwal Posyandu:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="jadwal-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="jadwal-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        {/* HEADER SECTION */}
        <div className="jadwal-header-block" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Pelayanan Rutin Bulanan
          </span>
          <h1 className="jadwal-title" style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px 0' }}>
            Jadwal Kegiatan 9 Posyandu
          </h1>
          <p className="jadwal-subtitle" style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Informasi lokasi, waktu pelaksanaan penimbangan balita, imunisasi, dan pemeriksaan kesehatan di Desa Loa Duri Ulu.
          </p>
        </div>

        {/* GRID DAFTAR POSYANDU */}
        <div className="jadwal-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="jadwal-location-card" key={`skel-${i}`} style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <Skeleton type="circle" width="48px" height="48px" style={{ marginBottom: '16px' }} />
                <Skeleton type="title" width="60%" />
                <Skeleton type="text" width="40%" style={{ marginBottom: '24px' }} />
                <Skeleton type="text" width="100%" />
                <Skeleton type="text" width="80%" />
              </div>
            ))
          ) : posyanduList.length === 0 ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '48px 20px', gridColumn: '1 / -1', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Data jadwal Posyandu belum tersedia.</h3>
              <p style={{ marginTop: '6px', fontSize: '13.5px' }}>Silakan periksa kembali setelah data jadwal ditambahkan oleh pengurus.</p>
            </div>
          ) : (
            posyanduList.map((loc, idx) => (
              <div
                className="jadwal-location-card"
                key={loc.id || idx}
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Header Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      Posyandu {loc.nama}
                    </h3>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                      Wilayah RT {loc.rukun_tetangga || 'Desa Loa Duri Ulu'}
                    </span>
                  </div>
                </div>

                {/* Alamat */}
                <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '12px', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Alamat Pelayanan:
                  </strong>
                  {loc.alamat || 'Balai Posyandu / Rumah Ketua RT'}
                </div>

                {/* Highlight Jadwal Rutin: Shape PILLS */}
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Jadwal Kegiatan Rutin
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      width: '100%'
                    }}
                  >
                    <Clock size={16} color="#16a34a" />
                    <span>
                      {loc.jadwal?.keterangan_waktu || `Setiap tanggal ${(idx % 15) + 2} awal bulan`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SECTION PERSIAPAN SEBELUM DATANG */}
        <section className="jadwal-prep-section" style={{ backgroundColor: '#ffffff', padding: '36px 28px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="jadwal-prep-intro" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ClipboardCheck size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase' }}>
                PANDUAN KUNJUNGAN
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                Persiapan Sebelum Datang ke Posyandu
              </h2>
            </div>
          </div>

          <div className="jadwal-prep-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="jadwal-prep-item" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#008080', marginBottom: '6px' }}>01. Buku KIA / KMS</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Bawa Dokumen Kesehatan</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                Siapkan buku KIA atau KMS balita untuk mencatat grafik berat dan tinggi badan.
              </p>
            </div>

            <div className="jadwal-prep-item" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#008080', marginBottom: '6px' }}>02. Waktu & Lokasi</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Tepat Waktu Pelayanan</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                Pelayanan dibuka pukul 08.30 – 11.30 WITA agar tidak antre terlalu lama.
              </p>
            </div>

            <div className="jadwal-prep-item" style={{ padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#008080', marginBottom: '6px' }}>03. Catatan Keluhan</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Konsultasi Kader & Bidan</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                Catat hal yang ingin ditanyakan seputar nafsu makan, imunisasi, atau keluhan bayi.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '14px 18px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#92400e' }}>
            <Info size={18} style={{ flexShrink: 0 }} />
            <span>Pemberian vitamin A dan obat cacing diadakan serentak pada bulan Februari dan Agustus setiap tahun.</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}