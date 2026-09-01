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
      iconClass: "bi-telephone-fill",
    },
    {
      id: "kalkulator",
      title: "Kalkulator",
      desc: "Hitung otomatis status gizi & stunting balita Anda.",
      bg: "var(--cyan-bg)",
      iconColor: "var(--cyan-deep)",
      page: "kalkulator",
      iconClass: "bi-calculator-fill",
    },
    {
      id: "artikel",
      title: "Artikel",
      desc: "Tips kesehatan terpercaya untuk ibu hamil dan balita.",
      bg: "var(--magenta-bg)",
      iconColor: "var(--magenta-deep)",
      page: "artikel",
      iconClass: "bi-newspaper",
    },
    {
      id: "jadwal",
      title: "Jadwal",
      desc: "Cek jadwal rutin penimbangan dan imunisasi Posyandu.",
      bg: "var(--orange-bg)",
      iconColor: "var(--orange-deep)",
      page: "jadwal",
      iconClass: "bi-calendar-event-fill",
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

            <div
              className="feature-icon-bg"
              style={{
                backgroundColor: feature.bg,
              }}
            >
              <i 
                className={`bi ${feature.iconClass}`} 
                style={{ fontSize: '1.5rem', color: feature.iconColor }}
              ></i>
            </div>

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