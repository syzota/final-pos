import React from 'react';
import kasnahImg from '../../assets/images/profil/kasnah-ketua.png';

export default function ChairmanCard() {
  return (
    <div className="chairman-card">
      <div className="chairman-avatar-wrapper">
        <div className="avatar-ring">
          <img src={kasnahImg} alt="Kasnah - Ketua Posyandu" className="chairman-img" />
        </div>
      </div>
      <h3 className="chairman-name">Kasnah</h3>
      <div className="chairman-role">Ketua Posyandu</div>
      <p className="chairman-subtext">Desa Loa Duri Ulu, Kec. Loa Janan</p>
    </div>
  );
}
