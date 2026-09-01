import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from '../common/Skeleton';

export default function DaftarView() {
  const [posyanduList, setPosyanduList] = useState([]);
  const [myPosyanduId, setMyPosyanduId] = useState(null);

  // Ubah jadwal_rutin menjadi keterangan_waktu
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
      setPosyanduList(resAll.data.data);

      const resMe = await axios.get('/api/posyandu/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const myData = resMe.data.data;

      setMyPosyanduId(myData.id);
      setFormData({
        nama: myData.nama || '',
        alamat: myData.alamat || '',
        // Ambil dari relasi jadwal
        keterangan_waktu: myData.jadwal?.keterangan_waktu || ''
      });
    } catch (err) {
      console.error(
        'Gagal menyimpan Posyandu:',
        err.response?.data || err
      );

      setMessage({
        type: 'error',
        text:
          err.response?.data?.pesan ||
          err.response?.data?.message ||
          'Gagal menyimpan perubahan.'
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
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

      setMessage({ type: 'success', text: 'Perubahan alamat & jadwal berhasil disimpan!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan perubahan.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="section-head">
        <h3>Daftar 9 Posyandu — Desa Loa Duri Ulu</h3>
        <span className="badge badge-violet">Baris Anda dapat diedit</span>
      </div>

      {message.text && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
          <b>Info Sistem:</b> {message.text}
        </div>
      )}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr><th>Nama Posyandu</th><th>Alamat</th><th>Jadwal Rutin</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Skeleton type="table-row" rows={3} cols={4} />
            ) : (
              posyanduList.map((posyandu) => {
                const isMine = posyandu.id === myPosyanduId;
                return (
                  <tr key={posyandu.id} className={isMine ? 'row-highlight' : ''}>
                    {isMine ? (
                      <>
                        <td><input name="nama" value={formData.nama} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} /></td>
                        <td><input name="alamat" value={formData.alamat} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} /></td>
                        <td><input name="keterangan_waktu" value={formData.keterangan_waktu} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="mis: Tanggal 3" /></td>
                        <td>
                          <button className="btn btn-sm btn-violet" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Menyimpan...' : 'Simpan'}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td><b>{posyandu.nama}</b></td>
                        <td>{posyandu.alamat || '-'}</td>
                        <td>{posyandu.jadwal?.keterangan_waktu || '-'}</td>
                        <td style={{ color: 'var(--ink-faint)', fontSize: '11px' }}>Hanya-lihat</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}