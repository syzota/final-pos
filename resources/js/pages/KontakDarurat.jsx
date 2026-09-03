import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import '../styles/kontak.css';

import { Info, ShieldCheck, ClipboardCheck, MapPin, Signpost, ArrowUpRight, Hospital, CalendarCheck2, UserCheck } from 'lucide-react';

export default function KontakDarurat({
  activePage,
  onNavigate,
  onDarurat
}) {

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


      <main className="kontak-info-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        {/* UNIFIED HERO SECTION */}
        <PageHero
          badgeIcon={Info}
          badgeText="Kontak & Lokasi"
          title="Informasi Kontak &"
          titleHighlight="Lokasi Posyandu"
          description="Layanan kontak siaga dan titik lokasi 9 Posyandu di Desa Loa Duri Ulu."
          stats={[
            { icon: ShieldCheck, label: 'Layanan Resmi Desa Loa Duri Ulu' },
            { icon: MapPin, label: '9 Titik Posyandu Terdata Lengkap' },
          ]}
        />

        {/* PAPAN INFORMASI */}
        <section className="kontak-info-section">
          <SectionHeader
            eyebrow="INFORMASI PENTING"
            title="Papan Informasi Layanan"
            description="Informasi penting yang perlu diketahui masyarakat sebelum menghubungi atau mengunjungi posyandu."
            align="left"
          />


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
        {/* PANDUAN SEBELUM DATANG */}
        <section className="kontak-guide-section">
          <SectionHeader
            eyebrow="SEBELUM DATANG"
            title="Informasi yang Sebaiknya Disiapkan"
            description="Langkah praktis persiapan warga sebelum berkunjung ke posyandu."
            align="left"
          />

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