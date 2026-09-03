import React from 'react';
import { Menu } from 'lucide-react';

export default function DashboardNavbar({ title, onOpenSidebar }) {
  return (
    <div className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <button
          className="icon-btn hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title-wrapper" style={{ minWidth: 0 }}>
          <span id="pageTitle" style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
            {title || 'Posyandu Loa Duri Ulu'}
          </span>
        </div>
      </div>
    </div>
  );
}
