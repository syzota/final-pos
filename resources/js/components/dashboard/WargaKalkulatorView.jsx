import React, { useState } from 'react';
import { FOOD_DB } from '../../utils/mockData';

const CALC_CATEGORIES = {
  hamil: { label: 'Ibu Hamil', tools: ['usia_hpl', 'janin', 'bb_hamil', 'imt_hamil'] },
  balita: { label: 'Bayi & Balita', tools: ['status_gizi', 'kms', 'imunisasi', 'kpsp'] },
  umum: { label: 'Umum', tools: ['imt_ideal', 'kalori'] },
};

const CALC_TOOL_LABELS = {
  usia_hpl: 'Usia Kehamilan & HPL',
  janin: 'Perkembangan Janin',
  bb_hamil: 'Kenaikan BB Ibu Hamil',
  imt_hamil: 'IMT & LILA Ibu Hamil',
  status_gizi: 'Status Gizi Bayi/Balita',
  kms: 'KMS Digital (Tren)',
  imunisasi: 'Jadwal Imunisasi',
  kpsp: 'Tumbuh Kembang (KPSP)',
  imt_ideal: 'IMT & Berat Badan Ideal',
  kalori: 'Kalkulator Kalori',
};

const JANIN_DATA = [
  { min: 1, max: 4, desc: 'Sel telur dibuahi dan mulai menempel di dinding rahim.', ukuran: 'sebesar biji wijen' },
  { min: 5, max: 8, desc: 'Jantung mulai berdetak dan organ dasar mulai terbentuk.', ukuran: 'sebesar kacang polong' },
  { min: 9, max: 12, desc: 'Wajah, jari tangan & kaki mulai terbentuk jelas.', ukuran: 'sebesar buah lemon' },
  { min: 13, max: 16, desc: 'Janin mulai bisa bergerak, jenis kelamin mulai terlihat lewat USG.', ukuran: 'sebesar buah alpukat' },
  { min: 17, max: 20, desc: 'Gerakan janin mulai terasa oleh ibu, rambut halus mulai tumbuh.', ukuran: 'sebesar buah pisang' },
  { min: 21, max: 24, desc: 'Indera pendengaran berkembang, janin mulai merespons suara.', ukuran: 'sebesar buah jagung' },
  { min: 25, max: 28, desc: 'Mata sudah bisa membuka & menutup, paru-paru terus berkembang.', ukuran: 'sebesar buah terong' },
  { min: 29, max: 32, desc: 'Tulang mengeras, berat badan janin bertambah cepat.', ukuran: 'sebesar kelapa muda' },
  { min: 33, max: 36, desc: 'Posisi janin mulai turun ke arah panggul bersiap lahir.', ukuran: 'sebesar buah nanas' },
  { min: 37, max: 42, desc: 'Janin dianggap cukup bulan dan siap dilahirkan kapan saja.', ukuran: 'sebesar semangka kecil' },
];

const ACTIVITY_FACTOR = {
  sangat_ringan: { label: 'Sangat Ringan (jarang olahraga, kerja duduk)', factor: 1.2 },
  ringan: { label: 'Ringan (olahraga 1–3 hari/minggu)', factor: 1.375 },
  sedang: { label: 'Sedang (olahraga 3–5 hari/minggu)', factor: 1.55 },
  berat: { label: 'Berat (olahraga 6–7 hari/minggu)', factor: 1.725 },
  sangat_berat: { label: 'Sangat Berat (aktivitas fisik/kerja fisik berat)', factor: 1.9 },
};

const IMUNISASI_SCHEDULE = [
  { bulan: 0, jenis: 'HB-0' },
  { bulan: 1, jenis: 'BCG, Polio 1' },
  { bulan: 2, jenis: 'DPT-HB-Hib 1, Polio 2, PCV 1' },
  { bulan: 3, jenis: 'DPT-HB-Hib 2, Polio 3, PCV 2' },
  { bulan: 4, jenis: 'DPT-HB-Hib 3, Polio 4, IPV' },
  { bulan: 9, jenis: 'Campak-Rubela (MR)' },
  { bulan: 18, jenis: 'DPT-HB-Hib Lanjutan, MR Lanjutan' },
];

const KPSP_CHECKPOINTS = [3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72];

