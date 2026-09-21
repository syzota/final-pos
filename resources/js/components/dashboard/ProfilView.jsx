import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  PrinterIcon,
  Building01Icon,
  UserGroupIcon,
  Activity01Icon,
  Image01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  FloppyDiskIcon,
  Upload01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const PROFIL_TABS = [
  { id: 'identitas', label: 'Identitas & Strata SIP', icon: Building01Icon },
  { id: 'pengurus', label: 'Struktur Pengurus & Kader', icon: UserGroupIcon },
  { id: 'sarana', label: 'Sarana & Alat Penimbangan', icon: Activity01Icon },
  { id: 'lokasi', label: 'Dokumentasi & Lokasi G-Maps', icon: Image01Icon },
];

export default function ProfilView() {
  const [activeTab, setActiveTab] = useState('identitas');
  const [formData, setFormData] = useState({
    nama: '', alamat: '', kontak_darurat: '', link_gmaps: '',
    kd_kecamatan: '', kd_desa: '', rukun_tetangga: '', nomor_posyandu: '',
    strata: 'Purnama', program_paud: 'Tidak', program_bkb: 'Tidak', program_terintegrasi: '',
    pj_umum: '', pj_operasional: '', ketua_pelaksana: '', sekretaris: '', bendahara: '',
    jml_kader_aktif: 0, jml_kader_tidak_aktif: 0, petugas_kb: '', medis_paramedis: '', bidan_desa: '', keterangan_profil: '',
    tempat_pelayanan: 'Gedung Sendiri', timbangan: 'Tersedia',
    jml_dacin: 0, timbangan_bayi: 0, timbangan_balita: 0, timbangan_ibu: 0,
    buku_kia: 'Tersedia', formulir_sip: 'Tersedia', blanko_skdn: 'Tersedia',
    buku_catatan_keuangan: 'Tersedia', alat_peraga_penyuluhan: 'Tersedia', ape: 'Tersedia',
    sarana_lain: '', keterangan_sarana: ''
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [printSection, setPrintSection] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/posyandu/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data.data) {
          const dataDariDb = response.data.data;
          setFormData(prev => ({ ...prev, ...dataDariDb }));
          if (dataDariDb.foto) {
            setFotoPreview(`/storage/${dataDariDb.foto}`);
          }
        }
      } catch (err) {
        console.error('Gagal memuat profil posyandu', err);
      }
    };
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth_token');
      const submitData = new FormData();

      const blacklist = ['jadwal', 'id', 'created_at', 'updated_at', 'foto', 'no_telepon'];

      Object.keys(formData).forEach(key => {
        if (!blacklist.includes(key)) {
          submitData.append(key, formData[key] === null ? '' : formData[key]);
        }
      });

      if (foto) submitData.append('foto', foto);

      await axios.post('/api/posyandu/me/update', submitData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: 'Seluruh data Profil, Sarana, dan Lokasi Posyandu berhasil disimpan!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setMessage({ type: 'error', text: `Gagal menyimpan profil: ${errMsg}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = (section) => {
    setPrintSection(section);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
        setPrintSection(null);
      }, 500);
    }, 150);
  };

  return (
    <>
      <style>{`
        #dokumen-cetak { display: none; }
        @media print {
          html, body { height: auto !important; overflow: visible !important; position: static !important; }
          body * { visibility: hidden; }
          #dokumen-cetak, #dokumen-cetak * { visibility: visible; }
          #dokumen-cetak {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
            font-family: Arial, sans-serif;
            background-color: #fff !important;
            color: #000 !important;
          }
          .tabel-cetak { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          .tabel-cetak th, .tabel-cetak td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
          .tabel-cetak th { background-color: #f2f2f2 !important; width: 38%; }
          .no-print { display: none !important; }
        }

        .profil-tabs-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .profil-tabs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 520px) {
          .profil-tabs-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .profil-tab-btn {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          border-width: 1.5px;
          border-style: solid;
          cursor: pointer;
          text-align: left;
          outline: none;
          min-height: 54px;
          box-sizing: border-box;
          transition: all 0.15s ease;
        }
        .profil-tab-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <div className="no-print" style={{ animation: 'fadein 0.3s ease' }}>
        {/* HEADER: KARTU NAVIGASI PROFIL & TOMBOL CETAK */}
        <div
          className="card"
          style={{
            marginBottom: '24px',
            padding: '20px 24px',
            borderRadius: '16px',
            backgroundColor: 'var(--surface, #ffffff)',
            border: '1.5px solid var(--line, #e2e8f0)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                  color: 'var(--primary-teal, #008080)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building01Icon size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
                  Profil & Sarana Posyandu (SIP)
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                  {formData.nama ? `${formData.nama} • Desa Loa Duri Ulu` : 'Kelola data identitas, sarana, dan pengurus posyandu'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="sm"
                icon={PrinterIcon}
                onClick={() => handlePrint('profil')}
              >
                Cetak Profil SIP
              </Button>
              <Button
                variant="teal"
                size="sm"
                icon={PrinterIcon}
                onClick={() => handlePrint('sarana')}
              >
                Cetak Sarana SIP
              </Button>
            </div>
          </div>

          <div className="profil-tabs-grid">
            {PROFIL_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className="profil-tab-btn"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    borderColor: isSelected ? 'var(--primary-teal, #008080)' : '#e2e8f0',
                    backgroundColor: isSelected ? 'var(--primary-teal, #008080)' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--primary-teal-light, #e6f3f3)',
                      color: isSelected ? '#ffffff' : 'var(--primary-teal, #008080)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <TabIcon size={16} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <NotificationModal
          isOpen={Boolean(message.text)}
          type={message.type || 'success'}
          message={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />

        {/* FORM UTAMA */}
        <form onSubmit={handleSave}>
          {/* TAB 1: IDENTITAS & STRATA SIP */}
          {activeTab === 'identitas' && (
            <div
              className="card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'var(--surface, #ffffff)',
                border: '1.5px solid var(--line, #e2e8f0)'
              }}
            >
              <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                Identitas Posyandu & Lembaga SIP
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Kode Kecamatan</label>
                  <input name="kd_kecamatan" value={formData.kd_kecamatan || ''} onChange={handleChange} placeholder="Sesuai lembar SIP" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Kode Desa</label>
                  <input name="kd_desa" value={formData.kd_desa || ''} onChange={handleChange} placeholder="Sesuai lembar SIP" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Rukun Tetangga (RT)</label>
                  <input inputMode="numeric" name="rukun_tetangga" value={formData.rukun_tetangga || ''} onChange={handleChange} placeholder="mis. 04" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nomor Posyandu</label>
                  <input inputMode="numeric" name="nomor_posyandu" value={formData.nomor_posyandu || ''} onChange={handleChange} placeholder="mis. 01" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Alamat Lengkap Bangunan Posyandu</label>
                  <input name="alamat" value={formData.alamat || ''} onChange={handleChange} placeholder="Jl. Contoh RT 01 Desa Loa Duri Ulu" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Strata Posyandu</label>
                  <select name="strata" value={formData.strata || 'Purnama'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}>
                    <option value="Pratama">Pratama</option>
                    <option value="Madya">Madya</option>
                    <option value="Purnama">Purnama</option>
                    <option value="Mandiri">Mandiri</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Program Integrasi PAUD</label>
                  <select name="program_paud" value={formData.program_paud || 'Tidak'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}>
                    <option value="Ada">Ada</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Program Integrasi BKB</label>
                  <select name="program_bkb" value={formData.program_bkb || 'Tidak'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}>
                    <option value="Ada">Ada</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Program Terintegrasi Lainnya</label>
                  <input name="program_terintegrasi" value={formData.program_terintegrasi || ''} onChange={handleChange} placeholder="mis. Posbindu / Lansia" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PENGURUS & KADER */}
          {activeTab === 'pengurus' && (
            <div
              className="card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'var(--surface, #ffffff)',
                border: '1.5px solid var(--line, #e2e8f0)'
              }}
            >
              <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                Struktur Pengurus & Tenaga Pelaksana
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Penanggung Jawab Umum</label>
                  <input name="pj_umum" value={formData.pj_umum || ''} onChange={handleChange} placeholder="Nama Kepala Desa / Tokoh" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>PJ Operasional</label>
                  <input name="pj_operasional" value={formData.pj_operasional || ''} onChange={handleChange} placeholder="Nama PJ Operasional" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Ketua Pelaksana</label>
                  <input name="ketua_pelaksana" value={formData.ketua_pelaksana || ''} onChange={handleChange} placeholder="Nama Ketua Posyandu" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Sekretaris</label>
                  <input name="sekretaris" value={formData.sekretaris || ''} onChange={handleChange} placeholder="Nama Sekretaris" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Bendahara</label>
                  <input name="bendahara" value={formData.bendahara || ''} onChange={handleChange} placeholder="Nama Bendahara" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jumlah Kader Aktif</label>
                  <input type="number" inputMode="numeric" name="jml_kader_aktif" value={formData.jml_kader_aktif || ''} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jumlah Kader Tidak Aktif</label>
                  <input type="number" inputMode="numeric" name="jml_kader_tidak_aktif" value={formData.jml_kader_tidak_aktif || ''} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Bidan Desa</label>
                  <input name="bidan_desa" value={formData.bidan_desa || ''} onChange={handleChange} placeholder="Nama Bidan Desa" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Petugas KB</label>
                  <input name="petugas_kb" value={formData.petugas_kb || ''} onChange={handleChange} placeholder="Nama Petugas KB" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Medis & Paramedis</label>
                  <input name="medis_paramedis" value={formData.medis_paramedis || ''} onChange={handleChange} placeholder="Nama Perawat / Dokter" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Keterangan Tambahan Pengurus</label>
                  <textarea rows="2" name="keterangan_profil" value={formData.keterangan_profil || ''} onChange={handleChange} placeholder="Catatan kepengurusan posyandu..." style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px' }}></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SARANA & INVENTARIS SIP */}
          {activeTab === 'sarana' && (
            <div
              className="card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'var(--surface, #ffffff)',
                border: '1.5px solid var(--line, #e2e8f0)'
              }}
            >
              <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                Sarana, Prasarana & Alat Penimbangan (SIP)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tempat Pelayanan</label>
                  <select name="tempat_pelayanan" value={formData.tempat_pelayanan || 'Gedung Sendiri'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}>
                    <option value="Gedung Sendiri">Gedung Sendiri</option>
                    <option value="Menumpang">Menumpang</option>
                    <option value="Sewa">Sewa</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Status Timbangan</label>
                  <select name="timbangan" value={formData.timbangan || 'Tersedia'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Tidak Tersedia">Tidak Tersedia</option>
                  </select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jumlah Dacin (Unit)</label>
                  <input type="number" inputMode="numeric" name="jml_dacin" value={formData.jml_dacin || ''} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jumlah Timbangan Bayi</label>
                  <input type="number" inputMode="numeric" name="timbangan_bayi" value={formData.timbangan_bayi || ''} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jumlah Timbangan Balita</label>
                  <input type="number" inputMode="numeric" name="timbangan_balita" value={formData.timbangan_balita || ''} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jumlah Timbangan Dewasa / Ibu</label>
                  <input type="number" inputMode="numeric" name="timbangan_ibu" value={formData.timbangan_ibu || ''} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Buku KIA</label>
                  <select name="buku_kia" value={formData.buku_kia || 'Tersedia'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Formulir SIP</label>
                  <select name="formulir_sip" value={formData.formulir_sip || 'Tersedia'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Blanko SKDN</label>
                  <select name="blanko_skdn" value={formData.blanko_skdn || 'Tersedia'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Alat Permainan Edukasi (APE)</label>
                  <select name="ape" value={formData.ape || 'Tersedia'} onChange={handleChange} style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff' }}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                </div>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Sarana Lainnya</label>
                  <input name="sarana_lain" value={formData.sarana_lain || ''} onChange={handleChange} placeholder="mis. Ruang tunggu ber-AC, dapur sehat PMT" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOTO & LOKASI GMAPS */}
          {activeTab === 'lokasi' && (
            <div
              className="card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'var(--surface, #ffffff)',
                border: '1.5px solid var(--line, #e2e8f0)'
              }}
            >
              <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                Dokumentasi Bangunan & Titik Lokasi Google Maps
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Foto Bangunan Posyandu</label>
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      textAlign: 'center'
                    }}
                  >
                    {fotoPreview && (
                      <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                        <img src={fotoPreview} alt="Bangunan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nomor Kontak Darurat Posyandu</label>
                    <input name="kontak_darurat" value={formData.kontak_darurat || ''} onChange={handleChange} placeholder="0812-5000-1001" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                  </div>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tautan (Link) Google Maps</label>
                    <input name="link_gmaps" value={formData.link_gmaps || ''} onChange={handleChange} placeholder="https://maps.app.goo.gl/xxxxx" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                    <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', display: 'block' }}>Salin tautan lokasi dari aplikasi Google Maps.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANCHORED SAVE BUTTON */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={FloppyDiskIcon}
              loading={isLoading}
              loadingText="Menyimpan Perubahan..."
            >
              Simpan Seluruh Data Posyandu
            </Button>
          </div>
        </form>
      </div>

      {/* PORTAL CETAK DOKUMEN PDF (SIP) */}
      {isPrinting && printSection === 'profil' && ReactDOM.createPortal(
        <div id="dokumen-cetak">
          <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>Data Profil Posyandu (SIP)</h2>
          <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>Nama Posyandu: {formData.nama || '-'}</h4>
          <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>I. Identitas Wilayah</h3>
          <table className="tabel-cetak">
            <tbody>
              <tr><th>Kode Kecamatan</th><td>{formData.kd_kecamatan || '-'}</td></tr>
              <tr><th>Kode Desa / Kelurahan</th><td>{formData.kd_desa || '-'}</td></tr>
              <tr><th>Rukun Tetangga (RT)</th><td>{formData.rukun_tetangga || '-'}</td></tr>
              <tr><th>Nomor Posyandu</th><td>{formData.nomor_posyandu || '-'}</td></tr>
              <tr><th>Alamat Lengkap</th><td>{formData.alamat || '-'}</td></tr>
            </tbody>
          </table>

          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>II. Profil Posyandu & Kepengurusan</h3>
          <table className="tabel-cetak">
            <tbody>
              <tr><th>Strata Posyandu</th><td>{formData.strata || '-'}</td></tr>
              <tr><th>Program Integrasi PAUD</th><td>{formData.program_paud || 'Tidak'}</td></tr>
              <tr><th>Program Integrasi BKB</th><td>{formData.program_bkb || 'Tidak'}</td></tr>
              <tr><th>Program Lain-lain</th><td>{formData.program_terintegrasi || '-'}</td></tr>
              <tr><th>Penanggung Jawab Umum</th><td>{formData.pj_umum || '-'}</td></tr>
              <tr><th>Penanggung Jawab Operasional</th><td>{formData.pj_operasional || '-'}</td></tr>
              <tr><th>Ketua Pelaksana</th><td>{formData.ketua_pelaksana || '-'}</td></tr>
              <tr><th>Sekretaris</th><td>{formData.sekretaris || '-'}</td></tr>
              <tr><th>Bendahara</th><td>{formData.bendahara || '-'}</td></tr>
            </tbody>
          </table>

          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>III. Tenaga Medis & Kader</h3>
          <table className="tabel-cetak">
            <tbody>
              <tr><th>Jumlah Kader Aktif</th><td>{formData.jml_kader_aktif || 0} Orang</td></tr>
              <tr><th>Jumlah Kader Tidak Aktif</th><td>{formData.jml_kader_tidak_aktif || 0} Orang</td></tr>
              <tr><th>Petugas KB</th><td>{formData.petugas_kb || '-'}</td></tr>
              <tr><th>Medis dan Paramedis</th><td>{formData.medis_paramedis || '-'}</td></tr>
              <tr><th>Bidan Desa</th><td>{formData.bidan_desa || '-'}</td></tr>
              <tr><th>Keterangan Tambahan</th><td style={{ whiteSpace: 'pre-wrap' }}>{formData.keterangan_profil || '-'}</td></tr>
            </tbody>
          </table>
        </div>,
        document.body
      )}

      {isPrinting && printSection === 'sarana' && ReactDOM.createPortal(
        <div id="dokumen-cetak">
          <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>Data Sarana Posyandu (SIP)</h2>
          <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>Nama Posyandu: {formData.nama || '-'}</h4>
          <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>I. Lokasi & Fasilitas Timbangan</h3>
          <table className="tabel-cetak">
            <tbody>
              <tr><th>Tempat Pelayanan</th><td>{formData.tempat_pelayanan || '-'}</td></tr>
              <tr><th>Status Timbangan Keseluruhan</th><td>{formData.timbangan || '-'}</td></tr>
              <tr><th>Jumlah Timbangan Dacin</th><td>{formData.jml_dacin || 0} Unit</td></tr>
              <tr><th>Jumlah Timbangan Bayi</th><td>{formData.timbangan_bayi || 0} Unit</td></tr>
              <tr><th>Jumlah Timbangan Balita</th><td>{formData.timbangan_balita || 0} Unit</td></tr>
              <tr><th>Jumlah Timbangan Ibu</th><td>{formData.timbangan_ibu || 0} Unit</td></tr>
            </tbody>
          </table>

          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>II. Kelengkapan Administrasi & Alat Peraga</h3>
          <table className="tabel-cetak">
            <tbody>
              <tr><th>Buku KIA</th><td>{formData.buku_kia || '-'}</td></tr>
              <tr><th>Formulir SIP</th><td>{formData.formulir_sip || '-'}</td></tr>
              <tr><th>Blanko SKDN</th><td>{formData.blanko_skdn || '-'}</td></tr>
              <tr><th>Buku Catatan Keuangan</th><td>{formData.buku_catatan_keuangan || '-'}</td></tr>
              <tr><th>Alat Peraga Penyuluhan</th><td>{formData.alat_peraga_penyuluhan || '-'}</td></tr>
              <tr><th>Alat Permainan Edukasi (APE)</th><td>{formData.ape || '-'}</td></tr>
              <tr><th>Sarana Lainnya</th><td>{formData.sarana_lain || '-'}</td></tr>
              <tr><th>Keterangan Kondisi Sarana</th><td style={{ whiteSpace: 'pre-wrap' }}>{formData.keterangan_sarana || '-'}</td></tr>
            </tbody>
          </table>
        </div>,
        document.body
      )}
    </>
  );
}
