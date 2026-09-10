import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  Search01Icon,
  UserAdd01Icon,
  Key01Icon,
  Delete02Icon,
  UserGroupIcon,
  AlertCircleIcon,
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  UserCheck01Icon,
  Baby01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const FORM_FIELDS = [
  'nama_lengkap',
  'jenis_kelamin',
  'nik',
  'no_kk',
  'no_hp',
  'status_pernikahan',
  'nama_istri'
];

export default function KelolaWargaView({ posyandu }) {
  const [wargaList, setWargaList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    jenis_kelamin: 'L',
    nik: '',
    no_kk: '',
    no_hp: '',
    status_pernikahan: 'Menikah',
    nama_istri: ''
  });
  const [errors, setErrors] = useState({});
  const [anakList, setAnakList] = useState([
    { nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchWarga = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/warga', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      setWargaList(response.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data warga:', err);
    }
  };

  useEffect(() => {
    fetchWarga();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'nik' || name === 'no_kk' || name === 'no_hp') {
      finalValue = value.replace(/[^0-9]/g, '');
    }

    if (name === 'jenis_kelamin') {
      setFormData({
        ...formData,
        jenis_kelamin: value,
        status_pernikahan: 'Menikah',
        nama_istri: ''
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: finalValue
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAnakChange = (index, field, value) => {
    const newList = [...anakList];
    newList[index][field] = value;
    setAnakList(newList);
  };

  const handleAddAnak = () => {
    setAnakList([...anakList, { nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }]);
  };

  const handleRemoveAnak = (index) => {
    const newList = [...anakList];
    newList.splice(index, 1);
    setAnakList(newList);
  };

  const handleResetPassword = async (id, nama) => {
    if (window.confirm(`Reset PIN akun warga "${nama}" menjadi default (123456)?`)) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(`/api/warga/${id}/reset-password`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: response.data.pesan || `PIN untuk ${nama} berhasil direset ke 123456.` });
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal mereset PIN warga.' });
      }
    }
  };

  const handleDeleteWarga = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus seluruh data keluarga "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/warga/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: `Data keluarga ${nama} berhasil dihapus.` });
        fetchWarga();
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal menghapus data warga.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    try {
      const token = localStorage.getItem('auth_token');
      const payload = {
        ...formData,
        posyandu: posyandu || 'Loa Duri Ulu',
        anak: anakList.filter(a => a.nama.trim() !== '')
      };

      const response = await axios.post('/api/warga', payload, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      setMessage({ type: 'success', text: response.data.pesan || 'Akun warga dan data keluarga berhasil dibuat.' });
      setFormData({
        nama_lengkap: '',
        jenis_kelamin: 'L',
        nik: '',
        no_kk: '',
        no_hp: '',
        status_pernikahan: 'Menikah',
        nama_istri: ''
      });
      setAnakList([{ nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }]);
      fetchWarga();
    } catch (err) {
      if (err.response?.status === 422) {
        const backendErrors = err.response.data.errors || {};
        const localErrors = {};
        Object.keys(backendErrors).forEach((key) => {
          if (FORM_FIELDS.includes(key)) {
            localErrors[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key];
          }
        });
        setErrors(localErrors);
        setMessage({ type: 'error', text: 'Terdapat isian yang belum sesuai validasi.' });
      } else {
        const pesan = err.response?.data?.message || err.message;
        setMessage({ type: 'error', text: `Gagal: ${pesan}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWarga = wargaList.filter(w => {
    const q = searchQuery.toLowerCase();
    return (
      (w.nama_kepala_keluarga || '').toLowerCase().includes(q) ||
      (w.no_kk || '').toLowerCase().includes(q) ||
      (w.nik || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{`
        .warga-grid-container {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .warga-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ animation: 'fadein 0.3s ease' }}>
        <NotificationModal
          isOpen={Boolean(message.text)}
          type={message.type || 'success'}
          message={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />

        <div className="warga-grid-container">
          {/* KOLOM KIRI: DAFTAR AKUN & KELUARGA WARGA */}
          <div
            className="card"
            style={{
              minWidth: 0,
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface, #ffffff)',
              border: '1.5px solid var(--line, #e2e8f0)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  <UserGroupIcon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
                    Daftar Akun Keluarga Warga
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                    Terdaftar di {posyandu || 'Posyandu Desa'}
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                  color: 'var(--primary-teal, #008080)',
                  border: '1px solid #99f6e4'
                }}
              >
                {wargaList.length} Keluarga
              </span>
            </div>

            {/* SEARCH BAR */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search01Icon
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="text"
                placeholder="Cari nama kepala keluarga atau No. KK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  padding: '0 14px 0 42px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
              {filteredWarga.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <UserGroupIcon size={36} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>Warga Tidak Ditemukan</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Tidak ada data yang cocok dengan kata kunci "{searchQuery}".</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredWarga.map((warga, idx) => (
                    <div
                      key={warga.id || idx}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <UserCheck01Icon size={18} />
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                              {warga.nama_kepala_keluarga}
                            </h4>
                            <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                              No. KK: <b>{warga.no_kk || '-'}</b>
                            </span>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f0fdfa',
                            color: '#008080',
                            border: '1px solid #ccfbf1',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Baby01Icon size={12} />
                          <span>{warga.anak_count || 0} Anak</span>
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                          NIK: {warga.nik || '-'} • HP: {warga.no_hp || '-'}
                        </span>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Key01Icon}
                            onClick={() => handleResetPassword(warga.id, warga.nama_kepala_keluarga)}
                            title="Reset PIN ke default (123456)"
                          >
                            Reset PIN
                          </Button>
                          <Button
                            variant="danger-outline"
                            size="sm"
                            icon={Delete02Icon}
                            onClick={() => handleDeleteWarga(warga.id, warga.nama_kepala_keluarga)}
                            title="Hapus data keluarga"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: FORM PENDAFTARAN WARGA BARU */}
          <div
            id="warga-form-container"
            className="card"
            style={{
              minWidth: 0,
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface, #ffffff)',
              border: '1.5px solid var(--line, #e2e8f0)'
            }}
          >
            <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                <UserAdd01Icon size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                  Pendaftaran Akun Keluarga Baru
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                  Input data kepala keluarga dan anggota keluarga balita
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nama Kepala Keluarga *</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    placeholder="Contoh: Bpk. Ahmad Hidayat"
                    required
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: errors.nama_lengkap ? '1.5px solid #ef4444' : '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                  {errors.nama_lengkap && <span style={{ color: '#ef4444', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>{errors.nama_lengkap}</span>}
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                  <select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '14px' }}
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Status Pernikahan</label>
                  <select
                    name="status_pernikahan"
                    value={formData.status_pernikahan}
                    onChange={handleInputChange}
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '14px' }}
                  >
                    <option value="Menikah">Menikah</option>
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Cerai">Cerai</option>
                  </select>
                </div>

                {formData.jenis_kelamin === 'L' && formData.status_pernikahan === 'Menikah' && (
                  <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nama Istri / Pasangan</label>
                    <input
                      type="text"
                      name="nama_istri"
                      value={formData.nama_istri}
                      onChange={handleInputChange}
                      placeholder="Contoh: Ibu Nurjanah"
                      style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                    />
                  </div>
                )}

                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>NIK (16 Digit Angka)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="6402..."
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: errors.nik ? '1.5px solid #ef4444' : '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>16 digit sesuai KTP/KK</span>
                  {errors.nik && <span style={{ color: '#ef4444', fontSize: '11.5px', marginTop: '2px', display: 'block' }}>{errors.nik}</span>}
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>No. Kartu Keluarga (KK) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    name="no_kk"
                    value={formData.no_kk}
                    onChange={handleInputChange}
                    placeholder="6402..."
                    required
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: errors.no_kk ? '1.5px solid #ef4444' : '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>16 digit nomor KK</span>
                  {errors.no_kk && <span style={{ color: '#ef4444', fontSize: '11.5px', marginTop: '2px', display: 'block' }}>{errors.no_kk}</span>}
                </div>

                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleInputChange}
                    placeholder="Contoh: 081234567890"
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* SECTION ANGGOTA KELUARGA ANAK */}
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Data Anggota Anak (Opsional)
                  </div>
                  <Button
                    variant="teal"
                    size="sm"
                    icon={Add01Icon}
                    onClick={handleAddAnak}
                  >
                    Tambah Anak
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {anakList.map((anak, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 0.8fr auto',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Nama Anak"
                        value={anak.nama}
                        onChange={(e) => handleAnakChange(index, 'nama', e.target.value)}
                        style={{ width: '100%', minHeight: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '12.5px' }}
                      />
                      <input
                        type="date"
                        value={anak.tanggal_lahir}
                        onChange={(e) => handleAnakChange(index, 'tanggal_lahir', e.target.value)}
                        style={{ width: '100%', minHeight: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '12px' }}
                      />
                      <select
                        value={anak.jenis_kelamin}
                        onChange={(e) => handleAnakChange(index, 'jenis_kelamin', e.target.value)}
                        style={{ width: '100%', minHeight: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 8px', fontSize: '12.5px', backgroundColor: '#fff' }}
                      >
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                      {anakList.length > 1 && (
                        <Button
                          variant="danger-outline"
                          size="sm"
                          iconOnly
                          icon={Cancel01Icon}
                          onClick={() => handleRemoveAnak(index)}
                          title="Hapus Anak"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={UserAdd01Icon}
                loading={isLoading}
                loadingText="Mendaftarkan Akun..."
                fullWidth
              >
                Daftarkan Akun Warga
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
