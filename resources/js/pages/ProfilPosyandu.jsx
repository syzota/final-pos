import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProfilHeroBanner from '../components/profil/ProfilHeroBanner';
import ChairmanCard from '../components/profil/ChairmanCard';
import BasicContactCard from '../components/profil/BasicContactCard';
import CoreTasksCard from '../components/profil/CoreTasksCard';
import StrategicFunctionsCard from '../components/profil/StrategicFunctionsCard';
import StrukturKepengurusanSection from '../components/profil/StrukturKepengurusanSection';

import { Info, Users, HeartPulse, Package, MapPin, Phone, Map, X } from 'lucide-react';
import Skeleton from '../components/common/Skeleton';

export default function ProfilPosyandu({ onNavigate }) {
  const [profilList, setProfilList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetailPosyandu, setSelectedDetailPosyandu] = useState(null);

  useEffect(() => {
    axios.get('/api/profil-posyandu')
      .then(response => {
        setProfilList(response.data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Gagal mengambil data API:', error);
        setLoading(false);
      });
  }, []);

  // Kunci scroll body saat modal popup terbuka
  useEffect(() => {
    if (selectedDetailPosyandu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedDetailPosyandu]);

  if (loading) {
    return (
      <div className="profil-wrapper">
        <Header activePage="profil" onNavigate={onNavigate} />
        <main className="profil-container" style={{ padding: '40px 20px', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto' }}>
          <section className="profil-section" style={{ marginBottom: '40px' }}>
            <Skeleton type="box" height="400px" />
          </section>
          <section className="profil-section grid-2-col" style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <Skeleton type="box" height="300px" />
            <Skeleton type="box" height="300px" />
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const defaultProfil = profilList.length > 0 ? profilList[0] : null;

  const renderDetailModal = () => {
    if (!selectedDetailPosyandu) return null;
    const p = selectedDetailPosyandu;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setSelectedDetailPosyandu(null)}
      >
        <div
          className="card modal-dialog-card"
          style={{
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setSelectedDetailPosyandu(null)}
            aria-label="Tutup"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Rincian Posyandu
            </span>
            <h2 style={{ color: '#0f172a', fontSize: '24px', fontWeight: 800, margin: '4px 0 8px 0' }}>
              Posyandu {p.nama}
            </h2>
            <span className="badge badge-green" style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
              Strata: {p.strata || 'Standar Pelayanan'}
            </span>
          </div>

          <div className="grid grid-2" style={{ gap: '24px' }}>
            {/* KOLOM KIRI */}
            <div>
              <h4 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} color="#008080" />
                Informasi Wilayah
              </h4>
              <table className="table" style={{ fontSize: '13.5px', marginBottom: '24px', width: '100%' }}>
                <tbody>
                  <tr><td style={{ width: '45%', color: '#64748b' }}>RT / Wilayah</td><td><b>{p.rukun_tetangga || '-'}</b></td></tr>
                  <tr><td style={{ color: '#64748b' }}>Alamat</td><td><b>{p.alamat || '-'}</b></td></tr>
                  <tr><td style={{ color: '#64748b' }}>Kontak Pengurus</td><td><b>{p.kontak_darurat || p.no_telp || '-'}</b></td></tr>
                  <tr>
                    <td style={{ color: '#64748b' }}>Program Terpadu</td>
                    <td>
                      <b>PAUD:</b> {p.program_paud || 'Tidak'}<br />
                      <b>BKB:</b> {p.program_bkb || 'Tidak'}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h4 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#008080" />
                Susunan Pengurus
              </h4>
              <table className="table" style={{ fontSize: '13.5px', width: '100%' }}>
                <tbody>
                  <tr><td style={{ width: '45%', color: '#64748b' }}>Ketua Posyandu</td><td><b>{p.ketua || p.ketua_pelaksana || '-'}</b></td></tr>
                  <tr><td style={{ color: '#64748b' }}>Sekretaris</td><td><b>{p.sekretaris || '-'}</b></td></tr>
                  <tr><td style={{ color: '#64748b' }}>Bendahara</td><td><b>{p.bendahara || '-'}</b></td></tr>
                </tbody>
              </table>
            </div>

            {/* KOLOM KANAN */}
            <div>
              <h4 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartPulse size={16} color="#008080" />
                Kader & Tenaga Medis
              </h4>
              <table className="table" style={{ fontSize: '13.5px', marginBottom: '24px', width: '100%' }}>
                <tbody>
                  <tr><td style={{ width: '45%', color: '#64748b' }}>Bidan Desa</td><td><b>{p.bidan_desa || '-'}</b></td></tr>
                  <tr><td style={{ color: '#64748b' }}>Kader Aktif</td><td><b>{p.jml_kader_aktif || 5} Orang</b></td></tr>
                </tbody>
              </table>

              <h4 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} color="#008080" />
                Sarana & Alat Penimbangan
              </h4>
              <table className="table" style={{ fontSize: '13.5px', width: '100%' }}>
                <tbody>
                  <tr><td style={{ width: '45%', color: '#64748b' }}>Lokasi Kegiatan</td><td><b>{p.tempat_pelayanan || 'Balai Posyandu / RT'}</b></td></tr>
                  <tr>
                    <td style={{ color: '#64748b' }}>Kelengkapan Timbangan</td>
                    <td>
                      <b>Dacin:</b> {p.jml_dacin || 1} | <b>Bayi:</b> {p.timbangan_bayi || 1}<br />
                      <b>Infanometer:</b> Tersedia
                    </td>
                  </tr>
                  <tr><td style={{ color: '#64748b' }}>Buku KIA & SIP</td><td><b>Lengkap</b></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSelectedDetailPosyandu(null)}
              style={{
                minHeight: '44px',
                padding: '0 24px',
                borderRadius: '10px',
                fontWeight: 700
              }}
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profil-wrapper">
      <Header activePage="profil" onNavigate={onNavigate} />

      <main className="profil-container">
        <section className="profil-section">
          <ProfilHeroBanner />
        </section>

        <section className="profil-section grid-2-col" style={{ marginTop: '24px' }}>
          <ChairmanCard />
          {defaultProfil && <BasicContactCard data={defaultProfil} />}
        </section>

        <section className="profil-section grid-2-col" style={{ marginTop: '24px' }}>
          <CoreTasksCard />
          <StrategicFunctionsCard />
        </section>

        <section className="profil-section" style={{ marginTop: '24px' }}>
          <StrukturKepengurusanSection />
        </section>

        {/* DAFTAR 9 LOKASI POSYANDU */}
        <section className="profil-section" style={{ marginTop: '56px', marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Wilayah Kerja Pelayanan
            </span>
            <h2 style={{ color: '#0f172a', fontSize: '26px', fontWeight: 800, margin: '4px 0 8px 0' }}>
              Daftar 9 Lokasi Posyandu
            </h2>
            <p style={{ color: '#64748b', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto' }}>
              Temukan posyandu terdekat di lingkungan rukun tetangga (RT) Anda di Desa Loa Duri Ulu.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {profilList.map((posyandu, idx) => (
              <div
                key={posyandu.id || idx}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                  <img
                    src={posyandu.foto ? `/storage/${posyandu.foto}` : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'}
                    alt={posyandu.nama}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '18px', fontWeight: 800 }}>
                    Posyandu {posyandu.nama}
                  </h3>

                  <div style={{ fontSize: '13.5px', color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={16} color="#008080" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: '1.4' }}>{posyandu.alamat || 'Alamat RT di Desa Loa Duri Ulu'}</span>
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#475569', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Phone size={16} color="#008080" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: '1.4' }}>{posyandu.kontak_darurat || posyandu.no_telp || '0812-5000-100' + ((idx % 9) + 1)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setSelectedDetailPosyandu(posyandu)}
                      style={{
                        flex: 1,
                        minHeight: '44px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13.5px'
                      }}
                    >
                      <Info size={16} /> Lihat Detail
                    </button>

                    <a
                      href={posyandu.link_gmaps || `https://maps.google.com/?q=Loa+Duri+Ulu+Posyandu+${posyandu.nama}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{
                        minHeight: '44px',
                        minWidth: '44px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',
                        color: 'var(--primary-teal, #008080)',
                        borderColor: '#cbd5e1',
                        padding: '0 14px'
                      }}
                      title="Lihat di Google Maps"
                    >
                      <Map size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      {renderDetailModal()}
    </div>
  );
}