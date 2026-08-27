import React from 'react';
import kasnahImg from '../../assets/images/profil/kader-1.png';
import dewaImg from '../../assets/images/profil/kader-2.png';
import rinawatieImg from '../../assets/images/profil/kader-3.png';
import baganStrukturImg from '../../assets/images/profil/bagan-struktur.png';

export default function StrukturKepengurusanSection() {
  const members = [
    { id: 1, name: 'Kasnah', role: 'Ketua TP Posyandu Desa', image: kasnahImg },
    { id: 2, name: 'Dewa Tri Arinda, M.A.P', role: 'Sekretaris', image: dewaImg },
    { id: 3, name: 'Rinawatie, S.Pd', role: 'Bendahara', image: rinawatieImg },
  ];

  return (
    <div className="struktur-card">
      <div className="struktur-header-row">
        <h2 className="section-title">Struktur Kepengurusan</h2>
      </div>

      <div className="struktur-members-row">
        {members.map((m) => (
          <div className="struktur-member" key={m.id}>
            <div className="struktur-avatar-wrapper">
              <img src={m.image} alt={m.name} className="struktur-avatar" />
            </div>
            <div className="struktur-member-name">{m.name}</div>
            <div className="struktur-member-role">{m.role}</div>
          </div>
        ))}
      </div>

      <div className="struktur-chart-placeholder" style={{ padding: '0', overflow: 'hidden', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'center' }}>
        <img src={baganStrukturImg} alt="Bagan Struktur Organisasi" style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '16px' }} />
      </div>
    </div>
  );
}