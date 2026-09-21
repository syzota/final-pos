import React from 'react';

/**
 * Komponen Skeleton Loading Mengikuti Best Practices Engineering:
 * 1. Zero Cumulative Layout Shift (CLS) dengan dimensi & aspect-ratio presisi.
 * 2. Shimmer animation yang halus & mendukung prefers-reduced-motion.
 * 3. Aksesibilitas (a11y) lengkap: aria-hidden="true" & role="status".
 * 4. Mendukung variasi 'variant' / 'type' serta komposisi komponen spesifik.
 */

export default function Skeleton({
  variant,
  type = 'text',
  width,
  height,
  aspectRatio,
  borderRadius,
  rows = 1,
  cols = 1,
  className = '',
  style = {},
  ariaLabel = 'Memuat konten...',
  ...props
}) {
  const activeVariant = variant || type;

  const inlineStyle = { ...style };
  if (width) inlineStyle.width = width;
  if (height) inlineStyle.height = height;
  if (aspectRatio) inlineStyle.aspectRatio = aspectRatio;
  if (borderRadius) inlineStyle.borderRadius = borderRadius;

  // 1. Variant Table Row (khusus tabel)
  if (activeVariant === 'table-row') {
    return (
      <>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <tr key={rIdx} className={`skeleton-table-row ${className}`} aria-hidden="true">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <td key={cIdx}>
                <div className="skeleton skeleton-table-cell" style={inlineStyle} />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  // 2. Variant Card (komposit kartu)
  if (activeVariant === 'card') {
    return (
      <div 
        className={`skeleton-card ${className}`} 
        style={inlineStyle} 
        aria-hidden="true"
        {...props}
      >
        <div className="skeleton skeleton-card-image" style={{ aspectRatio: aspectRatio || '16/9' }} />
        <div className="skeleton skeleton-title" style={{ width: '80%' }} />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '90%' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '20px' }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <div className="skeleton skeleton-button" style={{ width: '100%', height: '40px' }} />
        </div>
      </div>
    );
  }

  // 3. Variant Profile / User Header
  if (activeVariant === 'profile') {
    return (
      <div className={`skeleton-profile ${className}`} style={{ padding: '24px', ...inlineStyle }} aria-hidden="true" {...props}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div className="skeleton skeleton-circle" style={{ width: '80px', height: '80px', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton skeleton-title" style={{ width: '50%', height: '24px', margin: 0 }} />
            <div className="skeleton skeleton-text" style={{ width: '75%', margin: 0 }} />
            <div className="skeleton skeleton-text" style={{ width: '40%', margin: 0 }} />
          </div>
        </div>
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '70%' }} />
      </div>
    );
  }

  // 4. Variant Box / Rectangle (gambar, banner, container)
  if (activeVariant === 'box' || activeVariant === 'rectangle') {
    return (
      <div
        className={`skeleton skeleton-rectangle ${className}`}
        style={{ width: width || '100%', height: height || '200px', ...inlineStyle }}
        aria-hidden="true"
        {...props}
      />
    );
  }

  // 5. Multi-line Text
  if (rows > 1 && (activeVariant === 'text' || activeVariant === 'paragraph')) {
    return (
      <div className={`skeleton-text-group ${className}`} style={inlineStyle} aria-hidden="true" {...props}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton skeleton-text"
            style={{
              width: idx === rows - 1 ? '65%' : '100%',
              marginBottom: idx === rows - 1 ? 0 : '8px',
            }}
          />
        ))}
      </div>
    );
  }

  // 6. Base / Standard Variant (text, title, circle, button)
  return (
    <div
      className={`skeleton skeleton-${activeVariant} ${className}`}
      style={inlineStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Accessible Wrapper untuk area Skeleton Loading.
 * Membantu Screen Reader mengetahui bahwa konten sedang dimuat tanpa membaca potongan skeleton.
 */
export function SkeletonWrapper({ children, label = 'Sedang memuat data...', className = '' }) {
  return (
    <div className={`skeleton-container ${className}`} role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export { Skeleton };
