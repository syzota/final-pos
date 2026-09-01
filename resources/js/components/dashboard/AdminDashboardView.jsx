import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { Megaphone, BookText, Search, ArrowLeft, FileText, Building, Book, Droplet, Home, ShieldCheck, Heart, Eye, Printer, Trash, Image, Users, CheckCircle, Clock, MapPin, Loader2, PlaySquare, AlertCircle } from 'lucide-react';
import Skeleton from '../common/Skeleton';

export default function AdminDashboardView() {
    // === STATE NAVIGASI & DATA ===
    const [viewMode, setViewMode] = useState('list');
    const [selectedPosyandu, setSelectedPosyandu] = useState(null);
    const [tab, setTab] = useState(0);

    const [pengaduanList, setPengaduanList] = useState([]);
    const [formulirList, setFormulirList] = useState([]);
    const [waktuUpdates, setWaktuUpdates] = useState({});
    const [stats, setStats] = useState({ pengaduan: [], formulir: [] });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedPengaduan, setSelectedPengaduan] = useState(null);

    const [printTarget, setPrintTarget] = useState({ type: 'all', data: null });
    const [isPrinting, setIsPrinting] = useState(false);

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

    const BIDANG_MAP = ['pendidikan', 'pekerjaan_umum', 'perumahan_rakyat', 'trantibumlinmas', 'sosial'];
    const BIDANG_NAMA = ['Pendidikan', 'Pekerjaan Umum', 'Perumahan Rakyat', 'Trantibumlinmas', 'Sosial'];

    useEffect(() => {
        if (viewMode === 'list') {
            const fetchDataAwal = async () => {
                try {
                    const token = localStorage.getItem('auth_token');
                    const [resUpdates, resStats] = await Promise.all([
                        axios.get('/api/admin/posyandu-updates', { headers: { 'Authorization': `Bearer ${token}` } }),
                        axios.get('/api/admin/statistik', { headers: { 'Authorization': `Bearer ${token}` } })
                    ]);
                    setWaktuUpdates(resUpdates.data?.data || {});
                    setStats(resStats.data?.data || { pengaduan: [], formulir: [] });
                } catch (err) {
                    console.error("Gagal mengambil data awal", err);
                }
            };
            fetchDataAwal();
        }
    }, [viewMode]);

    const formatWaktu = (waktuISO) => {
        if (!waktuISO) return '—';
        const d = new Date(waktuISO);
        return `${d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const statPengaduan = stats?.pengaduan || [];
    const statFormulir = stats?.formulir || [];
    const maxPengaduan = statPengaduan.length > 0 ? Math.max(...statPengaduan.map(item => item.total)) : 1;
    const maxFormulir = statFormulir.length > 0 ? Math.max(...statFormulir.map(item => item.total)) : 1;

    const formatNama = (text) => text ? text.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '-';

    const openDetail = async (posyandu) => {
        setSelectedPosyandu(posyandu);
        setViewMode('detail');
        setTab(0);
        setMessage({ type: '', text: '' });
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const [resPengaduan, resFormulir] = await Promise.all([
                axios.get(`/api/admin/pengaduan?posyandu_id=${posyandu.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get(`/api/admin/formulir?posyandu_id=${posyandu.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            setPengaduanList(resPengaduan.data?.data || []);
            setFormulirList(resFormulir.data?.data || []);
        } catch (err) {
            setMessage({ type: 'error', text: 'Gagal memuat data laporan.' });
        } finally {
            setIsLoading(false);
        }
    };

    const closeDetail = () => {
        setViewMode('list');
        setSelectedPosyandu(null);
        setPengaduanList([]);
        setFormulirList([]);
        setMessage({ type: '', text: '' });
    };

    const handleUbahStatus = async (pengaduanId, statusBaru) => {
        const dataLama = [...pengaduanList];
        setPengaduanList(pengaduanList.map(item => item.id === pengaduanId ? { ...item, status: statusBaru } : item));
        try {
            const token = localStorage.getItem('auth_token');
            await axios.patch(`/api/admin/pengaduan/${pengaduanId}/status`, { status: statusBaru }, { headers: { 'Authorization': `Bearer ${token}` } });
            setMessage({ type: 'success', text: 'Status laporan diperbarui.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setPengaduanList(dataLama);
            setMessage({ type: 'error', text: 'Gagal mengubah status.' });
        }
    };

    const handleHapusFormulir = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data formulir ini secara permanen?")) return;
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/admin/formulir/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setFormulirList(formulirList.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Data formulir berhasil dihapus.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Gagal menghapus data formulir.' });
        }
    };

    const handleHapusPengaduan = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data pengaduan ini secara permanen?")) return;
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/admin/pengaduan/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setPengaduanList(pengaduanList.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Data pengaduan berhasil dihapus.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.pesan || 'Gagal menghapus data pengaduan.' });
        }
    };

    const getArrayData = (rawData) => {
        if (!rawData) return [];
        let arr = [];
        if (Array.isArray(rawData)) { arr = rawData; }
        else {
            try {
                let parsed = JSON.parse(rawData);
                if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                arr = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) { arr = [rawData]; }
        }
        return arr.filter(item => item && typeof item === 'string');
    };

    const getSafeObject = (rawData) => {
        if (!rawData) return {};
        if (typeof rawData === 'object') return rawData;
        try { return JSON.parse(rawData) || {}; } catch (e) { return {}; }
    };

    const getFileUrl = (path) => {
        if (!path) return '';
        let cleanPath = path.replace(/\\/g, '/');
        if (cleanPath.startsWith('http')) return cleanPath;
        cleanPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
        return `/storage/${cleanPath}`;
    };

    const handleCetakIndividu = (tipe, item) => {
        setPrintTarget({ type: tipe, data: item });
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                setIsPrinting(false);
                setPrintTarget({ type: 'all', data: null });
            }, 500);
        }, 150);
    };

    const dataFormulirAktif = formulirList.filter(item => item.bidang === BIDANG_MAP[tab]);
    const dataPengaduanAktif = pengaduanList.filter(item => item.bidang === BIDANG_MAP[tab]);

    let formsToPrint = dataFormulirAktif;
    let pengaduansToPrint = dataPengaduanAktif;

    if (printTarget.type === 'form' && printTarget.data) {
        formsToPrint = [printTarget.data];
        pengaduansToPrint = [];
    } else if (printTarget.type === 'pengaduan' && printTarget.data) {
        formsToPrint = [];
        pengaduansToPrint = [printTarget.data];
    }

    return (
        <>
            <style>{`
        #dokumen-cetak { display: none; }

        @media print {
          html, body { height: auto !important; overflow: visible !important; position: static !important; }
          body * { visibility: hidden; }
          #dokumen-cetak, #dokumen-cetak * { visibility: visible; }
          #dokumen-cetak { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 20px; font-family: Arial, sans-serif; }
          .tabel-cetak { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          .tabel-cetak th, .tabel-cetak td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
          .tabel-cetak th { background-color: #f2f2f2; }
          #dokumen-cetak img { display: block !important; max-width: 100% !important; page-break-inside: avoid !important; }
          .no-print { display: none !important; }

          /* Paksa warna hitam & putih, mengatasi teks/border yang jadi
             tak terlihat karena tertimpa reset CSS print global lain */
          #dokumen-cetak, #dokumen-cetak * {
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
            background-color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .tabel-cetak th, .tabel-cetak td { border-color: #000 !important; }
          .tabel-cetak th { background-color: #f2f2f2 !important; }
        }
      `}</style>

            {message.text && (
                <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
                    <b>Info Sistem:</b> {message.text}
                </div>
            )}

            {viewMode === 'list' && (
                <div>
                    <div className="grid grid-2" style={{ marginBottom: '24px' }}>
                        <div className="card">
                            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                                <h3 style={{ color: 'var(--magenta-deep)', margin: 0 }}><Megaphone className="me-2" />Top Laporan Pengaduan</h3>
                            </div>
                            {statPengaduan.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {statPengaduan.map((item, index) => {
                                        const percent = (item.total / maxPengaduan) * 100;
                                        return (
                                            <div key={index}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold', color: '#444' }}>
                                                    <span>{formatNama(item.bidang || '')}</span>
                                                    <span style={{ color: 'var(--magenta-deep)' }}>{item.total} Laporan</span>
                                                </div>
                                                <div style={{ width: '100%', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--magenta-deep)', borderRadius: '10px' }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#888', padding: '10px' }}>Belum ada data.</div>
                            )}
                        </div>

                        <div className="card">
                            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                                <h3 style={{ color: 'var(--violet-deep)', margin: 0 }}><BookText className="me-2" />Top Pemetaan Identifikasi</h3>
                            </div>
                            {statFormulir.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {statFormulir.map((item, index) => {
                                        const percent = (item.total / maxFormulir) * 100;
                                        return (
                                            <div key={index}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold', color: '#444' }}>
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }} title={item.sub_bidang}>{item.sub_bidang || '-'}</span>
                                                    <span style={{ color: 'var(--violet-deep)' }}>{item.total} Data</span>
                                                </div>
                                                <div style={{ width: '100%', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--violet-deep)', borderRadius: '10px' }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#888', padding: '10px' }}>Belum ada data.</div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-head"><h3>Transparansi Pelaporan 9 Posyandu</h3></div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Nama Posyandu</th>
                                    <th>Jadwal Rutin</th>
                                    <th>Terakhir Diperbarui</th>
                                    <th style={{ textAlign: 'center' }}>Aksi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {daftarPosyandu.map((posyandu) => (
                                    <tr key={posyandu.id}>
                                        <td><b>{posyandu.nama}</b></td>
                                        <td>{posyandu.jadwal}</td>
                                        <td>{formatWaktu((waktuUpdates || {})[posyandu.id])}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn btn-sm btn-outline" onClick={() => openDetail(posyandu)}>
                                                <Search className="me-1" />Cek Laporan Warga
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'detail' && selectedPosyandu && (
                <div className="no-print">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <button className="btn btn-outline" onClick={closeDetail}>
                            <ArrowLeft className="me-2" />Kembali ke Daftar
                        </button>
                        <button className="btn btn-violet" onClick={() => {
                            setPrintTarget({ type: 'all', data: null });
                            setIsPrinting(true);
                            setTimeout(() => {
                                window.print();
                                setTimeout(() => setIsPrinting(false), 500);
                            }, 150);
                        }}>
                            <FileText className="me-2" />Ekspor PDF Lengkap
                        </button>
                    </div>

                    <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="section-head">
                            <h3><Building className="me-2" />Laporan Posyandu {selectedPosyandu.nama} - Bidang {BIDANG_NAMA[tab]}</h3>
                        </div>

                        <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
                            <button className={`tab-btn ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}><Book className="me-1" />Pendidikan</button>
                            <button className={`tab-btn ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}><Droplet className="me-1" />Pekerjaan Umum</button>
                            <button className={`tab-btn ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}><Home className="me-1" />Perumahan Rakyat</button>
                            <button className={`tab-btn ${tab === 3 ? 'active' : ''}`} onClick={() => setTab(3)}><ShieldCheck className="me-1" />Trantibumlinmas</button>
                            <button className={`tab-btn ${tab === 4 ? 'active' : ''}`} onClick={() => setTab(4)}><Heart className="me-1" />Sosial</button>
                        </div>

                        <div className="grid grid-2">
                            <div className="card">
                                <div className="section-head"><h3 style={{ color: 'var(--violet-deep)' }}><BookText className="me-2" />Data Identifikasi</h3></div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead><tr><th>Tgl</th><th>Sub-Bidang</th><th>Aksi</th></tr></thead>
                                        <tbody>
                                        {isLoading ? <Skeleton type="table-row" rows={3} cols={3} /> : dataFormulirAktif.length > 0 ? (
                                            dataFormulirAktif.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                                    <td><span style={{ fontWeight: '600', color: '#333' }}>{item.sub_bidang || '-'}</span></td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button className="btn btn-sm btn-outline" title="Lihat Detail" onClick={() => setSelectedForm(item)}><Eye /></button>
                                                            <button className="btn btn-sm btn-outline" title="Cetak Data Ini" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => handleCetakIndividu('form', item)}><Printer /></button>
                                                            <button className="btn btn-sm btn-outline" title="Hapus" style={{ color: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleHapusFormulir(item.id)}><Trash /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : <tr><td colSpan="3" style={{ textAlign: 'center', color: '#666' }}>Belum ada formulir.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <div className="section-head"><h3 style={{ color: 'var(--magenta-deep)' }}><Megaphone className="me-2" />Pengaduan Warga</h3></div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead><tr><th>Pelapor / Isi</th><th>Status</th><th>Aksi</th></tr></thead>
                                        <tbody>
                                        {isLoading ? <Skeleton type="table-row" rows={3} cols={3} /> : dataPengaduanAktif.length > 0 ? (
                                            dataPengaduanAktif.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <b>{item.nama_pelapor || 'Warga'}</b>
                                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{(item.isi_keluhan || '').substring(0, 30)}{(item.isi_keluhan || '').length > 30 ? '...' : ''}</div>
                                                    </td>
                                                    <td>
                                                        <select value={item.status || 'menunggu'} onChange={(e) => handleUbahStatus(item.id, e.target.value)}
                                                                style={{ padding: '4px 8px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', backgroundColor: item.status === 'menunggu' ? '#ffeaea' : item.status === 'diproses' ? '#fff4e5' : '#e1fce8', color: item.status === 'menunggu' ? '#c81e1e' : item.status === 'diproses' ? '#b55a00' : '#036c2a' }}>
                                                            <option value="menunggu">Baru</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            <button className="btn btn-sm btn-outline" title="Lihat Detail" onClick={() => setSelectedPengaduan(item)}><Eye /></button>
                                                            <button className="btn btn-sm btn-outline" title="Cetak Pengaduan Ini" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => handleCetakIndividu('pengaduan', item)}><Printer /></button>
                                                            {item.status === 'selesai' && (
                                                                <button className="btn btn-sm btn-outline" title="Hapus" style={{ color: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleHapusPengaduan(item.id)}><Trash /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : <tr><td colSpan="3" style={{ textAlign: 'center', color: '#666' }}>Belum ada laporan.</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedForm && (
                <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', backgroundColor: '#fff', borderRadius: '12px', padding: '24px' }}>
                        <button onClick={() => setSelectedForm(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>
                        <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={{ color: 'var(--violet-deep)' }}>Detail Formulir Identifikasi</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{selectedForm.sub_bidang}</p>
                        </div>
                        <table className="table">
                            <tbody>
                            <tr><td style={{ width: '40%', color: '#666', fontSize: '13px' }}>Tanggal Kirim</td><td><b>{new Date(selectedForm.created_at).toLocaleString('id-ID')}</b></td></tr>
                            {Object.entries(getSafeObject(selectedForm.data_formulir)).map(([key, value], idx) => (
                                <tr key={idx}><td style={{ color: '#666', textTransform: 'capitalize', fontSize: '13px' }}>{key.replace(/_/g, ' ')}</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{value || '-'}</b></td></tr>
                            ))}
                            </tbody>
                        </table>

                        {(() => {
                            const fotoArr = getArrayData(selectedForm.dokumentasi_foto);
                            if (fotoArr.length > 0) {
                                return (
                                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                        <div style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}><b>Bukti Dokumentasi:</b></div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {fotoArr.map((file_path, idx) => (
                                                <a key={idx} href={getFileUrl(file_path)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                                    <Image className="me-1" />Lihat File {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                        })()}

                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button className="btn btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => { setSelectedForm(null); handleCetakIndividu('form', selectedForm); }}>
                                <Printer className="me-2" />Cetak Ini
                            </button>
                            <button className="btn btn-violet" onClick={() => setSelectedForm(null)}>Tutup Rincian</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedPengaduan && (
                <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', backgroundColor: '#fff', borderRadius: '12px', padding: '24px' }}>
                        <button onClick={() => setSelectedPengaduan(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>
                        <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={{ color: 'var(--magenta-deep)' }}>Detail Pengaduan Masyarakat</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'capitalize' }}>Bidang: {(selectedPengaduan.bidang || '').replace(/_/g, ' ')}</p>
                        </div>
                        <table className="table">
                            <tbody>
                            <tr><td style={{ width: '35%', color: '#666', fontSize: '13px' }}>Tanggal Lapor</td><td><b>{new Date(selectedPengaduan.created_at).toLocaleString('id-ID')}</b></td></tr>
                            <tr><td style={{ color: '#666', fontSize: '13px' }}>Nama Pelapor</td><td><b>{selectedPengaduan.nama_pelapor} ({selectedPengaduan.jenis_kelamin})</b></td></tr>
                            <tr><td style={{ color: '#666', fontSize: '13px' }}>NIK</td><td><b>{selectedPengaduan.nik}</b></td></tr>
                            <tr><td style={{ color: '#666', fontSize: '13px' }}>No. HP</td><td><b>{selectedPengaduan.no_hp || '-'}</b></td></tr>
                            <tr><td style={{ color: '#666', fontSize: '13px' }}>Alamat</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.alamat || '-'}</b></td></tr>
                            <tr><td style={{ color: '#666', fontSize: '13px' }}>Lokasi Masalah</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.lokasi_masalah || '-'}</b></td></tr>
                            <tr><td style={{ color: '#666', fontSize: '13px' }}>Isi Keluhan</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.isi_keluhan}</b></td></tr>
                            </tbody>
                        </table>

                        {(() => {
                            const lampiranArr = getArrayData(selectedPengaduan.lampiran);
                            if (lampiranArr.length > 0) {
                                return (
                                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                        <div style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}><b>Bukti Lampiran:</b></div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {lampiranArr.map((file_path, idx) => (
                                                <a key={idx} href={getFileUrl(file_path)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                                    <Image className="me-1" />Lihat File {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                        })()}

                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button className="btn btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => { setSelectedPengaduan(null); handleCetakIndividu('pengaduan', selectedPengaduan); }}>
                                <Printer className="me-2" />Cetak Ini
                            </button>
                            <button className="btn btn-violet" onClick={() => setSelectedPengaduan(null)}>Tutup Rincian</button>
                        </div>
                    </div>
                </div>
            )}

            {isPrinting && viewMode === 'detail' && selectedPosyandu && ReactDOM.createPortal(
                <div id="dokumen-cetak">
                    <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Laporan Detail Posyandu {selectedPosyandu.nama}</h2>
                    <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>Bidang: {BIDANG_NAMA[tab]}</h4>
                    <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

                    {formsToPrint.length > 0 && (
                        <>
                            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>A. Data Pemetaan Identifikasi</h3>
                            {formsToPrint.map((item, idx) => {
                                const fotoArr = getArrayData(item.dokumentasi_foto);
                                const amanFormulir = getSafeObject(item.data_formulir);

                                return (
                                    <div key={idx} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>{formsToPrint.length > 1 ? `${idx + 1}. ` : ''}Sub-Bidang: {item.sub_bidang || '-'} <span style={{ fontWeight: 'normal', color: '#555', fontSize: '13px' }}>(Tgl: {new Date(item.created_at).toLocaleDateString('id-ID')})</span></p>
                                        <table className="tabel-cetak">
                                            <tbody>
                                            {Object.entries(amanFormulir).map(([k, v], i) => (
                                                <tr key={i}>
                                                    <th style={{ width: '35%', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</th>
                                                    <td style={{ whiteSpace: 'pre-wrap' }}>{v || '-'}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        {fotoArr.length > 0 && (
                                            <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #999', backgroundColor: '#f9f9f9' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 8px 0' }}>Lampiran Dokumentasi:</p>
                                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                                    {fotoArr.map((fPath, fIdx) => {
                                                        const isImage = fPath.match(/\.(jpeg|jpg|png|gif)$/i);
                                                        const fileUrl = getFileUrl(fPath);
                                                        if (isImage) {
                                                            return <img key={fIdx} src={fileUrl} alt="Foto Bukti" style={{ display: 'block', maxHeight: '350px', width: 'auto', maxWidth: '100%', objectFit: 'contain', border: '1px solid #ccc', backgroundColor: '#fff', padding: '4px' }} />;
                                                        } else {
                                                            return <div key={fIdx} style={{ fontSize: '13px', border: '1px solid #ccc', padding: '6px', background: '#fff' }}>📄 Dokumen PDF/Word Terlampir</div>;
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {pengaduansToPrint.length > 0 && (
                        <>
                            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', marginTop: '32px' }}>B. Laporan Pengaduan Masyarakat</h3>
                            {pengaduansToPrint.map((item, idx) => {
                                const lampiranArr = getArrayData(item.lampiran);
                                return (
                                    <div key={idx} style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>{pengaduansToPrint.length > 1 ? `${idx + 1}. ` : ''}Laporan dari: {item.nama_pelapor}</p>
                                        <table className="tabel-cetak">
                                            <tbody>
                                            <tr><th style={{ width: '35%' }}>Tanggal & Status</th><td>{new Date(item.created_at).toLocaleDateString('id-ID')} — <b>{(item.status || '').toUpperCase()}</b></td></tr>
                                            <tr><th>NIK / No. HP</th><td>{item.nik} / {item.no_hp || '-'}</td></tr>
                                            <tr><th>Alamat & Lokasi Masalah</th><td style={{ whiteSpace: 'pre-wrap' }}>{item.alamat || '-'} <br /><b>Lokasi Masalah:</b> {item.lokasi_masalah || '-'}</td></tr>
                                            <tr><th>Isi Keluhan Lengkap</th><td style={{ whiteSpace: 'pre-wrap' }}>{item.isi_keluhan}</td></tr>
                                            </tbody>
                                        </table>

                                        {lampiranArr.length > 0 && (
                                            <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #999', backgroundColor: '#f9f9f9' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 8px 0' }}>Lampiran Aduan:</p>
                                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                                    {lampiranArr.map((lPath, lIdx) => {
                                                        const isImage = lPath.match(/\.(jpeg|jpg|png|gif)$/i);
                                                        const fileUrl = getFileUrl(lPath);
                                                        if (isImage) {
                                                            return <img key={lIdx} src={fileUrl} alt="Foto Lampiran" style={{ display: 'block', maxHeight: '350px', width: 'auto', maxWidth: '100%', objectFit: 'contain', border: '1px solid #ccc', backgroundColor: '#fff', padding: '4px' }} />;
                                                        } else {
                                                            return <div key={lIdx} style={{ fontSize: '13px', border: '1px solid #ccc', padding: '6px', background: '#fff' }}>📄 Dokumen PDF/Word Terlampir</div>;
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}
