import React from 'react';
import { Phone, Calculator, Newspaper, CalendarDays } from 'lucide-react';

export default function FeatureCards({ onNavigate, onDarurat }) {
  const features = [
    {
      id: 'darurat',
      title: 'Kontak Darurat',
      desc: 'Hubungi cepat ambulans desa, bidan, dan puskesmas 24 jam.',
      bg: '#fee2e2',
      iconColor: '#dc2626',
      onClick: onDarurat,
      icon: Phone,
    },
    {
      id: 'kalkulator',
      title: 'Kalkulator Gizi',
      desc: 'Cek otomatis status gizi balita & IMT tubuh ideal Anda.',
      bg: '#e0f2fe',
      iconColor: '#0284c7',
      page: 'kalkulator',
      icon: Calculator,
    },
    {
      id: 'artikel',
      title: 'Artikel Kesehatan',
      desc: 'Tips kesehatan ibu hamil, pola makan balita, dan imunisasi.',
      bg: '#fae8ff',
      iconColor: '#a855f7',
      page: 'artikel',
      icon: Newspaper,
    },
    {
      id: 'jadwal',
      title: 'Jadwal Posyandu',
      desc: 'Jadwal rutin penimbangan, imunisasi, dan lokasi 9 posyandu.',
      bg: '#ffedd5',
      iconColor: '#ea580c',
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
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h2 className="section-title" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
          Akses Cepat Layanan
        </h2>
      </div>

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
                minHeight: '110px',
                padding: '20px 16px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <div
                className="feature-icon-bg"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: feature.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  flexShrink: 0
                }}
              >
                <Icon size={22} color={feature.iconColor} />
              </div>

              <h3 className="feature-title" style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                {feature.title}
              </h3>

              <p className="feature-desc" style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                {feature.desc}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}