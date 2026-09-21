import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import {
  Home01Icon,
  Book02Icon,
  Search01Icon,
  AlertCircleIcon,
  UserGroupIcon,
  Calendar01Icon,
  Calculator01Icon,
  Call02Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function NotFound({ activePage = '404', onNavigate, onDarurat }) {
  const handleGo = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    } else {
      window.location.hash = pageId;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div
          className="reveal-section"
          style={{
            maxWidth: '620px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '48px 32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px -15px rgba(0, 128, 128, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
            border: '1.5px solid #e2e8f0',
          }}
        >
          {/* Badge & Big 404 Code */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '16px',
              border: '1px solid #fecdd3'
            }}
          >
            <AlertCircleIcon size={16} />
            <span>Galat 404 • Halaman Tidak Ditemukan</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(56px, 12vw, 96px)',
              fontWeight: 900,
              margin: '0',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #008080 0%, #0E7C93 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </h1>

          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#0f172a',
              marginTop: '12px',
              marginBottom: '10px'
            }}
          >
            Halaman Tidak Ditemukan
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: '#64748b',
              lineHeight: 1.6,
              maxWidth: '460px',
              margin: '0 auto 28px'
            }}
          >
            Maaf, halaman atau tautan yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL salah ketik.
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '32px'
            }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={Home01Icon}
              onClick={() => handleGo('beranda')}
            >
              Kembali ke Beranda
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={Book02Icon}
              onClick={() => handleGo('artikel')}
            >
              Baca Artikel Kesehatan
            </Button>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Tautan Menu Populer:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleGo('profil')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <UserGroupIcon size={14} color="#008080" />
                <span>Profil Posyandu</span>
              </button>
              <button
                type="button"
                onClick={() => handleGo('jadwal')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Calendar01Icon size={14} color="#008080" />
                <span>Jadwal Penimbangan</span>
              </button>
              <button
                type="button"
                onClick={() => handleGo('kalkulator')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Calculator01Icon size={14} color="#008080" />
                <span>Kalkulator Gizi</span>
              </button>
              <button
                type="button"
                onClick={() => handleGo('kontak')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Call02Icon size={14} color="#008080" />
                <span>Kontak Darurat</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
