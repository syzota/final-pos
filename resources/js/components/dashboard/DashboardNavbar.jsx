import React from 'react';

const ROLE_AVATARS = {
  kader: 'K',
  ketua: 'KP',
  puskesmas: 'PK',
  superadmin: 'PD',
  warga: 'W',
};

export default function DashboardNavbar({ title, desc, userAuth, role, onOpenSidebar }) {
  const namaPosyandu = userAuth?.posyandu?.nama || userAuth?.posyandu || '';

  const posyanduName =
    role === 'superadmin'
      ? 'Admin Loa Duri Ulu'
      : role === 'puskesmas'
        ? 'Petugas Puskesmas'
        : role === 'warga'
          ? `Warga Posyandu ${namaPosyandu}`
          : role === 'ketua'
            ? `Ketua Posyandu ${namaPosyandu}`
            : `Kader Posyandu ${namaPosyandu}`;

  return (
    <div className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          className="icon-btn hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Buka menu navigasi"
        >
          <i className="bi bi-list" style={{ fontSize: '20px' }}></i>
        </button>
        <div className="topbar-title-wrapper" style={{ minWidth: 0 }}>
          <h2 id="pageTitle">{title || 'Beranda'}</h2>
          {desc && <div className="desc" id="pageDesc">{desc}</div>}
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" title="Notifikasi">
          <i className="bi bi-bell" style={{ fontSize: '16px' }}></i>
        </button>
        <div className="topbar-profile">
          <div className="avatar-mini" id="topbarAvatar">
            {ROLE_AVATARS[role] || 'U'}
          </div>
          <div className="topbar-profile-info">
            <div className="who" id="topbarWho">
              {userAuth?.nama || 'User'}
            </div>
            <div className="role" id="topbarPosyandu">
              {posyanduName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
