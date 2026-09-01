import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ShieldAlert } from 'lucide-react';

export default function WargaPasswordView() {
  const [formData, setFormData] = useState({
    username: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Tarik username saat ini ketika halaman dibuka
  useEffect(() => {
    const fetchMyAccount = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // Asumsi backend menggunakan kolom 'name' untuk nama akun/username
        setFormData(prev => ({ ...prev, username: response.data.data.name || '' }));
      } catch (err) {
        console.error("Gagal memuat data akun", err);
      }
    };
    fetchMyAccount();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validasi dasar di sisi Frontend
    if (formData.new_password && formData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal harus 6 karakter.' });
      setIsLoading(false);
      return;
    }
    if (formData.new_password !== formData.new_password_confirmation) {
      setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      await axios.put('/api/warga/update-akun', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Data Akun & Password berhasil diperbarui!' });
      // Kosongkan kolom password setelah berhasil
      setFormData(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));
    } catch (err) {
      // Menangkap error validasi dari Laravel (misal: password lama salah)
      const errorMsg = err.response?.data?.message || 'Gagal memperbarui akun. Pastikan password lama Anda benar.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '450px' }}>
      <div className="section-head">
        <h3><ShieldAlert className="me-2" />Pengaturan Akun</h3>
      </div>

      <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
        Anda dapat mengubah nama tampilan (username) dan kata sandi untuk keamanan akun Anda.
      </p>

      {message.text && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
          <b>Info Sistem:</b> {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="form-field" style={{ marginBottom: '16px' }}>
          <label>Username / Nama Akun</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nama Anda"
            required
          />
        </div>

        <div style={{ borderTop: '1px solid #eee', margin: '20px 0' }}></div>

        <div className="form-field" style={{ marginBottom: '12px' }}>
          <label>Password Saat Ini <span style={{ color: 'red' }}>*</span></label>
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            placeholder="Wajib diisi untuk mengubah data"
            required
          />
        </div>

        <div className="form-field" style={{ marginBottom: '12px' }}>
          <label>Password Baru (Opsional)</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="Kosongkan jika tidak ingin mengubah password"
          />
        </div>

        <div className="form-field" style={{ marginBottom: '24px' }}>
          <label>Ulangi Password Baru</label>
          <input
            type="password"
            name="new_password_confirmation"
            value={formData.new_password_confirmation}
            onChange={handleChange}
            placeholder="Ulangi password baru Anda"
          />
        </div>

        <button type="submit" className="btn btn-violet" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan Akun'}
        </button>
      </form>
    </div>
  );
}