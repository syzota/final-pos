import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import NotificationModal from '../common/NotificationModal';
import Button from '../common/Button';

import {
    Camera01Icon,
    PrinterIcon,
    Book02Icon,
    File01Icon,
    Search01Icon,
    Cancel01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function PuskesmasView() {
    const [selectedPosyandu, setSelectedPosyandu] = useState(null);
    const [tab, setTab] = useState(0); // 0: Balita, 1: Remaja, 2: Ibu Hamil, 3: Lansia
    const [dataKesehatan, setDataKesehatan] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [selectedDetail, setSelectedDetail] = useState(null);
    const [dataCetak, setDataCetak] = useState([]);
    const [isPrintingAll, setIsPrintingAll] = useState(false);
    const [printSubtitle, setPrintSubtitle] = useState('');

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

    // Lock scroll and handle Escape key for detail modal
    useEffect(() => {
        if (selectedDetail) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedDetail) {
                setSelectedDetail(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedDetail]);

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
        setPrintSubtitle(`Rekam Medis Individu: ${getNamaPasien(item)}`);
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                setDataCetak(filteredData);
                setPrintSubtitle('');
            }, 1000);
        }, 150);
    };

    const cetakKategoriIni = () => {
        setDataCetak(filteredData);
        setPrintSubtitle(`Kategori: ${SASARAN_NAMA[tab]}`);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintSubtitle(''), 1000);
        }, 150);
    };

    const cetakSemuaSasaran = async () => {
        if (!selectedPosyandu) return;
        setIsPrintingAll(true);
        try {
            const token = localStorage.getItem('auth_token');
            const requests = SASARAN.map(s =>
                axios.get(`/api/puskesmas/pemeriksaan/${s}?posyandu_id=${selectedPosyandu.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            );
            const responses = await Promise.all(requests);
            let allData = [];
            responses.forEach((res, idx) => {
                const items = (res.data?.data || []).map(item => ({
                    ...item,
                    _kategoriNama: SASARAN_NAMA[idx]
                }));
                allData = allData.concat(items);
            });

            if (filterBulan) {
                allData = allData.filter(item => item.created_at && item.created_at.startsWith(filterBulan));
            }

            setDataCetak(allData);
            setPrintSubtitle('Semua Kategori Sasaran (Lengkap)');
            setTimeout(() => {
                window.print();
                setTimeout(() => {
                    setDataCetak(filteredData);
                    setPrintSubtitle('');
                }, 1000);
            }, 300);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Gagal memuat seluruh sasaran untuk dicetak.' });
        } finally {
            setIsPrintingAll(false);
        }
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

        return ReactDOM.createPortal(
            <div
                className="no-print"
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}
                onClick={() => setSelectedDetail(null)}
                onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
            >
                <div
                    className="card"
                    style={{
                        width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
                        position: 'relative', backgroundColor: '#fff', borderRadius: '16px', padding: '28px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedDetail(null)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s ease' }}
                        aria-label="Tutup"
                    >
                        <Cancel01Icon size={16} />
                    </button>

                    <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h3 style={{ color: 'var(--primary-teal, #008080)', margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>Detail Pemeriksaan {SASARAN_NAMA[tab]}</h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px' }}>Waktu Input: {formatWaktu(selectedDetail.created_at)}</p>
                    </div>

                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                            <tr>
                                <td style={{ width: '40%', color: '#64748b', fontSize: '13px' }}>Nama Sasaran</td>
                                <td style={{ fontWeight: 'bold', color: 'var(--primary-teal, #008080)', fontSize: '15px' }}>{namaPasien}</td>
                            </tr>
                            {Object.entries(selectedDetail).map(([key, value], idx) => {
                                if (hiddenKeys.includes(key)) return null;
                                let displayVal = value !== null ? String(value) : '-';
                                if (key.includes('tanggal') && value) displayVal = new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

                                return (
                                    <tr key={idx}>
                                        <td style={{ width: '40%', color: '#64748b', textTransform: 'capitalize', fontSize: '13px' }}>{key.replace(/_/g, ' ')}</td>
                                        <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 'bold' }}>{displayVal}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                        <h4 style={{ color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700 }}><Camera01Icon size={18} />Bukti Foto Pemeriksaan</h4>
                        {fotoArray.length > 0 ? (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {fotoArray.map((path, idx) => (
                                    <div key={idx} style={{ flex: '1 1 calc(50% - 12px)', minWidth: '150px', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                        <a href={`/storage/${path}`} target="_blank" rel="noreferrer" title="Klik untuk memperbesar">
                                            <img src={`/storage/${path}`} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', color: '#64748b', fontStyle: 'italic', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                                Kader tidak melampirkan foto pada pemeriksaan ini.
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button variant="primary" size="md" icon={PrinterIcon} onClick={() => { setSelectedDetail(null); cetakIndividu(selectedDetail); }}>
                            Cetak Rekam Medis Ini
                        </Button>
                        <Button variant="secondary" size="md" onClick={() => setSelectedDetail(null)}>Tutup</Button>
                    </div>
                </div>
            </div>,
            document.body
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
                <NotificationModal
                    isOpen={Boolean(message.text)}
                    type={message.type || 'success'}
                    message={message.text}
                    onClose={() => setMessage({ type: '', text: '' })}
                />

                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="section-head"><h3>Pilih Posyandu</h3></div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {daftarPosyandu.map((p) => (
                            <Button
                                key={p.id}
                                variant={selectedPosyandu?.id === p.id ? 'cyan' : 'secondary'}
                                size="sm"
                                onClick={() => setSelectedPosyandu(p)}
                            >
                                {p.nama}
                            </Button>
                        ))}
                    </div>
                </div>

                {selectedPosyandu && (
                    <div className="card">
                        <div className="section-head" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <h3 style={{ margin: 0 }}><Book02Icon size={18} className="me-2" />Data Pemeriksaan — Posyandu {selectedPosyandu.nama}</h3>

                            {/* AREA PENYARING BULAN & EKSPOR */}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Filter Bulan:</span>
                                <input
                                    type="month"
                                    value={filterBulan}
                                    onChange={(e) => setFilterBulan(e.target.value)}
                                    style={{ padding: '0 12px', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff', fontSize: '13.5px' }}
                                />
                                <Button variant="secondary" size="md" icon={PrinterIcon} onClick={cetakKategoriIni}>
                                    Cetak {SASARAN_NAMA[tab]} (PDF)
                                </Button>
                                <Button variant="primary" size="md" icon={File01Icon} onClick={cetakSemuaSasaran} disabled={isPrintingAll} loading={isPrintingAll} loadingText="Menyiapkan...">
                                    Cetak Semua Sasaran (Lengkap)
                                </Button>
                            </div>
                        </div>

                        <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
                            {SASARAN_NAMA.map((nama, index) => (
                                <Button
                                    key={index}
                                    variant={tab === index ? 'cyan' : 'secondary'}
                                    size="sm"
                                    onClick={() => setTab(index)}
                                    style={{ borderRadius: '20px' }}
                                >
                                    {nama}
                                </Button>
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
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <Button variant="secondary" size="sm" onClick={() => setSelectedDetail(item)} title="Lihat Rekam Medis"><Search01Icon size={14} className="me-1" /> Detail</Button>
                                                    <Button variant="primary" size="sm" onClick={() => cetakIndividu(item)} title="Cetak Rekam Medis Ini"><PrinterIcon size={16} /></Button>
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

            {/* =========================================================================
          LAPORAN CETAK RAHASIA (MENGGUNAKAN STATE 'dataCetak')

          PERBAIKAN (titik 2): Dirender via React Portal langsung ke document.body
          agar TIDAK terjebak/ke-clip oleh wrapper dashboard (.shell, .main,
          .content, dsb) yang menyebabkan hasil cetak blank/putih setelah
          repo Laravel & React digabung jadi satu.
          ========================================================================= */}
            {selectedPosyandu && ReactDOM.createPortal(
                <div id="dokumen-cetak">
                    <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Laporan Resmi Pemeriksaan Kesehatan</h2>
                    <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>
                        Fasilitas: Posyandu {selectedPosyandu.nama} | {printSubtitle || `Kategori: ${SASARAN_NAMA[tab]}`} <br />
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
                                        {item._kategoriNama && <span style={{ color: '#008080', marginLeft: '8px' }}>[{item._kategoriNama}]</span>}
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
                </div>,
                document.body
            )}

            {renderDetailModal()}
        </>
    );
}