export default function WargaKalkulatorView() {
  const [currentCat, setCurrentCat] = useState('hamil');
  const [currentTool, setCurrentTool] = useState('usia_hpl');

  // Tool 1: Usia HPL
  const [hpht, setHpht] = useState('');

  // Tool 2: Janin
  const [janinMinggu, setJaninMinggu] = useState('');

  // Tool 3: BB Hamil
  const [bbhSebelum, setBbhSebelum] = useState('');
  const [bbhTinggi, setBbhTinggi] = useState('');
  const [bbhMinggu, setBbhMinggu] = useState('');
  const [bbhSekarang, setBbhSekarang] = useState('');

  // Tool 4: IMT & LILA Hamil
  const [ihBerat, setIhBerat] = useState('');
  const [ihTinggi, setIhTinggi] = useState('');
  const [ihLila, setIhLila] = useState('');

  // Tool 5: Status Gizi Balita
  const [sgUmur, setSgUmur] = useState('');
  const [sgGender, setSgGender] = useState('Perempuan');
  const [sgBerat, setSgBerat] = useState('');
  const [sgTinggi, setSgTinggi] = useState('');

  // Tool 6: KMS Digital
  const [kmsLog, setKmsLog] = useState([
    { bulan: 'Mei 2026', bb: 9.8 },
    { bulan: 'Jun 2026', bb: 10.0 },
    { bulan: 'Jul 2026', bb: 10.2 }
  ]);
  const [kmsBulanInput, setKmsBulanInput] = useState('');
  const [kmsBbInput, setKmsBbInput] = useState('');

  // Tool 7: Imunisasi
  const [imunTgl, setImunTgl] = useState('');

  // Tool 8: KPSP
  const [kpspUmur, setKpspUmur] = useState('');
  const [kpspAnswers, setKpspAnswers] = useState({});
  const [kpspResult, setKpspResult] = useState(null);

  // Tool 9: IMT Ideal
  const [imiGender, setImiGender] = useState('Perempuan');
  const [imiUmur, setImiUmur] = useState('');
  const [imiBerat, setImiBerat] = useState('');
  const [imiTinggi, setImiTinggi] = useState('');

  // Tool 10: Kalori Panel
  const [kalGender, setKalGender] = useState('Perempuan');
  const [kalUmur, setKalUmur] = useState('');
  const [kalBerat, setKalBerat] = useState('');
  const [kalTinggi, setKalTinggi] = useState('');
  const [kalAktivitas, setKalAktivitas] = useState('sedang');
  const [foodPick, setFoodPick] = useState(FOOD_DB[0]?.id || 'f01');
  const [foodQty, setFoodQty] = useState(1);
  const [foodLog, setFoodLog] = useState([]);

  const handleSelectCat = (cat) => {
    setCurrentCat(cat);
    const tools = CALC_CATEGORIES[cat].tools;
    setCurrentTool(tools[0]);
  };

  // --- CALCULATION LOGIC ---
  // Tool 1
  const getHplResult = () => {
    if (!hpht) return { usia: '—', tanggal: '—' };
    const date = new Date(hpht);
    if (isNaN(date.getTime())) return { usia: 'Tanggal tidak valid', tanggal: '—' };
    const today = new Date();
    const diffDays = Math.floor((today - date) / 86400000);
    if (diffDays < 0) return { usia: 'Tanggal belum terjadi', tanggal: '—' };
    const minggu = Math.floor(diffDays / 7);
    const hari = diffDays % 7;
    const hpl = new Date(date.getTime() + 280 * 86400000);
    return {
      usia: `${minggu} minggu ${hari} hari`,
      tanggal: hpl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  // Tool 2
  const getJaninResult = () => {
    const w = parseInt(janinMinggu);
    if (!w) return { ukuran: '—', desc: 'Isi usia kehamilan untuk melihat perkiraan perkembangan janin.' };
    const data = JANIN_DATA.find(d => w >= d.min && w <= d.max);
    if (data) return { ukuran: `Usia ${w} minggu — ${data.ukuran}`, desc: data.desc };
    return { ukuran: '—', desc: 'Isi usia kehamilan 1–42 minggu untuk melihat perkiraan.' };
  };

  // Tool 3
  const getBBHamilResult = () => {
    const s = parseFloat(bbhSebelum), t = parseFloat(bbhTinggi), m = parseFloat(bbhMinggu), sek = parseFloat(bbhSekarang);
    if (!s || !t || !m || !sek) return { result: '—', label: 'Isi semua data di atas untuk melihat hasil.' };
    const imt = s / Math.pow(t / 100, 2);
    let kat, range;
    if (imt < 18.5) { kat = 'Kurus (sebelum hamil)'; range = [12.5, 18]; }
    else if (imt < 25) { kat = 'Normal (sebelum hamil)'; range = [11.5, 16]; }
    else if (imt < 30) { kat = 'Gemuk (sebelum hamil)'; range = [7, 11.5]; }
    else { kat = 'Obesitas (sebelum hamil)'; range = [5, 9]; }
    const targetMid = (range[0] + range[1]) / 2;
    const expectedSoFar = targetMid * Math.min(m, 40) / 40;
    const actualGain = sek - s;
    let status;
    if (actualGain < expectedSoFar - 2) status = 'Di bawah target — konsultasikan ke bidan/Posyandu';
    else if (actualGain > expectedSoFar + 2) status = 'Di atas target — konsultasikan ke bidan/Posyandu';
    else status = 'Sesuai target kenaikan BB kehamilan';
    return {
      result: `Naik ${actualGain.toFixed(1)} kg`,
      label: `${kat} · Target total kehamilan ${range[0]}–${range[1]} kg · ${status}`
    };
  };

  // Tool 4
  const getImtHamilResult = () => {
    const b = parseFloat(ihBerat), t = parseFloat(ihTinggi), l = parseFloat(ihLila);
    if (!b || !t) return { result: '—', lilaNote: '' };
    const imt = b / Math.pow(t / 100, 2);
    let kat = 'Normal';
    if (imt < 18.5) kat = 'Kurus';
    else if (imt >= 25) kat = 'Gemuk';
    let lilaNote = '';
    if (l) {
      lilaNote = l < 23.5 ? `LILA ${l} cm — indikasi risiko KEK, sebaiknya periksa ke Posyandu/bidan.` : `LILA ${l} cm — dalam rentang normal.`;
    }
    return { result: `${imt.toFixed(1)} — ${kat}`, lilaNote };
  };

  // Tool 5
  const getStatusGiziResult = () => {
    const b = parseFloat(sgBerat), t = parseFloat(sgTinggi), u = parseFloat(sgUmur);
    if (!b || !t) return { result: '—', extra: '' };
    return { result: 'Normal', extra: u ? `Perkiraan berdasarkan umur ${u} bulan.` : '' };
  };

  // Tool 6: KMS
  const addKmsPoint = () => {
    if (!kmsBulanInput.trim() || !parseFloat(kmsBbInput)) return;
    setKmsLog(prev => [...prev, { bulan: kmsBulanInput.trim(), bb: parseFloat(kmsBbInput) }]);
    setKmsBulanInput('');
    setKmsBbInput('');
  };
  const removeKmsPoint = (idx) => {
    setKmsLog(prev => prev.filter((_, i) => i !== idx));
  };
  const getKmsTrend = () => {
    if (kmsLog.length < 2) return 'Tambahkan minimal 2 titik data untuk melihat tren.';
    const delta = kmsLog[kmsLog.length - 1].bb - kmsLog[kmsLog.length - 2].bb;
    if (delta > 0) return `Tren naik ${delta.toFixed(1)} kg dari bulan sebelumnya.`;
    if (delta < 0) return `Tren turun ${Math.abs(delta).toFixed(1)} kg dari bulan sebelumnya — perhatikan asupan gizi.`;
    return 'Berat badan stagnan dari bulan sebelumnya.';
  };

  // Tool 7: Imunisasi
  const getImunisasiRows = () => {
    if (!imunTgl) return [];
    const lahir = new Date(imunTgl);
    if (isNaN(lahir.getTime())) return [];
    const today = new Date();
    return IMUNISASI_SCHEDULE.map(item => {
      const tgl = new Date(lahir);
      tgl.setMonth(tgl.getMonth() + item.bulan);
      const isPast = today >= tgl;
      return {
        usiaStr: item.bulan === 0 ? 'Saat lahir' : `${item.bulan} bulan`,
        jenis: item.jenis,
        tglStr: tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: isPast ? 'Sudah Waktunya' : 'Akan Datang',
        isPast
      };
    });
  };

  // Tool 8: KPSP
  const nearestKpspCheckpoint = (bulan) => {
    return KPSP_CHECKPOINTS.reduce((prev, curr) => Math.abs(curr - bulan) < Math.abs(prev - bulan) ? curr : prev);
  };
  const handleKpspAnswer = (idx, val) => {
    setKpspAnswers(prev => ({ ...prev, [idx]: val }));
  };
  const calcKpspScore = () => {
    let ya = 0, count = 0;
    for (let i = 0; i < 10; i++) {
      if (kpspAnswers[i]) {
        count++;
        if (kpspAnswers[i] === 'ya') ya++;
      }
    }
    if (count < 10) {
      setKpspResult({ type: 'warning', text: 'Jawab semua pertanyaan untuk melihat hasil skrining.' });
      return;
    }
    if (ya >= 9) setKpspResult({ type: 'success', text: `${ya}/10 jawaban "Ya" — Sesuai: perkembangan anak sesuai tahapan usianya.` });
    else if (ya >= 7) setKpspResult({ type: 'warning', text: `${ya}/10 jawaban "Ya" — Meragukan: perlu stimulasi lebih & pemeriksaan ulang 2 minggu.` });
    else setKpspResult({ type: 'danger', text: `${ya}/10 jawaban "Ya" — Kemungkinan Penyimpangan: rujuk ke tenaga kesehatan/Posyandu.` });
  };

  // Tool 9: IMT Ideal
  const getImtIdealResult = () => {
    const b = parseFloat(imiBerat), t = parseFloat(imiTinggi);
    if (!b || !t) return { result: '—', ideal: '—' };
    const imt = b / Math.pow(t / 100, 2);
    let kat = 'Normal';
    if (imt < 18.5) kat = 'Kurus';
    else if (imt >= 25) kat = 'Gemuk';
    const tb = t / 100;
    const minIdeal = (18.5 * tb * tb).toFixed(1);
    const maxIdeal = (24.9 * tb * tb).toFixed(1);
    return { result: `${imt.toFixed(1)} — ${kat}`, ideal: `${minIdeal} – ${maxIdeal} kg` };
  };

  // Tool 10: TDEE & Kalori
  const getTDEE = () => {
    const u = parseFloat(kalUmur), b = parseFloat(kalBerat), t = parseFloat(kalTinggi);
    if (!u || !b || !t) return 0;
    const s = kalGender === 'Laki-laki' ? 5 : -161;
    const bmr = 10 * b + 6.25 * t - 5 * u + s;
    return Math.round(bmr * (ACTIVITY_FACTOR[kalAktivitas]?.factor || 1.55));
  };
  const addFoodItem = () => {
    const food = FOOD_DB.find(f => f.id === foodPick);
    if (!food) return;
    const q = Math.max(1, parseInt(foodQty) || 1);
    setFoodLog(prev => [...prev, { nama: food.nama, qty: q, kaloriSatuan: food.kalori }]);
  };
  const removeFoodItem = (idx) => {
    setFoodLog(prev => prev.filter((_, i) => i !== idx));
  };
  const getTotalKaloriLog = () => foodLog.reduce((sum, f) => sum + f.qty * f.kaloriSatuan, 0);

  const colors = ['cyan', 'orange', 'magenta', 'green', 'violet'];

  return (
    <>
      <div className="callout" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="bi bi-info-circle-fill" style={{ fontSize: '16px' }}></i>
        <span>Kalkulator mandiri, lebih lengkap dari kalkulator publik — hasil hanya membantu interpretasi awal, bukan pengganti penilaian ahli gizi/tenaga medis/bidan. Input tidak disimpan ke server.</span>
      </div>

      {/* CATEGORY TABS */}
      <div className="tabs" style={{ marginBottom: '16px' }}>
        {Object.entries(CALC_CATEGORIES).map(([catKey, catVal]) => (
          <button
            key={catKey}
            className={`tab-btn ${currentCat === catKey ? 'active' : ''}`}
            onClick={() => handleSelectCat(catKey)}
          >
            {catVal.label}
          </button>
        ))}
      </div>

      {/* TOOL CHIPS */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {CALC_CATEGORIES[currentCat].tools.map((toolKey, idx) => (
          <div
            key={toolKey}
            className={`target-chip ${colors[idx % colors.length]} ${currentTool === toolKey ? 'active' : ''}`}
            onClick={() => setCurrentTool(toolKey)}
            style={{ cursor: 'pointer' }}
          >
            <span className="dot"></span>
            {CALC_TOOL_LABELS[toolKey]}
          </div>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div>
        {/* 1. Usia HPL */}
        {currentTool === 'usia_hpl' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="section-head"><h3>Usia Kehamilan &amp; HPL</h3></div>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Hari Pertama Haid Terakhir (HPHT)</label>
                  <input type="date" value={hpht} onChange={e => setHpht(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--cyan-bg)', border: 'none' }}>
              <div className="section-head"><h3 style={{ color: 'var(--cyan-deep)' }}><i className="bi bi-calculator me-1"></i>Hasil</h3></div>
              <div className="result-box">
                <div>
                  <div className="r-num">{getHplResult().usia}</div>
                  <div className="r-label">Usia kehamilan saat ini</div>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '10px' }}>
                Perkiraan Hari Lahir (HPL): <span style={{ color: 'var(--cyan-deep)' }}>{getHplResult().tanggal}</span>
              </p>
              <p style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600, marginTop: '6px' }}>
                Dihitung dengan Rumus Naegele (HPHT + 280 hari) — bukan pengganti pemeriksaan USG oleh bidan/dokter.
              </p>
            </div>
          </div>
        )}

        {/* 2. Janin */}
        {currentTool === 'janin' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="section-head"><h3>Perkembangan Janin</h3></div>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Usia Kehamilan Saat Ini (minggu)</label>
                  <input type="number" placeholder="mis. 20" min="1" max="42" value={janinMinggu} onChange={e => setJaninMinggu(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--magenta-bg)', border: 'none' }}>
              <div className="section-head"><h3 style={{ color: 'var(--magenta-deep)' }}><i className="bi bi-heart-fill me-1"></i>Perkiraan Perkembangan</h3></div>
              <div className="result-box">
                <div>
                  <div className="r-num">{getJaninResult().ukuran}</div>
                  <div className="r-label">{getJaninResult().desc}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Kenaikan BB Hamil */}
        {currentTool === 'bb_hamil' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="section-head"><h3>Kenaikan BB Ibu Hamil</h3></div>
              <div className="form-grid">
                <div className="form-field"><label>BB Sebelum Hamil (kg)</label><input type="number" placeholder="55" value={bbhSebelum} onChange={e => setBbhSebelum(e.target.value)} /></div>
                <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" placeholder="156" value={bbhTinggi} onChange={e => setBbhTinggi(e.target.value)} /></div>
                <div className="form-field"><label>Usia Kehamilan (minggu)</label><input type="number" placeholder="20" min="1" max="42" value={bbhMinggu} onChange={e => setBbhMinggu(e.target.value)} /></div>
                <div className="form-field"><label>BB Saat Ini (kg)</label><input type="number" placeholder="62" value={bbhSekarang} onChange={e => setBbhSekarang(e.target.value)} /></div>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--green-bg)', border: 'none' }}>
              <div className="section-head"><h3 style={{ color: 'var(--green-deep)' }}><i className="bi bi-calculator me-1"></i>Hasil</h3></div>
              <div className="result-box">
                <div>
                  <div className="r-num">{getBBHamilResult().result}</div>
                  <div className="r-label">{getBBHamilResult().label}</div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600, marginTop: '10px' }}>
                Acuan rentang total kenaikan BB kehamilan (pedoman IOM) — bukan pengganti penilaian bidan/dokter kandungan.
              </p>
            </div>
          </div>
        )}

        {/* 4. IMT & LILA Hamil */}
        {currentTool === 'imt_hamil' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="section-head"><h3>IMT &amp; LILA Ibu Hamil</h3></div>
              <div className="form-grid">
                <div className="form-field"><label>Berat Badan (kg)</label><input type="number" placeholder="58" value={ihBerat} onChange={e => setIhBerat(e.target.value)} /></div>
                <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" placeholder="156" value={ihTinggi} onChange={e => setIhTinggi(e.target.value)} /></div>
                <div className="form-field full"><label>Lingkar Lengan Atas / LILA (cm)</label><input type="number" placeholder="24.5" value={ihLila} onChange={e => setIhLila(e.target.value)} /></div>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--cyan-bg)', border: 'none' }}>
              <div className="section-head"><h3 style={{ color: 'var(--cyan-deep)' }}><i className="bi bi-calculator me-1"></i>Hasil IMT</h3></div>
              <div className="result-box">
                <div>
                  <div className="r-num">{getImtHamilResult().result}</div>
                  <div className="r-label">IMT — bukan pengganti penilaian ahli gizi</div>
                </div>
              </div>
              {getImtHamilResult().lilaNote && (
                <p style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--cyan-deep)', marginTop: '10px' }}>
                  {getImtHamilResult().lilaNote}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 5. Status Gizi Balita */}
        {currentTool === 'status_gizi' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="section-head"><h3>Status Gizi — Bayi &amp; Balita</h3></div>
              <div className="form-grid">
                <div className="form-field"><label>Umur (bulan)</label><input type="number" placeholder="18" value={sgUmur} onChange={e => setSgUmur(e.target.value)} /></div>
                <div className="form-field">
                  <label>Jenis Kelamin</label>
                  <select value={sgGender} onChange={e => setSgGender(e.target.value)}>
                    <option>Perempuan</option>
                    <option>Laki-laki</option>
                  </select>
                </div>
                <div className="form-field"><label>Berat Badan (kg)</label><input type="number" placeholder="10.2" value={sgBerat} onChange={e => setSgBerat(e.target.value)} /></div>
                <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" placeholder="78" value={sgTinggi} onChange={e => setSgTinggi(e.target.value)} /></div>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--cyan-bg)', border: 'none' }}>
              <div className="section-head"><h3 style={{ color: 'var(--cyan-deep)' }}><i className="bi bi-calculator me-1"></i>Hasil Status Gizi</h3></div>
              <div className="result-box">
                <div>
                  <div className="r-num">{getStatusGiziResult().result}</div>
                  <div className="r-label">Status Gizi (BB/TB) — bukan pengganti penilaian ahli gizi</div>
                </div>
              </div>
              {getStatusGiziResult().extra && (
                <p style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--cyan-deep)', marginTop: '10px' }}>{getStatusGiziResult().extra}</p>
              )}
            </div>
          </div>
        )}

        {/* 6. KMS Digital */}
        {currentTool === 'kms' && (
          <div className="card">
            <div className="section-head"><h3>KMS Digital — Tren Pertumbuhan</h3></div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="form-field" style={{ flex: '1 1 160px', marginBottom: 0 }}>
                <label>Bulan</label>
                <input type="text" placeholder="mis. Jul 2026" value={kmsBulanInput} onChange={e => setKmsBulanInput(e.target.value)} />
              </div>
              <div className="form-field" style={{ flex: '1 1 140px', marginBottom: 0 }}>
                <label>Berat Badan (kg)</label>
                <input type="number" placeholder="10.2" value={kmsBbInput} onChange={e => setKmsBbInput(e.target.value)} />
              </div>
              <button className="btn btn-violet" style={{ height: '38px' }} onClick={addKmsPoint}>Tambah Titik Data</button>
            </div>

            {/* KMS Chart */}
            {kmsLog.length > 0 && (
              <div style={{ marginTop: '18px' }}>
                {(() => {
                  const w = 560, h = 160, pad = 30;
                  const maxBB = Math.max(...kmsLog.map(p => p.bb)) * 1.15;
                  const minBB = Math.min(...kmsLog.map(p => p.bb)) * 0.85;
                  const stepX = kmsLog.length > 1 ? (w - 2 * pad) / (kmsLog.length - 1) : 0;
                  const points = kmsLog.map((p, i) => {
                    const x = pad + i * stepX;
                    const y = h - pad - ((p.bb - minBB) / (maxBB - minBB || 1)) * (h - 2 * pad);
                    return { x, y, bb: p.bb, bulan: p.bulan };
                  });
                  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
                  return (
                    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${h}px` }}>
                      <polyline points={polyline} fill="none" stroke="var(--cyan)" strokeWidth="2.5" />
                      {points.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="4" fill="var(--cyan-deep)" />
                          <text x={p.x} y={p.y - 10} fontSize="10" textAnchor="middle" fill="var(--ink)">{p.bb}</text>
                        </g>
                      ))}
                    </svg>
                  );
                })()}
              </div>
            )}

            <div className="table-responsive">
              <table className="table" style={{ marginTop: '14px' }}>
                <thead><tr><th>Bulan</th><th>Berat Badan</th><th>Aksi</th></tr></thead>
                <tbody>
                  {kmsLog.length === 0 ? (
                    <tr><td colSpan="3" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>Belum ada data pertumbuhan ditambahkan.</td></tr>
                  ) : (
                    kmsLog.map((p, i) => (
                      <tr key={i}>
                        <td>{p.bulan}</td>
                        <td>{p.bb} kg</td>
                        <td><button className="btn btn-sm btn-outline" onClick={() => removeKmsPoint(i)}>Hapus</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cyan-deep)', marginTop: '10px' }}>{getKmsTrend()}</p>
          </div>
        )}

        {/* 7. Imunisasi */}
        {currentTool === 'imunisasi' && (
          <div className="card">
            <div className="section-head"><h3>Jadwal Imunisasi</h3></div>
            <div className="form-field" style={{ maxWidth: '280px' }}>
              <label>Tanggal Lahir Anak</label>
              <input type="date" value={imunTgl} onChange={e => setImunTgl(e.target.value)} />
            </div>
            <div className="table-responsive">
              <table className="table" style={{ marginTop: '14px' }}>
                <thead><tr><th>Usia</th><th>Jenis Imunisasi</th><th>Tanggal Jadwal</th><th>Status</th></tr></thead>
                <tbody>
                  {!imunTgl ? (
                    <tr><td colSpan="4" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>Isi tanggal lahir untuk melihat jadwal.</td></tr>
                  ) : (
                    getImunisasiRows().map((row, i) => (
                      <tr key={i}>
                        <td>{row.usiaStr}</td>
                        <td>{row.jenis}</td>
                        <td>{row.tglStr}</td>
                        <td>
                          <span className={`badge ${row.isPast ? 'badge-green' : 'badge-orange'}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600, marginTop: '10px' }}>
              Jadwal mengikuti Program Imunisasi Nasional Kemenkes RI (skema sederhana) — periksa ke Posyandu/Puskesmas untuk jadwal resmi.
            </p>
          </div>
        )}

        {/* 8. KPSP */}
        {currentTool === 'kpsp' && (
          <div className="card">
            <div className="section-head"><h3>Tumbuh Kembang (KPSP)</h3></div>
            <div className="form-field" style={{ maxWidth: '220px' }}>
              <label>Usia Anak (bulan)</label>
              <input type="number" placeholder="18" value={kpspUmur} onChange={e => { setKpspUmur(e.target.value); setKpspResult(null); }} />
            </div>
            {kpspUmur && (
              <div style={{ marginTop: '14px' }}>
                <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontWeight: 700, marginBottom: '10px' }}>
                  Checkpoint terdekat: <span style={{ color: 'var(--cyan-deep)' }}>{nearestKpspCheckpoint(parseInt(kpspUmur) || 18)} bulan</span> — contoh 10 pertanyaan ilustrasi (isi final mengikuti formulir resmi KPSP Kemenkes RI).
                </p>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, flex: 1 }}>
                      Pertanyaan {i + 1} — kemampuan motorik/bahasa/sosial sesuai standar KPSP usia {nearestKpspCheckpoint(parseInt(kpspUmur) || 18)} bulan
                    </span>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', cursor: 'pointer' }}>
                        <input type="radio" name={`kpsp-q${i}`} value="ya" checked={kpspAnswers[i] === 'ya'} onChange={() => handleKpspAnswer(i, 'ya')} /> Ya
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', cursor: 'pointer' }}>
                        <input type="radio" name={`kpsp-q${i}`} value="tidak" checked={kpspAnswers[i] === 'tidak'} onChange={() => handleKpspAnswer(i, 'tidak')} /> Tidak
                      </label>
                    </div>
                  </div>
                ))}
                <button className="btn btn-violet" style={{ marginTop: '14px' }} onClick={calcKpspScore}>Hitung Skor</button>
                {kpspResult && (
                  <div style={{ marginTop: '12px', fontWeight: 700, fontSize: '13px' }}>
                    <span style={{ color: kpspResult.type === 'success' ? 'var(--green-deep)' : kpspResult.type === 'warning' ? 'var(--orange-deep)' : 'var(--rose-deep)' }}>
                      {kpspResult.text}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 9. IMT Ideal */}
        {currentTool === 'imt_ideal' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="form-grid">
                <div className="form-field">
                  <label>Jenis Kelamin</label>
                  <select value={imiGender} onChange={e => setImiGender(e.target.value)}>
                    <option>Perempuan</option>
                    <option>Laki-laki</option>
                  </select>
                </div>
                <div className="form-field"><label>Umur (tahun)</label><input type="number" placeholder="30" value={imiUmur} onChange={e => setImiUmur(e.target.value)} /></div>
                <div className="form-field"><label>Berat Badan (kg)</label><input type="number" placeholder="58" value={imiBerat} onChange={e => setImiBerat(e.target.value)} /></div>
                <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" placeholder="156" value={imiTinggi} onChange={e => setImiTinggi(e.target.value)} /></div>
              </div>
            </div>
            <div className="card" style={{ background: 'var(--cyan-bg)', border: 'none' }}>
              <div className="section-head"><h3 style={{ color: 'var(--cyan-deep)' }}><i className="bi bi-calculator me-1"></i>Hasil IMT</h3></div>
              <div className="result-box">
                <div>
                  <div className="r-num">{getImtIdealResult().result}</div>
                  <div className="r-label">Statis, tidak tersimpan ke database</div>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '10px' }}>
                Berat Badan Ideal: <span style={{ color: 'var(--cyan-deep)' }}>{getImtIdealResult().ideal}</span>
              </p>
            </div>
          </div>
        )}

        {/* 10. Kalori */}
        {currentTool === 'kalori' && (
          <>
            <div className="grid grid-2">
              <div className="card">
                <div className="section-head"><h3>Kebutuhan Kalori Harian</h3></div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Jenis Kelamin</label>
                    <select value={kalGender} onChange={e => setKalGender(e.target.value)}>
                      <option>Perempuan</option>
                      <option>Laki-laki</option>
                    </select>
                  </div>
                  <div className="form-field"><label>Umur (tahun)</label><input type="number" placeholder="30" value={kalUmur} onChange={e => setKalUmur(e.target.value)} /></div>
                  <div className="form-field"><label>Berat Badan (kg)</label><input type="number" placeholder="58" value={kalBerat} onChange={e => setKalBerat(e.target.value)} /></div>
                  <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" placeholder="156" value={kalTinggi} onChange={e => setKalTinggi(e.target.value)} /></div>
                  <div className="form-field full">
                    <label>Tingkat Aktivitas Fisik</label>
                    <select value={kalAktivitas} onChange={e => setKalAktivitas(e.target.value)}>
                      {Object.entries(ACTIVITY_FACTOR).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="card" style={{ background: 'var(--cyan-bg)', border: 'none' }}>
                <div className="section-head"><h3 style={{ color: 'var(--cyan-deep)' }}><i className="bi bi-calculator me-1"></i>Kebutuhan Kalori (TDEE)</h3></div>
                <div className="result-box">
                  <div>
                    <div className="r-num">{getTDEE() ? `${getTDEE()} kkal/hari` : '— kkal'}</div>
                    <div className="r-label">Perkiraan kebutuhan kalori/hari sesuai aktivitas — bukan pengganti penilaian ahli gizi</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
              <div className="section-head"><h3>Tambah Makanan yang Dikonsumsi Hari Ini</h3></div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-field" style={{ flex: '2 1 260px', marginBottom: 0 }}>
                  <label>Pilih Makanan</label>
                  <select value={foodPick} onChange={e => setFoodPick(e.target.value)}>
                    {FOOD_DB.map(f => (
                      <option key={f.id} value={f.id}>{f.nama} — {f.kalori} kkal</option>
                    ))}
                  </select>
                </div>
                <div className="form-field" style={{ flex: '0 1 110px', marginBottom: 0 }}>
                  <label>Porsi</label>
                  <input type="number" min="1" value={foodQty} onChange={e => setFoodQty(e.target.value)} />
                </div>
                <button className="btn btn-violet" style={{ height: '38px' }} onClick={addFoodItem}>Tambah</button>
              </div>

              <div className="table-responsive">
                <table className="table" style={{ marginTop: '14px' }}>
                  <thead><tr><th>Makanan</th><th>Porsi</th><th>Kalori</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {foodLog.length === 0 ? (
                      <tr><td colSpan="4" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>Belum ada makanan ditambahkan.</td></tr>
                    ) : (
                      foodLog.map((item, i) => (
                        <tr key={i}>
                          <td>{item.nama}</td>
                          <td>{item.qty}x</td>
                          <td>{item.qty * item.kaloriSatuan} kkal</td>
                          <td><button className="btn btn-sm btn-outline" onClick={() => removeFoodItem(i)}>Hapus</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-2" style={{ marginTop: '14px' }}>
                <div className="card pad-sm" style={{ background: 'var(--orange-bg)', border: 'none' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--orange-deep)' }}>Total Kalori Dikonsumsi</p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--orange-deep)' }}>{getTotalKaloriLog()} kkal</p>
                </div>
                <div className="card pad-sm" style={{ background: getTDEE() ? (getTDEE() - getTotalKaloriLog() >= 0 ? 'var(--green-bg)' : 'var(--rose-bg)') : 'var(--cyan-bg)', border: 'none' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: getTDEE() ? (getTDEE() - getTotalKaloriLog() >= 0 ? 'var(--green-deep)' : 'var(--rose-deep)') : 'var(--cyan-deep)' }}>
                    {!getTDEE() ? 'Isi data kebutuhan kalori di atas terlebih dahulu' : (getTDEE() - getTotalKaloriLog() >= 0 ? 'Sisa Kalori Hari Ini' : 'Melebihi Kebutuhan Kalori')}
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: getTDEE() ? (getTDEE() - getTotalKaloriLog() >= 0 ? 'var(--green-deep)' : 'var(--rose-deep)') : 'var(--cyan-deep)' }}>
                    {!getTDEE() ? '— kkal' : `${Math.abs(getTDEE() - getTotalKaloriLog())} kkal`}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--ink-soft)', fontWeight: 600, marginTop: '10px' }}>
                Contoh: jika kebutuhan kalori harian Anda 1300 kkal dan makanan yang sudah dikonsumsi berjumlah 900 kkal, maka sisa kalori harian Anda adalah 400 kkal.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
