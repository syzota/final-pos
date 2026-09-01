import { Phone, Calculator, Newspaper, CalendarDays } from 'lucide-react';
import React from "react";

export default function FeatureCards({ onNavigate, onDarurat }) {
  const features = [
    {
      id: "darurat",
      title: "Kontak Darurat",
      desc: "Hubungi cepat nomor medis seperti bidan atau ambulan desa.",
      bg: "var(--rose-bg)",
      iconColor: "var(--rose-deep)",
      onClick: onDarurat,
      icon: Phone,
    },
    {
      id: "kalkulator",
      title: "Kalkulator",
      desc: "Hitung otomatis status gizi & stunting balita Anda.",
      bg: "var(--cyan-bg)",
      iconColor: "var(--cyan-deep)",
      page: "kalkulator",
      icon: Calculator,
    },
    {
      id: "artikel",
      title: "Artikel",
      desc: "Tips kesehatan terpercaya untuk ibu hamil dan balita.",
      bg: "var(--magenta-bg)",
      iconColor: "var(--magenta-deep)",
      page: "artikel",
      icon: Newspaper,
    },
    {
      id: "jadwal",
      title: "Jadwal",
      desc: "Cek jadwal rutin penimbangan dan imunisasi Posyandu.",
      bg: "var(--orange-bg)",
      iconColor: "var(--orange-deep)",
      page: "jadwal",
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

      <div className="section-header">
        <h2 className="section-title">Akses Cepat</h2>
      </div>

      <div className="feature-cards-row">

        {features.map((feature) => (
          <button
            key={feature.id}
            className="feature-card"
            onClick={() => handleClick(feature)}
          >

            {(() => {
              const Icon = feature.icon;
              return (
                <div
                  className="feature-icon-bg"
                  style={{
                    backgroundColor: feature.bg,
                  }}
                >
                  <Icon size={24} color={feature.iconColor} />
                </div>
              );
            })()}

            <h3 className="feature-title">
              {feature.title}
            </h3>

            <p className="feature-desc">
              {feature.desc}
            </p>

          </button>
        ))}

      </div>

    </section>
  );
}