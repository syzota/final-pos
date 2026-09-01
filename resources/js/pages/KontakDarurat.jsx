import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/kontak.css';

import { Info, ShieldCheck, ClipboardCheck, MapPin, Signpost, ArrowUpRight, Hospital, CalendarCheck2, UserCheck } from 'lucide-react';

export default function KontakDarurat({
  activePage,
  onNavigate,
  onDarurat
}) {

  /*
   * Lokasi mengikuti data lokasi yang sudah digunakan
   * di halaman Profil Posyandu.
   *
   * Tidak meminta GPS pengguna.
   */
  const locations = [
    {
      id: 1,
      name: 'Posyandu Bina Putra',
      address: 'Gg. Melati 6 No.5',
      coords: '-0.591351, 117.063864',
      mapsUrl: 'https://maps.google.com/?q=-0.591351,117.063864',
    },
    {
      id: 2,
      name: 'Posyandu Melati',
      address: 'Belakang Pos Polisi',
      coords: '-0.587910, 117.061170',
      mapsUrl: 'https://maps.google.com/?q=-0.587910,117.061170',
    },
    {
      id: 3,
      name: 'Posyandu Terkini',
      address: 'Gg. Nangka',
      coords: '-0.589430, 117.061800',
      mapsUrl: 'https://maps.google.com/?q=-0.589430,117.061800',
    },
    {
      id: 4,
      name: 'Posyandu Tunas Mulia',
      address: 'Loa Duri Ulu RT.08',
      coords: '-0.587190, 117.048890',
      mapsUrl: 'https://maps.google.com/?q=-0.587190,117.048890',
    },
    {
      id: 5,
      name: 'Posyandu Nusa Indah',
      address: 'Loa Duri Ulu RT.12',
      coords: '-0.588640, 117.055510',
      mapsUrl: 'https://maps.google.com/?q=-0.588640,117.055510',
    },
    {
      id: 6,
      name: 'Posyandu Rukun Lestari',
      address: 'Jl. Padat Karya',
      coords: '-0.590050, 117.053150',
      mapsUrl: 'https://maps.google.com/?q=-0.590050,117.053150',
    },
    {
      id: 7,
      name: 'Posyandu Mawar',
      address: 'Gintung RT 10',
      coords: '-0.605280, 117.048430',
      mapsUrl: 'https://maps.google.com/?q=-0.605280,117.048430',
    },
    {
      id: 8,
      name: 'Posyandu Cempaka',
      address: 'RT 17 Sei Pimping',
      coords: '-0.575500, 117.043630',
      mapsUrl: 'https://maps.google.com/?q=-0.575500,117.043630',
    },
    {
      id: 9,
      name: 'Posyandu Surya',
      address: 'RT 14 C3C5+542',
      coords: '-0.579550, 117.057760',
      mapsUrl: 'https://maps.google.com/?q=-0.579550,117.057760',
    },
  ];


  const informationCards = [
    {
      icon: Hospital,
      title: 'Kondisi Gawat Darurat',
      description:
        'Untuk kondisi yang membutuhkan pertolongan medis segera, gunakan layanan darurat resmi.',
      info: '112 / 119',
      caption: 'Layanan Darurat Nasional',
      type: 'emergency',
    },
    {
      icon: CalendarCheck2,
      title: 'Pelayanan Posyandu',
      description:
        'Pelayanan dilaksanakan mengikuti jadwal masing-masing Posyandu di wilayah Loa Duri Ulu.',
      info: 'Lihat Jadwal',
      caption: 'Jadwal tersedia pada portal',
      type: 'schedule',
    },
    {
      icon: UserCheck,
      title: 'Ibu, Bayi & Balita',
      description:
        'Informasi pelayanan ibu hamil, bayi dan balita dapat diperoleh melalui Posyandu sesuai wilayah.',
      info: '9 Posyandu',
      caption: 'Wilayah Loa Duri Ulu',
      type: 'health',
    },
  ];


  return (
    <div className="kontak-page">

      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        onDarurat={onDarurat}
      />


      <main className="kontak-info-main">

        {/* ==================================================
            HERO / HEADER
            ================================================== */}
        <section className="kontak-info-hero">

          <div className="kontak-info-hero__content">

            <div className="kontak-info-eyebrow">
              <Info />
              Informasi Layanan Masyarakat
            </div>

            <h1>
              Informasi Kontak &amp;
              <span> Lokasi Posyandu</span>
            </h1>

            <p>
              Temukan informasi layanan kesehatan, nomor darurat,
              serta lokasi Posyandu di wilayah Loa Duri Ulu.
              Halaman ini disediakan sebagai pusat informasi bagi masyarakat.
            </p>

          </div>


          <div className="kontak-info-hero__notice">

            <div className="kontak-info-notice-icon">
              <ShieldCheck />
            </div>

            <div>
              <strong>Informasi untuk warga</strong>

              <p>
                Website tidak meminta atau membagikan lokasi GPS Anda.
                Gunakan informasi alamat dan peta di bawah untuk menemukan
                Posyandu yang dituju.
              </p>
            </div>

          </div>

        </section>


        {/* ==================================================
            PAPAN INFORMASI
            ================================================== */}
        <section className="kontak-info-section">

          <div className="kontak-info-heading">

            <div>
              <span className="kontak-section-label">
                INFORMASI PENTING
              </span>

              <h2>Papan Informasi Layanan</h2>

              <p>
                Informasi singkat yang perlu diketahui sebelum
                menggunakan layanan kesehatan.
              </p>
            </div>

          </div>


          <div className="kontak-info-cards">

            {informationCards.map((item, index) => (

              <article
                className={`kontak-info-card kontak-info-card--${item.type}`}
                key={index}
              >

                <div className="kontak-info-card-icon">
                  <item.icon size={24} />
                </div>


                <div className="kontak-info-card-content">

                  <h3>{item.title}</h3>

                  <p>
                    {item.description}
                  </p>


                  <div className="kontak-info-card-value">

                    <strong>{item.info}</strong>

                    <span>
                      {item.caption}
                    </span>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* ==================================================
            CATATAN SEBELUM DATANG
            ================================================== */}
        <section className="kontak-guide-section">

          <div className="kontak-guide-header">

            <div className="kontak-guide-header-icon">
              <ClipboardCheck />
            </div>

            <div>
              <span className="kontak-section-label">
                SEBELUM DATANG
              </span>

              <h2>Informasi yang Sebaiknya Disiapkan</h2>
            </div>

          </div>


          <div className="kontak-guide-grid">

            <div className="kontak-guide-item">

              <span className="kontak-guide-number">
                01
              </span>

              <div>
                <h3>Periksa jadwal</h3>

                <p>
                  Pastikan hari dan waktu pelayanan Posyandu
                  yang akan dikunjungi.
                </p>
              </div>

            </div>


            <div className="kontak-guide-item">

              <span className="kontak-guide-number">
                02
              </span>

              <div>
                <h3>Siapkan dokumen</h3>

                <p>
                  Bawa dokumen kesehatan atau identitas yang
                  diperlukan sesuai jenis pelayanan.
                </p>
              </div>

            </div>


            <div className="kontak-guide-item">

              <span className="kontak-guide-number">
                03
              </span>

              <div>
                <h3>Catat keluhan</h3>

                <p>
                  Siapkan informasi mengenai keluhan atau kondisi
                  kesehatan yang ingin dikonsultasikan.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            9 LOKASI POSYANDU
            ================================================== */}
        <section className="kontak-location-section">

          <div className="kontak-info-heading kontak-location-heading">

            <div>

              <span className="kontak-section-label">
                LOKASI LAYANAN
              </span>

              <h2>9 Posyandu di Loa Duri Ulu</h2>

              <p>
                Pilih lokasi untuk membuka titik Posyandu
                melalui Google Maps.
              </p>

            </div>

            <div className="kontak-location-count">

              <strong>9</strong>

              <span>
                Lokasi
                <br />
                Posyandu
              </span>

            </div>

          </div>


          <div className="kontak-location-grid">

            {locations.map((location) => (

              <article
                key={location.id}
                className="kontak-location-card"
              >

                <div className="kontak-location-number">
                  {String(location.id).padStart(2, '0')}
                </div>


                <div className="kontak-location-icon">
                  <MapPin />
                </div>


                <div className="kontak-location-content">

                  <h3>
                    {location.name}
                  </h3>


                  <div className="kontak-location-address">

                    <Signpost />

                    <span>
                      {location.address}
                    </span>

                  </div>


                  <div className="kontak-location-coords">

                    {location.coords}

                  </div>

                </div>


                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kontak-location-map"
                  aria-label={`Buka lokasi ${location.name} di Google Maps`}
                >
                  <span>Buka Peta</span>

                  <ArrowUpRight />
                </a>

              </article>

            ))}

          </div>

        </section>


        {/* ==================================================
            MAP AREA
            ================================================== */}
        <section className="kontak-area-section">

          <div className="kontak-area-image">

            <iframe
              src="https://maps.google.com/maps?q=-0.587190,117.048890&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title="Peta Wilayah Loa Duri Ulu"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>


            <div className="kontak-area-overlay" style={{ pointerEvents: 'none' }}>

              <div className="kontak-area-pin">
                <MapPin />
              </div>


              <div>

                <span>
                  CAKUPAN WILAYAH
                </span>

                <strong>
                  Loa Duri Ulu
                </strong>

              </div>

            </div>

          </div>


          <div className="kontak-area-content">

            <span className="kontak-section-label">
              WILAYAH PELAYANAN
            </span>

            <h2>
              Layanan Posyandu dekat dengan masyarakat
            </h2>

            <p>
              Posyandu tersebar di beberapa titik di wilayah
              Loa Duri Ulu untuk memudahkan masyarakat memperoleh
              pelayanan dasar kesehatan.
            </p>


            <div className="kontak-area-note">

              <Info />

              <p>
                Gunakan tombol <strong>Buka Peta</strong> pada daftar
                lokasi untuk melihat titik Posyandu yang dipilih.
                Website tidak mengakses lokasi perangkat Anda.
              </p>

            </div>

          </div>

        </section>

      </main>


      <Footer />

    </div>
  );
}