import React from "react";

export default function FeatureCards({ onNavigate, onDarurat }) {
  const features = [
    {
      id: "darurat",
      title: "Kontak Darurat",
      desc: "Akses cepat nomor bantuan medis desa.",
      bg: "#ffdad6",
      iconColor: "#8c1d18",
      onClick: onDarurat,
      icon: (
        <path
          d="M5.175 13.5V9.0375L1.3125 11.2688 0 9 3.8625 6.75 0 4.5188 1.3125 2.25 5.175 4.4812V0H7.8V4.4812L11.6625 2.25 12.975 4.5188 9.1125 6.75 12.975 9 11.6625 11.2688 7.8 9.0375V13.5H5.175Z"
          fill="#8c1d18"
        />
      ),
      viewBox: "0 0 13 14",
    },
    {
      id: "kalkulator",
      title: "Kalkulator",
      desc: "Pantau tumbuh kembang anak.",
      bg: "#99c2f1",
      iconColor: "#235078",
      page: "kalkulator",
      icon: (
        <path
          d="M2 0H14C15.1038 0 16 0.8962 16 2V18C16 19.1038 15.1038 20 14 20H2C0.8962 20 0 19.1038 0 18V2C0 0.8962 0.8962 0 2 0"
          transform="translate(1.125 1.1)"
          stroke="#235078"
          strokeWidth="2"
          fill="none"
        />
      ),
      viewBox: "0 0 18 22",
    },
    {
      id: "artikel",
      title: "Artikel",
      desc: "Informasi kesehatan terpercaya.",
      bg: "#f0abc4",
      iconColor: "#713c52",
      page: "artikel",
      icon: (
        <path
          d="M2 20C0.8962 20 0 19.1038 0 18V2C0 0.8962 0.8962 0 2 0H10C10.6394 0 11.2527 0.2531 11.704 0.706L15.292 4.294C15.7461 4.7454 16 5.3597 16 6V18C16 19.1038 15.1038 20 14 20H2"
          transform="translate(1.125 1.1)"
          stroke="#713c52"
          strokeWidth="2"
          fill="none"
        />
      ),
      viewBox: "0 0 18 22",
    },
    {
      id: "jadwal",
      title: "Jadwal",
      desc: "Agenda Posyandu.",
      bg: "#dce3eb",
      iconColor: "#5e656c",
      page: "jadwal",
      icon: (
        <path
          d="M2 0H16C17.1038 0 18 0.8962 18 2V16C18 17.1038 17.1038 18 16 18H2C0.8962 18 0 17.1038 0 16V2C0 0.8962 0.8962 0 2 0"
          transform="translate(1.11 1.11)"
          stroke="#5e656c"
          strokeWidth="2"
          fill="none"
        />
      ),
      viewBox: "0 0 20 20",
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
              <svg
                width="24"
                height="24"
                viewBox={feature.viewBox}
                fill="none"
              >
                {feature.icon}
              </svg>
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