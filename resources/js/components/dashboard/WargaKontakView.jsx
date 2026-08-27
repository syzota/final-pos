import React from 'react';

export default function WargaKontakView({ posyandu }) {
  return (
    <div className="card">
      <div className="section-head"><h3>Kontak Posyandu {posyandu}</h3></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="bidang-icon-tile" style={{ background: 'var(--cyan-bg)', color: 'var(--cyan-deep)', width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
          <i className="bi bi-telephone-fill" style={{ fontSize: '20px' }}></i>
        </div>
        <div><p style={{ fontWeight: 800, fontSize: '16px' }}>0812-5000-1001</p><p style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 600 }}>Jl. Mawar RT 02 · Jadwal rutin tanggal 3 setiap bulan</p></div>
      </div>
    </div>
  );
}
