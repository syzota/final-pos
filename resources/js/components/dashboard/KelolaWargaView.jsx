import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, KeyRound, Trash2, Users, AlertCircle, Plus, X } from 'lucide-react';

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

  const handleResetPassword = async (id) => {
    if (window.confirm('Reset PIN akun warga ini menjadi default (123456)?')) {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.post(`/api/warga/${id}/reset-password`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: response.data.pesan || 'PIN berhasil direset ke 123456' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal mereset PIN warga.' });
      }
    }
  };

  const handleDeleteWarga = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus seluruh data keluarga ${nama}? Tindakan ini tidak dapat dibatalkan.`)) {
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

      setMessage({ type: 'success', text: response.data.pesan || 'Akun warga berhasil dibuat.' });
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
      (w.no_kk || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ animation: 'fadein 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* KIRI: DAFTAR AKUN WARGA */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#008080" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Daftar Akun Warga</h3>
            </div>
            <span className="badge badge-violet" style={{ fontSize: '12px', fontWeight: 700 }}>
              {wargaList.length} Keluarga
            </span>
          </div>

          {/* SEARCH BAR DENGAN ICON & BORDER JELAS */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
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
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div className="table-responsive" style={{ maxHeight: '480px', overflowY: 'auto' }}>
            <table className="table" style={{ fontSize: '13px', width: '100%' }}>
              <thead>
                <tr>
                  <th>Kepala Keluarga</th>
                  <th>No. KK</th>
                  <th>Anak</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarga.length > 0 ? (
                  filteredWarga.map((warga, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{warga.nama_kepala_keluarga}</strong>
                      </td>
                      <td>{warga.no_kk}</td>
                      <td>{warga.anak_count || 0}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => handleResetPassword(warga.id)}
                            style={{
                              minHeight: '34px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Reset PIN warga menjadi 123456"
                          >
                            <KeyRound size={13} /> Reset PIN
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWarga(warga.id, warga.nama_kepala_keluarga)}
                            style={{
                              minHeight: '34px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Hapus data keluarga"
                          >
                            <Trash2 size={13} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                      {searchQuery ? 'Tidak ditemukan warga yang cocok.' : 'Belum ada data warga terdaftar.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
            <AlertCircle size={14} color="#008080" />
            <span>Reset PIN akan mengembalikan kata sandi warga ke default (123456).</span>
          </div>
        </div>

        {/* KANAN: FORM REGISTRASI WARGA */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <UserPlus size={20} color="#008080" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Registrasi Keluarga Baru</h3>
          </div>

          {message.text && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                color: message.type === 'error' ? '#b91c1c' : '#15803d'
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-field">
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Nama Lengkap Kepala Keluarga
              </label>
              <input
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleInputChange}
                placeholder="mis. Herman Wijaya"
                style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
              />
              {errors.nama_lengkap && <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.nama_lengkap}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Jenis Kelamin
                </label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleInputChange}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Status Pernikahan
                </label>
                <select
                  name="status_pernikahan"
                  value={formData.status_pernikahan}
                  onChange={handleInputChange}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
                >
                  <option value="Menikah">Menikah</option>
                  <option value={formData.jenis_kelamin === 'L' ? 'Duda' : 'Janda'}>
                    {formData.jenis_kelamin === 'L' ? 'Duda' : 'Janda'}
                  </option>
                </select>
              </div>
            </div>

            {formData.status_pernikahan === 'Menikah' && (
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  {formData.jenis_kelamin === 'L' ? 'Nama Istri' : 'Nama Suami'}
                </label>
                <input
                  name="nama_istri"
                  value={formData.nama_istri}
                  onChange={handleInputChange}
                  placeholder={formData.jenis_kelamin === 'L' ? 'mis. Ibu Siti Aminah' : 'mis. Bapak Herman'}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  NIK Kepala Keluarga (16 Digit)
                </label>
                <input
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="16 Digit NIK"
                  maxLength={16}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
                />
                {errors.nik && <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.nik}</span>}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  No. Kartu Keluarga (16 Digit)
                </label>
                <input
                  name="no_kk"
                  value={formData.no_kk}
                  onChange={handleInputChange}
                  placeholder="16 Digit No. KK"
                  maxLength={16}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
                />
                {errors.no_kk && <span style={{ color: '#dc2626', fontSize: '12px' }}>{errors.no_kk}</span>}
              </div>
            </div>

            {/* List Anak Sasaran */}
            <div style={{ marginTop: '8px', padding: '16px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Anggota Anak / Balita</span>
                <button
                  type="button"
                  onClick={handleAddAnak}
                  style={{
                    minHeight: '32px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: 'var(--primary-teal, #008080)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} /> Tambah Anak
                </button>
              </div>

              {anakList.map((anak, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nama Anak"
                    value={anak.nama}
                    onChange={(e) => handleAnakChange(idx, 'nama', e.target.value)}
                    style={{ width: '100%', minHeight: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '12.5px' }}
                  />
                  <input
                    type="date"
                    value={anak.tanggal_lahir}
                    onChange={(e) => handleAnakChange(idx, 'tanggal_lahir', e.target.value)}
                    style={{ width: '100%', minHeight: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 8px', fontSize: '12.5px' }}
                  />
                  <select
                    value={anak.jenis_kelamin}
                    onChange={(e) => handleAnakChange(idx, 'jenis_kelamin', e.target.value)}
                    style={{ width: '100%', minHeight: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 6px', fontSize: '12.5px' }}
                  >
                    <option value="L">L</option>
                    <option value="P">P</option>
                  </select>
                  {anakList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAnak(idx)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                minHeight: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-teal, #008080)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '14px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '8px'
              }}
            >
              {isLoading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Warga Baru'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
