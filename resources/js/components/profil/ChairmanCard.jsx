import React from 'react';
import kasnahImg from '../../assets/images/profil/kasnah-ketua.png';

export default function ChairmanCard() {
  return (
    <div
      className="chairman-card"
      style={{
        padding: '28px 24px',
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div className="chairman-avatar-wrapper" style={{ marginBottom: '16px' }}>
        <div
          className="avatar-ring"
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            padding: '3px',
            background: 'linear-gradient(135deg, var(--primary-500, #008080), var(--secondary-200, #c7e4ff))',
            boxShadow: '0 4px 14px rgba(0, 128, 128, 0.18)'
          }}
        >
          <img
            src={kasnahImg}
            alt="Kasnah - Ketua Posyandu"
            className="chairman-img"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#ffffff' }}
          />
        </div>
      </div>
      <h3 className="chairman-name" style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
        Kasnah
      </h3>
      <div
        className="chairman-role"
        style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '999px',
          backgroundColor: 'var(--secondary-50, #f0f7ff)',
          color: 'var(--primary-700, #007373)',
          border: '1px solid var(--secondary-200, #c7e4ff)',
          fontSize: '12.5px',
          fontWeight: 700,
          marginBottom: '8px'
        }}
      >
        Ketua Posyandu
      </div>
      <p className="chairman-subtext" style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
        Desa Loa Duri Ulu, Kec. Loa Janan
      </p>
    </div>
  );
}
