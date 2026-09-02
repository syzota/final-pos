import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Activity,
  Calculator,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  X,
  Info,
  ChevronDown
} from 'lucide-react';

const KELOMPOK_CALC = {
  balita: { title: 'Kalkulator Status Gizi Balita', label: 'Status Pertumbuhan (BB/TB Standar Kemenkes)' },
  remaja: { title: 'Kalkulator IMT Remaja', label: 'Indeks Massa Tubuh (IMT)' },
  hamil: { title: 'Kalkulator IMT Ibu Hamil', label: 'IMT Pra-Hamil & Risiko KEK' },
  lansia: { title: 'Kalkulator IMT Lansia', label: 'Indeks Massa Tubuh Lansia' }
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

        setDaftarAnak(resAnak.data.data || []);
        setDaftarRemaja(resRemaja.data.data || []);
        setDaftarIbu(resIbu.data.data || []);
        setDaftarLansia(resLansia.data.data || []);
      } catch (error) {
        console.error('Gagal memuat data warga:', error);
      }
    };
    fetchData();
  }, []);

  // Kunci scroll saat modal draf terbuka
  useEffect(() => {
    if (showDraftModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDraftModal]);

  // === FITUR DRAF: BUKA MODAL & AMBIL DATA ===
  const openDraftModal = async () => {
    setShowDraftModal(true);
    setIsFetchingDrafts(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`/api/draf-pemeriksaan/${target}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDraftList(response.data.data || []);
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

  const submitData = async (url, formData, resetStateCallback) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage({ type: 'success', text: response.data.pesan || 'Data berhasil disimpan.' });
      resetStateCallback();
      setFotoFiles(null);
    } catch (err) {
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
    if (fotoFiles) {
      for (let i = 0; i < fotoFiles.length; i++) {
        formData.append('dokumentasi_foto[]', fotoFiles[i]);
      }
    }

    const appendSafeData = (dataObj, targetIdField) => {
      if (dataObj.pemeriksaan_id) formData.append('pemeriksaan_id', dataObj.pemeriksaan_id);

      Object.keys(dataObj).forEach(k => {
        if (k === 'pemeriksaan_id') return;
        let val = dataObj[k];

        if (dataObj[targetIdField] !== 'baru' && k.includes('_baru')) return;
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
    } else if (kelompok === 'remaja') {
      appendSafeData(remajaData, 'remaja_id');
      submitData('/api/pemeriksaan-remaja', formData, () => {
        if (statusForm === 'final') {
          setRemajaData({ pemeriksaan_id: '', remaja_id: '', nama_remaja_baru: '', jenis_kelamin_baru: 'L', umur_tahun: '', berat_badan: '', tinggi_badan: '', tekanan_darah: '', status_imt: 'Normal' });
        }
      });
    } else if (kelompok === 'hamil') {
      appendSafeData(hamilData, 'ibu_id');
      submitData('/api/pemeriksaan-hamil', formData, () => {
        if (statusForm === 'final') {
          setHamilData({ pemeriksaan_id: '', ibu_id: '', nama_ibu_baru: '', usia_kehamilan_minggu: '', berat_badan: '', tinggi_badan: '', tekanan_darah: '', lingkar_perut: '', lingkar_lengan: '', status_kek: 'Tidak', anemia: 'Tidak', status_imt: 'Normal' });
        }
      });
    } else if (kelompok === 'lansia') {
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

  const getTargetTitle = () => {
    if (target === 'balita') return 'Pemeriksaan Bayi & Balita';
    if (target === 'remaja') return 'Pemeriksaan Kesehatan Remaja';
    if (target === 'hamil') return 'Pemeriksaan Ibu Hamil';
    return 'Pemeriksaan Orang Tua & Lansia';
  };

  return (
    <>
      {/* POP-UP MODAL PILIH DRAF (DESAIN BERSIH & RAPI) */}
      {showDraftModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowDraftModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '28px',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase' }}>Draf Tersimpan</span>
                <h3 style={{ margin: '2px 0 0', color: '#0f172a', fontSize: '18px', fontWeight: 800 }}>
                  Pilih Draf {target.charAt(0).toUpperCase() + target.slice(1)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDraftModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {isFetchingDrafts ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>Memuat draf tersimpan...</p>
            ) : draftList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b' }}>
                <FileText size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                <p style={{ fontWeight: 600, margin: 0 }}>Tidak ada draf tersimpan untuk kelompok sasaran ini.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {draftList.map(draft => (
                  <div
                    key={draft.id}
                    onClick={() => handleSelectDraft(draft)}
                    style={{
                      padding: '14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: '#f8fafc',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '4px', color: '#0f172a', fontSize: '14px' }}>
                      Tanggal: {draft.tanggal_periksa}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Ketuk untuk memuat kembali isian form draf ini.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 1. HEADER: PILLS JADWAL RUTIN DI ATAS + DROPDOWN/CHIPS SASARAN */}
      <div className="card" style={{ marginBottom: '20px', padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        {/* Pills Jadwal Rutin di Atas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Formulir Identifikasi & Pelayanan
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              Pencatatan Kesehatan Warga
            </h2>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '12.5px',
              fontWeight: 700
            }}
          >
            <Calendar size={14} />
            <span>Jadwal Rutin: Minggu I & II Setiap Bulan</span>
          </div>
        </div>

        {/* Dropdown Selector untuk Mobile Space-Saving */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            Pilih Kelompok Sasaran Pemeriksaan:
          </label>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { id: 'balita', label: 'Bayi & Balita (0–5 Tahun)' },
              { id: 'remaja', label: 'Remaja (10–18 Tahun)' },
              { id: 'hamil', label: 'Ibu Hamil & Menyusui' },
              { id: 'lansia', label: 'Orang Tua & Lansia (≥60 Thn)' }
            ].map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => { setTarget(k.id); setMessage({ type: '', text: '' }); }}
                style={{
                  minHeight: '42px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: target === k.id ? 'var(--primary-teal, #008080)' : '#cbd5e1',
                  backgroundColor: target === k.id ? 'var(--primary-teal, #008080)' : '#ffffff',
                  color: target === k.id ? '#ffffff' : '#334155',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message.text && (
        <div
          style={{
            padding: '14px 18px',
            marginBottom: '20px',
            borderRadius: '12px',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            color: message.type === 'error' ? '#b91c1c' : '#15803d',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Info size={16} />
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. FORM GRID & KALKULATOR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* KIRI: FORM ISIAN */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          {/* Eyebrow & Headline Form Header + Button Fisik Lihat Draf */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Formulir Identifikasi
              </span>
              <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                {getTargetTitle()}
              </h3>
            </div>

            {/* Desain Teks "Lihat Draf" Sebagai Button Fisik Nyata */}
            <button
              type="button"
              onClick={openDraftModal}
              style={{
                minHeight: '40px',
                padding: '0 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <FileText size={15} color="#008080" />
              Lihat Draf
            </button>
          </div>

          {/* FORM BALITA */}
          {target === 'balita' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Pilih Nama Anak</label>
                <select name="anak_id" value={balitaData.anak_id} onChange={handleBalitaChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="">-- Pilih Anak Terdaftar --</option>
                  {daftarAnak.map((a) => (
                    <option key={a.id} value={a.id}>{a.nama_anak} ({a.jenis_kelamin})</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Umur (Bulan)</label>
                <input type="number" name="umur_bulan" value={balitaData.umur_bulan} onChange={handleBalitaChange} placeholder="Otomatis..." style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input type="number" step="0.1" name="berat_badan" value={balitaData.berat_badan} onChange={handleBalitaChange} placeholder="mis. 10.5" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input type="number" step="0.1" name="tinggi_badan" value={balitaData.tinggi_badan} onChange={handleBalitaChange} placeholder="mis. 78.5" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Lingkar Kepala (cm)</label>
                <input type="number" step="0.1" name="lingkar_kepala" value={balitaData.lingkar_kepala} onChange={handleBalitaChange} placeholder="mis. 45" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Catatan Perkembangan Anak</label>
                <textarea rows="2" name="catatan_perkembangan" value={balitaData.catatan_perkembangan} onChange={handleBalitaChange} placeholder="Catatan nafsu makan, keaktifan motorik..." style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px' }}></textarea>
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>Status Imunisasi Diberikan Hari Ini</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['BCG', 'Polio I', 'Polio II', 'DPT-HB I', 'DPT-HB II', 'Campak', 'Vitamin A'].map(v => {
                    const isSelected = imunisasi.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => toggleImunisasi(v)}
                        style={{
                          minHeight: '36px',
                          border: isSelected ? '1px solid #16a34a' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#16a34a' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#475569',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => handleSubmit('balita', 'draft')}
                  disabled={isLoading}
                  style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, cursor: 'pointer' }}
                >
                  Simpan Draf
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('balita', 'final')}
                  disabled={isLoading}
                  style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Data Final'}
                </button>
              </div>
            </div>
          )}

          {/* FORM REMAJA */}
          {target === 'remaja' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Pilih Nama Remaja</label>
                <select name="remaja_id" value={remajaData.remaja_id} onChange={handleRemajaChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="">-- Pilih Remaja Terdaftar --</option>
                  {daftarRemaja.map((r) => (
                    <option key={r.id} value={r.id}>{r.nama_remaja} ({r.jenis_kelamin})</option>
                  ))}
                  <option value="baru">+ Tambah Remaja Baru...</option>
                </select>
              </div>

              {remajaData.remaja_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Ketik Nama Lengkap</label>
                    <input type="text" name="nama_remaja_baru" value={remajaData.nama_remaja_baru} onChange={handleRemajaChange} placeholder="mis. Dimas Aditya" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                  </div>
                </div>
              )}

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Umur (Tahun)</label>
                <input type="number" name="umur_tahun" value={remajaData.umur_tahun} onChange={handleRemajaChange} placeholder="mis. 15" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tekanan Darah (mmHg)</label>
                <input type="text" name="tekanan_darah" value={remajaData.tekanan_darah} onChange={handleRemajaChange} placeholder="mis. 110/70" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input type="number" step="0.1" name="berat_badan" value={remajaData.berat_badan} onChange={handleRemajaChange} placeholder="mis. 48" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input type="number" step="0.1" name="tinggi_badan" value={remajaData.tinggi_badan} onChange={handleRemajaChange} placeholder="mis. 155" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => handleSubmit('remaja', 'draft')} disabled={isLoading} style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, cursor: 'pointer' }}>Simpan Draf</button>
                <button type="button" onClick={() => handleSubmit('remaja', 'final')} disabled={isLoading} style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data Final'}</button>
              </div>
            </div>
          )}

          {/* FORM IBU HAMIL */}
          {target === 'hamil' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nama Ibu Hamil</label>
                <select name="ibu_id" value={hamilData.ibu_id} onChange={handleHamilChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="">-- Pilih Ibu Hamil Terdaftar --</option>
                  {daftarIbu.map((i) => (
                    <option key={i.id} value={i.id}>{i.nama_lengkap}</option>
                  ))}
                  <option value="baru">+ Tambah Ibu Baru...</option>
                </select>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usia Kehamilan (Minggu)</label>
                <input type="number" name="usia_kehamilan_minggu" value={hamilData.usia_kehamilan_minggu} onChange={handleHamilChange} placeholder="mis. 24" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tensi Darah</label>
                <input type="text" name="tekanan_darah" value={hamilData.tekanan_darah} onChange={handleHamilChange} placeholder="mis. 110/80" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input type="number" step="0.1" name="berat_badan" value={hamilData.berat_badan} onChange={handleHamilChange} placeholder="mis. 58" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Lingkar Lengan / LILA (cm)</label>
                <input type="number" step="0.1" name="lingkar_lengan" value={hamilData.lingkar_lengan} onChange={handleHamilChange} placeholder="mis. 24.5" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => handleSubmit('hamil', 'draft')} disabled={isLoading} style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, cursor: 'pointer' }}>Simpan Draf</button>
                <button type="button" onClick={() => handleSubmit('hamil', 'final')} disabled={isLoading} style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data Final'}</button>
              </div>
            </div>
          )}

          {/* FORM LANSIA */}
          {target === 'lansia' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Pilih Nama Orang Tua / Lansia</label>
                <select name="lansia_id" value={lansiaData.lansia_id} onChange={handleLansiaChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="">-- Pilih Lansia Terdaftar --</option>
                  {daftarLansia.map((l) => (
                    <option key={l.id} value={l.id}>{l.nama_lengkap} ({l.jenis_kelamin})</option>
                  ))}
                  <option value="baru">+ Tambah Lansia Baru...</option>
                </select>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Gula Darah (mg/dL)</label>
                <input type="number" name="gula_darah" value={lansiaData.gula_darah} onChange={handleLansiaChange} placeholder="mis. 110" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tekanan Darah (mmHg)</label>
                <input type="text" name="tekanan_darah" value={lansiaData.tekanan_darah} onChange={handleLansiaChange} placeholder="mis. 130/85" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input type="number" step="0.1" name="berat_badan" value={lansiaData.berat_badan} onChange={handleLansiaChange} placeholder="mis. 60" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input type="number" step="0.1" name="tinggi_badan" value={lansiaData.tinggi_badan} onChange={handleLansiaChange} placeholder="mis. 160" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => handleSubmit('lansia', 'draft')} disabled={isLoading} style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, cursor: 'pointer' }}>Simpan Draf</button>
                <button type="button" onClick={() => handleSubmit('lansia', 'final')} disabled={isLoading} style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>{isLoading ? 'Menyimpan...' : 'Simpan Data Final'}</button>
              </div>
            </div>
          )}
        </div>

        {/* KANAN: KALKULATOR HASIL + MICROCOPY APA ITU IMT + DOKUMENTASI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Box Kalkulator Otomatis */}
          <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Calculator size={20} color="#008080" />
              <h3 style={{ color: '#0f766e', fontSize: '17px', fontWeight: 800, margin: 0 }}>
                {KELOMPOK_CALC[target].title}
              </h3>
            </div>

            {/* Microcopy Penjelasan Apa Itu IMT */}
            <p style={{ fontSize: '12.5px', color: '#115e59', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              <b>Apa itu IMT?</b> Indeks Massa Tubuh (IMT) adalah rasio perbandingan berat terhadap tinggi badan yang digunakan untuk mendeteksi dini risiko stunting, gizi kurang, atau obesitas.
            </p>

            <div style={{ padding: '18px', background: '#ffffff', borderRadius: '14px', border: '1px solid #99f6e4', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Hasil Penilaian Otomatis
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#008080', marginBottom: '6px' }}>
                {getKalkulatorResult()}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                {KELOMPOK_CALC[target].label}
              </div>
            </div>
          </div>

          {/* Box Upload Dokumentasi Foto */}
          <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Upload size={18} color="#64748b" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Dokumentasi Foto Pemeriksaan
              </h3>
            </div>

            <div
              style={{
                position: 'relative',
                border: '2px dashed #cbd5e1',
                borderRadius: '14px',
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              <Upload size={28} style={{ margin: '0 auto 8px', color: '#008080' }} />
              <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                Ketuk untuk unggah foto kegiatan
              </p>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                {fotoFiles ? `${fotoFiles.length} foto dipilih` : 'Format JPG, PNG, WEBP (Maks. 2MB)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}