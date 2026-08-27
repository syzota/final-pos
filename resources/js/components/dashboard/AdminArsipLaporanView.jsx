import React, { useState } from 'react';
import axios from 'axios';

export default function AdminArsipLaporanView() {
  const [viewMode, setViewMode] = useState('list'); // 'list' atau 'detail'
  const [selectedPosyandu, setSelectedPosyandu] = useState(null);

  // State untuk 3 Tab (0: Rekap 46, 1: Rekap 13, 2: Data Umum)
  const [activeTab, setActiveTab] = useState(0);

  const [laporanData, setLaporanData] = useState({ rekap46: [], rekap13: [], dataUmum: [] });
  const [isLoadingLaporan, setIsLoadingLaporan] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Target Cetak Laporan Administratif
  const [printLaporanTarget, setPrintLaporanTarget] = useState({ type: '', data: null });

  const daftarPosyandu = [
    { id: 1, nama: 'Melati', jadwal: 'Tgl. 3' },
    { id: 2, nama: 'Rukun Lestari', jadwal: 'Tgl. 4' },
    { id: 3, nama: 'Mawar', jadwal: 'Tgl. 6' },
    { id: 4, nama: 'Bina Putra', jadwal: 'Tgl. 9' },
    { id: 5, nama: 'Nusa Indah', jadwal: 'Tgl. 10' },
    { id: 6, nama: 'Cempaka', jadwal: 'Tgl. 12' },
    { id: 7, nama: 'Tunas Mulya', jadwal: 'Tgl. 14' },
    { id: 8, nama: 'Surya', jadwal: 'Tgl. 16' },
    { id: 9, nama: 'Terkini', jadwal: 'Tgl. 19' }
  ];

  const openDetailPosyandu = async (posyandu) => {
    setSelectedPosyandu(posyandu);
    setViewMode('detail');
    setActiveTab(0); // Default buka tab pertama
    setIsLoadingLaporan(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/admin/laporan-posyandu/${posyandu.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Pastikan data yang diterima adalah array (berisi banyak riwayat)
      setLaporanData({
        rekap46: response.data.data.rekap46 || [],
        rekap13: response.data.data.rekap13 || [],
        dataUmum: response.data.data.dataUmum || []
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memuat arsip laporan dari server.' });
    } finally {
      setIsLoadingLaporan(false);
    }
  };

  const closeDetail = () => {
    setViewMode('list');
    setSelectedPosyandu(null);
    setLaporanData({ rekap46: [], rekap13: [], dataUmum: [] });
  };

  const handleCetakLaporan = (tipe, data) => {
    setPrintLaporanTarget({ type: tipe, data: data });
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintLaporanTarget({ type: '', data: null }), 800);
    }, 150);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return {
      tgl: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      jam: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <>
      <style>{`
        /* Sembunyikan semua elemen cetak secara default di layar monitor */
        #dokumen-cetak-rekap46, #dokumen-cetak-rekap13, #dokumen-cetak-dataumum { display: none; }

        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }

          @page {
            size: ${printLaporanTarget.type === 'rekap46' ? 'landscape' : 'portrait'};
            margin: 10mm 15mm;
          }

          /* TAMPILAN CETAK REKAP 46 KOLOM (LANDSCAPE) */
          ${printLaporanTarget.type === 'rekap46' ? `
            #dokumen-cetak-rekap46, #dokumen-cetak-rekap46 * { visibility: visible; }
            #dokumen-cetak-rekap46 { display: block !important; position: absolute; left: 0; top: 0; width: 100%; font-family: 'Times New Roman', Times, serif; }
            .tabel-kegiatan { width: 100%; border-collapse: collapse; font-size: 10px; }
            .tabel-kegiatan th, .tabel-kegiatan td { border: 1px solid #000; text-align: center; vertical-align: middle; padding: 2px; }
            .teks-vertikal { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; padding: 8px 4px !important; max-height: 180px; }
          ` : ''}

          /* TAMPILAN CETAK 13 POIN VERTIKAL (PORTRAIT) */
          ${printLaporanTarget.type === 'rekap13' ? `
            #dokumen-cetak-rekap13, #dokumen-cetak-rekap13 * { visibility: visible; }
            #dokumen-cetak-rekap13 { display: block !important; position: absolute; left: 0; top: 0; width: 100%; font-family: Arial, sans-serif; font-size: 13px; }
            .tabel-laporan { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
            .tabel-laporan th, .tabel-laporan td { border: 1px solid #000; padding: 4px 8px; vertical-align: middle; }
            .titik-titik { border-bottom: 1px dotted #000; display: inline-block; min-width: 30px; text-align: center; }
            .garis-bawah { border-bottom: 1px dotted #000; flex-grow: 1; margin: 0 8px; }
            .item-baris { display: flex; align-items: flex-end; margin-bottom: 8px; }
          ` : ''}

          /* TAMPILAN CETAK DATA UMUM (PORTRAIT) */
          ${printLaporanTarget.type === 'dataUmum' ? `
            #dokumen-cetak-dataumum, #dokumen-cetak-dataumum * { visibility: visible; }
            #dokumen-cetak-dataumum { display: block !important; position: absolute; left: 0; top: 0; width: 100%; font-family: Arial, sans-serif; font-size: 13.5px; color: #000; }
            .tabel-umum { width: 100%; border-collapse: collapse; margin-bottom: 12px; margin-top: 4px; }
            .tabel-umum th, .tabel-umum td { border: 1px solid #000; padding: 4px 8px; vertical-align: middle; }
            .titik-titik { border-bottom: 1px dotted #000; display: inline-block; min-width: 40px; text-align: right; padding-right: 4px; }
            .garis-bawah { border-bottom: 1px dotted #000; flex-grow: 1; margin: 0 8px; }
            .item-baris { display: flex; align-items: flex-end; margin-bottom: 10px; font-weight: bold; }
            .header-posyandu { margin-bottom: 24px; line-height: 1.6; font-size: 14px; }
            .header-posyandu span { display: inline-block; width: 120px; }
          ` : ''}
        }
      `}</style>

      <div className="no-print">
        {message.text && (
          <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
            <b>Info Sistem:</b> {message.text}
          </div>
        )}

        {/* =========================================
            MODE 1: DAFTAR 9 POSYANDU
            ========================================= */}
        {viewMode === 'list' && (
          <div className="card">
            <div className="section-head">
              <h3><i className="bi bi-folder-check me-2" style={{ color: 'var(--violet-deep)' }}></i>Arsip Laporan 9 Posyandu</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Pantau riwayat lengkap dan ekspor dokumen laporan bulanan (Register 46 Kolom, 13 Poin, dan Data Umum) dari masing-masing Posyandu.</p>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Posyandu</th>
                    <th>Jadwal Rutin</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarPosyandu.map((posyandu) => (
                    <tr key={posyandu.id}>
                      <td><b>{posyandu.nama}</b></td>
                      <td>{posyandu.jadwal}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn btn-sm btn-violet" onClick={() => openDetailPosyandu(posyandu)}>
                          <i className="bi bi-folder2-open me-1"></i>Buka Arsip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================
            MODE 2: DETAIL ARSIP (TABBED)
            ========================================= */}
        {viewMode === 'detail' && selectedPosyandu && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <button className="btn btn-outline" onClick={closeDetail}>
                <i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Posyandu
              </button>
            </div>

            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="section-head">
                <h3><i className="bi bi-building me-2"></i>Arsip Lengkap - Posyandu {selectedPosyandu.nama}</h3>
              </div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>Pilih kategori laporan untuk melihat riwayat bulan-bulan sebelumnya dan mencetaknya.</p>

              {/* TABS MENU */}
              <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
                <button
                  className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
                  onClick={() => setActiveTab(0)}
                  style={{ borderBottom: activeTab === 0 ? '2px solid var(--violet-deep)' : 'none', color: activeTab === 0 ? 'var(--violet-deep)' : '#666' }}>
                  <i className="bi bi-file-earmark-spreadsheet-fill me-2"></i>Register Kegiatan (46 Kolom)
                </button>
                <button
                  className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => setActiveTab(1)}
                  style={{ borderBottom: activeTab === 1 ? '2px solid var(--violet-deep)' : 'none', color: activeTab === 1 ? 'var(--violet-deep)' : '#666' }}>
                  <i className="bi bi-card-checklist me-2"></i>Pencatatan 13 Poin (TTD)
                </button>
                <button
                  className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
                  onClick={() => setActiveTab(2)}
                  style={{ borderBottom: activeTab === 2 ? '2px solid var(--violet-deep)' : 'none', color: activeTab === 2 ? 'var(--violet-deep)' : '#666' }}>
                  <i className="bi bi-clipboard-data-fill me-2"></i>Data Umum Posyandu
                </button>
              </div>

              {/* ISI KONTEN TAB */}
              {isLoadingLaporan ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <h4>Memuat Arsip Laporan... ⏳</h4>
                </div>
              ) : (
                <div className="card" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>

                  {/* TAB 0: REKAP 46 KOLOM */}
                  {activeTab === 0 && (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Tanggal Kirim Sistem</th>
                            <th>Bulan Pendataan</th>
                            <th>Total Sasaran (S)</th>
                            <th>Total Ditimbang (D)</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laporanData.rekap46.length > 0 ? (
                            laporanData.rekap46.map((item) => {
                              const dt = formatDateTime(item.created_at);
                              return (
                                <tr key={item.id}>
                                  <td><b>{dt.tgl}</b> <br/><span style={{ fontSize: '12px', color: '#666' }}>Pukul {dt.jam}</span></td>
                                  <td>{item.bulan_pendataan || '-'}</td>
                                  <td>{item.skdn_s || 0} Anak</td>
                                  <td>{item.skdn_d || 0} Anak</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-sm btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => handleCetakLaporan('rekap46', item)}>
                                      <i className="bi bi-printer me-1"></i>Cetak PDF
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada riwayat Register 46 Kolom.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB 1: PENCATATAN 13 POIN */}
                  {activeTab === 1 && (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Tanggal Kirim Sistem</th>
                            <th>Ketua Pelaksana</th>
                            <th>Total Balita (SKDN-S)</th>
                            <th>Tanda Tangan</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laporanData.rekap13.length > 0 ? (
                            laporanData.rekap13.map((item) => {
                              const dt = formatDateTime(item.created_at);
                              return (
                                <tr key={item.id}>
                                  <td><b>{dt.tgl}</b> <br/><span style={{ fontSize: '12px', color: '#666' }}>Pukul {dt.jam}</span></td>
                                  <td>{item.ketua_pelaksana || '-'}</td>
                                  <td>{item.skdn_s || 0} Anak</td>
                                  <td>
                                    {item.signature_data ? <span className="badge badge-green">Tersedia</span> : <span className="badge badge-rose">Kosong</span>}
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-sm btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => handleCetakLaporan('rekap13', item)}>
                                      <i className="bi bi-printer me-1"></i>Cetak PDF
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada riwayat Laporan 13 Poin.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* TAB 2: DATA UMUM POSYANDU */}
                  {activeTab === 2 && (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Bulan / Tahun Laporan</th>
                            <th>Total Pengunjung Bayi</th>
                            <th>Jml Ibu Hamil</th>
                            <th>Kader Hadir</th>
                            <th style={{ textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laporanData.dataUmum.length > 0 ? (
                            laporanData.dataUmum.map((item) => {
                              return (
                                <tr key={item.id}>
                                  <td><b>{item.bulan} {item.tahun}</b></td>
                                  <td>{item.pengunjung_bayi || 0} Bayi</td>
                                  <td>{item.pengunjung_ibu_hamil || 0} Orang</td>
                                  <td>{item.petugas_kader || 0} Orang</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <button className="btn btn-sm btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => handleCetakLaporan('dataUmum', item)}>
                                      <i className="bi bi-printer me-1"></i>Cetak PDF
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada riwayat Data Umum Posyandu.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          LAPORAN CETAK RAHASIA (MUNCUL DI KERTAS PDF SESUAI DENGAN TARGET)
          ========================================================================= */}

      {/* 1. CETAK REKAP 46 KOLOM (LANDSCAPE) */}
      {printLaporanTarget.type === 'rekap46' && printLaporanTarget.data && (
        <div id="dokumen-cetak-rekap46">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '12px' }}>
              <div>TAHUN : {new Date().getFullYear()}</div>
              <div>Kab/Kodya : Kutai Kartanegara</div>
              <div>Provinsi : Kalimantan Timur</div>
            </div>
            <div style={{ textAlign: 'center', flexGrow: 1 }}>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>DATA HASIL KEGIATAN POSYANDU</h2>
            </div>
            <div style={{ width: '150px' }}></div>
          </div>
          <table className="tabel-kegiatan">
            <thead>
              <tr>
                <th colSpan="3" style={{ borderBottom: 'none' }}>ISI 1 BILA ADA DATA</th>
                <th rowSpan="3" className="teks-vertikal">NO POSYANDU</th>
                <th rowSpan="3" className="teks-vertikal">BULAN PENDATAAN</th>
                <th rowSpan="3" className="teks-vertikal">JUMLAH</th>
                <th colSpan="3">IBU HAMIL</th>
                <th colSpan="3">JUMLAH<br/>PESERTA KB</th>
                <th colSpan="5">PENIMBANG BALITA (JUMLAH)</th>
                <th colSpan="7">JUMLAH BALITA</th>
                <th colSpan="15">JUMLAH BALITA YANG DIIMUNISASI</th>
                <th colSpan="2">BALITA YANG<br/>MENDERITA<br/>DIARE</th>
                <th colSpan="5" rowSpan="2">LAYANAN KESEHATAN</th>
              </tr>
              <tr>
                <th rowSpan="2" className="teks-vertikal">KD KEC</th>
                <th rowSpan="2" className="teks-vertikal">KD DESA</th>
                <th rowSpan="2" className="teks-vertikal">RT</th>
                <th rowSpan="2" className="teks-vertikal">JML YANG MEMERIKSAKAN DIRI</th>
                <th rowSpan="2" className="teks-vertikal">JML YANG MENDAPAT Fe</th>
                <th rowSpan="2" className="teks-vertikal">JUMLAH YANG MENYUSUI</th>
                <th rowSpan="2" className="teks-vertikal">KONDOM</th>
                <th rowSpan="2" className="teks-vertikal">PIL</th>
                <th rowSpan="2" className="teks-vertikal">SUNTIK</th>
                <th rowSpan="2" className="teks-vertikal">JML BALITA SASARAN POSYANDU (S)</th>
                <th rowSpan="2" className="teks-vertikal">YANG PUNYA KMS (K)</th>
                <th rowSpan="2" className="teks-vertikal">YANG DITIMBANG (D)</th>
                <th rowSpan="2" className="teks-vertikal">YANG NAIK</th>
                <th rowSpan="2" className="teks-vertikal">YANG DIBAWAH GARIS MERAH (BGM)</th>
                <th rowSpan="2" className="teks-vertikal">JUMLAH BGM LAKI-LAKI</th>
                <th rowSpan="2" className="teks-vertikal">JUMLAH BGM PEREMPUAN</th>
                <th rowSpan="2" className="teks-vertikal">YANG DAPAT VITAMIN A</th>
                <th rowSpan="2" className="teks-vertikal">KMS YANG KELUAR</th>
                <th colSpan="2">YANG<br/>DAPAT<br/>Fe</th>
                <th rowSpan="2" className="teks-vertikal">YANG DAPAT PMT</th>
                <th rowSpan="2" className="teks-vertikal">HEPATITIS 0-7 HARI</th>
                <th rowSpan="2" className="teks-vertikal">BCG</th>
                <th colSpan="3">DPT-HB</th>
                <th colSpan="4">POLIO</th>
                <th rowSpan="2" className="teks-vertikal">CAMPAK</th>
                <th colSpan="3">HEPATITIS</th>
                <th colSpan="2">TT</th>
                <th rowSpan="2" className="teks-vertikal">JUMLAH BALITA</th>
                <th rowSpan="2" className="teks-vertikal">JUMLAH BALITA DAPAT ORALIT</th>
              </tr>
              <tr>
                <th>1</th><th>2</th>
                <th>I</th><th>II</th><th>III</th>
                <th>I</th><th>II</th><th>III</th><th>IV</th>
                <th>I</th><th>II</th><th>III</th>
                <th>I</th><th>II</th>
                <th className="teks-vertikal">SOSIALISASI PENYULUHAN</th>
                <th className="teks-vertikal">JUMLAH BAYI YANG MENERIMA KMS</th>
                <th className="teks-vertikal">JUMLAH BALITA DAPAT IMUNISASI</th>
                <th className="teks-vertikal">JUMLAH BALITA YG KURANG GIZI</th>
                <th></th>
              </tr>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                {[...Array(46)].map((_, i) => <th key={i}>{i + 1}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{printLaporanTarget.data.kd_kec}</td><td>{printLaporanTarget.data.kd_desa}</td><td>{printLaporanTarget.data.rt}</td><td>{printLaporanTarget.data.no_posyandu}</td>
                <td>{printLaporanTarget.data.bulan_pendataan}</td><td>{printLaporanTarget.data.jumlah}</td><td>{printLaporanTarget.data.ibu_hamil_periksa}</td>
                <td>{printLaporanTarget.data.ibu_hamil_fe}</td><td>{printLaporanTarget.data.ibu_menyusui}</td><td>{printLaporanTarget.data.kb_kondom}</td>
                <td>{printLaporanTarget.data.kb_pil}</td><td>{printLaporanTarget.data.kb_suntik}</td><td>{printLaporanTarget.data.skdn_s}</td>
                <td>{printLaporanTarget.data.skdn_k}</td><td>{printLaporanTarget.data.skdn_d}</td><td>{printLaporanTarget.data.skdn_n}</td>
                <td>{printLaporanTarget.data.skdn_bgm}</td><td>{printLaporanTarget.data.bgm_l}</td><td>{printLaporanTarget.data.bgm_p}</td>
                <td>{printLaporanTarget.data.vit_a}</td><td>{printLaporanTarget.data.kms_keluar}</td><td>{printLaporanTarget.data.fe_1}</td>
                <td>{printLaporanTarget.data.fe_2}</td><td>{printLaporanTarget.data.pmt}</td><td>{printLaporanTarget.data.hep_0_7}</td>
                <td>{printLaporanTarget.data.bcg}</td><td>{printLaporanTarget.data.dpt_1}</td><td>{printLaporanTarget.data.dpt_2}</td>
                <td>{printLaporanTarget.data.dpt_3}</td><td>{printLaporanTarget.data.polio_1}</td><td>{printLaporanTarget.data.polio_2}</td>
                <td>{printLaporanTarget.data.polio_3}</td><td>{printLaporanTarget.data.polio_4}</td><td>{printLaporanTarget.data.campak}</td>
                <td>{printLaporanTarget.data.hep_1}</td><td>{printLaporanTarget.data.hep_2}</td><td>{printLaporanTarget.data.hep_3}</td>
                <td>{printLaporanTarget.data.tt_1}</td><td>{printLaporanTarget.data.tt_2}</td><td>{printLaporanTarget.data.diare_jml}</td>
                <td>{printLaporanTarget.data.diare_oralit}</td><td>{printLaporanTarget.data.sosialisasi}</td><td>{printLaporanTarget.data.bayi_kms}</td>
                <td>{printLaporanTarget.data.balita_imunisasi}</td><td>{printLaporanTarget.data.balita_kurang_gizi}</td><td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 2. CETAK LAPORAN 13 POIN (PORTRAIT) */}
      {printLaporanTarget.type === 'rekap13' && printLaporanTarget.data && (
        <div id="dokumen-cetak-rekap13">
          <h3 style={{ marginBottom: '16px' }}>III.&nbsp;&nbsp;PENCATATAN " KEGIATAN POSYANDU "</h3>
          <b>1 Ibu Hamil</b>
          <table className="tabel-laporan">
            <tbody>
              <tr><td style={{ width: '60%' }}>Jml. Ibu Hamil</td><td><span className="titik-titik">{printLaporanTarget.data.ibu_hamil}</span> Orang</td></tr>
              <tr><td>Jml. Ibu Hamil yang memeriksakan diri</td><td><span className="titik-titik">{printLaporanTarget.data.ibu_hamil_periksa}</span> Orang</td></tr>
              <tr><td>Jml. Yang mendapat Fe</td><td><span className="titik-titik">{printLaporanTarget.data.ibu_hamil_fe}</span> Orang</td></tr>
            </tbody>
          </table>
          <div className="item-baris"><b>2 Jumlah Yang menyusui</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.ibu_menyusui}</span></div>
          <b>3 Jumlah Peserta KB Yang Mendapat Pelayanan Ulang</b>
          <table className="tabel-laporan">
            <tbody>
              <tr><td style={{ width: '60%' }}>KONDOM</td><td><span className="titik-titik">{printLaporanTarget.data.kb_kondom}</span> Orang</td></tr>
              <tr><td>PIL</td><td><span className="titik-titik">{printLaporanTarget.data.kb_pil}</span> Orang</td></tr>
              <tr><td>SUNTIK</td><td><span className="titik-titik">{printLaporanTarget.data.kb_suntik}</span> Orang</td></tr>
            </tbody>
          </table>
          <b>4 Penimbangan Balita</b>
          <table className="tabel-laporan">
            <tbody>
              <tr><td style={{ width: '60%' }}>Jml Balita (S)sasaran Posyandu</td><td><span className="titik-titik">{printLaporanTarget.data.skdn_s}</span> BALITA</td></tr>
              <tr><td>Jml Balita punya (K)MS</td><td><span className="titik-titik">{printLaporanTarget.data.skdn_k}</span> BALITA</td></tr>
              <tr><td>Jml Balita (D)itimbang</td><td><span className="titik-titik">{printLaporanTarget.data.skdn_d}</span> BALITA</td></tr>
              <tr><td>Jml Balita (Naik) BB</td><td><span className="titik-titik">{printLaporanTarget.data.skdn_n}</span> BALITA</td></tr>
              <tr><td>Jml Balita (BGM)</td><td><span className="titik-titik">{printLaporanTarget.data.skdn_bgm}</span> BALITA</td></tr>
              <tr><td>Jml Balita BGM laki-laki</td><td><span className="titik-titik">{printLaporanTarget.data.bgm_l}</span> BALITA</td></tr>
              <tr><td>Jml Balita BGM Perempuan</td><td><span className="titik-titik">{printLaporanTarget.data.bgm_p}</span> BALITA</td></tr>
            </tbody>
          </table>
          <b>5 Jumlah BALITA</b>
          <table className="tabel-laporan">
            <tbody>
              <tr><td colSpan="2" style={{ width: '60%' }}>DAPAT VITAMIN A</td><td colSpan="2"><span className="titik-titik">{printLaporanTarget.data.vit_a}</span> BALITA</td></tr>
              <tr><td colSpan="2">KMS yang Keluar</td><td colSpan="2"><span className="titik-titik">{printLaporanTarget.data.kms_keluar}</span> BALITA</td></tr>
              <tr><td rowSpan="2" style={{ width: '30%' }}>Dapat Fe</td><td style={{ textAlign: 'center', width: '30%' }}>Fe-1</td><td colSpan="2" style={{ textAlign: 'center' }}>Fe-2</td></tr>
              <tr><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.fe_1}</span> BALITA</td><td colSpan="2" style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.fe_2}</span> BALITA</td></tr>
              <tr><td colSpan="2">Balita dapat PMT</td><td colSpan="2"><span className="titik-titik">{printLaporanTarget.data.pmt}</span> BALITA</td></tr>
            </tbody>
          </table>
          <b>6 Jumlah Balita Yang Diimunisasi</b>
          <table className="tabel-laporan" style={{ textAlign: 'center' }}>
            <tbody>
              <tr><td style={{ textAlign: 'left', width: '35%' }}>HEPATITIS 0-7 HARI</td><td colSpan="4"><span className="titik-titik">{printLaporanTarget.data.hep_0_7}</span> BALITA</td></tr>
              <tr><td style={{ textAlign: 'left' }}>DPT-HB</td><td colSpan="4"><span className="titik-titik">{printLaporanTarget.data.dpt_hb}</span> BALITA</td></tr>
              <tr><td rowSpan="2" style={{ textAlign: 'left' }}>POLIO</td><td>I</td><td>II</td><td>III</td><td>IV</td></tr>
              <tr><td><span className="titik-titik">{printLaporanTarget.data.polio_1}</span> BALITA</td><td><span className="titik-titik">{printLaporanTarget.data.polio_2}</span> BALITA</td><td><span className="titik-titik">{printLaporanTarget.data.polio_3}</span> BALITA</td><td><span className="titik-titik">{printLaporanTarget.data.polio_4}</span> BALITA</td></tr>
              <tr><td style={{ textAlign: 'left' }}>CAMPAK</td><td colSpan="4"><span className="titik-titik">{printLaporanTarget.data.campak}</span> BALITA</td></tr>
              <tr><td rowSpan="2" style={{ textAlign: 'left' }}>HEPATITIS</td><td>I</td><td colSpan="2">II</td><td>III</td></tr>
              <tr><td></td><td colSpan="2"><span className="titik-titik">{printLaporanTarget.data.hep_2}</span> BALITA</td><td><span className="titik-titik">{printLaporanTarget.data.hep_3}</span> BALITA</td></tr>
              <tr><td rowSpan="2" style={{ textAlign: 'left' }}>TT</td><td colSpan="2">I</td><td colSpan="2">II</td></tr>
              <tr><td colSpan="2"><span className="titik-titik">{printLaporanTarget.data.tt_1}</span> BALITA</td><td colSpan="2"><span className="titik-titik">{printLaporanTarget.data.tt_2}</span> BALITA</td></tr>
            </tbody>
          </table>
          <b>7 BALITA Yang Menderita DIARE</b>
          <table className="tabel-laporan">
            <tbody>
              <tr><td style={{ width: '60%' }}>Jumlah BALITA DIARE</td><td><span className="titik-titik">{printLaporanTarget.data.diare_jml}</span> BALITA</td></tr>
              <tr><td>Jumlah BALITA DIARE Dapat Oralit</td><td><span className="titik-titik">{printLaporanTarget.data.diare_oralit}</span> BALITA</td></tr>
            </tbody>
          </table>
          <div className="item-baris"><b>8 Layanan Kesehatan</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.layanan_kesehatan}</span>&nbsp;Kali</div>
          <div className="item-baris"><b>9 Sosialisasi Penyuluhan</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.sosialisasi}</span>&nbsp;Kali</div>
          <div className="item-baris"><b>10 Jumlah Bayi Yang Menerima KMS</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.bayi_kms}</span>&nbsp;Orang</div>
          <div className="item-baris"><b>11 Jumlah Bayi yang dapat Imunisasi</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.balita_imunisasi}</span>&nbsp;Orang</div>
          <div className="item-baris"><b>12 Jumlah Bayi yang kurang gizi</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.balita_kurang_gizi}</span>&nbsp;Orang</div>
          <div className="item-baris"><b>13 Jumlah kematian Balita</b><div className="garis-bawah"></div><span>{printLaporanTarget.data.kematian_balita}</span>&nbsp;Orang</div>

          {/* Tanda Tangan */}
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '250px', textAlign: 'center' }}>
              <div>Posyandu <span className="titik-titik">{printLaporanTarget.data.nama_posyandu}</span></div>
              <div style={{ marginBottom: '10px' }}>Ketua Pelaksanaan :</div>
              {printLaporanTarget.data.signature_data ? (
                <img src={printLaporanTarget.data.signature_data} alt="Tanda Tangan" style={{ height: '80px', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
              ) : (
                <div style={{ height: '80px' }}></div>
              )}
              <div style={{ borderBottom: '1px dotted #000', marginTop: '10px', minHeight: '20px' }}>
                {printLaporanTarget.data.ketua_pelaksana}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CETAK DATA UMUM POSYANDU (PORTRAIT) */}
      {printLaporanTarget.type === 'dataUmum' && printLaporanTarget.data && (
        <div id="dokumen-cetak-dataumum">
          <div className="header-posyandu">
            <div><span>Posyandu</span>: {printLaporanTarget.data.nama_posyandu}</div>
            <div><span>Rukun Warga</span>: {printLaporanTarget.data.rukun_warga}</div>
            <div><span>Desa/Kelurahan</span>: {printLaporanTarget.data.desa}</div>
            <div><span>Kecamatan</span>: {printLaporanTarget.data.kecamatan}</div>
          </div>
          <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>II.&nbsp;&nbsp;&nbsp;PENCATATAN "DATA UMUM POSYANDU "</h3>
          <div style={{ paddingLeft: '16px' }}>
            <div style={{ marginBottom: '12px' }}><div style={{ fontWeight: 'bold' }}>1&nbsp;&nbsp;&nbsp;Tahun</div><div style={{ color: '#555', fontSize: '12px', paddingLeft: '20px' }}>Diisi dengan tahun pendataan .............................................. <span style={{ color: '#000', fontSize: '13px' }}>{printLaporanTarget.data.tahun}</span></div></div>
            <div style={{ marginBottom: '16px' }}><div style={{ fontWeight: 'bold' }}>2&nbsp;&nbsp;&nbsp;Bulan</div><div style={{ color: '#555', fontSize: '12px', paddingLeft: '20px' }}>Diisi dengan bulan pendataan .............................................. <span style={{ color: '#000', fontSize: '13px' }}>{printLaporanTarget.data.bulan}</span></div></div>
            <div style={{ fontWeight: 'bold' }}>3&nbsp;&nbsp;&nbsp;Jumlah Pengunjung</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
              <tbody>
                <tr><td style={{ width: '60%' }}>Jml Bayi ( 0-12 Bln )</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_bayi}</span>&nbsp;Bayi</td></tr>
                <tr><td>Jml Baduta ( 13-24 Bln )</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_baduta}</span>&nbsp;Bayi</td></tr>
                <tr><td>Jml Balita ( 25- 59 Bln )</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_balita}</span>&nbsp;Bayi</td></tr>
                <tr><td>WUS</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_wus}</span>&nbsp;Orang</td></tr>
                <tr><td>PUS</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_pus}</span>&nbsp;Pasangan</td></tr>
                <tr>
                  <td rowSpan="2" style={{ verticalAlign: 'middle' }}>Ibu</td>
                  <td style={{ textAlign: 'center', padding: '0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '50%', border: 'none', borderRight: '1px solid #000', borderBottom: '1px solid #000', textAlign: 'center' }}>Hamil</td>
                          <td style={{ width: '50%', border: 'none', borderBottom: '1px solid #000', textAlign: 'center' }}>Menyusui</td>
                        </tr>
                        <tr>
                          <td style={{ border: 'none', borderRight: '1px solid #000', textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_ibu_hamil}</span>&nbsp;Orang</td>
                          <td style={{ border: 'none', textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_ibu_menyusui}</span>&nbsp;Orang</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontWeight: 'bold', marginTop: '16px' }}>4&nbsp;&nbsp;&nbsp;Jumlah Bayi</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
              <tbody>
                <tr><td style={{ width: '60%' }}>Lahir</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.bayi_lahir}</span>&nbsp;Bayi</td></tr>
                <tr><td>Meninggal</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.bayi_meninggal}</span>&nbsp;Bayi</td></tr>
              </tbody>
            </table>
            <div className="item-baris" style={{ marginTop: '16px' }}><span>5&nbsp;&nbsp;&nbsp;Jumlah Kematian Ibu Hamil, salin nifas</span><div className="garis-bawah"></div><span>{printLaporanTarget.data.mati_ibu_hamil_salin_nifas}</span>&nbsp;Orang</div>
            <div style={{ fontWeight: 'bold', marginTop: '16px' }}>6&nbsp;&nbsp;&nbsp;Jumlah Petugas Hadir</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
              <tbody>
                <tr><td style={{ width: '60%' }}>Kader PKK Posyandu</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.petugas_kader}</span>&nbsp;Orang</td></tr>
                <tr><td>PLKB/PKB</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.petugas_plkb}</span>&nbsp;Orang</td></tr>
                <tr><td>Medis dan Para Medis</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.petugas_medis}</span>&nbsp;Orang</td></tr>
              </tbody>
            </table>
            <div style={{ fontWeight: 'bold', marginTop: '16px' }}>7&nbsp;&nbsp;&nbsp;Jumlah Ibu Nifas</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
              <tbody>
                <tr><td style={{ width: '60%' }}>Dapat Fe</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.nifas_fe}</span>&nbsp;Orang</td></tr>
                <tr><td>Dapat Vit A</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.nifas_vit_a}</span>&nbsp;Orang</td></tr>
              </tbody>
            </table>
            <div style={{ fontWeight: 'bold', marginTop: '16px' }}>8&nbsp;&nbsp;&nbsp;Ibu Hamil</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
              <tbody>
                <tr><td style={{ width: '60%' }}>KEK</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.hamil_kek}</span>&nbsp;Orang</td></tr>
                <tr><td>Anemia</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.hamil_anemia}</span>&nbsp;Orang</td></tr>
              </tbody>
            </table>
            <div style={{ fontWeight: 'bold', marginTop: '16px' }}>9&nbsp;&nbsp;&nbsp;Jumlah Pengunjung</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
              <tbody>
                <tr><td style={{ width: '60%' }}>Laki-laki</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_l}</span>&nbsp;Orang</td></tr>
                <tr><td>Perempuan</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{printLaporanTarget.data.pengunjung_p}</span>&nbsp;Orang</td></tr>
              </tbody>
            </table>
            <div className="item-baris" style={{ marginTop: '16px' }}><span>10&nbsp;&nbsp;Jumlah Kepala Keluarga</span><div className="garis-bawah"></div><span>{printLaporanTarget.data.jml_kk}</span>&nbsp;KK</div>
            <div className="item-baris" style={{ marginTop: '12px' }}><span>11&nbsp;&nbsp;Jumlah Ibu melahirkan</span><div className="garis-bawah"></div><span>{printLaporanTarget.data.jml_ibu_melahirkan}</span>&nbsp;Orang</div>
            <div style={{ fontWeight: 'bold', marginTop: '16px' }}>12&nbsp;&nbsp;Jumlah Kematian Ibu</div>
            <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px', textAlign: 'center' }}>
              <thead><tr><th style={{ width: '33.33%' }}>Hamil</th><th style={{ width: '33.33%' }}>Melahirkan</th><th style={{ width: '33.33%' }}>Nifas</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="titik-titik">{printLaporanTarget.data.mati_ibu_hamil}</span>&nbsp;Orang</td>
                  <td><span className="titik-titik">{printLaporanTarget.data.mati_ibu_melahirkan}</span>&nbsp;Orang</td>
                  <td><span className="titik-titik">{printLaporanTarget.data.mati_ibu_nifas}</span>&nbsp;Orang</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}