import React from 'react';

export default function DashboardPageHeader({
  eyebrow,
  title,
  description,
  badgeIcon: BadgeIcon,
  action,
  posyanduName
}) {
  return (
    <div
      className="dashboard-page-hero"
      style={{
        marginBottom: '24px',
        backgroundColor: '#ffffff',
        padding: 'clamp(20px, 3.5vw, 28px)',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ minWidth: 0, flex: '1 1 300px' }}>
          {eyebrow && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              {BadgeIcon && <BadgeIcon size={14} color="var(--primary-teal, #008080)" />}
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: 'var(--primary-teal, #008080)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {eyebrow}
              </span>
            </div>
          )}
          <h1
            style={{
              color: '#0f172a',
              margin: '2px 0 6px 0',
              fontSize: 'clamp(20px, 2.5vw, 25px)',
              fontWeight: 800,
              lineHeight: 1.3
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                color: '#64748b',
                fontSize: '13.5px',
                margin: 0,
                lineHeight: 1.55,
                maxWidth: '720px'
              }}
            >
              {description}
            </p>
          )}
        </div>

        {(action || posyanduName) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', alignSelf: 'flex-start' }}>
            {posyanduName && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--secondary-50, #f0f7ff)',
                  border: '1px solid var(--secondary-200, #c7e4ff)',
                  color: 'var(--primary-800, #004d4d)',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
              >
                Posyandu {posyanduName}
              </span>
            )}
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
