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
  Baby01Icon,
  ViewIcon
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
  const [detailKeluarga, setDetailKeluarga] = useState(null);
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

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmVariant: 'danger', confirmText: 'Ya, Lanjutkan' });

  const handleResetPassword = (id, nama) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Reset PIN',
      message: `Apakah Anda yakin ingin mereset PIN akun warga "${nama}" kembali ke default (000000)?`,
      confirmVariant: 'danger',
      confirmText: 'Ya, Reset PIN',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.put(`/api/warga/${id}/reset-password`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setMessage({ type: 'success', title: 'Reset PIN Berhasil', text: response.data.pesan || `PIN untuk ${nama} berhasil direset ke 000000.` });
        } catch (err) {
          setMessage({ type: 'error', title: 'Gagal Reset PIN', text: err.response?.data?.pesan || 'Gagal mereset PIN akun warga.' });
        }
      }
    });
  };

  const handleDeleteWarga = (id, nama) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Hapus Keluarga',
      message: `Apakah Anda yakin ingin menghapus seluruh data keluarga "${nama}" secara permanen? Seluruh riwayat catatan kesehatan terkait juga akan terhapus.`,
      confirmVariant: 'danger',
      confirmText: 'Ya, Hapus Data',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          await axios.delete(`/api/warga/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setMessage({ type: 'success', title: 'Data Berhasil Dihapus', text: `Data keluarga ${nama} telah berhasil dihapus dari sistem.` });
          fetchWarga();
        } catch (err) {
          setMessage({ type: 'error', title: 'Gagal Menghapus Data', text: 'Gagal menghapus data keluarga warga.' });
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    // Client-side completeness check
    const missing = [];
    if (!formData.nama_lengkap.trim()) missing.push('Nama Kepala Keluarga wajib diisi.');
    if (!formData.no_kk.trim()) {
      missing.push('No. Kartu Keluarga (KK) wajib diisi.');
    } else if (formData.no_kk.trim().length !== 16 || isNaN(formData.no_kk.trim())) {
      missing.push('No. Kartu Keluarga (KK) harus tepat 16 digit angka.');
    }
    if (formData.nik.trim() && (formData.nik.trim().length !== 16 || isNaN(formData.nik.trim()))) {
      missing.push('NIK harus tepat 16 digit angka jika diisi.');
    }

    // Validasi data anak yang diisi
    anakList.forEach((a, i) => {
      const hasNama = Boolean(a.nama && a.nama.trim());
      const hasTgl = Boolean(a.tanggal_lahir && a.tanggal_lahir.trim());
      if (hasNama && !hasTgl) {
        missing.push(`Data anak ke-${i + 1} (${a.nama}): Tanggal lahir wajib diisi.`);
      } else if (!hasNama && hasTgl) {
        missing.push(`Data anak ke-${i + 1}: Nama lengkap anak wajib diisi.`);
      }
    });

    if (missing.length > 0) {
      setMessage({
        type: 'error',
        title: 'Data Pendaftaran Belum Lengkap',
        text: 'Mohon periksa dan lengkapi data formulir pendaftaran keluarga:',
        details: missing
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

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

      setMessage({
        type: 'success',
        title: 'Pendaftaran Berhasil!',
        text: response.data.pesan || `Akun keluarga atas nama ${formData.nama_lengkap} berhasil didaftarkan.`
      });
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
        const errorList = [];
        Object.keys(backendErrors).forEach((key) => {
          const errItem = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key];
          if (FORM_FIELDS.includes(key)) {
            localErrors[key] = errItem;
          }
          errorList.push(errItem);
        });
        setErrors(localErrors);
        setMessage({
          type: 'error',
          title: 'Validasi Data Gagal',
          text: 'Terdapat isian yang belum sesuai dengan kriteria sistem:',
          details: errorList
        });
      } else {
        const pesan = err.response?.data?.pesan || err.response?.data?.message || err.message;
        setMessage({
          type: 'error',
          title: 'Gagal Menyimpan Data',
          text: `Terjadi kendala saat menyimpan data keluarga: ${pesan}`
        });
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
        .warga-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 8px;
          margin-top: 2px;
          gap: 8px;
        }
        .warga-card-meta {
          font-size: 11.5px;
          color: #94a3b8;
        }
        .warga-card-actions {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .warga-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .warga-card-footer {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .warga-card-actions {
            display: flex !important;
            width: 100% !important;
            gap: 6px !important;
          }
          .warga-card-actions > * {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            padding-left: 4px !important;
            padding-right: 4px !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .warga-card-actions > * span {
            white-space: nowrap !important;
            font-size: 11.5px !important;
          }
        }
      `}</style>

      <div style={{ animation: 'fadein 0.3s ease' }}>
        <NotificationModal
          isOpen={Boolean(message.text || message.details)}
          type={message.type || 'success'}
          title={message.title}
          message={message.text}
          details={message.details}
          onClose={() => setMessage({ type: '', title: '', text: '', details: null })}
        />

        <NotificationModal
          isOpen={confirmModal.isOpen}
          type="confirm"
          isConfirm={true}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          confirmVariant={confirmModal.confirmVariant}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
        />

        {/* MODAL DETAIL ANGGOTA KELUARGA (Poin 18) */}
        {detailKeluarga && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '16px'
            }}
            onClick={() => setDetailKeluarga(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e2e8f0',
                padding: '24px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e6f3f3', color: '#008080', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserGroupIcon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Detail Anggota Keluarga
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Kepala Keluarga: <b>{detailKeluarga.nama_kepala_keluarga}</b>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailKeluarga(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                  title="Tutup Modal"
                >
                  <Cancel01Icon size={20} />
                </button>
              </div>

              {/* INFO KK & NIK */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', padding: '12px 14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Nomor KK</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{detailKeluarga.no_kk || '-'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>NIK Kepala Keluarga</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{detailKeluarga.nik_kepala_keluarga || detailKeluarga.nik || '-'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', fontWeight: 600 }}>Kontak / WhatsApp</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#008080' }}>{detailKeluarga.no_hp || '-'}</span>
                </div>
              </div>

              {/* ANGGOTA DEWASA / PASANGAN */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck01Icon size={14} color="#008080" />
                  Anggota Dewasa / Pasangan
                </h4>
                {(!detailKeluarga.dewasa || detailKeluarga.dewasa.length === 0) ? (
                  <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                    Belum ada rincian pasangan tercatat.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {detailKeluarga.dewasa.map((dew, i) => (
                      <div key={dew.id || i} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{dew.nama_lengkap}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                            {dew.nama_lengkap === detailKeluarga.nama_kepala_keluarga ? 'Kepala Keluarga' : 'Pasangan / Istri'}
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: dew.jenis_kelamin === 'L' ? '#e0f2fe' : '#fce7f3', color: dew.jenis_kelamin === 'L' ? '#0369a1' : '#be185d' }}>
                          {dew.jenis_kelamin === 'L' ? 'L (Laki-laki)' : 'P (Perempuan)'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ANGGOTA ANAK */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Baby01Icon size={14} color="#0284c7" />
                  Daftar Anggota Anak ({detailKeluarga.anak ? detailKeluarga.anak.length : 0})
                </h4>
                {(!detailKeluarga.anak || detailKeluarga.anak.length === 0) ? (
                  <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                    Belum ada data anak terdaftar dalam keluarga ini.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {detailKeluarga.anak.map((ank, i) => (
                      <div key={ank.id || i} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{ank.nama_anak}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                            Tgl Lahir: {ank.tanggal_lahir ? new Date(ank.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: ank.jenis_kelamin === 'L' ? '#e0f2fe' : '#fce7f3', color: ank.jenis_kelamin === 'L' ? '#0369a1' : '#be185d' }}>
                          {ank.jenis_kelamin === 'L' ? 'L (Laki-laki)' : 'P (Perempuan)'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <Button variant="secondary" size="sm" onClick={() => setDetailKeluarga(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        )}

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
                      <div
                        onClick={() => setDetailKeluarga(warga)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}
                        title="Klik untuk melihat detail anggota keluarga"
                      >
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

                      <div className="warga-card-footer">
                        <span className="warga-card-meta">
                          NIK: {warga.nik || '-'} • HP: {warga.no_hp || '-'}
                        </span>

                        <div className="warga-card-actions">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={ViewIcon}
                            onClick={() => setDetailKeluarga(warga)}
                            title="Lihat detail anggota keluarga"
                          >
                            Detail
                          </Button>
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
                    <option value="Duda">Duda</option>
                    <option value="Janda">Janda</option>
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

                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
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

                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
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
                    iconOnly
                    onClick={handleAddAnak}
                    title="Tambah Data Anak"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {anakList.map((anak, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      {anakList.length > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                            Data Anak #{index + 1}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                          Nama Lengkap Anak
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan nama lengkap anak"
                          value={anak.nama}
                          onChange={(e) => handleAnakChange(index, 'nama', e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '42px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            padding: '0 12px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          value={anak.tanggal_lahir}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleAnakChange(index, 'tanggal_lahir', e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '42px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            padding: '0 12px',
                            fontSize: '13px',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                          Jenis Kelamin
                        </label>
                        <select
                          value={anak.jenis_kelamin}
                          onChange={(e) => handleAnakChange(index, 'jenis_kelamin', e.target.value)}
                          style={{
                            width: '100%',
                            minHeight: '42px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            padding: '0 12px',
                            fontSize: '13px',
                            backgroundColor: '#fff',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>

                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={Cancel01Icon}
                        fullWidth
                        onClick={() => {
                          if (anakList.length > 1) {
                            handleRemoveAnak(index);
                          } else {
                            setAnakList([{ nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }]);
                          }
                        }}
                        style={{ marginTop: '2px' }}
                      >
                        {anakList.length > 1 ? 'Hapus Data Anak' : 'Kosongkan Data'}
                      </Button>
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
                loadingText="Menyimpan..."
                fullWidth
              >
                Simpan Data
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
