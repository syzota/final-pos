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
    <div className="tasks-card strategic-functions" style={{ padding: '28px 24px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
      <div className="card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fae8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Peran Bagi Masyarakat</h3>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>Fungsi sosial & kesehatan lingkungan</span>
        </div>
      </div>

      <ul className="task-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {functions.map((fn, idx) => (
          <li key={idx} className="task-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
            <CheckCircle2 size={18} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{fn}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
