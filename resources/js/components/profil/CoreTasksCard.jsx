import React from 'react';
import { CheckCircle2, ClipboardList } from 'lucide-react';

export default function CoreTasksCard() {
  const tasks = [
    'Memantau pertumbuhan dan gizi bayi serta balita setiap bulan secara rutin.',
    'Memberikan penyuluhan pola makan sehat dan gizi seimbang bagi ibu hamil dan menyusui.',
    'Mendampingi lansia untuk cek kesehatan rutin, tekanan darah, dan pemeriksaan gula darah.',
    'Menjadi penghubung langsung antara warga masyarakat dengan Puskesmas dan Bidan Desa.'
  ];

  return (
    <div
      className="tasks-card core-tasks"
      style={{
        padding: '28px 24px',
        borderRadius: '18px',
        backgroundColor: '#f0f7ff',
        border: '1px solid #c7e4ff',
        boxShadow: '0 4px 16px rgba(2, 132, 199, 0.05)'
      }}
    >
      <div className="card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ClipboardList size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>Tugas Utama Posyandu</h3>
          <span style={{ fontSize: '13px', color: '#0369a1', fontWeight: 600 }}>Pelayanan langsung untuk warga</span>
        </div>
      </div>

      <ul className="task-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {tasks.map((task, idx) => (
          <li key={idx} className="task-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#1e293b', lineHeight: '1.55' }}>
            <CheckCircle2 size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
