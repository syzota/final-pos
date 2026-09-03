import React from 'react';

import { Phone, Building } from 'lucide-react';

// 1. Tambahkan { data } di dalam kurung untuk menerima lemparan dari ProfilPosyandu.jsx
export default function BasicContactCard({ data }) {

  // 2. Keamanan ekstra: Jika data belum siap, render kosong dulu agar tidak error
  if (!data) return null;

  const contactItems = [
    {
      label: 'ALAMAT UTAMA',
      value: data.alamat, // 3. Datanya sekarang memanggil dari API Laravel!
      icon: (
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path d="M8 10C8.55 10 9.0208 9.8042 9.4125 9.4125 9.8042 9.0208 10 8.55 10 8C10 7.45 9.8042 6.9792 9.4125 6.5875 9.0208 6.1958 8.55 6 8 6C7.45 6 6.9792 6.1958 6.5875 6.5875 6.1958 6.9792 6 7.45 6 8C6 8.55 6.1958 9.0208 6.5875 9.4125 6.9792 9.8042 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625 13.5083 10.7375 14 9.3833 14 8.2C14 6.3833 13.4208 4.8958 12.2625 3.7375 11.1042 2.5792 9.6833 2 8 2C6.3167 2 4.8958 2.5792 3.7375 3.7375 2.5792 4.8958 2 6.3833 2 8.2C2 9.3833 2.4917 10.7375 3.475 12.2625 4.4583 13.7875 5.9667 15.4833 8 17.35ZM8 20C5.3167 17.7167 3.3125 15.5958 1.9875 13.6375 0.6625 11.6792 0 9.8667 0 8.2C0 5.7 0.8042 3.7083 2.4125 2.225 4.0208 0.7417 5.8833 0 8 0C10.1167 0 11.9792 0.7417 13.5875 2.225 15.1958 3.7083 16 5.7 16 8.2C16 9.8667 15.3375 11.6792 14.0125 13.6375 12.6875 15.5958 10.6833 17.7167 8 20Z" fill="currentColor" />
        </svg>
      )
    },
    {
      label: 'TELEPON LAYANAN',
      value: data.no_telepon,
      icon: (
        <Phone size={18} />
      )
    },
    {
      label: 'SUREL RESMI',
      value: 'ldu.bersamakitabisa@gmail.com',
      icon: (
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path d="M2 16C1.45 16 0.9792 15.8042 0.5875 15.4125 0.1958 15.0208 0 14.55 0 14V2C0 1.45 0.1958 0.9792 0.5875 0.5875 0.9792 0.1958 1.45 0 2 0H18C18.55 0 19.0208 0.1958 19.4125 0.5875 19.8042 0.9792 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125 19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7Z" fill="currentColor" />
        </svg>
      )
    },
    {
      label: 'JAM OPERASIONAL',
      value: 'Senin–Jumat (Sesuai Jadwal Kegiatan)',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13.3 14.7L14.7 13.3 11 9.6V5H9V10.4L13.3 14.7ZM10 20C8.6167 20 7.3167 19.7375 6.1 19.2125 4.8833 18.6875 3.825 17.975 2.925 17.075 2.025 16.175 1.3125 15.1167 0.7875 13.9 0.2625 12.6833 0 11.3833 0 10C0 8.6167 0.2625 7.3167 0.7875 6.1 1.3125 4.8833 2.025 3.825 2.925 2.925 3.825 2.025 4.8833 1.3125 6.1 0.7875 7.3167 0.2625 8.6167 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875 15.1167 1.3125 16.175 2.025 17.075 2.925 17.975 3.825 18.6875 4.8833 19.2125 6.1 19.7375 7.3167 20 8.6167 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9 18.6875 15.1167 17.975 16.175 17.075 17.075 16.175 17.975 15.1167 18.6875 13.9 19.2125 12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625 17.2208 14.1042 18 12.2167 18 10C18 7.7833 17.2208 5.8958 15.6625 4.3375 14.1042 2.7792 12.2167 2 10 2C7.7833 2 5.8958 2.7792 4.3375 4.3375 2.7792 5.8958 2 7.7833 2 10C2 12.2167 2.7792 14.1042 4.3375 15.6625 5.8958 17.2208 7.7833 18 10 18Z" fill="currentColor" />
        </svg>
      )
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
          <Building size={22} />
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