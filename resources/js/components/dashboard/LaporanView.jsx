import React, { useState } from 'react';

export default function LaporanView({ role }) {
  const [tab, setTab] = useState(0);

  return (
    <>
      <div className="tabs">
        <button className={`tab-btn ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>Bulanan ke Puskesmas</button>
        <button className={`tab-btn ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>Bulanan Kesehatan ke Desa</button>
        <button className={`tab-btn ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}>3 Bulanan 6 Bidang</button>
      </div>

      {tab === 0 && (
        <div className="card">
          <div className="section-head">
            <h3>Laporan Bulanan Bidang Kesehatan — Juli 2026</h3>
            <span className="badge badge-green">Siap Dilaporkan ke Puskesmas</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', fontWeight: 500, marginBottom: '14px' }}>
            Mengikuti format resmi Kertas Data Umum & Pencatatan Kegiatan Posyandu (SIP). Tinjau angka rekap otomatis sebelum dikirim.
          </p>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Indikator</th><th>Laki-laki</th><th>Perempuan</th><th>Total</th></tr>
              </thead>
              <tbody>
                <tr><td>Balita Ditimbang</td><td><input defaultValue="22" /></td><td><input defaultValue="20" /></td><td style={{ fontWeight: 800 }}>42</td></tr>
                <tr><td>Naik Berat Badan</td><td><input defaultValue="19" /></td><td><input defaultValue="18" /></td><td style={{ fontWeight: 800 }}>37</td></tr>
                <tr><td>Bawah Garis Merah (BGM)</td><td><input defaultValue="1" /></td><td><input defaultValue="0" /></td><td style={{ fontWeight: 800 }}>1</td></tr>
                <tr><td>Cakupan Imunisasi Lengkap</td><td colSpan="2"><input defaultValue="89%" /></td><td style={{ fontWeight: 800 }}>89%</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600, margin: '10px 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg className="ic ic-sm"><use href="#i-edit" /></svg>Dikoreksi oleh Kader Melati · 28 Jul 2026, 14:02
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div className="export-row">
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-file" /></svg>PDF</button>
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-file" /></svg>Word</button>
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-grid" /></svg>Excel</button>
            </div>
            <button className="btn btn-violet">Kirim ke Puskesmas</button>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="card">
          <div className="section-head">
            <h3>Laporan Bulanan Kesehatan ke Kantor Desa — Juli 2026</h3>
            <span className="badge badge-orange">Belum Lengkap</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', fontWeight: 500, marginBottom: '14px' }}>
            Menggabungkan rekap Kesehatan bulan ini dengan data Profil & Sarana Posyandu terkini.
          </p>
          <div className="grid grid-2">
            <div className="card pad-sm" style={{ background: 'var(--bg)', border: 'none' }}><p style={{ fontSize: '12px', fontWeight: 700 }}>Rekap Kegiatan Kesehatan</p><span className="badge badge-green" style={{ marginTop: '8px' }}>Lengkap</span></div>
            <div className="card pad-sm" style={{ background: 'var(--bg)', border: 'none' }}><p style={{ fontSize: '12px', fontWeight: 700 }}>Profil & Sarana Posyandu</p><span className="badge badge-orange" style={{ marginTop: '8px' }}>Perlu diperbarui</span></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div className="export-row">
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-file" /></svg>PDF</button>
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-file" /></svg>Word</button>
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-grid" /></svg>Excel</button>
            </div>
            <button className="btn btn-outline">Lengkapi & Kirim ke Desa</button>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="card">
          <div className="section-head">
            <h3>Rekapitulasi 3 Bulanan — 6 Bidang (Mei–Jul 2026)</h3>
            <span className="badge badge-rose">2 bidang belum direkap</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--cyan-bg)', borderRadius: '12px' }}><span style={{ fontWeight: 700, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-deep)' }}><svg className="ic ic-sm"><use href="#i-activity" /></svg>Kesehatan</span><span className="badge badge-green">Siap</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--orange-bg)', borderRadius: '12px' }}><span style={{ fontWeight: 700, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--orange-deep)' }}><svg className="ic ic-sm"><use href="#i-book" /></svg>Pendidikan</span><span className="badge badge-green">Siap</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--magenta-bg)', borderRadius: '12px' }}><span style={{ fontWeight: 700, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--magenta-deep)' }}><svg className="ic ic-sm"><use href="#i-droplet" /></svg>Pekerjaan Umum</span><span className="badge badge-orange">Proses</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--green-bg)', borderRadius: '12px' }}><span style={{ fontWeight: 700, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green-deep)' }}><svg className="ic ic-sm"><use href="#i-home" /></svg>Perumahan Rakyat</span><span className="badge badge-orange">Proses</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--violet-bg)', borderRadius: '12px' }}><span style={{ fontWeight: 700, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--violet-deep)' }}><svg className="ic ic-sm"><use href="#i-shield" /></svg>Trantibumlinmas</span><span className="badge badge-rose">Belum Direkap</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--rose-bg)', borderRadius: '12px' }}><span style={{ fontWeight: 700, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rose-deep)' }}><svg className="ic ic-sm"><use href="#i-heart" /></svg>Sosial</span><span className="badge badge-rose">Belum Direkap</span></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div className="export-row">
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-file" /></svg>PDF</button>
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-file" /></svg>Word</button>
              <button className="export-btn"><svg className="ic ic-sm"><use href="#i-grid" /></svg>Excel</button>
            </div>
            <button className="btn btn-violet">Susun Laporan 3 Bulanan</button>
          </div>
        </div>
      )}
    </>
  );
}
