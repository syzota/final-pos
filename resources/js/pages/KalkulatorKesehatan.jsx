import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import '../styles/kalkulator.css';
import caltBg from '../assets/images/common/calt.jpg';

import {
  HeartPulse,
  ArrowDown,
  Info,
  Activity,
  Calculator,
  CheckCircle2,
  Utensils,
  Flame,
  AlertCircle
} from 'lucide-react';

const ACTIVITY_FACTOR = {
  sangat_ringan: { label: 'Sangat Ringan (jarang olahraga / duduk)', factor: 1.2 },
  ringan: { label: 'Ringan (olahraga 1–3 hari/minggu)', factor: 1.375 },
  sedang: { label: 'Sedang (olahraga 3–5 hari/minggu)', factor: 1.55 },
  berat: { label: 'Berat (olahraga 6–7 hari/minggu)', factor: 1.725 },
};

export default function KalkulatorKesehatan({ activePage, onNavigate, onDarurat }) {
  // IMT STATE
  const [imiGender, setImiGender] = useState('Perempuan');
  const [imiUmur, setImiUmur] = useState('');
  const [imiBerat, setImiBerat] = useState('');
  const [imiTinggi, setImiTinggi] = useState('');
  const [imiResult, setImiResult] = useState(null);
  const [imiError, setImiError] = useState('');

  // KALORI STATE
  const [kalGender, setKalGender] = useState('Perempuan');
  const [kalUmur, setKalUmur] = useState('');
  const [kalBerat, setKalBerat] = useState('');
  const [kalTinggi, setKalTinggi] = useState('');
  const [kalAktivitas, setKalAktivitas] = useState('sedang');
  const [kalResult, setKalResult] = useState(null);
  const [kalError, setKalError] = useState('');

  const handleCalcIMT = () => {
    const bb = parseFloat(imiBerat);
    const tb = parseFloat(imiTinggi);
    if (!bb || !tb || tb <= 0 || bb <= 0) {
      setImiError('Mohon masukkan berat badan dan tinggi badan yang valid terlebih dahulu.');
      return;
    }
    setImiError('');

    const imt = bb / Math.pow(tb / 100, 2);
    let status = 'Normal (Gizi Ideal)';
    let badgeBg = '#dcfce7';
    let badgeColor = '#15803d';

    if (imt < 17.0) {
      status = 'Kekurangan Berat Badan Tingkat Berat';
      badgeBg = '#fee2e2';
      badgeColor = '#b91c1c';
    } else if (imt < 18.5) {
      status = 'Kurus (Kekurangan BB Ringan)';
      badgeBg = '#fef3c7';
      badgeColor = '#b45309';
    } else if (imt <= 25.0) {
      status = 'Normal (Gizi Sehat & Ideal)';
      badgeBg = '#dcfce7';
      badgeColor = '#15803d';
    } else if (imt <= 27.0) {
      status = 'Kelebihan Berat Badan (Overweight)';
      badgeBg = '#ffedd5';
      badgeColor = '#c2410c';
    } else {
      status = 'Obesitas (Risiko Kesehatan)';
      badgeBg = '#fee2e2';
      badgeColor = '#b91c1c';
    }

    const bbIdealMin = Math.round((tb - 100) * 0.85);
    const bbIdealMax = Math.round((tb - 100) * 0.95);

    setImiResult({
      imt: imt.toFixed(1),
      status,
      badgeBg,
      badgeColor,
      bbIdealMin: Math.max(10, bbIdealMin),
      bbIdealMax: Math.max(15, bbIdealMax),
    });
  };

  const handleCalcKalori = () => {
    const bb = parseFloat(kalBerat);
    const tb = parseFloat(kalTinggi);
    const umur = parseFloat(kalUmur);
    if (!bb || !tb || !umur || bb <= 0 || tb <= 0 || umur <= 0) {
      setKalError('Mohon lengkapi usia, berat badan, dan tinggi badan dengan benar.');
      return;
    }
    setKalError('');

    const bmr = kalGender === 'Perempuan'
      ? (10 * bb) + (6.25 * tb) - (5 * umur) - 161
      : (10 * bb) + (6.25 * tb) - (5 * umur) + 5;

    const factor = ACTIVITY_FACTOR[kalAktivitas]?.factor || 1.55;
    const tdee = Math.round(bmr * factor);

    setKalResult({
      bmr: Math.round(bmr),
      tdee,
      turun: Math.max(1200, tdee - 500),
      naik: tdee + 500,
    });
  };

  return (
    <div className="kalkulator-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="kalkulator-main">
        {/* UNIFIED HERO SECTION */}
        <PageHero
          badgeIcon={HeartPulse}
          badgeText="Kalkulator Kesehatan"
          title="Kenali Kondisi Tubuh Anda"
          titleHighlight="dengan Kalkulator Kesehatan Praktis"
          description="Periksa status gizi, Indeks Massa Tubuh (IMT), dan kebutuhan kalori harian Anda."
          primaryAction={{
            label: 'Mulai Hitung IMT',
            icon: ArrowDown,
            onClick: () =>
              document.getElementById('calc-imt-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          }}
          secondaryAction={{
            label: 'Kalkulator Kalori',
            onClick: () =>
              document.getElementById('calc-kalori-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          }}
          bgImage={caltBg}
        />

        {/* SECTION KALKULATOR UTAMA */}
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 16px' }}>
          <SectionHeader
            eyebrow="FITUR KALKULATOR"
            title="Alat Pengukuran Gizi & Pola Makan"
            description="Gunakan fitur di bawah ini untuk memantau indeks massa tubuh dan kebutuhan energi harian keluarga Anda."
            align="left"
          />

          <div className="kalkulator-calc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '28px', width: '100%', boxSizing: 'border-box' }}>
            {/* KALKULATOR 1: IMT */}
            <div id="calc-imt-card" className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--secondary-200, #c7e4ff)', color: 'var(--primary-800, #004d4d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  1. Hitung Indeks Massa Tubuh (IMT)
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                IMT adalah indikator pengukuran komposisi tubuh untuk mengetahui apakah berat badan Anda berada dalam kategori sehat, kurus, atau berlebih.
              </p>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                  <select value={imiGender} onChange={(e) => setImiGender(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }}>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usia (Tahun)</label>
                  <input type="number" placeholder="mis. 28" value={imiUmur} onChange={(e) => setImiUmur(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                  <input type="number" placeholder="mis. 55" value={imiBerat} onChange={(e) => setImiBerat(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                  <input type="number" placeholder="mis. 160" value={imiTinggi} onChange={(e) => setImiTinggi(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '20px', width: '100%', minHeight: '46px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={handleCalcIMT}
              >
                <Calculator size={18} />
                Hitung IMT & Berat Ideal
              </button>

              {imiError && (
                <div style={{
                  marginTop: '14px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-danger-bg, #fee2e2)',
                  border: '1px solid var(--color-danger-border, #fca5a5)',
                  color: 'var(--color-danger-text, #991b1b)',
                  fontSize: '13.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600
                }}>
                  <AlertCircle size={18} color="var(--color-danger-solid, #ef4444)" style={{ flexShrink: 0 }} />
                  <span>{imiError}</span>
                </div>
              )}

              {imiResult && (
                <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    HASIL PENGUKURAN IMT
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a' }}>{imiResult.imt}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>kg/m²</span>
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, backgroundColor: imiResult.badgeBg, color: imiResult.badgeColor }}>
                      {imiResult.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.5', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    Rentang Berat Badan Ideal Anda: <b style={{ color: '#008080' }}>{imiResult.bbIdealMin} – {imiResult.bbIdealMax} kg</b>
                  </div>
                </div>
              )}
            </div>

            {/* KALKULATOR 2: KALORI */}
            <div id="calc-kalori-card" className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Utensils size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  2. Kebutuhan Kalori Harian (TDEE)
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                Hitung jumlah kalori yang dibutuhkan tubuh setiap hari berdasarkan tingkat aktivitas fisik harian Anda.
              </p>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                  <select value={kalGender} onChange={(e) => setKalGender(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }}>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usia (Tahun)</label>
                  <input type="number" placeholder="mis. 25" value={kalUmur} onChange={(e) => setKalUmur(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                  <input type="number" placeholder="mis. 60" value={kalBerat} onChange={(e) => setKalBerat(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-field" style={{ minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                  <input type="number" placeholder="mis. 165" value={kalTinggi} onChange={(e) => setKalTinggi(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-field full" style={{ gridColumn: '1 / -1', minWidth: 0 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Aktivitas Fisik</label>
                  <select value={kalAktivitas} onChange={(e) => setKalAktivitas(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', boxSizing: 'border-box' }}>
                    {Object.entries(ACTIVITY_FACTOR).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '20px', width: '100%', minHeight: '46px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={handleCalcKalori}
              >
                <Flame size={18} />
                Hitung Kalori Harian
              </button>

              {kalResult && (
                <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    HASIL KALKULATOR KALORI
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a' }}>{kalResult.tdee}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>kkal / hari</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 700 }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '8px' }}>Jaga Berat: {kalResult.tdee} kkal</span>
                    <span style={{ background: '#ffedd5', color: '#c2410c', padding: '6px 14px', borderRadius: '8px' }}>Turun Berat: {kalResult.turun} kkal</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}