import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Users, Activity, Megaphone, HeartPulse, ArrowRight, Building2, BookCheck, FolderCheck, FolderX, FileCheck2, FileX2, Book, Cone, Home, ShieldCheck } from 'lucide-react';
import Skeleton from '../common/Skeleton';

export default function DashboardHome({ role, onViewChange }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStats(response.data.data);
      } catch (error) {
        console.error("Gagal memuat statistik dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <Skeleton type="box" height="120px" />
          <Skeleton type="box" height="120px" />
          <Skeleton type="box" height="120px" />
          <Skeleton type="box" height="120px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
           <Skeleton type="box" height="400px" />
           <Skeleton type="box" height="400px" />
        </div>
      </div>
    );
  }

  // Fungsi utilitas memformat tanggal
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Fungsi utilitas kapitalisasi huruf
  const formatBidang = (teks) => teks.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div style={{ animation: 'fadein 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--violet-deep)', margin: '0 0 4px 0', fontSize: '24px' }}>Beranda Analitik Posyandu</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '14px', margin: 0, fontWeight: 500 }}>Ringkasan terpadu pencatatan kesehatan, pengaduan masyarakat, dan rekapitulasi kegiatan bulanan.</p>
      </div>

      {/* =========================================
          1. KARTU STATISTIK UTAMA (HERO STATS)
          ========================================= */}
      <div className="grid grid-4" style={{ marginBottom: '24px', gap: '16px' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: 'none', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.1)' }}>
          <div className="ico" style={{ background: '#0284c7', color: '#fff' }}><Users /></div>
          <div className="num" style={{ color: '#0369a1' }}>{stats.top_stats.total_warga}</div>
          <div className="label" style={{ color: '#075985', fontWeight: 600 }}>Total Warga Sasaran</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', border: 'none', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.1)' }}>
          <div className="ico" style={{ background: '#ea580c', color: '#fff' }}><Activity /></div>
          <div className="num" style={{ color: '#c2410c' }}>{stats.top_stats.kehadiran_persen}%</div>
          <div className="label" style={{ color: '#9a3412', fontWeight: 600 }}>Kehadiran Pemeriksaan</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', border: 'none', boxShadow: '0 4px 12px rgba(219, 39, 119, 0.1)' }}>
          <div className="ico" style={{ background: '#db2777', color: '#fff' }}><Megaphone /></div>
          <div className="num" style={{ color: '#be185d' }}>{stats.top_stats.pengaduan_baru}</div>
          <div className="label" style={{ color: '#9d174d', fontWeight: 600 }}>Pengaduan Baru</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: 'none', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)' }}>
          <div className="ico" style={{ background: stats.rekap_bulan_ini ? '#16a34a' : '#ef4444', color: '#fff' }}>
            {stats.rekap_bulan_ini ? <FileCheck2 size={18} /> : <FileX2 size={18} />}
          </div>
          <div className="num" style={{ color: stats.rekap_bulan_ini ? '#15803d' : '#b91c1c' }}>{stats.top_stats.status_register}</div>
          <div className="label" style={{ color: stats.rekap_bulan_ini ? '#166534' : '#991b1b', fontWeight: 600 }}>Status Register Bulanan</div>
        </div>
      </div>

      {/* =========================================
          2. ZONA TENGAH: KESEHATAN VS PENGADUAN
          ========================================= */}
      <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>

        {/* KIRI: PROGRES KESEHATAN */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="section-head" style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--cyan-deep)' }}><HeartPulse className="me-2" />Pencatatan Kesehatan</h3>
              <span className="badge badge-cyan">Bulan Ini</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Loop Data Kesehatan */}
              {[
                { key: 'balita', label: 'Bayi & Balita', color: '#0ea5e9', bg: '#e0f2fe' },
                { key: 'remaja', label: 'Remaja', color: '#f59e0b', bg: '#ffedd5' },
                { key: 'hamil', label: 'Ibu Hamil', color: '#d946ef', bg: '#fae8ff' },
                { key: 'lansia', label: 'Orang Tua & Lansia', color: '#10b981', bg: '#dcfce7' },
              ].map(item => {
                const diperiksa = stats.kesehatan[item.key].diperiksa;
                const total = stats.kesehatan[item.key].total;
                const persen = total > 0 ? Math.min(Math.round((diperiksa / total) * 100), 100) : 0;

                return (
                  <div key={item.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{item.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{diperiksa} / {total} ({persen}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: item.bg, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${persen}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
          <button className="btn btn-outline" style={{ marginTop: '24px', width: '100%', justifyContent: 'center', borderColor: 'var(--cyan-deep)', color: 'var(--cyan-deep)' }} onClick={() => onViewChange('kesehatan')}>
            Lanjutkan Pengisian Data Kesehatan <ArrowRight className="ms-2" />
          </button>
        </div>

        {/* KANAN: IDENTIFIKASI & PENGADUAN LINGKUNGAN */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div>
            <div className="section-head" style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--magenta-deep)' }}><Building2 className="me-2" />Lingkungan & Pengaduan</h3>
              <span className="badge badge-magenta">5 Bidang Non-Kesehatan</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Loop Data 5 Bidang */}
              {Object.keys(stats.lingkungan).map((bidang, index) => {
                const dataBidang = stats.lingkungan[bidang];
                const icons = [Book, Cone, Home, ShieldCheck, Users];
                const colors = ['#d97706', '#0284c7', '#16a34a', '#9333ea', '#db2777'];
                const bgs = ['#fef3c7', '#e0f2fe', '#dcfce7', '#f3e8ff', '#fce7f3'];

                return (
                  <div key={bidang} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bgs[index], color: colors[index], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className={`bi ${icons[index]}`}></i>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{formatBidang(bidang)}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: dataBidang.aduan > 0 ? '#ef4444' : '#64748b' }}>
                      {dataBidang.form} Form / {dataBidang.aduan} Aduan
                    </span>
                  </div>
                );
              })}

            </div>
          </div>
          <button className="btn btn-outline" style={{ marginTop: '24px', width: '100%', justifyContent: 'center', borderColor: 'var(--magenta-deep)', color: 'var(--magenta-deep)' }} onClick={() => onViewChange('pengaduan')}>
            Tinjau Formulir & Pengaduan <ArrowRight className="ms-2" />
          </button>
        </div>
      </div>

      {/* =========================================
          3. ZONA BAWAH: BUKU REGISTER & AKTIVITAS
          ========================================= */}
      <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>

        {/* KIRI: STATUS BUKU REGISTER F1/F2 */}
        <div className="card">
          <div className="section-head">
            <h3><BookCheck className="me-2" />Status Register Bulanan (F1/F2)</h3>
          </div>

          {stats.rekap_bulan_ini ? (
             <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #4ade80' }}>
               <div style={{ fontSize: '40px', color: '#16a34a' }}><FolderCheck /></div>
               <div>
                 <h4 style={{ margin: '0 0 4px 0', color: '#14532d', fontSize: '15px' }}>Register Bulan Ini Selesai</h4>
                 <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: '1.4' }}>Terima kasih! Rekapitulasi kegiatan dan data umum bulan ini sudah tersimpan di sistem dengan aman.</p>
               </div>
             </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #e879f9' }}>
              <div style={{ fontSize: '40px', color: '#c026d3' }}><FolderX /></div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#86198f', fontSize: '15px' }}>Buku Register Belum Disimpan</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#a21caf', lineHeight: '1.4' }}>Pencatatan harian kesehatan sudah hampir lengkap. Silakan kompilasi data menjadi Laporan 46 Kolom bulan ini.</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onViewChange('rekap-kegiatan')}>Rekap 46 Kolom</button>
            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', color: 'var(--violet-deep)' }} onClick={() => onViewChange('pencatatan-kegiatan')}>Laporan 13 Poin</button>
          </div>
        </div>

        {/* KANAN: AKTIVITAS TERBARU */}
        <div className="card">
          <div className="section-head">
            <h3>Aktivitas Terbaru Sistem</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {stats.aktivitas_terbaru.length > 0 ? (
              stats.aktivitas_terbaru.map((log, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: log.warna, marginTop: '5px' }}></div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 2px 0' }}>{log.judul}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{timeAgo(log.waktu)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>Belum ada aktivitas tercatat bulan ini.</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}