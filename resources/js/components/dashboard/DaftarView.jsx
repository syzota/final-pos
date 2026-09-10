import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  Location01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  FloppyDiskIcon,
  Building01Icon,
  InformationCircleIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';
import Skeleton from '../common/Skeleton';

export default function DaftarView() {
  const [posyanduList, setPosyanduList] = useState([]);
  const [myPosyanduId, setMyPosyanduId] = useState(null);

  const [formData, setFormData] = useState({ nama: '', alamat: '', keterangan_waktu: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const resAll = await axios.get('/api/profil-posyandu');
      setPosyanduList(resAll.data.data || []);

      const resMe = await axios.get('/api/posyandu/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const myData = resMe.data.data;

      if (myData) {
        setMyPosyanduId(myData.id);
        setFormData({
          nama: myData.nama || '',
          alamat: myData.alamat || '',
          keterangan_waktu: myData.jadwal?.keterangan_waktu || ''
        });
      }
    } catch (err) {
      console.error('Gagal memuat Posyandu:', err.response?.data || err);
      setMessage({
        type: 'error',
        text: err.response?.data?.pesan || err.response?.data?.message || 'Gagal memuat data posyandu.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth_token');
      const submitData = new FormData();
      submitData.append('nama', formData.nama);
      submitData.append('alamat', formData.alamat);
      submitData.append('keterangan_waktu', formData.keterangan_waktu);

      await axios.post('/api/posyandu/me/update', submitData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Perubahan alamat dan jadwal posyandu Anda berhasil disimpan!' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan perubahan posyandu.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ animation: 'fadein 0.3s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <NotificationModal
        isOpen={Boolean(message.text)}
        type={message.type || 'success'}
        message={message.text}
        onClose={() => setMessage({ type: '', text: '' })}
      />

      {/* 1. KARTU PENGELOLAAN JADWAL & ALAMAT POSYANDU SAYA */}
      <div
        className="card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'var(--surface, #ffffff)',
          border: '1.5px solid var(--line, #e2e8f0)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
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
              <Building01Icon size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                Pengaturan Posyandu Anda
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                Perbarui nama, alamat, dan jadwal buka pelayanan bulanan untuk warga
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
              color: 'var(--primary-teal, #008080)',
              border: '1px solid #99f6e4'
            }}
          >
            Unit Terautentikasi
          </span>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="form-field">
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nama Posyandu *</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Posyandu Kemuning 01"
                required
                style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
              />
            </div>
            <div className="form-field">
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jadwal Rutin Pelayanan</label>
              <input
                type="text"
                name="keterangan_waktu"
                value={formData.keterangan_waktu}
                onChange={handleChange}
                placeholder="Contoh: Setiap Tanggal 5 Awal Bulan"
                style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
              />
            </div>
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Alamat Posyandu Lengkap</label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Contoh: Jl. Pelita RT 04 Desa Loa Duri Ulu"
                style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={FloppyDiskIcon}
              loading={isSaving}
              loadingText="Menyimpan..."
            >
              Simpan Jadwal & Alamat
            </Button>
          </div>
        </form>
      </div>

      {/* 2. DIREKTORI RESMI 9 POSYANDU DESA */}
      <div
        className="card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: 'var(--surface, #ffffff)',
          border: '1.5px solid var(--line, #e2e8f0)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
              Direktori 9 Posyandu Desa Loa Duri Ulu
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
              Daftar seluruh posyandu dan jadwal operasional pelayanan masyarakat
            </span>
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: '#f1f5f9',
              color: '#334155'
            }}
          >
            {posyanduList.length} Posyandu Wilayah
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Nama Posyandu</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Alamat Wilayah</th>
                <th style={{ textAlign: 'left', padding: '12px 14px' }}>Jadwal Rutin Pelayanan</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', width: '140px' }}>Status Akun</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <Skeleton type="table-row" rows={4} cols={4} />
              ) : posyanduList.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Belum ada data posyandu terdaftar.
                  </td>
                </tr>
              ) : (
                posyanduList.map((posyandu) => {
                  const isMine = posyandu.id === myPosyanduId;
                  return (
                    <tr
                      key={posyandu.id}
                      style={{
                        backgroundColor: isMine ? '#f0fdfa' : 'transparent',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#0f172a' }}>{posyandu.nama}</strong>
                          {isMine && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: '#008080',
                                color: '#ffffff'
                              }}
                            >
                              Posyandu Anda
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {posyandu.alamat || '-'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            fontSize: '11.5px',
                            fontWeight: 600
                          }}
                        >
                          <Calendar03Icon size={12} color="#64748b" />
                          <span>{posyandu.jadwal?.keterangan_waktu || 'Sesuai Pengumuman'}</span>
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: isMine ? '#f0fdf4' : '#f8fafc',
                            color: isMine ? '#16a34a' : '#64748b',
                            border: isMine ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                          }}
                        >
                          {isMine ? 'Aktif Mengelola' : 'Terdaftar'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}