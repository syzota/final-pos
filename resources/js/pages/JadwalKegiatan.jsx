import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
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
        {/* UNIFIED HERO SECTION */}
        <PageHero
          badgeIcon={CalendarCheck}
          badgeText="Jadwal Posyandu"
          title="Jadwal Kegiatan Layanan"
          titleHighlight="9 Posyandu"
          description="Informasi jadwal penimbangan, imunisasi, dan pemeriksaan kesehatan di 9 posyandu desa."
          stats={[
            { icon: Clock, label: 'Layanan Rutin Setiap Bulan' },
            { icon: MapPin, label: '9 Titik Posyandu Tersebar' },
          ]}
        />

        {/* SECTION DAFTAR POSYANDU */}
        <SectionHeader
          eyebrow="Agenda Pelayanan"
          title="Waktu & Lokasi Posyandu di Desa Loa Duri Ulu"
          description="Silakan periksa jadwal dan lokasi posyandu terdekat di lingkungan rukun tetangga (RT) Anda."
          align="left"
        />

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
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--secondary-200)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 2px 0' }}>
                      Posyandu {loc.nama}
                    </h3>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--neutral-500)' }}>
                      Wilayah RT {loc.rukun_tetangga || 'Desa Loa Duri Ulu'}
                    </span>
                  </div>
                </div>

                {/* Alamat */}
                <div style={{ fontSize: '13.5px', color: 'var(--neutral-600)', lineHeight: '1.5' }}>
                  <strong style={{ display: 'block', color: 'var(--neutral-900)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Alamat Pelayanan:
                  </strong>
                  {loc.alamat || 'Balai Posyandu / Rumah Ketua RT'}
                </div>

                {/* Highlight Jadwal Rutin: Shape PILLS */}
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--neutral-100)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Jadwal Kegiatan Rutin
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success-text)',
                      border: '1px solid var(--color-success-border)',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      width: '100%'
                    }}
                  >
                    <Clock size={16} color="var(--color-success-solid)" />
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
        <section
          className="jadwal-prep-section"
          style={{
            backgroundColor: '#ffffff',
            padding: '36px 32px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            marginTop: '48px'
          }}
        >
          <SectionHeader
            eyebrow="PANDUAN KUNJUNGAN"
            title="Persiapan Sebelum Datang ke Posyandu"
            description="Langkah praktis bagi para orang tua dan keluarga agar pelayanan berlangsung tertib, lancar, dan nyaman."
            align="left"
          />

          <div
            className="jadwal-prep-list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {/* LANGKAH 1 */}
            <div
              className="jadwal-prep-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--primary-700, #007373)',
                    backgroundColor: 'var(--secondary-50, #f0f7ff)',
                    border: '1px solid var(--secondary-200, #c7e4ff)',
                    padding: '3px 12px',
                    borderRadius: '999px'
                  }}
                >
                  Langkah 01
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardCheck size={18} />
                </div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Bawa Dokumen Kesehatan
              </h3>
              <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                Siapkan buku KIA (Kesehatan Ibu & Anak) atau KMS balita untuk pencatatan grafik penimbangan berat dan pengukuran tinggi badan.
              </p>
            </div>

            {/* LANGKAH 2 */}
            <div
              className="jadwal-prep-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--primary-700, #007373)',
                    backgroundColor: 'var(--secondary-50, #f0f7ff)',
                    border: '1px solid var(--secondary-200, #c7e4ff)',
                    padding: '3px 12px',
                    borderRadius: '999px'
                  }}
                >
                  Langkah 02
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={18} />
                </div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Hadir Tepat Waktu Pelayanan
              </h3>
              <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                Pelayanan rutin dibuka pukul 08.30 – 11.30 WITA. Disarankan hadir lebih awal agar anak tidak terlalu lama mengantre.
              </p>
            </div>

            {/* LANGKAH 3 */}
            <div
              className="jadwal-prep-card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'var(--primary-700, #007373)',
                    backgroundColor: 'var(--secondary-50, #f0f7ff)',
                    border: '1px solid var(--secondary-200, #c7e4ff)',
                    padding: '3px 12px',
                    borderRadius: '999px'
                  }}
                >
                  Langkah 03
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquareText size={18} />
                </div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Konsultasi Kader & Bidan
              </h3>
              <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                Catat keluhan seputar nafsu makan balita, jadwal imunisasi susulan, atau kondisi kesehatan ibu hamil untuk ditanyakan langsung.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '28px',
              padding: '16px 20px',
              backgroundColor: '#fffbeb',
              borderRadius: '12px',
              border: '1px solid #fef3c7',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13.5px',
              color: '#92400e',
              lineHeight: '1.5'
            }}
          >
            <Info size={20} style={{ flexShrink: 0, color: '#d97706' }} />
            <span>
              <strong>Pengingat Suplementasi:</strong> Pemberian Vitamin A dosis tinggi dan obat cacing diadakan serentak pada bulan Februari dan Agustus di seluruh Posyandu Desa Loa Duri Ulu.
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}