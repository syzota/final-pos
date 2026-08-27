import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/kalkulator.css';
import caltBg from '../assets/images/common/calt.jpg';

// === DATABASE PINTAR BAWAAN SISTEM ===
const DATABASE_PINTAR = [
  { id: 'db_1', nama_makanan: 'Nasi Putih (1 centong/100g)', kalori_per_porsi: 130 },
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
  { id: 'db_14', nama_makanan: 'Kopi Manis (1 cangkir)', kalori_per_porsi: 70 },
  { id: 'db_15', nama_makanan: 'Pisang Goreng (1 potong)', kalori_per_porsi: 140 },
  { id: 'db_16', nama_makanan: 'Telur Mata Sapi (1 butir)', kalori_per_porsi: 92 },
  { id: 'db_17', nama_makanan: 'Telur Rebus (1 butir)', kalori_per_porsi: 77 },
  { id: 'db_18', nama_makanan: 'Susu Sapi (1 gelas)', kalori_per_porsi: 146 },
  { id: 'db_19', nama_makanan: 'Roti Tawar (1 lembar)', kalori_per_porsi: 75 },
  { id: 'db_20', nama_makanan: 'Mie Instan Goreng (1 bungkus)', kalori_per_porsi: 380 },
  { id: 'db_21', nama_makanan: 'Mie Instan Kuah (1 bungkus)', kalori_per_porsi: 330 },
  { id: 'db_22', nama_makanan: 'Bubur Ayam (1 mangkuk)', kalori_per_porsi: 372 },
  { id: 'db_23', nama_makanan: 'Nasi Padang (1 porsi komplit)', kalori_per_porsi: 680 },
  { id: 'db_24', nama_makanan: 'Pempek (1 porsi)', kalori_per_porsi: 390 },
  { id: 'db_25', nama_makanan: 'Sayur Sop (1 mangkuk)', kalori_per_porsi: 70 },
];

const ACTIVITY_FACTOR = {
  sangat_ringan: { label: 'Sangat Ringan (jarang olahraga, kerja duduk)', factor: 1.2 },
  ringan: { label: 'Ringan (olahraga 1–3 hari/minggu)', factor: 1.375 },
  sedang: { label: 'Sedang (olahraga 3–5 hari/minggu)', factor: 1.55 },
  berat: { label: 'Berat (olahraga 6–7 hari/minggu)', factor: 1.725 },
  sangat_berat: { label: 'Sangat Berat (aktivitas fisik/kerja fisik berat)', factor: 1.9 },
};

