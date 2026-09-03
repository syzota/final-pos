import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // <-- PERBAIKAN (titik 1): import ReactDOM untuk createPortal
import axios from 'axios';

import { Camera, Printer, HeartPulse, Building, FileText, Eye, Trash, Download, Filter, CheckCircle, Search } from 'lucide-react';
import Skeleton from '../common/Skeleton';

export default function AdminEksporView() {
    const [selectedPosyandu, setSelectedPosyandu] = useState(null);
    const [tab, setTab] = useState(0); // 0: Balita, 1: Remaja, 2: Ibu Hamil, 3: Lansia
    const [dataKesehatan, setDataKesehatan] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [selectedDetail, setSelectedDetail] = useState(null);

    // STATE BARU: Untuk menyimpan data mana yang akan dicetak (Semua atau Individu)
    const [dataCetak, setDataCetak] = useState([]);

    const daftarPosyandu = [
        { id: 1, nama: 'Melati' }, { id: 2, nama: 'Rukun Lestari' },
        { id: 3, nama: 'Mawar' }, { id: 4, nama: 'Bina Putra' },
        { id: 5, nama: 'Nusa Indah' }, { id: 6, nama: 'Cempaka' },
        { id: 7, nama: 'Tunas Mulya' }, { id: 8, nama: 'Surya' },
        { id: 9, nama: 'Terkini' }
    ];

    const SASARAN = ['balita', 'remaja', 'ibu-hamil', 'lansia'];
    const SASARAN_NAMA = ['Balita', 'Remaja', 'Ibu Hamil', 'Lansia'];

    // Ketika ganti Posyandu atau Tab, reset data dan panggil API
    useEffect(() => {
        if (selectedPosyandu) {
            fetchDataKesehatan();
        }
    }, [selectedPosyandu, tab]);

    // Ketika dataKesehatan berhasil diambil, jadikan sebagai default data cetak (Bulk Print)
    useEffect(() => {
        setDataCetak(dataKesehatan);
    }, [dataKesehatan]);

    const fetchDataKesehatan = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        setDataKesehatan([]);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/admin/pemeriksaan/${SASARAN[tab]}?posyandu_id=${selectedPosyandu.id}`, {
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

    const handleHapusData = async (id) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus data pemeriksaan ${SASARAN_NAMA[tab]} ini?`)) return;
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/admin/pemeriksaan/${SASARAN[tab]}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setDataKesehatan(dataKesehatan.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Data berhasil dihapus.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Gagal menghapus data pencatatan.' });
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

    // --- FUNGSI CETAK INDIVIDU ---
    const cetakIndividu = (item) => {
        // 1. Ubah data cetak hanya menjadi 1 orang ini saja
        setDataCetak([item]);
        // 2. Beri jeda sangat sebentar agar React merender data baru, lalu buka menu print
        setTimeout(() => {
            window.print();
            // 3. Kembalikan data cetak ke semua orang setelah menu print tertutup
            setTimeout(() => setDataCetak(dataKesehatan), 1000);
        }, 150);
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
                        <h4 style={{ color: '#555', marginBottom: '12px' }}><Camera className="me-2" />Bukti Foto Pemeriksaan</h4>
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
                            <Printer className="me-2" />Cetak Laporan Ini
                        </button>
                        <button className="btn btn-cyan" onClick={() => setSelectedDetail(null)}>Tutup</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* === CSS KHUSUS UNTUK EKSPOR PDF === */}
            <style>{`
        #dokumen-cetak { display: none; }

        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }

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

          /* PERBAIKAN: Memaksa tabel tidak terpotong dan teks memanjang ke bawah */
          .tabel-cetak { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px; table-layout: fixed; }
          .tabel-cetak th, .tabel-cetak td { border: 1px solid #000; padding: 8px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
          .tabel-cetak th { background-color: #f2f2f2; width: 35%; text-transform: capitalize; }
          .tabel-cetak td { white-space: pre-wrap; }

          /* ====== PERBAIKAN PDF BLANK (titik 3) ======
             Paksa warna hitam & putih, mengatasi teks/border yang jadi
             tak terlihat karena tertimpa reset CSS print global lain */
          #dokumen-cetak, #dokumen-cetak * {
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
            background-color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .tabel-cetak th, .tabel-cetak td {
            border-color: #000 !important;
          }
        }
      `}</style>

            {/* =========================================
          TAMPILAN NORMAL (DI LAYAR MONITOR)
          ========================================= */}
            <div className="no-print">

                {message.text && (
                    <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
                        <b>Info Sistem:</b> {message.text}
                    </div>
                )}

                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="section-head"><h3>1. Pilih Posyandu</h3></div>
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
                            <h3 style={{ margin: 0 }}><Building className="me-2" />Data Kesehatan — Posyandu {selectedPosyandu.nama}</h3>
                            {/* TOMBOL CETAK SEMUA */}
                            <button className="btn btn-violet" onClick={() => window.print()}>
                                <FileText className="me-2" />Cetak Semua Halaman Ini
                            </button>
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
                                    <th>Nama Sasaran</th>
                                    <th>Tgl & Jam Pemeriksaan</th>
                                    <th>Status Form</th>
                                    <th>Aksi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {isLoading ? (
                                    <Skeleton type="table-row" rows={3} cols={4} />
                                ) : dataKesehatan.length > 0 ? (
                                    dataKesehatan.map((item) => (
                                        <tr key={item.id}>
                                            <td><b>{getNamaPasien(item)}</b></td>
                                            <td>{formatWaktu(item.created_at)}</td>
                                            <td><span className={`badge ${item.status_form === 'draft' ? 'badge-orange' : 'badge-green'}`}>{item.status_form.toUpperCase()}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button className="btn btn-sm btn-outline" onClick={() => setSelectedDetail(item)} title="Lihat Detail"><Eye /></button>
                                                    {/* TOMBOL CETAK PER INDIVIDU */}
                                                    <button className="btn btn-sm btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => cetakIndividu(item)} title="Cetak Laporan Pasien Ini"><Printer /></button>
                                                    <button className="btn btn-sm btn-outline" style={{ color: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleHapusData(item.id)} title="Hapus Data"><Trash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>Belum ada data pencatatan {SASARAN_NAMA[tab]} di Posyandu ini.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* =========================================================================
          LAPORAN CETAK RAHASIA (MENGGUNAKAN STATE 'dataCetak')

          PERBAIKAN (titik 2): Dirender via React Portal langsung ke document.body
          agar TIDAK terjebak/ke-clip oleh wrapper dashboard (.shell, .main,
          .content, dsb) yang menyebabkan hasil cetak blank/putih setelah
          repo Laravel & React digabung jadi satu.
          ========================================================================= */}
            {selectedPosyandu && ReactDOM.createPortal(
                <div id="dokumen-cetak">
                    <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Laporan Pencatatan Kesehatan</h2>
                    <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>
                        Posyandu: {selectedPosyandu.nama} | Sasaran Pemeriksaan: {SASARAN_NAMA[tab]}
                    </h4>
                    <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

                    {dataCetak.length > 0 ? (
                        dataCetak.map((item, idx) => {
                            const namaPasien = getNamaPasien(item);

                            // Ambil array foto khusus untuk mode cetak ini
                            let fotoCetak = [];
                            try {
                                if (typeof item.dokumentasi_foto === 'string') fotoCetak = JSON.parse(item.dokumentasi_foto);
                                else if (Array.isArray(item.dokumentasi_foto)) fotoCetak = item.dokumentasi_foto;
                            } catch (e) { }

                            return (
                                <div key={item.id} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '15px' }}>
                                        {dataCetak.length > 1 ? `${idx + 1}. ` : ''} Nama Pasien: {namaPasien}
                                        <span style={{ fontWeight: 'normal', color: '#555', fontSize: '13px' }}> (Waktu Input: {formatWaktu(item.created_at)})</span>
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

                                    {/* MENAMPILKAN FOTO DI PDF JIKA ADA */}
                                    {fotoCetak.length > 0 && (
                                        <div style={{ marginTop: '12px' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Dokumentasi Pemeriksaan:</p>
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
                        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>Tidak ada data pemeriksaan.</p>
                    )}
                </div>,
                document.body
            )}

            {renderDetailModal()}
        </>
    );
}
