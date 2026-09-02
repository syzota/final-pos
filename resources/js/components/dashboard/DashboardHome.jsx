import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  Activity,
  Megaphone,
  HeartPulse,
  ArrowRight,
  Building2,
  BookCheck,
  FolderCheck,
  FolderX,
  FileCheck2,
  FileX2,
  Book,
  Home,
  ShieldCheck,
  Flame,
  Clock
} from 'lucide-react';
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
        console.error('Gagal memuat statistik dashboard', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div style={{ padding: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Skeleton type="box" height="110px" />
          <Skeleton type="box" height="110px" />
          <Skeleton type="box" height="110px" />
          <Skeleton type="box" height="110px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <Skeleton type="box" height="360px" />
          <Skeleton type="box" height="360px" />
        </div>
      </div>
    );
  }

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const formatBidang = (teks) => teks.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div style={{ animation: 'fadein 0.3s ease' }}>
      {/* HERO SECTION DENGAN TIPOGRAFI MODERN & HIERARKI JELAS */}
      <div style={{ marginBottom: '24px', backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Ringkasan Operasional Bulanan
        </span>
        <h1 style={{ color: '#0f172a', margin: '4px 0 6px 0', fontSize: '24px', fontWeight: 800 }}>
          Beranda Analitik Posyandu Loa Duri Ulu
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
          Pantau rekapitulasi data penimbangan kesehatan, laporan pengaduan masyarakat, serta progres register bulanan desa.
        </p>
      </div>

      {/* 1. BENTO GRID 4 STATS CARD (4x4 COMPACT STYLE) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* CARD 1: Total Warga */}
        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)',
            border: '1px solid #ccfbf1',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#008080', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f766e', lineHeight: 1 }}>{stats.top_stats.total_warga}</div>
            <div style={{ fontSize: '13px', color: '#115e59', fontWeight: 600, marginTop: '4px' }}>Total Warga Sasaran</div>
          </div>
        </div>

        {/* CARD 2: Kehadiran Pemeriksaan */}
        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: '1px solid #fed7aa',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#c2410c', lineHeight: 1 }}>{stats.top_stats.kehadiran_persen}%</div>
            <div style={{ fontSize: '13px', color: '#9a3412', fontWeight: 600, marginTop: '4px' }}>Kehadiran Pemeriksaan</div>
          </div>
        </div>

        {/* CARD 3: Pengaduan Warga */}
        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
            border: '1px solid #fbcfe8',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#db2777', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Megaphone size={24} />
          </div>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#be185d', lineHeight: 1 }}>{stats.top_stats.pengaduan_baru}</div>
            <div style={{ fontSize: '13px', color: '#9d174d', fontWeight: 600, marginTop: '4px' }}>Laporan Pengaduan</div>
          </div>
        </div>

        {/* CARD 4: Status Laporan Bulanan (Disederhanakan dari F1/F2) */}
        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: stats.rekap_bulan_ini ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: `1px solid ${stats.rekap_bulan_ini ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stats.rekap_bulan_ini ? '#16a34a' : '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {stats.rekap_bulan_ini ? <FileCheck2 size={24} /> : <FileX2 size={24} />}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: stats.rekap_bulan_ini ? '#15803d' : '#b91c1c', lineHeight: 1.2 }}>
              {stats.rekap_bulan_ini ? 'Sudah Lengkap' : 'Belum Lengkap'}
            </div>
            <div style={{ fontSize: '12.5px', color: stats.rekap_bulan_ini ? '#166534' : '#991b1b', fontWeight: 600, marginTop: '4px' }}>
              Laporan Bulanan Posyandu
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIORITAS UTAMA: PROGRES PENCATATAN KESEHATAN & IDENTIFIKASI NON-KESEHATAN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* KIRI: PROGRES KESEHATAN */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartPulse size={20} color="#008080" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pencatatan Kesehatan Warga
                </h3>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>Bulan Ini</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'balita', label: 'Bayi & Balita', color: '#0284c7', bg: '#e0f2fe' },
                { key: 'remaja', label: 'Remaja', color: '#ea580c', bg: '#ffedd5' },
                { key: 'hamil', label: 'Ibu Hamil', color: '#c026d3', bg: '#fae8ff' },
                { key: 'lansia', label: 'Orang Tua & Lansia', color: '#16a34a', bg: '#dcfce7' },
              ].map(item => {
                const diperiksa = stats.kesehatan[item.key]?.diperiksa || 0;
                const total = stats.kesehatan[item.key]?.total || 0;
                const persen = total > 0 ? Math.min(Math.round((diperiksa / total) * 100), 100) : 0;

                return (
                  <div key={item.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>{item.label}</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: item.color }}>{diperiksa} / {total} sasaran ({persen}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: item.bg, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${persen}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{
              marginTop: '24px',
              minHeight: '44px',
              width: '100%',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              color: 'var(--primary-teal, #008080)',
              borderColor: 'var(--primary-teal, #008080)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => onViewChange('kesehatan')}
          >
            Lanjutkan Pengisian Data Kesehatan <ArrowRight size={16} />
          </button>
        </div>

        {/* KANAN: 5 BIDANG NON-KESEHATAN (DENGAN WARNA TEKS KONTRAS & JELAS) */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#7c3aed" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  5 Bidang Non-Kesehatan
                </h3>
              </div>
              <span className="badge badge-magenta" style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>SPM Desa</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.keys(stats.lingkungan || {}).map((bidang) => {
                const dataBidang = stats.lingkungan[bidang] || { form: 0, aduan: 0 };
                return (
                  <div
                    key={bidang}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                      {formatBidang(bidang)}
                    </span>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: dataBidang.aduan > 0 ? '#dc2626' : '#059669' }}>
                      {dataBidang.form} Formulir / {dataBidang.aduan} Pengaduan
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{
              marginTop: '24px',
              minHeight: '44px',
              width: '100%',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13.5px',
              color: '#7c3aed',
              borderColor: '#c4b5fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onClick={() => onViewChange('pengaduan')}
          >
            Tinjau Formulir & Pengaduan <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3. STATUS BUKU REGISTER BULANAN & AKTIVITAS TERKINI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* KIRI: BUKU REGISTER BULANAN */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookCheck size={20} color="#008080" />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Status Rekapitulasi Laporan Bulanan
            </h3>
          </div>

          {stats.rekap_bulan_ini ? (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <FolderCheck size={32} color="#16a34a" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 2px 0', color: '#15803d', fontSize: '14.5px', fontWeight: 700 }}>Laporan Bulan Ini Siap</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: '1.4' }}>
                  Rekapitulasi bulanan dan data demografi posyandu telah tersimpan aman dan terintegrasi dengan Puskesmas.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
              <FolderX size={32} color="#dc2626" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 2px 0', color: '#b91c1c', fontSize: '14.5px', fontWeight: 700 }}>Laporan Belum Diterbitkan</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#991b1b', lineHeight: '1.4' }}>
                  Pencatatan pemeriksaan siap direkap. Buka formulir rekap bulanan untuk finalisasi data.
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1, minHeight: '44px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px' }}
              onClick={() => onViewChange('rekap-kegiatan')}
            >
              Rekap Laporan Bulanan
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, minHeight: '44px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px' }}
              onClick={() => onViewChange('pencatatan-kegiatan')}
            >
              Laporan 13 Poin
            </button>
          </div>
        </div>

        {/* KANAN: AKTIVITAS TERKINI */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={20} color="#64748b" />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Aktivitas Terbaru Sistem
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(stats.aktivitas_terbaru || []).length > 0 ? (
              stats.aktivitas_terbaru.map((log, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.warna || '#008080', marginTop: '6px', flexShrink: 0 }}></div>
                  <div>
                    <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', margin: '0 0 2px 0' }}>{log.judul}</p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{timeAgo(log.waktu)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '13.5px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Belum ada aktivitas tercatat untuk sesi ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}