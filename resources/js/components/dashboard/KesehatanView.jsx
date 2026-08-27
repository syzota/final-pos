import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KELOMPOK_CALC = {
  balita: { title: 'Kalkulator Status Gizi', label: 'Status Gizi (BB/TB) — bukan pengganti penilaian ahli gizi' },
  remaja: { title: 'Kalkulator IMT', label: 'IMT — bukan pengganti penilaian ahli gizi' },
  hamil: { title: 'Kalkulator IMT', label: 'IMT Ibu Hamil — bukan pengganti penilaian ahli gizi' },
  lansia: { title: 'Kalkulator IMT', label: 'IMT — bukan pengganti penilaian ahli gizi' }
};

export default function KesehatanView() {
  const [target, setTarget] = useState('balita');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fotoFiles, setFotoFiles] = useState(null);

  // === STATE MODAL DRAF ===
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftList, setDraftList] = useState([]);
  const [isFetchingDrafts, setIsFetchingDrafts] = useState(false);

  // === STATE DATA WARGA ===
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [daftarRemaja, setDaftarRemaja] = useState([]);
  const [daftarIbu, setDaftarIbu] = useState([]);
  const [daftarLansia, setDaftarLansia] = useState([]);

  // === STATE FORM ===
  const [balitaData, setBalitaData] = useState({
    pemeriksaan_id: '', anak_id: '', tanggal_periksa: new Date().toISOString().split('T')[0],
    umur_bulan: '', berat_badan: '', tinggi_badan: '', lingkar_kepala: '', lingkar_lengan: '', catatan_perkembangan: '', status_gizi: 'Normal'
  });
  const [imunisasi, setImunisasi] = useState([]);

  const [remajaData, setRemajaData] = useState({
    pemeriksaan_id: '', remaja_id: '', nama_remaja_baru: '', jenis_kelamin_baru: 'L',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    umur_tahun: '', berat_badan: '', tinggi_badan: '', tekanan_darah: '', status_imt: 'Normal'
  });

  const [hamilData, setHamilData] = useState({
    pemeriksaan_id: '', ibu_id: '', nama_ibu_baru: '',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    usia_kehamilan_minggu: '', berat_badan: '', tinggi_badan: '', tekanan_darah: '',
    lingkar_perut: '', lingkar_lengan: '', status_kek: 'Tidak', anemia: 'Tidak', status_imt: 'Normal'
  });

  const [lansiaData, setLansiaData] = useState({
    pemeriksaan_id: '', lansia_id: '', nama_lansia_baru: '', jenis_kelamin_baru: 'L',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    berat_badan: '', tinggi_badan: '', lingkar_pinggang: '', tekanan_darah: '',
    tensi: 'Normal', gula_darah: '', nadi: '', status_imt: 'Normal'
  });

  // === AMBIL DATA DARI API ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resAnak, resRemaja, resIbu, resLansia] = await Promise.all([
          axios.get('/api/warga/anak', { headers }),
          axios.get('/api/warga/remaja', { headers }),
          axios.get('/api/warga/ibu', { headers }),
          axios.get('/api/warga/lansia', { headers })
        ]);

        setDaftarAnak(resAnak.data.data);
        setDaftarRemaja(resRemaja.data.data);
        setDaftarIbu(resIbu.data.data);
        setDaftarLansia(resLansia.data.data);
      } catch (error) {
        console.error("Gagal memuat data warga:", error);
      }
    };
    fetchData();
  }, []);

  // === FITUR DRAF: BUKA MODAL & AMBIL DATA ===
  const openDraftModal = async () => {
    setShowDraftModal(true);
    setIsFetchingDrafts(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/draf-pemeriksaan/${target}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDraftList(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Gagal mengambil daftar draf.' });
    } finally {
      setIsFetchingDrafts(false);
    }
  };

  // === FITUR DRAF: MASUKKAN DATA KE DALAM FORM ===
  const handleSelectDraft = (draft) => {
    if (target === 'balita') {
      setBalitaData({
        ...balitaData, pemeriksaan_id: draft.id, anak_id: draft.anak_id ? draft.anak_id.toString() : '',
        umur_bulan: draft.umur_bulan || '', berat_badan: draft.berat_badan || '', tinggi_badan: draft.tinggi_badan || '',
        lingkar_kepala: draft.lingkar_kepala || '', lingkar_lengan: draft.lingkar_lengan || '',
        catatan_perkembangan: draft.catatan_perkembangan || '', status_gizi: draft.status_gizi || 'Normal'
      });
    } else if (target === 'remaja') {
      setRemajaData({
        ...remajaData, pemeriksaan_id: draft.id, remaja_id: draft.remaja_id ? draft.remaja_id.toString() : '',
        umur_tahun: draft.umur_tahun || '', berat_badan: draft.berat_badan || '', tinggi_badan: draft.tinggi_badan || '',
        tekanan_darah: draft.tekanan_darah || '', status_imt: draft.status_imt || 'Normal'
      });
    } else if (target === 'hamil') {
      setHamilData({
        ...hamilData, pemeriksaan_id: draft.id, ibu_id: draft.ibu_id ? draft.ibu_id.toString() : '',
        usia_kehamilan_minggu: draft.usia_kehamilan_minggu || '', berat_badan: draft.berat_badan || '',
        tinggi_badan: draft.tinggi_badan || '', tekanan_darah: draft.tekanan_darah || '',
        lingkar_perut: draft.lingkar_perut || '', lingkar_lengan: draft.lingkar_lengan || '',
        status_kek: draft.status_kek || 'Tidak', anemia: draft.anemia || 'Tidak', status_imt: draft.status_imt || 'Normal'
      });
    } else if (target === 'lansia') {
      setLansiaData({
        ...lansiaData, pemeriksaan_id: draft.id, lansia_id: draft.lansia_id ? draft.lansia_id.toString() : '',
        berat_badan: draft.berat_badan || '', tinggi_badan: draft.tinggi_badan || '',
        lingkar_pinggang: draft.lingkar_pinggang || '', tekanan_darah: draft.tekanan_darah || '',
        tensi: draft.tensi || 'Normal', gula_darah: draft.gula_darah || '', nadi: draft.nadi || '', status_imt: draft.status_imt || 'Normal'
      });
    }

    setShowDraftModal(false);
    setMessage({ type: 'success', text: 'Draf berhasil dimuat ke dalam form. Silakan lanjutkan.' });
  };

  // === HANDLER GLOBAL ===
  const handleFileChange = (e) => setFotoFiles(e.target.files);
  const toggleImunisasi = (namaVaksin) => {
    if (imunisasi.includes(namaVaksin)) setImunisasi(imunisasi.filter(item => item !== namaVaksin));
    else setImunisasi([...imunisasi, namaVaksin]);
  };

  const calculateIMT = (bb, tb_cm, rules) => {
    if (bb > 0 && tb_cm > 0) {
      const imt = bb / ((tb_cm / 100) ** 2);
      if (rules === 'hamil') {
        if (imt < 18.5) return 'Kurang (Risiko KEK)';
        if (imt >= 25 && imt < 29.9) return 'Berlebih';
        if (imt >= 30) return 'Obesitas';
        return 'Normal';
      } else {
        if (imt < 18.5) return 'Kurus';
        if (imt >= 25 && imt < 29.9) return 'Gemuk';
        if (imt >= 30) return 'Obesitas';
        return 'Normal';
      }
    }
    return 'Normal';
  };

  // === HANDLER INPUT MENGGUNAKAN KALKULATOR ===
  const handleBalitaChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...balitaData, [name]: value };
    if (name === 'anak_id') {
      const selected = daftarAnak.find(a => a.id.toString() === value);
      if (selected) {
        const birthDate = new Date(selected.tanggal_lahir);
        const today = new Date();
        let ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 - birthDate.getMonth() + today.getMonth();
        updated.umur_bulan = ageMonths > 0 ? ageMonths : 0;
      }
    }
    setBalitaData(updated);
  };

  const handleRemajaChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...remajaData, [name]: value };
    if (name === 'remaja_id' && value !== 'baru') {
      const selected = daftarRemaja.find(r => r.id.toString() === value);
      if (selected) {
        const birthDate = new Date(selected.tanggal_lahir);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        updated.umur_tahun = age > 0 ? age : 0;
      }
    }
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      updated.status_imt = calculateIMT(
        name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan),
        name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan), 'remaja'
      );
    }
    setRemajaData(updated);
  };

  const handleHamilChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...hamilData, [name]: value };
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      updated.status_imt = calculateIMT(
        name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan),
        name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan), 'hamil'
      );
    }
    setHamilData(updated);
  };

  const handleLansiaChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...lansiaData, [name]: value };
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      updated.status_imt = calculateIMT(
        name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan),
        name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan), 'lansia'
      );
    }
    setLansiaData(updated);
  };

  // === SUBMIT DATA (FUNGSI UTAMA) ===
  const submitData = async (url, formData, resetStateCallback) => {
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(url, formData, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      setMessage({ type: 'success', text: response.data.pesan });
      resetStateCallback();
      setFotoFiles(null);
    } catch (err) {
      // PERBAIKAN: Menangkap detail error validasi dari Laravel agar user tahu persis apa yang salah
      let pesanError = err.response?.data?.message || err.message;
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        pesanError = err.response.data.errors[firstErrorKey][0];
      }
      setMessage({ type: 'error', text: `Gagal Menyimpan: ${pesanError}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (kelompok, statusForm) => {
    const formData = new FormData();
    formData.append('status_form', statusForm);
    if (fotoFiles) { for (let i = 0; i < fotoFiles.length; i++) formData.append('dokumentasi_foto[]', fotoFiles[i]); }

    // PERBAIKAN: Fungsi pembersih cerdas untuk membuang field kosong yang bikin error
    const appendSafeData = (dataObj, targetIdField) => {
      if (dataObj.pemeriksaan_id) formData.append('pemeriksaan_id', dataObj.pemeriksaan_id);

      Object.keys(dataObj).forEach(k => {
        if (k === 'pemeriksaan_id') return;
        let val = dataObj[k];

        // Jika user MEMILIH nama dari dropdown, jangan pernah kirim data "_baru"
        // (ini mencegah error validasi string di laravel)
        if (dataObj[targetIdField] !== 'baru' && k.includes('_baru')) return;

        // Cegah pengiriman field yang murni kosong ("") untuk menghindari konflik string vs int di backend
        if (val !== '' && val !== null && val !== undefined) {
          formData.append(k, val);
        }
      });
    };

    if (kelompok === 'balita') {
      appendSafeData(balitaData, 'anak_id');
      imunisasi.forEach((item, index) => formData.append(`imunisasi[${index}]`, item));
      submitData('/api/pemeriksaan-balita', formData, () => {
        if (statusForm === 'final') {
          setBalitaData({ pemeriksaan_id: '', anak_id: '', umur_bulan: '', berat_badan: '', tinggi_badan: '', lingkar_kepala: '', lingkar_lengan: '', catatan_perkembangan: '', status_gizi: 'Normal' });
          setImunisasi([]);
        }
      });
    }
    else if (kelompok === 'remaja') {
      appendSafeData(remajaData, 'remaja_id');
      submitData('/api/pemeriksaan-remaja', formData, () => {
        if (statusForm === 'final') {
          setRemajaData({ pemeriksaan_id: '', remaja_id: '', nama_remaja_baru: '', jenis_kelamin_baru: 'L', umur_tahun: '', berat_badan: '', tinggi_badan: '', tekanan_darah: '', status_imt: 'Normal' });
        }
      });
    }
    else if (kelompok === 'hamil') {
      appendSafeData(hamilData, 'ibu_id');
      submitData('/api/pemeriksaan-hamil', formData, () => {
        if (statusForm === 'final') {
          setHamilData({ pemeriksaan_id: '', ibu_id: '', nama_ibu_baru: '', usia_kehamilan_minggu: '', berat_badan: '', tinggi_badan: '', tekanan_darah: '', lingkar_perut: '', lingkar_lengan: '', status_kek: 'Tidak', anemia: 'Tidak', status_imt: 'Normal' });
        }
      });
    }
    else if (kelompok === 'lansia') {
      appendSafeData(lansiaData, 'lansia_id');
      submitData('/api/pemeriksaan-lansia', formData, () => {
        if (statusForm === 'final') {
          setLansiaData({ pemeriksaan_id: '', lansia_id: '', nama_lansia_baru: '', jenis_kelamin_baru: 'L', berat_badan: '', tinggi_badan: '', lingkar_pinggang: '', tekanan_darah: '', tensi: 'Normal', gula_darah: '', nadi: '', status_imt: 'Normal' });
        }
      });
    }
  };

  const getKalkulatorResult = () => {
    if (target === 'balita') return balitaData.status_gizi;
    if (target === 'remaja') return remajaData.status_imt;
    if (target === 'hamil') return hamilData.status_imt;
    if (target === 'lansia') return lansiaData.status_imt;
    return 'Normal';
  };

  return (
    <>
      {/* === POP-UP MODAL DRAF === */}
      {showDraftModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: 'var(--violet)' }}>Pilih Draf {target.charAt(0).toUpperCase() + target.slice(1)}</h3>
              <button onClick={() => setShowDraftModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>

            {isFetchingDrafts ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Memuat draf tersimpan...</p>
            ) : draftList.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Tidak ada draf tersimpan untuk kelompok sasaran ini.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {draftList.map(draft => (
                  <div key={draft.id} onClick={() => handleSelectDraft(draft)} style={{ padding: '14px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', background: '#f8fafc', transition: '0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--violet)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>Draf Tanggal: {draft.tanggal_periksa}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Ketuk untuk memuat kembali isian form ini.</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === HEADER PILIH SASARAN === */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="section-head">
          <h3>Pilih Kelompok Sasaran</h3>
          <span className="badge badge-violet">Jadwal rutin: 3 Agustus 2026</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div className={`target-chip cyan ${target === 'balita' ? 'active' : ''}`} onClick={() => { setTarget('balita'); setMessage({ type: '', text: '' }); }}><span className="dot"></span>Bayi & Balita</div>
          <div className={`target-chip orange ${target === 'remaja' ? 'active' : ''}`} onClick={() => { setTarget('remaja'); setMessage({ type: '', text: '' }); }}><span className="dot"></span>Remaja</div>
          <div className={`target-chip magenta ${target === 'hamil' ? 'active' : ''}`} onClick={() => { setTarget('hamil'); setMessage({ type: '', text: '' }); }}><span className="dot"></span>Ibu Hamil</div>
          <div className={`target-chip green ${target === 'lansia' ? 'active' : ''}`} onClick={() => { setTarget('lansia'); setMessage({ type: '', text: '' }); }}><span className="dot"></span>Orang Tua & Lansia</div>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
          <b>{message.type === 'error' ? 'Peringatan:' : 'Info Sistem:'}</b> {message.text}
        </div>
      )}

      <div className="grid grid-2">
        <div className="card">
          {/* HEADER FORM DENGAN TOMBOL LIHAT DRAF */}
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Form Pemeriksaan — {target === 'balita' ? 'Bayi & Balita' : target === 'remaja' ? 'Remaja' : target === 'hamil' ? 'Ibu Hamil' : 'Orang Tua & Lansia'}</h3>
            <button onClick={openDraftModal} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>
              Lihat Draf
            </button>
          </div>

          {/* === FORM BALITA === */}
          {target === 'balita' && (
            <div className="form-grid kel-subform">
              <div className="form-field full"><label>Pilih Nama Anak</label><select name="anak_id" value={balitaData.anak_id} onChange={handleBalitaChange}><option value="">-- Pilih Anak --</option>{daftarAnak.map((a) => (<option key={a.id} value={a.id}>{a.nama_anak} ({a.jenis_kelamin})</option>))}</select></div>
              <div className="form-field"><label>Umur (bulan)</label><input type="number" name="umur_bulan" value={balitaData.umur_bulan} onChange={handleBalitaChange} placeholder="Otomatis terisi..." /></div>
              <div className="form-field"><label>Berat Badan (kg)</label><input type="number" step="0.1" name="berat_badan" value={balitaData.berat_badan} onChange={handleBalitaChange} placeholder="mis. 10.2" /></div>
              <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" step="0.1" name="tinggi_badan" value={balitaData.tinggi_badan} onChange={handleBalitaChange} placeholder="mis. 78" /></div>
              <div className="form-field"><label>Lingkar Kepala (cm)</label><input type="number" step="0.1" name="lingkar_kepala" value={balitaData.lingkar_kepala} onChange={handleBalitaChange} placeholder="opsional" /></div>
              <div className="form-field"><label>Lingkar Lengan (cm)</label><input type="number" step="0.1" name="lingkar_lengan" value={balitaData.lingkar_lengan} onChange={handleBalitaChange} placeholder="opsional" /></div>
              <div className="form-field full"><label>Catatan Perkembangan Anak</label><textarea rows="2" name="catatan_perkembangan" value={balitaData.catatan_perkembangan} onChange={handleBalitaChange} placeholder="Hasil wawancara perkembangan..."></textarea></div>
              <div className="form-field full">
                <label>Status Imunisasi</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['BCG', 'Polio I', 'Polio II', 'DPT-HB II'].map(v => {
                    const isSelected = imunisasi.includes(v);
                    return (
                      <div
                        key={v}
                        onClick={() => toggleImunisasi(v)}
                        style={{
                          cursor: 'pointer',
                          border: isSelected ? '1px solid transparent' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#16a34a' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#475569',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '13px',
                          fontWeight: '600',
                          userSelect: 'none',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 24 24" width="16" height="16" style={{ marginRight: '6px', fill: 'currentColor' }}>
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                          </svg>
                        )}
                        {v}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="form-field full" style={{ display: 'flex', gap: '10px', marginTop: '18px' }}><button onClick={() => handleSubmit('balita', 'draft')} disabled={isLoading} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Simpan Draf</button><button onClick={() => handleSubmit('balita', 'final')} disabled={isLoading} className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data'}</button></div>
            </div>
          )}

          {/* === FORM REMAJA === */}
          {target === 'remaja' && (
            <div className="form-grid kel-subform">
              <div className="form-field full"><label>Pilih Nama Remaja</label><select name="remaja_id" value={remajaData.remaja_id} onChange={handleRemajaChange}><option value="">-- Pilih Remaja --</option>{daftarRemaja.map((r) => (<option key={r.id} value={r.id}>{r.nama_remaja} ({r.jenis_kelamin})</option>))}<option value="baru" style={{ fontWeight: 'bold', color: 'var(--violet)' }}>+ Tambah Remaja Baru...</option></select></div>
              {remajaData.remaja_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f1f5f9', padding: '16px', borderRadius: '8px', marginBottom: '8px' }}>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}><label>Ketik Nama Lengkap</label><input type="text" name="nama_remaja_baru" value={remajaData.nama_remaja_baru} onChange={handleRemajaChange} placeholder="mis. Dimas Aditya" /></div>
                  <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin_baru" value={remajaData.jenis_kelamin_baru} onChange={handleRemajaChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                </div>
              )}
              <div className="form-field"><label>Umur (tahun)</label><input type="number" name="umur_tahun" value={remajaData.umur_tahun} onChange={handleRemajaChange} placeholder="Otomatis..." disabled={remajaData.remaja_id !== 'baru'} /></div>
              <div className="form-field"><label>Berat Badan (kg)</label><input type="number" step="0.1" name="berat_badan" value={remajaData.berat_badan} onChange={handleRemajaChange} placeholder="mis. 48" /></div>
              <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" step="0.1" name="tinggi_badan" value={remajaData.tinggi_badan} onChange={handleRemajaChange} placeholder="mis. 155" /></div>
              <div className="form-field"><label>Tekanan Darah (mmHg)</label><input type="text" name="tekanan_darah" value={remajaData.tekanan_darah} onChange={handleRemajaChange} placeholder="mis. 110/70" /></div>
              <div className="form-field full" style={{ display: 'flex', gap: '10px', marginTop: '18px' }}><button onClick={() => handleSubmit('remaja', 'draft')} disabled={isLoading} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Simpan Draf</button><button onClick={() => handleSubmit('remaja', 'final')} disabled={isLoading} className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data'}</button></div>
            </div>
          )}

          {/* === FORM IBU HAMIL === */}
          {target === 'hamil' && (
            <div className="form-grid kel-subform">
              <div className="form-field full"><label>Nama Ibu</label><select name="ibu_id" value={hamilData.ibu_id} onChange={handleHamilChange}><option value="">-- Pilih Ibu Hamil --</option>{daftarIbu.map((i) => (<option key={i.id} value={i.id}>{i.nama_lengkap}</option>))}<option value="baru" style={{ fontWeight: 'bold', color: 'var(--violet)' }}>+ Tambah Ibu Baru...</option></select></div>
              {hamilData.ibu_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', background: '#f1f5f9', padding: '16px', borderRadius: '8px', marginBottom: '8px' }}>
                  <div className="form-field full"><label>Ketik Nama Lengkap</label><input type="text" name="nama_ibu_baru" value={hamilData.nama_ibu_baru} onChange={handleHamilChange} placeholder="mis. Siti Aminah" /></div>
                </div>
              )}
              <div className="form-field"><label>Usia Kehamilan (minggu)</label><input type="number" name="usia_kehamilan_minggu" value={hamilData.usia_kehamilan_minggu} onChange={handleHamilChange} placeholder="mis. 24" /></div>
              <div className="form-field"><label>Berat Badan (kg)</label><input type="number" step="0.1" name="berat_badan" value={hamilData.berat_badan} onChange={handleHamilChange} placeholder="mis. 58" /></div>
              <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" step="0.1" name="tinggi_badan" value={hamilData.tinggi_badan} onChange={handleHamilChange} placeholder="mis. 156" /></div>
              <div className="form-field"><label>Tensi (Tekanan Darah)</label><input type="text" name="tekanan_darah" value={hamilData.tekanan_darah} onChange={handleHamilChange} placeholder="mis. 110/80" /></div>
              <div className="form-field"><label>Lingkar Perut/Pinggang (cm)</label><input type="number" step="0.1" name="lingkar_perut" value={hamilData.lingkar_perut} onChange={handleHamilChange} placeholder="mis. 88" /></div>
              <div className="form-field"><label>Lingkar Lengan / LILA (cm)</label><input type="number" step="0.1" name="lingkar_lengan" value={hamilData.lingkar_lengan} onChange={handleHamilChange} placeholder="mis. 24.5" /></div>
              <div className="form-field"><label>Status KEK</label><select name="status_kek" value={hamilData.status_kek} onChange={handleHamilChange}><option value="Tidak">Tidak</option><option value="Ya">Ya</option></select></div>
              <div className="form-field"><label>Anemia</label><select name="anemia" value={hamilData.anemia} onChange={handleHamilChange}><option value="Tidak">Tidak</option><option value="Ya">Ya</option></select></div>
              <div className="form-field full" style={{ display: 'flex', gap: '10px', marginTop: '18px' }}><button onClick={() => handleSubmit('hamil', 'draft')} disabled={isLoading} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Simpan Draf</button><button onClick={() => handleSubmit('hamil', 'final')} disabled={isLoading} className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data'}</button></div>
            </div>
          )}

          {/* === FORM LANSIA === */}
          {target === 'lansia' && (
            <div className="form-grid kel-subform">
              <div className="form-field full"><label>Pilih Nama Lansia</label><select name="lansia_id" value={lansiaData.lansia_id} onChange={handleLansiaChange}><option value="">-- Pilih Orang Tua / Lansia --</option>{daftarLansia.map((l) => (<option key={l.id} value={l.id}>{l.nama_lengkap} ({l.jenis_kelamin})</option>))}<option value="baru" style={{ fontWeight: 'bold', color: 'var(--violet)' }}>+ Tambah Lansia Baru...</option></select></div>
              {lansiaData.lansia_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f1f5f9', padding: '16px', borderRadius: '8px', marginBottom: '8px' }}>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}><label>Ketik Nama Lengkap</label><input type="text" name="nama_lansia_baru" value={lansiaData.nama_lansia_baru} onChange={handleLansiaChange} placeholder="mis. Bapak Slamet" /></div>
                  <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin_baru" value={lansiaData.jenis_kelamin_baru} onChange={handleLansiaChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                </div>
              )}
              <div className="form-field"><label>Gula Darah (mg/dL)</label><input type="number" name="gula_darah" value={lansiaData.gula_darah} onChange={handleLansiaChange} placeholder="mis. 110" /></div>
              <div className="form-field"><label>Tekanan Darah (mmHg)</label><input type="text" name="tekanan_darah" value={lansiaData.tekanan_darah} onChange={handleLansiaChange} placeholder="mis. 130/85" /></div>
              <div className="form-field"><label>Tensi</label><select name="tensi" value={lansiaData.tensi} onChange={handleLansiaChange}><option value="Rendah">Rendah</option><option value="Normal">Normal</option><option value="Tinggi">Tinggi</option></select></div>
              <div className="form-field"><label>Nadi (per menit)</label><input type="number" name="nadi" value={lansiaData.nadi} onChange={handleLansiaChange} placeholder="mis. 78" /></div>
              <div className="form-field"><label>Berat Badan (kg)</label><input type="number" step="0.1" name="berat_badan" value={lansiaData.berat_badan} onChange={handleLansiaChange} placeholder="mis. 60" /></div>
              <div className="form-field"><label>Tinggi Badan (cm)</label><input type="number" step="0.1" name="tinggi_badan" value={lansiaData.tinggi_badan} onChange={handleLansiaChange} placeholder="mis. 160" /></div>
              <div className="form-field"><label>Lingkar Pinggang (cm)</label><input type="number" step="0.1" name="lingkar_pinggang" value={lansiaData.lingkar_pinggang} onChange={handleLansiaChange} placeholder="mis. 85" /></div>
              <div className="form-field full" style={{ display: 'flex', gap: '10px', marginTop: '18px' }}><button onClick={() => handleSubmit('lansia', 'draft')} disabled={isLoading} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Simpan Draf</button><button onClick={() => handleSubmit('lansia', 'final')} disabled={isLoading} className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data'}</button></div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: KALKULATOR & FOTO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ background: 'var(--cyan-bg)', border: 'none' }}>
            <div className="section-head"><h3 style={{ color: 'var(--cyan-deep)' }}><svg className="ic"><use href="#i-calculator" /></svg><span>{KELOMPOK_CALC[target].title}</span></h3></div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cyan-deep)', opacity: .85, marginBottom: '12px' }}>Terhitung otomatis dari berat, tinggi & umur yang diisi di form.</p>
            <div className="result-box"><div><div className="r-num">{getKalkulatorResult()}</div><div className="r-label">{KELOMPOK_CALC[target].label}</div></div></div>
          </div>
          <div className="card">
            <div className="section-head"><h3>Dokumentasi Foto</h3></div>
            <div className="upload-box" style={{ position: 'relative', overflow: 'hidden' }}>
              <input type="file" multiple accept="image/png, image/jpeg" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              <svg className="ic ic-lg"><use href="#i-camera" /></svg>
              <span><b>Tap untuk unggah</b> foto kegiatan</span>
              {fotoFiles ? <span style={{ color: 'var(--cyan-deep)' }}>{fotoFiles.length} foto terpilih</span> : <span>Maks. 5 foto · 2MB/foto · JPG/PNG</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}