import React from 'react';

/**
 * Komponen Skeleton kerangka untuk efek loading.
 * @param {string} type - 'text' | 'title' | 'circle' | 'button' | 'card' | 'table-row' | 'profile' | 'box'
 * @param {number} width - Lebar skeleton (opsional, px atau %)
 * @param {number} height - Tinggi skeleton (opsional, px)
 * @param {number} rows - Jumlah baris khusus untuk tabel atau daftar teks
 * @param {number} cols - Jumlah kolom khusus untuk tabel
 */
export default function Skeleton({ type = 'text', width, height, rows = 1, cols = 1, style = {} }) {
  const inlineStyle = { ...style };
  if (width) inlineStyle.width = width;
  if (height) inlineStyle.height = height;

  if (type === 'table-row') {
    return (
      <>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <tr key={rIdx} className="skeleton-table-row">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <td key={cIdx}>
                <div className="skeleton skeleton-table-cell" style={inlineStyle}></div>
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-card" style={inlineStyle}>
        <div className="skeleton skeleton-card-image"></div>
        <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '24px' }}></div>
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          <div className="skeleton skeleton-button" style={{ flex: 1 }}></div>
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div style={{ padding: '24px', ...inlineStyle }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div className="skeleton skeleton-circle" style={{ width: '120px', height: '120px', flexShrink: 0 }}></div>
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-title" style={{ width: '50%', height: '32px' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
          </div>
        </div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
      </div>
    );
  }

  if (type === 'box') {
     return <div className="skeleton" style={{ width: width || '100%', height: height || '200px', borderRadius: '12px', ...inlineStyle }}></div>;
  }

  if (rows > 1 && type === 'text') {
    return (
      <>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="skeleton skeleton-text" style={{ ...inlineStyle, width: idx === rows - 1 ? '60%' : (width || '100%') }}></div>
        ))}
      </>
    );
  }

  return (
    <div className={`skeleton skeleton-${type}`} style={inlineStyle}></div>
  );
}
