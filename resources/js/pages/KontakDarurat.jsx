import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import useScrollReveal from '../utils/useScrollReveal';
import '../styles/kontak.css';

import { 
  InformationCircleIcon, 
  Shield01Icon, 
  Location01Icon, 
  Hospital01Icon, 
  CalendarCheckIn01Icon, 
  UserCheck01Icon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function KontakDarurat({
  activePage,
  onNavigate,
  onDarurat
}) {
  useScrollReveal();

  const informationCards = [
    {
      icon: Hospital01Icon,
      title: 'Kondisi Gawat Darurat',
      description:
        'Untuk kondisi yang membutuhkan pertolongan medis segera, gunakan layanan darurat resmi.',
      info: '112 / 119',
      caption: 'Layanan Darurat Nasional',
      type: 'emergency',
    },
    {
      icon: CalendarCheckIn01Icon,
      title: 'Pelayanan Posyandu',
      description:
        'Pelayanan dilaksanakan mengikuti jadwal masing-masing Posyandu di wilayah Loa Duri Ulu.',
      info: 'Lihat Jadwal',
      caption: 'Jadwal tersedia pada portal',
      type: 'schedule',
    },
    {
      icon: UserCheck01Icon,
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

      <Navbar
        activePage={activePage}
        onNavigate={onNavigate}
        onDarurat={onDarurat}
      />

      <main className="kontak-info-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        {/* UNIFIED HERO SECTION */}
        <div className="reveal-section">
          <PageHero
            badgeIcon={InformationCircleIcon}
            badgeText="Kontak & Bantuan"
            title="Informasi Kontak &"
            titleHighlight="Lokasi Posyandu"
            description="Layanan kontak siaga dan titik lokasi 9 Posyandu di Desa Loa Duri Ulu."
            stats={[
              { icon: Shield01Icon, label: 'Layanan Resmi Desa Loa Duri Ulu' },
              { icon: Location01Icon, label: '9 Titik Posyandu Terdata Lengkap' },
            ]}
          />
        </div>

        {/* PAPAN INFORMASI */}
        <section className="kontak-info-section reveal-section reveal-delay-1">
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
                onClick={() => {
                  if (item.type === 'emergency') window.location.href = 'tel:112';
                  if (item.type === 'schedule') onNavigate && onNavigate('jadwal');
                  if (item.type === 'health') onNavigate && onNavigate('profil');
                }}
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
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
        <section className="kontak-guide-section reveal-on-scroll">
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
      </main>


      <Footer onNavigate={onNavigate} />

    </div>
  );
}