import React from 'react';
import { Menu01Icon } from '@theexperiencecompany/gaia-icons/stroke-rounded';

export default function DashboardNavbar({ title, userAuth, roleLabel, onOpenSidebar }) {
  const displayName = userAuth?.name || userAuth?.username || '';

  return (
    <header
      className="topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '64px',
        minHeight: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        boxSizing: 'border-box',
      }}
    >
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, height: '100%', flex: 1 }}>
        <button
          className="icon-btn hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Buka menu navigasi"
          style={{
            minWidth: '38px',
            minHeight: '38px',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#334155',
            transition: 'all 0.15s ease',
            padding: 0,
            flexShrink: 0,
            lineHeight: 1,
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <Menu01Icon size={20} />
        </button>
        <div className="topbar-title-wrapper" style={{ minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <span
            id="pageTitle"
            style={{
              fontSize: '14.5px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.01em',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1.2,
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0
            }}
          >
            {title || 'Posyandu Loa Duri Ulu'}
          </span>
        </div>
      </div>

    </header>
  );
}

