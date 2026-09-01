import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProfilHeroBanner from '../components/profil/ProfilHeroBanner';
import ChairmanCard from '../components/profil/ChairmanCard';
import BasicContactCard from '../components/profil/BasicContactCard';
import CoreTasksCard from '../components/profil/CoreTasksCard';
import StrategicFunctionsCard from '../components/profil/StrategicFunctionsCard';
import StrukturKepengurusanSection from '../components/profil/StrukturKepengurusanSection';

export default function ProfilPosyandu({ onNavigate }) {
  const [profilList, setProfilList] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE BARU: Untuk menyimpan data posyandu yang sedang di-klik detailnya
  const [selectedDetailPosyandu, setSelectedDetailPosyandu] = useState(null);

  useEffect(() => {
    axios.get('/api/profil-posyandu')
      .then(response => {
        setProfilList(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Gagal mengambil data API:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', minHeight: '60vh' }}>
        <p style={{ color: 'var(--ink-soft)' }}>Memuat...</p>
      </div>
    );
  }

  if (!profilList || profilList.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', minHeight: '60vh', color: 'red' }}>
        <h2>Gagal memuat profil Posyandu. Pastikan server aktif!</h2>
      </div>
    );
  }

  const defaultProfil = profilList[0];

  // --- FUNGSI RENDER POP-UP DETAIL POSYANDU ---
  const renderDetailModal = () => {
    if (!selectedDetailPosyandu) return null;
    const p = selectedDetailPosyandu;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', backgroundColor: '#fff', borderRadius: '12px', padding: '32px' }}>
          <button onClick={() => setSelectedDetailPosyandu(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#666' }}>&times;</button>

          <div style={{ borderBottom: '2px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--violet-deep)', margin: '0 0 8px 0' }}>Profil Posyandu {p.nama}</h2>
            <span className="badge badge-green">Strata: {p.strata || 'Belum Diatur'}</span>
          </div>

          <div className="grid grid-2" style={{ gap: '24px' }}>
            {/* KOLOM KIRI */}
            <div>
              <h4 style={{ color: '#444', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px' }}><i className="bi bi-info-circle-fill me-2"></i>Informasi Umum</h4>
              <table className="table" style={{ fontSize: '13px', marginBottom: '24px' }}>
                <tbody>
                  <tr><td style={{ width: '40%' }}>Kode Kec / Desa</td><td><b>{p.kd_kecamatan || '-'} / {p.kd_desa || '-'}</b></td></tr>
                  <tr><td>RT / No. Posyandu</td><td><b>{p.rukun_tetangga || '-'} / {p.nomor_posyandu || '-'}</b></td></tr>
                  <tr><td>Alamat</td><td><b>{p.alamat || '-'}</b></td></tr>
                  <tr><td>Kontak Darurat</td><td><b>{p.kontak_darurat || '-'}</b></td></tr>
                  <tr>
                    <td>Program Integrasi</td>
                    <td>
                      <b>PAUD:</b> {p.program_paud || 'Tidak'}<br/>
                      <b>BKB:</b> {p.program_bkb || 'Tidak'}<br/>
                      <b>Lainnya:</b> {p.program_terintegrasi || '-'}
                    </td>
                  </tr>
                  <tr><td>Keterangan Profil</td><td><b>{p.keterangan_profil || '-'}</b></td></tr>
                </tbody>
              </table>

              <h4 style={{ color: '#444', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px' }}><i className="bi bi-people-fill me-2"></i>Kepengurusan</h4>
              <table className="table" style={{ fontSize: '13px' }}>
                <tbody>
                  <tr><td style={{ width: '40%' }}>PJ Umum</td><td><b>{p.pj_umum || '-'}</b></td></tr>
                  <tr><td>PJ Operasional</td><td><b>{p.pj_operasional || '-'}</b></td></tr>
                  <tr><td>Ketua Pelaksana</td><td><b>{p.ketua_pelaksana || '-'}</b></td></tr>
                  <tr><td>Sekretaris</td><td><b>{p.sekretaris || '-'}</b></td></tr>
                  <tr><td>Bendahara</td><td><b>{p.bendahara || '-'}</b></td></tr>
                </tbody>
              </table>
            </div>

            {/* KOLOM KANAN */}
            <div>
              <h4 style={{ color: '#444', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px' }}><i className="bi bi-heart-pulse-fill me-2"></i>Tenaga Medis & Kader</h4>
              <table className="table" style={{ fontSize: '13px', marginBottom: '24px' }}>
                <tbody>
                  <tr><td style={{ width: '40%' }}>Bidan Desa</td><td><b>{p.bidan_desa || '-'}</b></td></tr>
                  <tr><td>Petugas KB</td><td><b>{p.petugas_kb || '-'}</b></td></tr>
                  <tr><td>Medis/Paramedis</td><td><b>{p.medis_paramedis || '-'}</b></td></tr>
                  <tr><td>Kader Aktif</td><td><b>{p.jml_kader_aktif || 0} Orang</b></td></tr>
                  <tr><td>Kader Tdk Aktif</td><td><b>{p.jml_kader_tidak_aktif || 0} Orang</b></td></tr>
                </tbody>
              </table>

              <h4 style={{ color: '#444', borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '12px' }}><i className="bi bi-box-seam-fill me-2"></i>Sarana & Prasarana</h4>
              <table className="table" style={{ fontSize: '13px' }}>
                <tbody>
                  <tr><td style={{ width: '40%' }}>Tempat Pelayanan</td><td><b>{p.tempat_pelayanan || '-'}</b></td></tr>
                  <tr>
                    <td>Total Timbangan</td>
                    <td>
                      <b>Dacin:</b> {p.jml_dacin || 0} | <b>Bayi:</b> {p.timbangan_bayi || 0}<br/>
                      <b>Balita:</b> {p.timbangan_balita || 0} | <b>Ibu:</b> {p.timbangan_ibu || 0}
                    </td>
                  </tr>
                  <tr><td>Buku KIA</td><td><b>{p.buku_kia || '-'}</b></td></tr>
                  <tr><td>Formulir SIP</td><td><b>{p.formulir_sip || '-'}</b></td></tr>
                  <tr><td>Blanko SKDN</td><td><b>{p.blanko_skdn || '-'}</b></td></tr>
                  <tr><td>Buku Keuangan</td><td><b>{p.buku_catatan_keuangan || '-'}</b></td></tr>
                  <tr><td>Alat Peraga (APE)</td><td><b>{p.ape || '-'}</b></td></tr>
                  <tr><td>Alat Penyuluhan</td><td><b>{p.alat_peraga_penyuluhan || '-'}</b></td></tr>
                  <tr><td>Sarana Lainnya</td><td><b>{p.sarana_lain || '-'}</b></td></tr>
                  <tr><td>Ket. Sarana</td><td><b>{p.keterangan_sarana || '-'}</b></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <button className="btn btn-violet" onClick={() => setSelectedDetailPosyandu(null)}>Tutup Rincian</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profil-wrapper">
      <Header activePage="profil" onNavigate={onNavigate} />

      <main className="profil-container">
        <section className="profil-section">
          <ProfilHeroBanner />
        </section>

        <section className="profil-section grid-2-col">
          <ChairmanCard />
          <BasicContactCard data={defaultProfil} />
        </section>

        <section className="profil-section grid-2-col">
          <CoreTasksCard />
          <StrategicFunctionsCard />
        </section>

        <section className="profil-section">
          <StrukturKepengurusanSection />
        </section>

        {/* ========================================================
            DAFTAR 9 LOKASI POSYANDU & INTEGRASI DETAIL / MAPS
            ======================================================== */}
        <section className="profil-section" style={{ marginTop: '64px', marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--violet-deep)', fontSize: '28px', margin: '0 0 12px 0' }}>Daftar 9 Lokasi Posyandu</h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Klik "Lihat Detail" untuk membaca kelengkapan profil sarana fasilitas.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {profilList.map((posyandu, idx) => (
              <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <img
                  src={posyandu.foto ? `/storage/${posyandu.foto}` : 'https://via.placeholder.com/600x300?text=Foto+Posyandu+Belum+Tersedia'}
                  alt={posyandu.nama}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: 'var(--violet-deep)', fontSize: '20px' }}>{posyandu.nama}</h3>

                  <div style={{ fontSize: '14.5px', color: '#555', marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                    <i className="bi bi-geo-alt-fill" style={{ color: 'var(--rose-deep)', marginRight: '10px', marginTop: '2px' }}></i>
                    <span>{posyandu.alamat || 'Alamat spesifik belum diatur oleh Kader.'}</span>
                  </div>

                  <div style={{ fontSize: '14.5px', color: '#555', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                    <i className="bi bi-telephone-fill" style={{ color: 'var(--cyan-deep)', marginRight: '10px' }}></i>
                    <span>{posyandu.kontak_darurat || 'Belum ada kontak darurat.'}</span>
                  </div>

                  {/* DUA TOMBOL: LIHAT DETAIL & NAVIGASI */}
                  <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <button
                      className="btn btn-violet"
                      onClick={() => setSelectedDetailPosyandu(posyandu)}
                      style={{ width: '100%', padding: '10px', fontWeight: 'bold' }}
                    >
                      <i className="bi bi-info-circle me-2"></i> Lihat Detail Profil
                    </button>

                    <a
                      href={posyandu.link_gmaps || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', fontWeight: 'bold' }}
                      onClick={(e) => {
                        if (!posyandu.link_gmaps) {
                          e.preventDefault();
                          alert('Kader belum mengatur link lokasi peta untuk Posyandu ini.');
                        }
                      }}
                    >
                      <i className="bi bi-map me-2"></i> Navigasi Rute Maps
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />

      {/* PANGGIL KOMPONEN POP-UP DI PALING BAWAH */}
      {renderDetailModal()}
    </div>
  );
}