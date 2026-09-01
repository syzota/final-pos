import React from 'react';

import { Menu, Bell } from 'lucide-react';

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
      ? 'Admin'
      : role === 'puskesmas'
        ? 'Petugas Puskesmas'
        : role === 'warga'
          ? 'Warga'
          : role === 'ketua'
            ? 'Ketua'
            : 'Kader';

  return (
    <div className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          className="icon-btn hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Buka menu navigasi"
        >
          <Menu />
        </button>
        <div className="topbar-title-wrapper" style={{ minWidth: 0 }}>
          <h2 id="pageTitle">{title || 'Beranda'}</h2>
          {desc && <div className="desc" id="pageDesc">{desc}</div>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-profile">
          <div className="avatar-mini" id="topbarAvatar">
            {ROLE_AVATARS[role] || 'U'}
          </div>
          <div className="topbar-profile-info">
            <div className="who" id="topbarWho">
              {posyanduName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
