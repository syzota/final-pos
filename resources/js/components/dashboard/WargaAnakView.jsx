import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import NotificationModal from '../common/NotificationModal';
import Button from '../common/Button';

import {
  InformationCircleIcon,
  Alert02Icon,
  CheckmarkCircle01Icon,
  Add01Icon,
  UserIcon,
  Cancel01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function WargaAnakView() {
  const [currentAnakIdx, setCurrentAnakIdx] = useState(0);

  // State Data dari Database
  const [anakList, setAnakList] = useState([]);
  const [lansiaBumilList, setLansiaBumilList] = useState([]); // <-- Diubah menjadi Array

  // State Status Loading & Pesan
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // === STATE MODAL TAMBAH ANAK ===
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAnak, setNewAnak] = useState({
    nama_anak: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L'
  });

  const tileColors = [
    ['var(--cyan-bg)', 'var(--cyan-deep)'],
    ['var(--orange-bg)', 'var(--orange-deep)'],
    ['var(--violet-bg)', 'var(--violet-deep)']
  ];

  const fetchRaporKeluarga = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/warga/rapor-keluarga', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = response.data.data;
      setAnakList(data.anak || []);
      setLansiaBumilList(data.anggotaLansiaBumil || []); // <-- Menerima Array dari Laravel
    } catch (error) {
      console.error("Gagal menarik rapor:", error);
      setErrorMsg('Gagal memuat rapor kesehatan keluarga.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRaporKeluarga();
  }, []);

  // Lock scroll and handle Escape key for showAddModal
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAddModal && !isSubmitting) {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAddModal, isSubmitting]);

  // === FUNGSI SUBMIT ANAK BARU ===
  const handleAddAnak = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post('/api/warga/anak', newAnak, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setSuccessMsg(response.data.pesan);
      setShowAddModal(false);
      setNewAnak({ nama_anak: '', tanggal_lahir: '', jenis_kelamin: 'L' }); // Reset form

      // Refresh data agar anak baru langsung muncul di layar
      fetchRaporKeluarga();
    } catch (error) {
      const pesanAsli = error.response?.data?.message || error.message;
      setErrorMsg(`Gagal menambah data anak: ${pesanAsli}`);
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Membuka Rapor Kesehatan Keluarga... ⏳</div>;
  }

  const currentAnak = anakList[currentAnakIdx] || null;

  return (
    <div style={{ animation: 'fadein 0.4s ease' }}>

      {/* NOTIFIKASI INFO / ERROR */}
      <div className="callout" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <InformationCircleIcon size={18} />
        <span>Data Rapor Kesehatan dicatat langsung oleh Kader Posyandu saat jadwal penimbangan.</span>
      </div>

      <NotificationModal
        isOpen={Boolean(errorMsg || successMsg)}
        type={errorMsg ? 'error' : 'success'}
        message={errorMsg || successMsg}
        onClose={() => {
          setErrorMsg('');
          setSuccessMsg('');
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>

        {/* === MENU ANAK === */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Rapor Bayi & Balita</h3>
            <Button
              variant="primary"
              size="sm"
              icon={Add01Icon}
              onClick={() => setShowAddModal(true)}
              title="Tambah Data Anak"
              aria-label="Tambah Data Anak"
            >
              + Tambah Anak
            </Button>
          </div>

          {anakList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {anakList.map((a, i) => {
                const c = tileColors[i % tileColors.length];
                const isSelected = i === currentAnakIdx;
                return (
                  <div
                    key={i}
                    className={`card pad-sm ${isSelected ? 'row-highlight' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '.15s', border: isSelected ? `1px solid ${c[1]}` : '1px solid #e2e8f0', boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none' }}
                    onClick={() => setCurrentAnakIdx(i)}
                  >
                    <div className="bidang-icon-tile" style={{ background: c[0], color: c[1] }}>
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '13px', margin: 0, color: '#334155' }}>{a.nama}</p>
                      <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, margin: 0 }}>{a.usia} · {a.gender}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
              Belum ada data bayi/balita.<br/>Silakan klik tombol <b>+ Tambah Anak</b> di atas.
            </div>
          )}
        </div>

        {/* === RIWAYAT PEMERIKSAAN ANAK === */}
        <div className="card">
          <div className="section-head">
            <h3>Riwayat Pemeriksaan — {currentAnak ? currentAnak.nama : 'Pilih Anak'}</h3>
            <span className="badge badge-cyan" style={{ background: 'var(--cyan-bg)', color: 'var(--cyan-deep)' }}>Dicatat Kader</span>
          </div>

          {currentAnak ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Berat Badan</th>
                    <th>Tinggi Badan</th>
                    <th>Status Gizi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAnak.riwayat && currentAnak.riwayat.length > 0 ? (
                    currentAnak.riwayat.map((r, i) => (
                      <tr key={i}>
                        <td><b>{r.bulan}</b></td>
                        <td>{r.bb}</td>
                        <td>{r.tb}</td>
                        <td>
                          <span className={`badge ${r.status.includes('Normal') ? 'badge-green' : 'badge-orange'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>Anak ini belum pernah diperiksa di Posyandu.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500, marginTop: '12px' }}>
                Menampilkan hasil penimbangan dari yang paling terbaru.
              </p>
            </div>
          ) : (
             <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '13.5px' }}>Pilih profil anak di sebelah kiri untuk melihat rapor pertumbuhannya.</div>
          )}
        </div>
      </div>

      {/* === RIWAYAT LANSIA / BUMIL === */}
      <div className="card" style={{ marginTop: '16px' }}>
        <div className="section-head">
          <h3>Rapor Kesehatan Orang Tua & Ibu Hamil</h3>
          <span className="badge badge-cyan" style={{ background: 'var(--cyan-bg)', color: 'var(--cyan-deep)' }}>Dicatat Kader</span>
        </div>

        {lansiaBumilList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {lansiaBumilList.map((lansiaBumil, index) => (
              <div key={index} style={{ borderBottom: index !== lansiaBumilList.length - 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: index !== lansiaBumilList.length - 1 ? '16px' : '0' }}>
                <p style={{ fontSize: '13px', color: '#334155', fontWeight: 700, marginBottom: '12px' }}>
                  Data Pemeriksaan: <span style={{ color: 'var(--violet-deep)' }}>{lansiaBumil.nama}</span> — {lansiaBumil.jenis === 'bumil' ? 'Ibu Hamil' : 'Lansia'}
                </p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bulan Periksa</th>
                        <th>{lansiaBumil.jenis === 'bumil' ? 'Ukuran LILA' : 'Berat Badan'}</th>
                        <th>Tekanan Darah (Tensi)</th>
                        <th>Status Evaluasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lansiaBumil.riwayat && lansiaBumil.riwayat.length > 0 ? (
                        lansiaBumil.riwayat.map((r, i) => (
                          <tr key={i}>
                            <td><b>{r.bulan}</b></td>
                            <td>{r.ukuran}</td>
                            <td>{r.tensi}</td>
                            <td>
                              <span className={`badge ${r.status.includes('Normal') ? 'badge-green' : 'badge-orange'}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>Belum ada data pemeriksaan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500, padding: '10px 0' }}>
            Akun Anda belum memiliki data Rapor Lansia atau Ibu Hamil.
            Hal ini terjadi apabila anggota keluarga belum melakukan pemeriksaan.
          </p>
        )}
      </div>

      {/* =========================================
          MODAL TAMBAH ANAK BARU
          ========================================= */}
      {showAddModal && createPortal(
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => { if (!isSubmitting) setShowAddModal(false); }}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '450px', backgroundColor: '#fff', borderRadius: '16px', padding: '24px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
              aria-label="Tutup"
            >
              <Cancel01Icon size={16} />
            </button>

            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--cyan-deep)', margin: 0 }}>Tambah Data Anak</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Data anak akan otomatis tertaut dengan Posyandu keluarga Anda.</p>
            </div>

            <form onSubmit={handleAddAnak} className="form-grid">
              <div className="form-field full">
                <label>Nama Lengkap Anak</label>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama lengkap..."
                  value={newAnak.nama_anak}
                  onChange={(e) => setNewAnak({...newAnak, nama_anak: e.target.value})}
                />
              </div>
              <div className="form-field">
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  required
                  value={newAnak.tanggal_lahir}
                  onChange={(e) => setNewAnak({...newAnak, tanggal_lahir: e.target.value})}
                  max={new Date().toISOString().split('T')[0]} // Tidak boleh melebihi hari ini
                />
              </div>
              <div className="form-field">
                <label>Jenis Kelamin</label>
                <select
                  value={newAnak.jenis_kelamin}
                  onChange={(e) => setNewAnak({...newAnak, jenis_kelamin: e.target.value})}
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="form-field full" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} disabled={isSubmitting} style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting} loading={isSubmitting} loadingText="Menyimpan..." style={{ flex: 1 }}>
                  Simpan Data
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}