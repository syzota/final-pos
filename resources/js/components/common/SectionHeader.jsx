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
      style={style}
    >
      <div style={{ display: 'flex', justifyContent: isCenter ? 'center' : 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ maxWidth: isCenter ? '100%' : '720px' }}>
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
