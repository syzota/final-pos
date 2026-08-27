import React from 'react';

import imgGeneric from '../../assets/images/profil/dokumentasi-1.png';
import imgMelati from '../../assets/images/profil/posyandu-melati.png';
import imgTerkini from '../../assets/images/profil/posyandu-terkini.png';
import imgTunasMulia from '../../assets/images/profil/posyandu-tunas-mulia.png';
import imgNusaIndah from '../../assets/images/profil/posyandu-nusa-indah.png';
import imgRukunLestari from '../../assets/images/profil/posyandu-rukun-lestari.png';
import imgMawar from '../../assets/images/profil/posyandu-mawar.png';
import imgCempaka from '../../assets/images/profil/posyandu-cempaka.png';
import imgSurya from '../../assets/images/profil/posyandu-dahlia.png';

export default function PosyanduLocationsSection() {
  const locations = [
    {
      id: 1,
      name: 'Posyandu Bina Putra',
      address: 'Gg. Melati 6 No.5',
      coords: '-0.591351, 117.063864',
      image: imgGeneric,
      mapsUrl: 'https://maps.google.com/?q=-0.591351,117.063864'
    },
    {
      id: 2,
      name: 'Posyandu Melati',
      address: 'Belakang Pos Polisi',
      coords: '-0.587910, 117.061170',
      image: imgMelati,
      mapsUrl: 'https://maps.google.com/?q=-0.587910,117.061170'
    },
    {
      id: 3,
      name: 'Posyandu Terkini',
      address: 'Gg. Nangka',
      coords: '-0.589430, 117.061800',
      image: imgTerkini,
      mapsUrl: 'https://maps.google.com/?q=-0.589430,117.061800'
    },
    {
      id: 4,
      name: 'Posyandu Tunas Mulia',
      address: 'Loa Duri Ulu RT.08',
      coords: '-0.587190, 117.048890',
      image: imgTunasMulia,
      mapsUrl: 'https://maps.google.com/?q=-0.587190,117.048890'
    },
    {
      id: 5,
      name: 'Posyandu Nusa Indah',
      address: 'Loa Duri Ulu RT.12',
      coords: '-0.588640, 117.055510',
      image: imgNusaIndah,
      mapsUrl: 'https://maps.google.com/?q=-0.588640,117.055510'
    },
    {
      id: 6,
      name: 'Posyandu Rukun Lestari',
      address: 'Jl. Padat Karya',
      coords: '-0.590050, 117.053150',
      image: imgRukunLestari,
      mapsUrl: 'https://maps.google.com/?q=-0.590050,117.053150'
    },
    {
      id: 7,
      name: 'Posyandu Mawar',
      address: 'Gintung RT 10',
      coords: '-0.605280, 117.048430',
      image: imgMawar,
      mapsUrl: 'https://maps.google.com/?q=-0.605280,117.048430'
    },
    {
      id: 8,
      name: 'Posyandu Cempaka',
      address: 'RT 17 Sei Pimping',
      coords: '-0.575500, 117.043630',
      image: imgCempaka,
      mapsUrl: 'https://maps.google.com/?q=-0.575500,117.043630'
    },
    {
      id: 9,
      name: 'Posyandu Surya',
      address: 'RT 14 C3C5+542',
      coords: '-0.579550, 117.057760',
      image: imgSurya,
      mapsUrl: 'https://maps.google.com/?q=-0.579550,117.057760'
    }
  ];

  return (
    <section className="posyandu-locations-section">
      <div className="locations-header">
        <h2 className="locations-title">Daftar 9 Lokasi Posyandu</h2>
        <p className="locations-subtitle">
          Klik untuk melihat detail lokasi di Peta
        </p>
      </div>

      <div className="locations-grid">
        {locations.map((loc) => (
          <div key={loc.id} className="location-card">
            <div className="loc-img-wrapper">
              <img src={loc.image} alt={loc.name} className="loc-img" />
            </div>
            <div className="loc-body">
              <h3 className="loc-name">{loc.name}</h3>
              <div className="loc-info-row">
                <svg className="loc-icon" width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path d="M8 10C8.55 10 9.0208 9.8042 9.4125 9.4125 9.8042 9.0208 10 8.55 10 8C10 7.45 9.8042 6.9792 9.4125 6.5875 9.0208 6.1958 8.55 6 8 6C7.45 6 6.9792 6.1958 6.5875 6.5875 6.1958 6.9792 6 7.45 6 8C6 8.55 6.1958 9.0208 6.5875 9.4125 6.9792 9.8042 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625 13.5083 10.7375 14 9.3833 14 8.2C14 6.3833 13.4208 4.8958 12.2625 3.7375 11.1042 2.5792 9.6833 2 8 2C6.3167 2 4.8958 2.5792 3.7375 3.7375 2.5792 4.8958 2 6.3833 2 8.2C2 9.3833 2.4917 10.7375 3.475 12.2625 4.4583 13.7875 5.9667 15.4833 8 17.35ZM8 20C5.3167 17.7167 3.3125 15.5958 1.9875 13.6375 0.6625 11.6792 0 9.8667 0 8.2C0 5.7 0.8042 3.7083 2.4125 2.225 4.0208 0.7417 5.8833 0 8 0C10.1167 0 11.9792 0.7417 13.5875 2.225 15.1958 3.7083 16 5.7 16 8.2C16 9.8667 15.3375 11.6792 14.0125 13.6375 12.6875 15.5958 10.6833 17.7167 8 20Z" fill="currentColor" />
                </svg>
                <span>{loc.address}</span>
              </div>
              <div className="loc-info-row coords">
                <svg className="loc-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M4.125 10.875L9.375 9.375 10.875 4.125 5.625 5.625 4.125 10.875ZM7.5 8.625C7.1875 8.625 6.9219 8.5156 6.7031 8.2969 6.4844 8.0781 6.375 7.8125 6.375 7.5C6.375 7.1875 6.4844 6.9219 6.7031 6.7031 6.9219 6.4844 7.1875 6.375 7.5 6.375C7.8125 6.375 8.0781 6.4844 8.2969 6.7031 8.5156 6.9219 8.625 7.1875 8.625 7.5C8.625 7.8125 8.5156 8.0781 8.2969 8.2969 8.0781 8.5156 7.8125 8.625 7.5 8.625ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094 3.6625 14.0156 2.8687 13.4812 2.1937 12.8062 1.5187 12.1312 0.9844 11.3375 0.5906 10.425 0.1969 9.5125 0 8.5375 0 7.5C0 6.4625 0.1969 5.4875 0.5906 4.575 0.9844 3.6625 1.5187 2.8687 2.1937 2.1937 2.8687 1.5187 3.6625 0.9844 4.575 0.5906 5.4875 0.1969 6.4625 0 7.5C0 8.5375 0.1969 9.5125 0.5906 10.425 0.9844 11.3375 1.5187 12.1312 2.1937 12.8062 2.8687 13.4812 3.6625 14.0156 4.575 14.8031 5.4875 15 6.4625 15 7.5 15ZM7.5 13.5C9.1625 13.5 10.5781 12.9156 11.7469 11.7469 12.9156 10.5781 13.5 9.1625 13.5 7.5C13.5 5.8375 12.9156 4.4219 11.7469 3.2531 10.5781 2.0844 9.1625 1.5 7.5 1.5C5.8375 1.5 4.4219 2.0844 3.2531 3.2531 2.0844 4.4219 1.5 5.8375 1.5 7.5C1.5 9.1625 2.0844 10.5781 3.2531 11.7469 4.4219 12.9156 5.8375 13.5 7.5 13.5Z" fill="currentColor" />
                </svg>
                <span>{loc.coords}</span>
              </div>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="maps-btn"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M12 18L6 15.9 1.35 17.7C1.0167 17.8333 0.7083 17.7958 0.425 17.5875 0.1417 17.3792 0 17.1 0 16.75V2.75C0 2.5333 0.0625 2.3417 0.1875 2.175 0.3125 2.0083 0.4833 1.8833 0.7 1.8L6 0 12 2.1 16.65 0.3C16.9833 0.1667 17.2917 0.2042 17.575 0.4125 17.8583 0.6208 18 0.9 18 1.25V15.25C18 15.4667 17.9375 15.6583 17.8125 15.825 17.6875 15.9917 17.5167 16.1167 17.3 16.2L12 18ZM11 15.55V3.85L7 2.45V14.15L11 15.55ZM13 15.55L16 14.55V2.7L13 3.85V15.55ZM2 15.3L5 14.15V2.45L2 3.45V15.3Z" fill="currentColor" />
                </svg>
                <span>Navigasi Google Maps</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
