import React from 'react';

/**
 * Standardized SectionHeader Component
 * Menyediakan hierarki judul dan sub-deskripsi yang seragam untuk setiap seksi konten
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  action,
  className = '',
  style = {},
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={`section-header ${isCenter ? 'section-header--center' : 'section-header--left'} ${className}`}
      style={{ width: '100%', ...(isCenter ? { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' } : {}), ...style }}
    >
      <div style={{ display: 'flex', flexDirection: isCenter ? 'column' : 'row', justifyContent: isCenter ? 'center' : 'space-between', alignItems: isCenter ? 'center' : 'flex-end', flexWrap: 'wrap', gap: '16px', width: '100%', textAlign: isCenter ? 'center' : 'left' }}>
        <div style={{ maxWidth: isCenter ? '100%' : '720px', width: isCenter ? '100%' : 'auto', display: isCenter ? 'flex' : 'block', flexDirection: 'column', alignItems: isCenter ? 'center' : 'flex-start' }}>
          {eyebrow && (
            <span className="section-header__eyebrow">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="section-header__title">
              {title}
            </h2>
          )}
          {description && (
            <p className="section-header__description">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="section-header__action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
