import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
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
  BookPlus,
  Plus,
  Trash2,
  LogIn
} from 'lucide-react';

const DATABASE_PINTAR = [
  { id: 'db_1', nama_makanan: 'Nasi Putih (1 centong / 100g)', kalori_per_porsi: 130 },
  { id: 'db_2', nama_makanan: 'Nasi Goreng (1 porsi)', kalori_per_porsi: 267 },
  { id: 'db_3', nama_makanan: 'Mie Ayam (1 mangkuk)', kalori_per_porsi: 330 },
  { id: 'db_4', nama_makanan: 'Bakso Sapi (1 mangkuk)', kalori_per_porsi: 326 },
  { id: 'db_5', nama_makanan: 'Sate Ayam (10 tusuk)', kalori_per_porsi: 340 },
  { id: 'db_6', nama_makanan: 'Soto Ayam (1 mangkuk)', kalori_per_porsi: 220 },
  { id: 'db_7', nama_makanan: 'Rendang Sapi (1 potong)', kalori_per_porsi: 195 },
  { id: 'db_8', nama_makanan: 'Gado-Gado (1 porsi)', kalori_per_porsi: 318 },
  { id: 'db_9', nama_makanan: 'Tempe Goreng (1 potong)', kalori_per_porsi: 34 },
  { id: 'db_10', nama_makanan: 'Tahu Goreng (1 potong)', kalori_per_porsi: 35 },
  { id: 'db_11', nama_makanan: 'Ayam Goreng (1 potong)', kalori_per_porsi: 260 },
  { id: 'db_12', nama_makanan: 'Ikan Bakar (1 potong)', kalori_per_porsi: 150 },
  { id: 'db_13', nama_makanan: 'Es Teh Manis (1 gelas)', kalori_per_porsi: 90 },
  { id: 'db_14', nama_makanan: 'Telur Mata Sapi (1 butir)', kalori_per_porsi: 92 },
  { id: 'db_15', nama_makanan: 'Sayur Bening Bayam (1 mangkuk)', kalori_per_porsi: 45 },
  { id: 'db_16', nama_makanan: 'Pisang Segar (1 buah)', kalori_per_porsi: 105 },
];

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

  // KALORI STATE
  const [kalGender, setKalGender] = useState('Perempuan');
  const [kalUmur, setKalUmur] = useState('');
  const [kalBerat, setKalBerat] = useState('');
  const [kalTinggi, setKalTinggi] = useState('');
  const [kalAktivitas, setKalAktivitas] = useState('sedang');
  const [kalResult, setKalResult] = useState(null);

  // FOOD DB & LOG STATE
  const [foodDb, setFoodDb] = useState(DATABASE_PINTAR);
  const [foodPick, setFoodPick] = useState(DATABASE_PINTAR[0].id);
  const [foodQty, setFoodQty] = useState(1);
  const [foodLog, setFoodLog] = useState([]);

  useEffect(() => {
    axios.get('/api/makanan')
      .then(res => {
        const dbKader = (res.data.data || []).map(item => ({
          id: item.id.toString(),
          nama_makanan: `${item.nama_makanan} (Menu Lokal)`,
          kalori_per_porsi: item.kalori_per_porsi
        }));
        const combined = [...dbKader, ...DATABASE_PINTAR];
        setFoodDb(combined);
        if (combined.length > 0) setFoodPick(combined[0].id);
      })
      .catch(() => {
        setFoodDb(DATABASE_PINTAR);
      });
  }, []);

  const handleCalcIMT = () => {
    const bb = parseFloat(imiBerat);
    const tb = parseFloat(imiTinggi);
    if (!bb || !tb || tb <= 0) return;

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
    if (!bb || !tb || !umur) return;

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

  const handleAddFood = () => {
    const selectedItem = foodDb.find((f) => f.id === foodPick);
    if (!selectedItem || foodQty <= 0) return;

    const totalKcal = selectedItem.kalori_per_porsi * foodQty;
    const newItem = {
      id: Date.now(),
      nama: selectedItem.nama_makanan,
      porsi: foodQty,
      kaloriUnit: selectedItem.kalori_per_porsi,
      totalKalori: totalKcal,
    };
    setFoodLog((prev) => [...prev, newItem]);
  };

  const handleRemoveFood = (id) => {
    setFoodLog((prev) => prev.filter((item) => item.id !== id));
  };

  const totalFoodKcal = foodLog.reduce((acc, cur) => acc + cur.totalKalori, 0);

  return (
    <div className="kalkulator-page">
      <Header activePage={activePage} onNavigate={onNavigate} onDarurat={onDarurat} />

      <main className="kalkulator-main">
        {/* HERO BANNER */}
        <section className="kalkulator-cover-hero">
          <div className="kalkulator-cover-hero__media">
            <img
              src={caltBg}
              alt="Kalkulator Kesehatan Posyandu Loa Duri Ulu"
              className="kalkulator-cover-hero__image"
              loading="lazy"
            />
            <div className="kalkulator-cover-hero__overlay"></div>
            <div className="kalkulator-cover-hero__gradient"></div>
          </div>

          <div className="kalkulator-cover-hero__content">
            <div className="kalkulator-cover-hero__badge">
              <HeartPulse size={16} />
              <span>Alat Bantu Kesehatan Mandiri</span>
            </div>

            <h1 className="kalkulator-cover-hero__title">
              Kenali Kondisi Tubuh Anda
              <span> dengan Kalkulator Kesehatan Praktis</span>
            </h1>

            <p className="kalkulator-cover-hero__description">
              Hitung Indeks Massa Tubuh (IMT), estimasi kebutuhan kalori harian, serta catat menu konsumsi makanan harian keluarga Loa Duri Ulu.
            </p>

            <div className="kalkulator-cover-hero__actions">
              <button
                type="button"
                className="kalkulator-cover-hero__primary"
                onClick={() =>
                  document.getElementById('calc-imt-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Mulai Hitung IMT
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                className="kalkulator-cover-hero__secondary"
                onClick={() =>
                  document.getElementById('calc-kalori-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                style={{ minHeight: '44px' }}
              >
                Kalkulator Kalori
              </button>
            </div>
          </div>
        </section>

        {/* SECTION KALKULATOR UTAMA */}
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 16px' }}>
          <div className="kalkulator-calc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* KALKULATOR 1: IMT */}
            <div id="calc-imt-card" className="card" style={{ padding: '28px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  1. Hitung Indeks Massa Tubuh (IMT)
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                IMT adalah indikator pengukuran komposisi tubuh untuk mengetahui apakah berat badan Anda berada dalam kategori sehat, kurus, atau berlebih.
              </p>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                  <select value={imiGender} onChange={(e) => setImiGender(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usia (Tahun)</label>
                  <input type="number" placeholder="mis. 28" value={imiUmur} onChange={(e) => setImiUmur(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                  <input type="number" placeholder="mis. 55" value={imiBerat} onChange={(e) => setImiBerat(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                  <input type="number" placeholder="mis. 160" value={imiTinggi} onChange={(e) => setImiTinggi(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '20px', width: '100%', minHeight: '46px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={handleCalcIMT}
              >
                <Calculator size={18} />
                Hitung IMT & Berat Ideal
              </button>

              {/* HASIL KALKULATOR DENGAN TIPOGRAFI JELAS & STATUS HIGHLIGHT */}
              {imiResult && (
                <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    HASIL KALKULATOR IMT
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a' }}>{imiResult.imt}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>kg/m²</span>
                  </div>

                  {/* Status Badge Highlight */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: imiResult.badgeBg,
                      color: imiResult.badgeColor,
                      fontSize: '14px',
                      fontWeight: 800,
                      marginBottom: '14px'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Status: {imiResult.status}
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.5', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    Rentang Berat Badan Ideal Anda: <b style={{ color: '#008080' }}>{imiResult.bbIdealMin} – {imiResult.bbIdealMax} kg</b>
                  </div>
                </div>
              )}
            </div>

            {/* KALKULATOR 2: KALORI & LOG MAKANAN */}
            <div id="calc-kalori-card" className="card" style={{ padding: '28px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Utensils size={18} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  2. Kebutuhan Kalori Harian (TDEE)
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                Hitung jumlah kalori yang dibutuhkan tubuh setiap hari dan pantau asupan gizi harian.
              </p>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                  <select value={kalGender} onChange={(e) => setKalGender(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usia (Tahun)</label>
                  <input type="number" placeholder="mis. 25" value={kalUmur} onChange={(e) => setKalUmur(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                  <input type="number" placeholder="mis. 60" value={kalBerat} onChange={(e) => setKalBerat(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                  <input type="number" placeholder="mis. 165" value={kalTinggi} onChange={(e) => setKalTinggi(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Aktivitas Fisik</label>
                  <select value={kalAktivitas} onChange={(e) => setKalAktivitas(e.target.value)} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                    {Object.entries(ACTIVITY_FACTOR).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: '20px', width: '100%', minHeight: '46px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
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
                    <span style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a' }}>{kalResult.tdee}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>kkal / hari</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', fontWeight: 700 }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '8px' }}>Jaga Berat: {kalResult.tdee} kkal</span>
                    <span style={{ background: '#ffedd5', color: '#c2410c', padding: '6px 12px', borderRadius: '8px' }}>Turun Berat: {kalResult.turun} kkal</span>
                  </div>
                </div>
              )}

              {/* PENCATAT LOG MAKANAN */}
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookPlus size={18} color="#008080" />
                  Simulasi Log Makanan Harian
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <select
                    value={foodPick}
                    onChange={(e) => setFoodPick(e.target.value)}
                    style={{ flex: '2 1 180px', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
                  >
                    {foodDb.map((f) => (
                      <option key={f.id} value={f.id}>{f.nama_makanan} ({f.kalori_per_porsi} kkal)</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={foodQty}
                    onChange={(e) => setFoodQty(parseInt(e.target.value) || 1)}
                    style={{ width: '60px', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddFood}
                    style={{ minHeight: '44px', padding: '0 18px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={16} /> Tambah
                  </button>
                </div>

                {foodLog.length > 0 && (
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {foodLog.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                          <div>
                            <b>{item.nama}</b> <span style={{ color: '#64748b' }}>({item.porsi}x)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 700, color: '#ea580c' }}>{item.totalKalori} kkal</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFood(item.id)}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                              aria-label="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '2px solid #e2e8f0', fontWeight: 800, fontSize: '14px' }}>
                      <span>Total Asupan Kalori:</span>
                      <span style={{ color: '#ea580c', fontSize: '16px' }}>{totalFoodKcal} kkal</span>
                    </div>
                  </div>
                )}

                {/* CTA LOGIN UNTUK MENYIMPAN RIWAYAT MAKANAN */}
                <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '13px', color: '#0f766e', lineHeight: '1.4' }}>
                    Ingin menyimpan riwayat log makanan dan memantau status gizi keluarga secara permanen?
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => onNavigate && onNavigate('login')}
                    style={{
                      minHeight: '44px',
                      width: '100%',
                      borderRadius: '10px',
                      color: 'var(--primary-teal, #008080)',
                      borderColor: 'var(--primary-teal, #008080)',
                      backgroundColor: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <LogIn size={16} />
                    Masuk Akun Warga untuk Simpan Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}