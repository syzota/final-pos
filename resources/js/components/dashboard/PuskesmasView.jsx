import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PuskesmasView() {
  const [selectedPosyandu, setSelectedPosyandu] = useState(null);
  const [tab, setTab] = useState(0); // 0: Balita, 1: Remaja, 2: Ibu Hamil, 3: Lansia
  const [dataKesehatan, setDataKesehatan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [dataCetak, setDataCetak] = useState([]);

  // STATE BARU: Untuk filter bulan (Format: "YYYY-MM")
  const [filterBulan, setFilterBulan] = useState('');

  const daftarPosyandu = [
    { id: 1, nama: 'Melati' }, { id: 2, nama: 'Rukun Lestari' },
    { id: 3, nama: 'Mawar' }, { id: 4, nama: 'Bina Putra' },
    { id: 5, nama: 'Nusa Indah' }, { id: 6, nama: 'Cempaka' },
    { id: 7, nama: 'Tunas Mulya' }, { id: 8, nama: 'Surya' },
    { id: 9, nama: 'Terkini' }
  ];

  const SASARAN = ['balita', 'remaja', 'ibu-hamil', 'lansia'];
  const SASARAN_NAMA = ['Balita', 'Remaja', 'Ibu Hamil', 'Lansia'];

  // 1. Tarik Data dari Backend
  useEffect(() => {
    if (selectedPosyandu) {
      fetchDataKesehatan();
    }
  }, [selectedPosyandu, tab]);

  // 2. Filter Data Secara Dinamis berdasarkan Bulan
  const filteredData = dataKesehatan.filter(item => {
    if (!filterBulan) return true; // Jika filter kosong, tampilkan semua
    return item.created_at.startsWith(filterBulan); // Mencocokkan "2026-08" dengan "2026-08-09T..."
  });

  // 3. Update Data Cetak setiap kali Data atau Filter berubah
  useEffect(() => {
    setDataCetak(filteredData);
  }, [dataKesehatan, filterBulan]);

  const fetchDataKesehatan = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setDataKesehatan([]);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/puskesmas/pemeriksaan/${SASARAN[tab]}?posyandu_id=${selectedPosyandu.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDataKesehatan(response.data.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: `Gagal memuat data pencatatan kesehatan ${SASARAN_NAMA[tab]}.` });
    } finally {
      setIsLoading(false);
    }
  };

  const formatWaktu = (waktuISO) => {
    if (!waktuISO) return '—';
    const d = new Date(waktuISO);
    return `${d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getNamaPasien = (item) => {
    return item.anak?.nama_anak
      || item.remaja?.nama_remaja
      || item.ibu?.nama_lengkap
      || item.lansia?.nama_lengkap
      || `(ID: ${item.anak_id || item.remaja_id || item.ibu_id || item.lansia_id})`;
  };

  const hiddenKeys = [
    'id', 'created_at', 'updated_at', 'dokumentasi_foto', 'kader_id',
    'anak_id', 'remaja_id', 'ibu_id', 'lansia_id',
    'anak', 'remaja', 'ibu', 'lansia'
  ];

  const cetakIndividu = (item) => {
    setDataCetak([item]);
    setTimeout(() => {
      window.print();
      setTimeout(() => setDataCetak(filteredData), 1000);
    }, 150);
  };

  // Teks untuk Judul Bulan di PDF
  const getNamaBulanCetak = () => {
    if (!filterBulan) return "Semua Waktu";
    const [year, month] = filterBulan.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const renderDetailModal = () => {
    if (!selectedDetail) return null;

    let fotoArray = [];
    try {
      if (typeof selectedDetail.dokumentasi_foto === 'string') fotoArray = JSON.parse(selectedDetail.dokumentasi_foto);
      else if (Array.isArray(selectedDetail.dokumentasi_foto)) fotoArray = selectedDetail.dokumentasi_foto;
    } catch (e) { }

    const namaPasien = getNamaPasien(selectedDetail);

    return (
      <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', backgroundColor: '#fff', borderRadius: '12px', padding: '24px' }}>
          <button onClick={() => setSelectedDetail(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>

          <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--cyan-deep)' }}>Detail Pemeriksaan {SASARAN_NAMA[tab]}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Waktu Input: {formatWaktu(selectedDetail.created_at)}</p>
          </div>

          <table className="table">
            <tbody>
              <tr>
                <td style={{ width: '40%', color: '#666', fontSize: '13px' }}>Nama Sasaran</td>
                <td style={{ fontWeight: 'bold', color: 'var(--cyan-deep)', fontSize: '15px' }}>{namaPasien}</td>
              </tr>
              {Object.entries(selectedDetail).map(([key, value], idx) => {
                if (hiddenKeys.includes(key)) return null;
                let displayVal = value !== null ? String(value) : '-';
                if (key.includes('tanggal') && value) displayVal = new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                return (
                  <tr key={idx}>
                    <td style={{ width: '40%', color: '#666', textTransform: 'capitalize', fontSize: '13px' }}>{key.replace(/_/g, ' ')}</td>
                    <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 'bold' }}>{displayVal}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
            <h4 style={{ color: '#555', marginBottom: '12px' }}><i className="bi bi-camera-fill me-2"></i>Bukti Foto Pemeriksaan</h4>
            {fotoArray.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {fotoArray.map((path, idx) => (
                  <div key={idx} style={{ flex: '1 1 calc(50% - 12px)', minWidth: '150px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <a href={`/storage/${path}`} target="_blank" rel="noreferrer" title="Klik untuk memperbesar">
                      <img src={`/storage/${path}`} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
                Kader tidak melampirkan foto pada pemeriksaan ini.
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button className="btn btn-outline me-2" onClick={() => { setSelectedDetail(null); cetakIndividu(selectedDetail); }}>
              <i className="bi bi-printer me-2"></i>Cetak Laporan Ini
            </button>
            <button className="btn btn-cyan" onClick={() => setSelectedDetail(null)}>Tutup</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        #dokumen-cetak { display: none; }
        @media print {
          body * { visibility: hidden; }
          #dokumen-cetak, #dokumen-cetak * { visibility: visible; }
          #dokumen-cetak {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .tabel-cetak { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px; table-layout: fixed; }
          .tabel-cetak th, .tabel-cetak td { border: 1px solid #000; padding: 8px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
          .tabel-cetak th { background-color: #f2f2f2; width: 35%; text-transform: capitalize; }
          .tabel-cetak td { white-space: pre-wrap; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print">
        <div className="section-head" style={{ marginBottom: '24px' }}>
          <h2><i className="bi bi-hospital me-2" style={{ color: 'var(--cyan-deep)' }}></i>Laporan Kesehatan per Posyandu</h2>
          <p style={{ color: '#666' }}>Tinjau dan ekspor laporan pemeriksaan secara terperinci untuk diserahkan ke instansi.</p>
        </div>

        {message.text && (
          <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
            <b>Info Sistem:</b> {message.text}
          </div>
        )}

        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="section-head"><h3>Pilih Posyandu</h3></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {daftarPosyandu.map((p) => (
              <button key={p.id} onClick={() => setSelectedPosyandu(p)} className={`btn btn-sm ${selectedPosyandu?.id === p.id ? 'btn-cyan' : 'btn-outline'}`}>
                {p.nama}
              </button>
            ))}
          </div>
        </div>

        {selectedPosyandu && (
          <div className="card">
            <div className="section-head" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0 }}><i className="bi bi-journal-medical me-2"></i>Data Pemeriksaan — Posyandu {selectedPosyandu.nama}</h3>

              {/* AREA PENYARING BULAN & EKSPOR */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Filter Bulan:</span>
                <input
                  type="month"
                  value={filterBulan}
                  onChange={(e) => setFilterBulan(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                />
                <button className="btn btn-violet" onClick={() => window.print()}>
                  <i className="bi bi-file-earmark-pdf-fill me-2"></i>Ekspor Sesuai Filter
                </button>
              </div>
            </div>

            <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
              {SASARAN_NAMA.map((nama, index) => (
                <button
                  key={index} className={`tab-btn ${tab === index ? 'active' : ''}`} onClick={() => setTab(index)}
                  style={{ padding: '8px 16px', borderRadius: '20px', border: tab === index ? 'none' : '1px solid #ddd', backgroundColor: tab === index ? 'var(--cyan-deep)' : 'transparent', color: tab === index ? 'white' : '#666', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {nama}
                </button>
              ))}
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Pasien</th>
                    <th>Tgl & Jam Masuk</th>
                    <th>Kondisi Form</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Menarik data dari database...</td></tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td><b>{getNamaPasien(item)}</b></td>
                        <td>{formatWaktu(item.created_at)}</td>
                        <td><span className={`badge ${item.status_form === 'draft' ? 'badge-orange' : 'badge-green'}`}>{item.status_form.toUpperCase()}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="btn btn-sm btn-outline" onClick={() => setSelectedDetail(item)} title="Lihat Rekam Medis"><i className="bi bi-search"></i> Detail</button>
                            <button className="btn btn-sm btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => cetakIndividu(item)} title="Cetak Rekam Medis Ini"><i className="bi bi-printer"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>Belum ada data rekam medis {SASARAN_NAMA[tab]} di bulan ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedPosyandu && (
        <div id="dokumen-cetak">
          <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Laporan Resmi Pemeriksaan Kesehatan</h2>
          <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>
            Fasilitas: Posyandu {selectedPosyandu.nama} | Kategori: {SASARAN_NAMA[tab]} <br />
            Periode Laporan: {getNamaBulanCetak()}
          </h4>
          <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

          {dataCetak.length > 0 ? (
            dataCetak.map((item, idx) => {
              const namaPasien = getNamaPasien(item);
              let fotoCetak = [];
              try {
                if (typeof item.dokumentasi_foto === 'string') fotoCetak = JSON.parse(item.dokumentasi_foto);
                else if (Array.isArray(item.dokumentasi_foto)) fotoCetak = item.dokumentasi_foto;
              } catch (e) { }

              return (
                <div key={item.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '15px' }}>
                    {dataCetak.length > 1 ? `${idx + 1}. ` : ''} Pasien: {namaPasien}
                    <span style={{ fontWeight: 'normal', color: '#555', fontSize: '13px' }}> (Dicatat: {formatWaktu(item.created_at)})</span>
                  </p>

                  <table className="tabel-cetak">
                    <tbody>
                      {Object.entries(item).map(([key, value], i) => {
                        if (hiddenKeys.includes(key)) return null;
                        let displayVal = value !== null ? String(value) : '-';
                        if (key.includes('tanggal') && value) displayVal = new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                        return (
                          <tr key={i}>
                            <th>{key.replace(/_/g, ' ')}</th>
                            <td>{displayVal}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {fotoCetak.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Dokumentasi Terlampir:</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {fotoCetak.map((path, fIdx) => (
                          <img
                            key={fIdx}
                            src={`/storage/${path}`}
                            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: '4px' }}
                            alt={`Dokumentasi ${fIdx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>Tidak ada rekam medis yang tercatat pada periode ini.</p>
          )}
        </div>
      )}

      {renderDetailModal()}
    </>
  );
}