import React, { useState, useEffect, useRef } from 'react';
import kasnahImg from '../../assets/images/profil/kader-1.png';
import dewaImg from '../../assets/images/profil/kader-2.png';
import rinawatieImg from '../../assets/images/profil/kader-3.png';
import baganStrukturImg from '../../assets/images/profil/bagan-struktur.png';

export default function StrukturKepengurusanSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const members = [
    { id: 1, name: 'Kasnah', role: 'Ketua TP Posyandu Desa', image: kasnahImg },
    { id: 2, name: 'Dewa Tri Arinda, M.A.P', role: 'Sekretaris', image: dewaImg },
    { id: 3, name: 'Rinawatie, S.Pd', role: 'Bendahara', image: rinawatieImg },
  ];

  return (
    <div
      ref={sectionRef}
      className="struktur-card"
      style={{
        padding: '36px 28px',
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}
    >
      <div className="struktur-header-row" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Organisasi & Kepemimpinan
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '6px 0 0 0' }}>
          Struktur Kepengurusan Posyandu
        </h2>
      </div>

      <div
        className="struktur-members-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}
      >
        {members.map((m, idx) => (
          <div
            key={m.id}
            className="struktur-member-card"
            style={{
              padding: '24px 20px',
              borderRadius: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: isVisible ? '0 4px 14px rgba(0,0,0,0.04)' : 'none',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : `translateY(${30 + idx * 15}px) scale(0.92)`,
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 150}ms`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'var(--secondary-200, #c7e4ff)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div
              className="struktur-avatar-wrapper"
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, var(--primary-500, #008080), var(--secondary-200, #c7e4ff))',
                marginBottom: '16px'
              }}
            >
              <img
                src={m.image}
                alt={m.name}
                className="struktur-avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#ffffff' }}
              />
            </div>
            <div className="struktur-member-name" style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {m.name}
            </div>
            <div
              className="struktur-member-role"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--primary-700, #007373)',
                backgroundColor: 'var(--secondary-50, #f0f7ff)',
                padding: '3px 12px',
                borderRadius: '999px',
                display: 'inline-block'
              }}
            >
              {m.role}
            </div>
          </div>
        ))}
      </div>

      <div
        className="struktur-chart-placeholder"
        style={{
          padding: '0',
          overflow: 'hidden',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 450ms'
        }}
      >
        <img
          src={baganStrukturImg}
          alt="Bagan Struktur Organisasi"
          style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '16px', border: '1px solid #e2e8f0' }}
        />
      </div>
    </div>
  );
}