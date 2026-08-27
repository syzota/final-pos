import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import logo from '../assets/images/common/logo-header.jpeg';

export default function Login({ onNavigate, onLogin }) {
  const [loginType, setLoginType] = useState('pengelola');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State baru untuk fitur mata
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (type) => {
    setLoginType(type);
    setError('');
    setUsername('');
    setPassword('');
    setShowPassword(false); // Kembalikan sandi menjadi tertutup saat ganti tab
  };

  const handleLogin = async () => {
    // 1. Validasi kosong
    if (!username || !password) {
      setError('Username dan kata sandi tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 2. Tembak API Login Laravel
      const response = await axiosClient.post('/login', {
          username,
          password,
      });

      // 3. Ekstrak data dari JSON
      const token = response.data.data.token;
      const user = response.data.data.user;

      // ==========================================
      // 4. CEK SILANG TIPE LOGIN VS JABATAN ASLI
      // ==========================================
      if (loginType === 'warga' && user.role !== 'warga') {
        throw new Error('Gagal: Anda menggunakan akun Pengelola. Silakan pindah ke tab "Akun Pengelola".');
      }

      if (loginType === 'pengelola' && user.role === 'warga') {
        throw new Error('Gagal: Anda menggunakan akun Warga. Silakan pindah ke tab "Akun Warga".');
      }
      // ==========================================

      // 5. Jika lolos cek silang, simpan Token ke brankas
      localStorage.setItem('auth_token', token);

      // TAMBAHKAN INI: Simpan data user (termasuk role & posyandu) ke LocalStorage
      localStorage.setItem('auth_user', JSON.stringify(user));

      // 6. Kirim data user aslinya ke App.jsx agar halaman berpindah
      onLogin(user);

    } catch (err) {
      console.error("Gagal Login:", err);
      if (err.message && err.message.startsWith('Gagal:')) {
        setError(err.message);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Koneksi ke server gagal atau Username/Sandi salah.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-screen">
      <div className="login-card">
        <div className="brand-mark">
          <img src={logo} alt="Logo Posyandu" />
        </div>
        <h1 style={{ fontSize: '21px', marginBottom: '4px', fontWeight: 700, color: 'var(--ink)' }}>Posyandu Loa Duri Ulu</h1>
        <p className="login-sub">Masuk untuk mencatat & melaporkan kegiatan Posyandu</p>

        <div className="role-toggle">
          <button
            className={`role-btn ${loginType === 'pengelola' ? 'active' : ''}`}
            onClick={() => handleTypeChange('pengelola')}
            style={{ flex: '1 1 45%' }}
          >
            Akun Pengelola
          </button>
          <button
            className={`role-btn ${loginType === 'warga' ? 'active' : ''}`}
            onClick={() => handleTypeChange('warga')}
            style={{ flex: '1 1 45%' }}
          >
            Akun Warga
          </button>
        </div>

        {/* Form Field: Username (Sekarang dinamis) */}
        <div className="field">
          <label id="usernameLabel">
            Username {loginType === 'warga' && '(Gunakan NIK)'}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={loginType === 'warga' ? 'Masukkan 16 digit NIK' : 'mis. kader.melati'}
            disabled={isLoading}
          />
        </div>

        {/* Form Field: Password (Dengan fitur Show/Hide) */}
        <div className="field">
          <label id="passwordLabel">{loginType === 'warga' ? 'Kata Sandi (default: NIK)' : 'Kata Sandi'}</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              style={{ width: '100%', paddingRight: '40px' }} // Beri ruang di kanan agar teks tidak tertimpa ikon
            />
            {/* Tombol Mata */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                padding: '0',
                cursor: 'pointer',
                color: 'var(--ink-soft)', // Sesuaikan dengan warna teks sekunder aplikasi
                display: 'flex'
              }}
              title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
            >
              {showPassword ? (
                // Ikon Eye-Off (Mata Disilang)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                // Ikon Eye (Mata Terbuka)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="login-error" style={{ display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M12 3 L2 20h20Z" /><path d="M12 10v4" /><circle cx="12" cy="17" r=".5" fill="currentColor" stroke="none" />
            </svg>
            {error}
          </p>
        )}

        <button className="btn-primary" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Mencocokkan Data... ⏳' : 'Masuk'}
        </button>

        <p className="login-foot" id="loginFootNote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" />
          </svg>
          Sistem mengenali Posyandu & peran Anda otomatis dari username.
        </p>

        <button className="public-link" onClick={() => onNavigate && onNavigate('beranda')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s7-6.7 7-12a7 7 0 0 0-14 0c0 5.3 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" />
          </svg>
          Lihat Halaman Publik (Tanpa Login)
        </button>
      </div>
    </div>
  );
}