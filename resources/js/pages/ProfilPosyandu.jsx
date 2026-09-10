import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import ProfilHeroBanner from '../components/profil/ProfilHeroBanner';
import ChairmanCard from '../components/profil/ChairmanCard';
import BasicContactCard from '../components/profil/BasicContactCard';
import CoreTasksCard from '../components/profil/CoreTasksCard';
import StrategicFunctionsCard from '../components/profil/StrategicFunctionsCard';
import StrukturKepengurusanSection from '../components/profil/StrukturKepengurusanSection';
import SectionHeader from '../components/common/SectionHeader';

import { 
  InformationCircleIcon, 
  UserGroupIcon, 
  Cardiogram01Icon, 
  DeliveryBox01Icon, 
  Location01Icon, 
  Call02Icon, 
  Directions01Icon, 
  Cancel01Icon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';
import Skeleton from '../components/common/Skeleton';

export default function ProfilPosyandu({ onNavigate, onDarurat }) {
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

  // Kunci scroll body saat modal popup terbuka & dukung tombol Escape
  useEffect(() => {
    if (selectedDetailPosyandu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedDetailPosyandu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDetailPosyandu]);

  if (loading) {
    return (
      <div className="profil-wrapper">
        <Header activePage="profil" onNavigate={onNavigate} onDarurat={onDarurat} />
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

    const modalJSX = (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
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
            <Cancel01Icon size={20} />
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
                <InformationCircleIcon size={16} color="#008080" />
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
                <UserGroupIcon size={16} color="#008080" />
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
                <Cardiogram01Icon size={16} color="#008080" />
                Kader & Tenaga Medis
              </h4>
              <table className="table" style={{ fontSize: '13.5px', marginBottom: '24px', width: '100%' }}>
                <tbody>
                  <tr><td style={{ width: '45%', color: '#64748b' }}>Bidan Desa</td><td><b>{p.bidan_desa || '-'}</b></td></tr>
                  <tr><td style={{ color: '#64748b' }}>Kader Aktif</td><td><b>{p.jml_kader_aktif || 5} Orang</b></td></tr>
                </tbody>
              </table>

              <h4 style={{ color: '#0f172a', fontSize: '15px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DeliveryBox01Icon size={16} color="#008080" />
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

          <div style={{ marginTop: '32px', textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              size="md"
              onClick={() => setSelectedDetailPosyandu(null)}
            >
              Tutup Rincian
            </Button>
          </div>
        </div>
      </div>
    );

    return createPortal(modalJSX, document.body);
  };

  return (
    <div className="profil-wrapper">
      <Header activePage="profil" onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="profil-container" style={{ padding: '40px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* UNIFIED HERO SECTION UNTUK PROFIL */}
        <section className="profil-section" style={{ marginBottom: '48px' }}>
          <ProfilHeroBanner defaultProfil={defaultProfil} onNavigate={onNavigate} />
        </section>

        {/* SECTION 1: SAMBUTAN KETUA & KONTAK SEKRETARIAT */}
        <section className="profil-section" style={{ marginBottom: '56px' }}>
          <SectionHeader
            eyebrow="STRUKTUR & INFORMASI"
            title="Kepemimpinan & Kontak Posyandu"
            description="Informasi mengenai kepemimpinan dan kontak posyandu terpadu di Desa Loa Duri Ulu."
            align="left"
          />
          <div className="grid grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
            <ChairmanCard />
            <BasicContactCard defaultProfil={defaultProfil} onNavigate={onNavigate} />
          </div>
        </section>

        {/* SECTION 2: TUGAS POKOK & FUNGSI STRATEGIS */}
        <section className="profil-section" style={{ marginBottom: '56px' }}>
          <SectionHeader
            eyebrow="PERAN & FUNGSI"
            title="Komitmen Pelayanan Masyarakat"
            description="Tugas pokok dan fungsi strategis Posyandu dalam meningkatkan taraf kesehatan warga desa."
            align="left"
          />
          <div className="grid grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
            <CoreTasksCard />
            <StrategicFunctionsCard />
          </div>
        </section>

        {/* SECTION 3: STRUKTUR KEPENGURUSAN POKJANAL & KADER */}
        <section className="profil-section" style={{ marginBottom: '56px' }}>
          <StrukturKepengurusanSection />
        </section>

        {/* SECTION 4: DAFTAR 9 TITIK POSYANDU DESA */}
        <section id="daftar-posyandu" className="profil-section" style={{ marginBottom: '40px' }}>
          <SectionHeader
            eyebrow="WILAYAH PELAYANAN"
            title="Daftar 9 Posyandu di Desa Loa Duri Ulu"
            description="Setiap posyandu melayani warga di lingkungan rukun tetangga (RT) masing-masing secara berkala."
            align="left"
          />

          <div className="posyandu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {profilList.map((posyandu, idx) => (
              <div
                key={posyandu.id || idx}
                className="posyandu-card"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ width: '100%', height: '180px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                  <img
                    src={posyandu.foto ? `/storage/${posyandu.foto}` : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'}
                    alt={posyandu.nama}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '18px', fontWeight: 800 }}>
                    Posyandu {posyandu.nama}
                  </h3>

                  <div style={{ fontSize: '13.5px', color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Location01Icon size={16} color="var(--primary-teal, #008080)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: '1.4' }}>{posyandu.alamat || 'Alamat RT di Desa Loa Duri Ulu'}</span>
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#475569', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Call02Icon size={16} color="var(--primary-teal, #008080)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: '1.4' }}>{posyandu.kontak_darurat || posyandu.no_telp || '0812-5000-100' + ((idx % 9) + 1)}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      icon={InformationCircleIcon}
                      onClick={() => setSelectedDetailPosyandu(posyandu)}
                    >
                      Lihat Detail Posyandu
                    </Button>

                    <Button
                      variant="secondary"
                      size="md"
                      fullWidth
                      icon={Directions01Icon}
                      onClick={() => window.open(posyandu.link_gmaps || `https://maps.google.com/?q=Loa+Duri+Ulu+Posyandu+${posyandu.nama}`, '_blank')}
                    >
                      Buka di Google Maps
                    </Button>
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