import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function StrategicFunctionsCard() {
  const functions = [
    'Pusat kegiatan gotong royong dan edukasi kesehatan keluarga di tingkat RT/RW.',
    'Pencatatan data kesehatan awal warga untuk mendukung program desa sehat.',
    'Pencegahan dini masalah stunting dan deteksi dini risiko kesehatan ibu hamil.',
    'Wadah silaturahmi dan konsultasi kesehatan santai warga dengan kader desa.'
  ];

  return (
    <div
      className="tasks-card strategic-functions"
      style={{
        padding: '28px 24px',
        borderRadius: '18px',
        backgroundColor: '#faf5ff',
        border: '1px solid #e9d5ff',
        boxShadow: '0 4px 16px rgba(168, 85, 247, 0.05)'
      }}
    >
      <div className="card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>Peran Bagi Masyarakat</h3>
          <span style={{ fontSize: '13px', color: '#7e22ce', fontWeight: 600 }}>Fungsi sosial & kesehatan lingkungan</span>
        </div>
      </div>

      <ul className="task-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {functions.map((fn, idx) => (
          <li key={idx} className="task-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#1e293b', lineHeight: '1.55' }}>
            <CheckCircle2 size={18} color="#9333ea" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{fn}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
