import React from 'react';
import { Phone, Calculator, Newspaper, CalendarDays } from 'lucide-react';

import SectionHeader from '../common/SectionHeader';

export default function FeatureCards({ onNavigate, onDarurat }) {
  const features = [
    {
      id: 'darurat',
      title: 'Kontak Darurat',
      desc: 'Hubungi cepat ambulans desa, bidan, dan puskesmas siaga 24 jam.',
      containerBg: '#fef2f2',
      containerBorder: '#fecaca',
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      onClick: onDarurat,
      icon: Phone,
    },
    {
      id: 'kalkulator',
      title: 'Kalkulator Gizi',
      desc: 'Cek otomatis status gizi balita & IMT tubuh ideal keluarga Anda.',
      containerBg: '#f0f7ff',
      containerBorder: '#c7e4ff',
      iconBg: '#e0f2fe',
      iconColor: '#0284c7',
      page: 'kalkulator',
      icon: Calculator,
    },
    {
      id: 'artikel',
      title: 'Artikel Kesehatan',
      desc: 'Tips kesehatan ibu hamil, panduan nutrisi balita, dan jadwal imunisasi.',
      containerBg: '#f0fdfa',
      containerBorder: '#ccfbf1',
      iconBg: '#ccfbf1',
      iconColor: '#0d9488',
      page: 'artikel',
      icon: Newspaper,
    },
    {
      id: 'jadwal',
      title: 'Jadwal Posyandu',
      desc: 'Informasi rutin penimbangan, imunisasi, dan lokasi 9 posyandu desa.',
      containerBg: '#fffbeb',
      containerBorder: '#fef3c7',
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      page: 'jadwal',
      icon: CalendarDays,
    },
  ];

  const handleClick = (feature) => {
    if (feature.onClick) {
      feature.onClick();
    } else if (feature.page && onNavigate) {
      onNavigate(feature.page);
    }
  };

  return (
    <section className="feature-cards-section">
      <SectionHeader
        eyebrow="Layanan Mandiri"
        title="Akses Cepat Informasi Warga"
        description="Pilih menu layanan praktis yang Anda butuhkan untuk keluarga sehat."
        align="left"
      />

      <div className="feature-cards-row">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              type="button"
              className="feature-card"
              onClick={() => handleClick(feature)}
              style={{
                minHeight: '130px',
                padding: '22px 18px',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                border: `1px solid ${feature.containerBorder}`,
                backgroundColor: feature.containerBg,
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)';
              }}
            >
              <div
                className="feature-icon-bg"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: feature.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  flexShrink: 0
                }}
              >
                <Icon size={22} color={feature.iconColor} />
              </div>

              <h3 className="feature-title" style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                {feature.title}
              </h3>

              <p className="feature-desc" style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                {feature.desc}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}