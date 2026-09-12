import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';

import {
    Camera01Icon,
    PrinterIcon,
    Building01Icon,
    File01Icon,
    ViewIcon,
    Delete02Icon,
    Cancel01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';
import Skeleton from '../common/Skeleton';

export default function AdminEksporView() {
    const [selectedPosyandu, setSelectedPosyandu] = useState(null);
    const [tab, setTab] = useState(0); // 0: Balita, 1: Remaja, 2: Ibu Hamil, 3: Lansia
    const [dataKesehatan, setDataKesehatan] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '', title: '', details: null });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        confirmVariant: 'danger'
    });

    const [selectedDetail, setSelectedDetail] = useState(null);

    // STATE BARU: Untuk menyimpan data mana yang akan dicetak (Semua atau Individu)
    const [dataCetak, setDataCetak] = useState([]);

    const daftarPosyandu = [
        { id: 'all', nama: 'Semua Posyandu (9 Titik Desa)' },
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
        setMessage({ type: '', text: '', title: '', details: null });
        setDataKesehatan([]);
        try {
            const token = localStorage.getItem('auth_token');
            const url = selectedPosyandu.id === 'all'
                ? `/api/admin/pemeriksaan/${SASARAN[tab]}`
                : `/api/admin/pemeriksaan/${SASARAN[tab]}?posyandu_id=${selectedPosyandu.id}`;
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDataKesehatan(response.data.data || []);
        } catch (err) {
            console.error(err);
            setMessage({
                type: 'error',
                title: 'Gagal Memuat Data',
                text: `Gagal memuat data pencatatan kesehatan ${SASARAN_NAMA[tab]}.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHapusData = (id, nama) => {
        setConfirmModal({
            isOpen: true,
            title: `Konfirmasi Hapus Data ${SASARAN_NAMA[tab]}`,
            message: `Apakah Anda yakin ingin menghapus data pemeriksaan ${nama ? `pasien "${nama}"` : `kategori ${SASARAN_NAMA[tab]}`} ini secara permanen?`,
            confirmVariant: 'danger',
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('auth_token');
                    await axios.delete(`/api/admin/pemeriksaan/${SASARAN[tab]}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    setDataKesehatan(dataKesehatan.filter(item => item.id !== id));
                    setMessage({
                        type: 'success',
                        title: 'Data Dihapus',
                        text: `Data pemeriksaan ${SASARAN_NAMA[tab]} berhasil dihapus.`
                    });
                } catch (err) {
                    setMessage({
                        type: 'error',
                        title: 'Gagal Menghapus Data',
                        text: err.response?.data?.pesan || err.response?.data?.message || 'Gagal menghapus data pencatatan.'
                    });
                }
            }
        });
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
                        style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: '#f1f5f9', border: 'none', borderRadius: '50%',
                            width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', color: '#64748b', zIndex: 10
                        }}
                        aria-label="Tutup"
                    >
                        <Cancel01Icon size={16} />
                    </button>

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
                        <h4 style={{ color: '#555', marginBottom: '12px' }}><Camera01Icon size={18} className="me-2" />Bukti Foto Pemeriksaan</h4>
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

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button
                            variant="secondary"
                            size="md"
                            icon={PrinterIcon}
                            onClick={() => { setSelectedDetail(null); cetakIndividu(selectedDetail); }}
                        >
                            Cetak Laporan Ini
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setSelectedDetail(null)}
                        >
                            Tutup
                        </Button>
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

                <NotificationModal
                    isOpen={Boolean(message.text || message.title)}
                    type={message.type || 'success'}
                    title={message.title}
                    message={message.text}
                    details={message.details}
                    onClose={() => setMessage({ type: '', text: '', title: '', details: null })}
                />

                <NotificationModal
                    isOpen={confirmModal.isOpen}
                    type="confirm"
                    title={confirmModal.title}
                    message={confirmModal.message}
                    confirmVariant={confirmModal.confirmVariant || 'danger'}
                    isConfirm
                    confirmText="Ya, Hapus"
                    cancelText="Batal"
                    onConfirm={() => {
                        if (confirmModal.onConfirm) confirmModal.onConfirm();
                        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, confirmVariant: 'danger' });
                    }}
                    onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, confirmVariant: 'danger' })}
                />

                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="section-head"><h3>1. Pilih Posyandu</h3></div>
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
                            <h3 style={{ margin: 0 }}><Building01Icon size={18} className="me-2" />Data Kesehatan — Posyandu {selectedPosyandu.nama}</h3>
                            {/* TOMBOL CETAK SEMUA */}
                            <Button
                                variant="primary"
                                size="md"
                                icon={File01Icon}
                                onClick={() => window.print()}
                            >
                                Cetak Semua Halaman Ini
                            </Button>
                        </div>

                        <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
                            {SASARAN_NAMA.map((nama, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`tab-btn ${tab === index ? 'active' : ''}`}
                                    onClick={() => setTab(index)}
                                    style={{
                                        minHeight: '40px',
                                        padding: '8px 18px',
                                        borderRadius: '10px',
                                        border: '1px solid',
                                        borderColor: tab === index ? 'var(--cyan-deep, #0E7C93)' : '#cbd5e1',
                                        backgroundColor: tab === index ? 'var(--cyan-deep, #0E7C93)' : '#ffffff',
                                        color: tab === index ? '#ffffff' : '#334155',
                                        fontWeight: 700,
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                    }}
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
                                    <th style={{ textAlign: 'right' }}>Aksi</th>
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
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                    <Button variant="secondary" size="sm" icon={ViewIcon} iconOnly onClick={() => setSelectedDetail(item)} title="Lihat Detail" />
                                                    {/* TOMBOL CETAK PER INDIVIDU */}
                                                    <Button variant="secondary" size="sm" icon={PrinterIcon} iconOnly onClick={() => cetakIndividu(item)} title="Cetak Laporan Pasien Ini" />
                                                    <Button variant="danger-outline" size="sm" icon={Delete02Icon} iconOnly onClick={() => handleHapusData(item.id, getNamaPasien(item))} title="Hapus Data" />
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