export default function KalkulatorKesehatan({ activePage, onNavigate, onDarurat }) {
  // === CALCULATOR 1: IMT & BERAT BADAN IDEAL STATE ===
  const [imiGender, setImiGender] = useState('Perempuan');
  const [imiUmur, setImiUmur] = useState('');
  const [imiBerat, setImiBerat] = useState('');
  const [imiTinggi, setImiTinggi] = useState('');
  const [imiResult, setImiResult] = useState(null);

  // === CALCULATOR 2: KALORI & LOG MAKANAN STATE ===
  const [kalGender, setKalGender] = useState('Perempuan');
  const [kalUmur, setKalUmur] = useState('');
  const [kalBerat, setKalBerat] = useState('');
  const [kalTinggi, setKalTinggi] = useState('');
  const [kalAktivitas, setKalAktivitas] = useState('sedang');
  const [kalResult, setKalResult] = useState(null);

  // FOOD DB STATE
  const [foodDb, setFoodDb] = useState([]);
  const [foodPick, setFoodPick] = useState('');
  const [foodQty, setFoodQty] = useState(1);
  const [foodLog, setFoodLog] = useState([]);

  useEffect(() => {
    // Menarik menu tambahan dari Kader, lalu digabungkan dengan Database Pintar
    axios.get('/api/makanan')
      .then(res => {
        // Konversi ID dari Laravel jadi string agar aman saat digabung
        const dbKader = res.data.data.map(item => ({
          id: item.id.toString(),
          nama_makanan: item.nama_makanan + ' (Menu Posyandu)',
          kalori_per_porsi: item.kalori_per_porsi
        }));

        // Gabungkan Menu Posyandu (Kader) di urutan atas, lalu Menu Bawaan Sistem di bawahnya
        const combinedFood = [...dbKader, ...DATABASE_PINTAR];
        setFoodDb(combinedFood);

        if (combinedFood.length > 0) {
          setFoodPick(combinedFood[0].id);
        }
      })
      .catch(err => {
        console.error("Gagal memuat daftar makanan dari server", err);
        // Fallback: Jika server mati, Warga tetap bisa pakai Database Pintar!
        setFoodDb(DATABASE_PINTAR);
        setFoodPick(DATABASE_PINTAR[0].id);
      });
  }, []);

  const handleCalcIMT = () => {
    const bb = parseFloat(imiBerat);
    const tb = parseFloat(imiTinggi);
    if (!bb || !tb || tb <= 0) return;

    const imt = bb / Math.pow(tb / 100, 2);
    let status = 'Normal';
    let badgeBg = 'var(--green-bg)';
    let badgeColor = 'var(--green-deep)';

    if (imt < 17.0) {
      status = 'Sangat Kurus';
      badgeBg = '#fef2f2';
      badgeColor = '#b91c1c';
    } else if (imt < 18.5) {
      status = 'Kurus';
      badgeBg = '#fffbeb';
      badgeColor = '#b45309';
    } else if (imt <= 25.0) {
      status = 'Normal';
      badgeBg = 'var(--green-bg)';
      badgeColor = 'var(--green-deep)';
    } else if (imt <= 27.0) {
      status = 'Gemuk (Kelebihan BB)';
      badgeBg = '#fffbeb';
      badgeColor = '#b45309';
    } else {
      status = 'Obesitas';
      badgeBg = '#fef2f2';
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
    // Cari data makanan gabungan berdasarkan ID
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
        {/* =========================================
            HERO KALKULATOR
            Background: assets/images/calt.jpg
            ========================================= */}
        <section className="kalkulator-cover-hero">

          <div className="kalkulator-cover-hero__media">
            <img
              src={caltBg}
              alt=""
              aria-hidden="true"
              className="kalkulator-cover-hero__image"
            />
            <div className="kalkulator-cover-hero__overlay"></div>
            <div className="kalkulator-cover-hero__gradient"></div>
          </div>

          <div className="kalkulator-cover-hero__content">

            <div className="kalkulator-cover-hero__badge">
              <i className="bi bi-heart-pulse-fill"></i>
              <span>Alat Bantu Kesehatan Mandiri</span>
            </div>

            <h1 className="kalkulator-cover-hero__title">
              Kenali Kondisi Tubuh,
              <span> Mulai dari Perhitungan Sederhana</span>
            </h1>

            <p className="kalkulator-cover-hero__description">
              Hitung Indeks Massa Tubuh (IMT), estimasi berat badan ideal,
              kebutuhan kalori harian, serta catat asupan makanan Anda
              dalam satu halaman yang mudah digunakan.
            </p>

            <div className="kalkulator-cover-hero__actions">

              <button
                type="button"
                className="kalkulator-cover-hero__primary"
                onClick={() =>
                  document
                    .getElementById('calc-imt-card')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                Mulai Hitung IMT
                <span>
                  <i className="bi bi-arrow-down"></i>
                </span>
              </button>

              <button
                type="button"
                className="kalkulator-cover-hero__secondary"
                onClick={() =>
                  document
                    .getElementById('calc-kalori-card')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              >
                Kalkulator Kalori
              </button>

            </div>

            <div className="kalkulator-cover-hero__features">

              <div className="kalkulator-cover-hero__feature">
                <i className="bi bi-calculator"></i>
                <span>IMT &amp; BB Ideal</span>
              </div>

              <div className="kalkulator-cover-hero__feature">
                <i className="bi bi-fire"></i>
                <span>Kebutuhan Kalori</span>
              </div>

              <div className="kalkulator-cover-hero__feature">
                <i className="bi bi-journal-check"></i>
                <span>Log Makanan</span>
              </div>

            </div>

          </div>

          <div className="kalkulator-cover-hero__note">
            <i className="bi bi-info-circle-fill"></i>
            <p>
              Hasil kalkulator merupakan informasi awal dan tidak menggantikan
              pemeriksaan atau diagnosis dari tenaga kesehatan.
            </p>
          </div>

        </section>


        <div className="kalkulator-section-title">Kalkulator Utama</div>

        <div className="kalkulator-calc-grid">
          {/* === CALCULATOR 1: IMT === */}
          <div id="calc-imt-card" className="card">
            <div className="section-head">
              <h3><i className="bi bi-activity me-2" style={{ color: 'var(--violet-deep)' }}></i>1. Kalkulator IMT &amp; Berat Badan Ideal</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
              Hitung Indeks Massa Tubuh (IMT) serta rentang berat badan ideal untuk dewasa berdasarkan kriteria WHO.
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label>Jenis Kelamin</label>
                <select value={imiGender} onChange={(e) => setImiGender(e.target.value)}>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>
              <div className="form-field">
                <label>Usia (tahun)</label>
                <input type="number" placeholder="mis. 30" value={imiUmur} onChange={(e) => setImiUmur(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Berat Badan (kg)</label>
                <input type="number" placeholder="mis. 55" value={imiBerat} onChange={(e) => setImiBerat(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Tinggi Badan (cm)</label>
                <input type="number" placeholder="mis. 160" value={imiTinggi} onChange={(e) => setImiTinggi(e.target.value)} />
              </div>
            </div>

            <button className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }} onClick={handleCalcIMT}>
              <i className="bi bi-calculator me-2"></i>Hitung IMT &amp; BB Ideal
            </button>

            {imiResult && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container-high)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>Hasil Indeks Massa Tubuh (IMT):</span>
                  <span className="badge" style={{ background: imiResult.badgeBg, color: imiResult.badgeColor, fontWeight: 700 }}>{imiResult.status}</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--violet-deep)', marginBottom: '8px' }}>
                  {imiResult.imt} <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>kg/m²</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--ink)', fontWeight: 600 }}>
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--green-deep)' }}></i>
                  Rentang Berat Badan Ideal Anda: <b>{imiResult.bbIdealMin} – {imiResult.bbIdealMax} kg</b>
                </div>
              </div>
            )}
          </div>

          {/* === CALCULATOR 2: KALORI === */}
          <div id="calc-kalori-card" className="card">
            <div className="section-head">
              <h3><i className="bi bi-egg-fried me-2" style={{ color: 'var(--orange-deep)' }}></i>2. Kalkulator Kalori &amp; Log Makanan</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
              Hitung kebutuhan kalori harian (TDEE) Anda dan catat menu makanan harian untuk menjaga pola makan seimbang.
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label>Jenis Kelamin</label>
                <select value={kalGender} onChange={(e) => setKalGender(e.target.value)}>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>
              <div className="form-field">
                <label>Usia (tahun)</label>
                <input type="number" placeholder="mis. 25" value={kalUmur} onChange={(e) => setKalUmur(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Berat Badan (kg)</label>
                <input type="number" placeholder="mis. 60" value={kalBerat} onChange={(e) => setKalBerat(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Tinggi Badan (cm)</label>
                <input type="number" placeholder="mis. 165" value={kalTinggi} onChange={(e) => setKalTinggi(e.target.value)} />
              </div>
              <div className="form-field full">
                <label>Tingkat Aktivitas Fisik</label>
                <select value={kalAktivitas} onChange={(e) => setKalAktivitas(e.target.value)}>
                  {Object.entries(ACTIVITY_FACTOR).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }} onClick={handleCalcKalori}>
              <i className="bi bi-fire me-2"></i>Hitung Kebutuhan Kalori
            </button>

            {kalResult && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'var(--surface-container-low)', border: '1px solid var(--surface-container-high)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600 }}>BMR (Metabolisme Dasar):</span>
                    <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>{kalResult.bmr} kcal</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600 }}>Kebutuhan Kalori Harian (TDEE):</span>
                    <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--violet-deep)', margin: 0 }}>{kalResult.tdee} kcal</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11.5px', fontWeight: 600 }}>
                  <span className="badge badge-green">Menjaga BB: {kalResult.tdee} kcal</span>
                  <span className="badge badge-orange">Turun BB: {kalResult.turun} kcal</span>
                  <span className="badge badge-orange">Naik BB: {kalResult.naik} kcal</span>
                </div>
              </div>
            )}

            {/* Pencatat Log Makanan (Menarik dari DB Gabungan) */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'var(--ink)' }}>
                <i className="bi bi-journal-plus me-1" style={{ color: 'var(--orange-deep)' }}></i>
                Pencatat Log Makanan Harian
              </div>

              <div className="food-log-input-group">
                <select className="food-select" value={foodPick} onChange={(e) => setFoodPick(e.target.value)}>
                  {foodDb.length > 0 ? (
                    foodDb.map((f) => (
                      <option key={f.id} value={f.id}>{f.nama_makanan} ({f.kalori_per_porsi} kcal)</option>
                    ))
                  ) : (
                    <option value="">Memuat database makanan...</option>
                  )}
                </select>
                <input type="number" min="1" max="10" className="food-qty-input" value={foodQty} onChange={(e) => setFoodQty(parseInt(e.target.value) || 1)} />
                <button className="btn btn-sm btn-violet food-add-btn" onClick={handleAddFood}>
                  <i className="bi bi-plus-lg me-1"></i>Tambah
                </button>
              </div>

              {foodLog.length > 0 && (
                <div className="table-responsive">
                  <table className="table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr><th>Menu Makanan</th><th>Porsi</th><th>Kalori</th><th style={{textAlign: 'right'}}>Aksi</th></tr>
                    </thead>
                    <tbody>
                      {foodLog.map((item) => (
                        <tr key={item.id}>
                          <td><b>{item.nama}</b></td>
                          <td>{item.porsi}x</td>
                          <td style={{ color: 'var(--orange-deep)' }}><b>{item.totalKalori} kcal</b></td>
                          <td style={{textAlign: 'right'}}>
                            <button style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 }} onClick={() => handleRemoveFood(item.id)}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: '12px', padding: '12px', background: 'var(--surface-container-low)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>Total Kalori Masuk:</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--orange-deep)' }}>{totalFoodKcal} kcal</span>
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