import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import '../styles/jadwal.css';


const LocationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 20"
    fill="none"
  >
    <path
      d="M8 10C8.55 10 9.0208 9.8042 9.4125 9.4125 9.8042 9.0208 10 8.55 10 8C10 7.45 9.8042 6.9792 9.4125 6.5875 9.0208 6.1958 8.55 6 8 6C7.45 6 6.9792 6.1958 6.5875 6.5875 6.1958 6.9792 6 7.45 6 8C6 8.55 6.1958 9.0208 6.5875 9.4125 6.9792 9.8042 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625 13.5083 10.7375 14 9.3833 14 8.2C14 6.3833 13.4208 4.8958 12.2625 3.7375 11.1042 2.5792 9.6833 2 8 2C6.3167 2 4.8958 2.5792 3.7375 3.7375 2.5792 4.8958 2 6.3833 2 8.2C2 9.3833 2.4917 10.7375 3.475 12.2625 4.4583 13.7875 5.9667 15.4833 8 17.35ZM8 20C5.3167 17.7167 3.3125 15.5958 1.9875 13.6375 0.6625 11.6792 0 9.8667 0 8.2C0 5.7 0.8042 3.7083 2.4125 2.225 4.0208 0.7417 5.8833 0 8 0C10.1167 0 11.9792 0.7417 13.5875 2.225 15.1958 3.7083 16 5.7 16 8.2C16 9.8667 15.3375 11.6792 14.0125 13.6375 12.6875 15.5958 10.6833 17.7167 8 20Z"
      fill="#235078"
    />
  </svg>
);


export default function JadwalKegiatan({
  activePage,
  onNavigate,
  onDarurat
}) {
  const [posyanduList, setPosyanduList] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios
      .get('/api/profil-posyandu')

      .then((res) => {
        setPosyanduList(res.data.data || []);
        setLoading(false);
      })

      .catch((err) => {
        console.error('Gagal mengambil jadwal Posyandu:', err);
        setLoading(false);
      });
  }, []);


  return (
    <div className="jadwal-page">

      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        onDarurat={onDarurat}
      />


      <main className="jadwal-main">

        {/* =========================================
            HEADER
            ========================================= */}
        <div className="jadwal-header-block">

          <h1 className="jadwal-title">
            Jadwal Kegiatan Posyandu
          </h1>

          <p className="jadwal-subtitle">
            Informasi lokasi dan jadwal rutin pelayanan kesehatan
            masyarakat di Loa Duri Ulu.
          </p>

        </div>


        {/* =========================================
            DAFTAR POSYANDU
            ========================================= */}
        <div className="jadwal-cards-grid">

          {loading ? (

            <div
              style={{
                textAlign: 'center',
                width: '100%',
                padding: '40px',
                gridColumn: '1 / -1'
              }}
            >
              <h3>
                Memuat jadwal dari server...
              </h3>
            </div>

          ) : posyanduList.length === 0 ? (

            <div
              style={{
                textAlign: 'center',
                width: '100%',
                padding: '40px',
                gridColumn: '1 / -1'
              }}
            >
              <h3>
                Data jadwal Posyandu belum tersedia.
              </h3>

              <p
                style={{
                  marginTop: '8px',
                  color: 'var(--color-text-muted)'
                }}
              >
                Silakan periksa kembali setelah data jadwal ditambahkan.
              </p>
            </div>

          ) : (

            posyanduList.map((loc) => (

              <div
                className="jadwal-location-card"
                key={loc.id}
              >

                {/* Card Header */}
                <div className="jadwal-card-header">

                  <div className="jadwal-icon-box">
                    <LocationIcon />
                  </div>


                  <div className="jadwal-card-heading">

                    <h3 className="jadwal-loc-name">
                      Posyandu {loc.nama}
                    </h3>

                    <span className="jadwal-wilayah-badge">
                      Wilayah Loa Duri Ulu
                    </span>

                  </div>

                </div>


                {/* Alamat */}
                <div className="jadwal-card-info-block">

                  <span className="jadwal-info-label">
                    Alamat Lengkap
                  </span>

                  <p className="jadwal-info-value">
                    {loc.alamat || 'Belum diatur'}
                  </p>

                </div>


                {/* Jadwal */}
                <div className="jadwal-card-info-block bordered">

                  <span className="jadwal-info-label">
                    Jadwal Kegiatan Rutin
                  </span>

                  <p className="jadwal-info-value">
                    {loc.jadwal?.keterangan_waktu
                      ? `${loc.jadwal.keterangan_waktu} setiap bulan`
                      : 'Belum diatur'}
                  </p>

                </div>

              </div>

            ))

          )}

        </div>
        {/* ===== END jadwal-cards-grid ===== */}



        {/* =========================================
            PERSIAPAN SEBELUM DATANG
            SUDAH DI LUAR GRID POSYANDU
            ========================================= */}
        <section className="jadwal-prep-section">

          <div className="jadwal-prep-intro">

            <div className="jadwal-prep-icon">
              <i className="bi bi-clipboard2-check-fill"></i>
            </div>


            <div>

              <span className="jadwal-prep-eyebrow">
                SEBELUM DATANG
              </span>

              <h2 className="jadwal-prep-title">
                Persiapan Sebelum ke Posyandu
              </h2>

              <p className="jadwal-prep-subtitle">
                Beberapa hal sederhana yang dapat disiapkan agar
                pelayanan Posyandu berjalan lebih nyaman dan tertib.
              </p>

            </div>

          </div>



          {/* =========================================
              LIST PERSIAPAN
              ========================================= */}
          <div className="jadwal-prep-list">


            {/* ITEM 1 */}
            <div className="jadwal-prep-item">

              <div className="jadwal-prep-number">
                01
              </div>


              <div className="jadwal-prep-item-icon">
                <i className="bi bi-journal-medical"></i>
              </div>


              <div className="jadwal-prep-item-content">

                <h3>
                  Bawa buku kesehatan
                </h3>

                <p>
                  Siapkan buku KIA, KMS, atau dokumen kesehatan
                  lain yang biasa digunakan saat pemeriksaan.
                </p>

              </div>

            </div>



            {/* ITEM 2 */}
            <div className="jadwal-prep-item">

              <div className="jadwal-prep-number">
                02
              </div>


              <div className="jadwal-prep-item-icon">
                <i className="bi bi-calendar-check"></i>
              </div>


              <div className="jadwal-prep-item-content">

                <h3>
                  Periksa jadwal
                </h3>

                <p>
                  Pastikan lokasi serta waktu pelayanan Posyandu
                  sudah sesuai dengan jadwal yang tertera.
                </p>

              </div>

            </div>



            {/* ITEM 3 */}
            <div className="jadwal-prep-item">

              <div className="jadwal-prep-number">
                03
              </div>


              <div className="jadwal-prep-item-icon">
                <i className="bi bi-chat-left-text"></i>
              </div>


              <div className="jadwal-prep-item-content">

                <h3>
                  Catat hal yang ingin ditanyakan
                </h3>

                <p>
                  Bila ada keluhan atau hal yang ingin dikonsultasikan,
                  catat terlebih dahulu agar tidak terlupa.
                </p>

              </div>

            </div>

          </div>



          {/* =========================================
              CATATAN TAMBAHAN
              ========================================= */}
          <div className="jadwal-prep-note">

            <i className="bi bi-info-circle-fill"></i>

            <p>
              Kebutuhan dokumen dapat berbeda sesuai jenis pelayanan.
              Ikuti arahan kader atau petugas Posyandu setempat.
            </p>

          </div>

        </section>

      </main>


      <Footer />

    </div>
  );
}