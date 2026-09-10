import React from 'react';
import { 
  Building01Icon, 
  Call02Icon, 
  Location01Icon, 
  Mail01Icon, 
  Clock01Icon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';

// 1. Tambahkan { data } di dalam kurung untuk menerima lemparan dari ProfilPosyandu.jsx
export default function BasicContactCard({ data }) {

  // 2. Keamanan ekstra: Jika data belum siap, render kosong dulu agar tidak error
  if (!data) return null;

  const contactItems = [
    {
      label: 'ALAMAT UTAMA',
      value: data.alamat, // 3. Datanya sekarang memanggil dari API Laravel!
      icon: <Location01Icon size={18} />
    },
    {
      label: 'TELEPON LAYANAN',
      value: data.no_telepon,
      icon: <Call02Icon size={18} />
    },
    {
      label: 'SUREL RESMI',
      value: 'ldu.bersamakitabisa@gmail.com',
      icon: <Mail01Icon size={18} />
    },
    {
      label: 'JAM OPERASIONAL',
      value: 'Senin–Jumat (Sesuai Jadwal Kegiatan)',
      icon: <Clock01Icon size={18} />
    }
  ];

  return (
    <div
      className="basic-contact-card"
      style={{
        padding: '28px 24px',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}
    >
      <div className="card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--primary-50, #f0fdfa)', color: 'var(--primary-600, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building01Icon size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>Informasi Kontak Dasar</h3>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Layanan informasi & alamat desa</span>
        </div>
      </div>

      <div className="contact-grid">
        {contactItems.map((item, idx) => (
          <div className="contact-item" key={idx}>
            <div className="contact-icon-box">{item.icon}</div>
            <div className="contact-details">
              <span className="contact-label">{item.label}</span>
              <span className="contact-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}