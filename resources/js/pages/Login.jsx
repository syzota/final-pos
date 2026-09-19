import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import logo from '../assets/images/common/logo-header.jpeg';
import Button from '../components/common/Button';
import NotificationModal from '../components/common/NotificationModal';
import { 
  ArrowLeft01Icon, 
  UserIcon, 
  LockIcon, 
  ViewIcon, 
  ViewOffSlashIcon, 
  AlertCircleIcon, 
  Loading03Icon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function Login({ onNavigate, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '', details: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!username.trim() || !password) {
      const missing = [];
      if (!username.trim()) missing.push('Kolom Username atau NIK belum diisi.');
      if (!password) missing.push('Kolom Kata Sandi belum diisi.');

      setErrorModal({
        isOpen: true,
        title: 'Data Masuk Belum Lengkap',
        message: 'Mohon lengkapi data akun Anda untuk dapat masuk ke dalam sistem:',
        details: missing
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosClient.post('/login', {
        username: username.trim(),
        password,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      if (onLogin) {
        onLogin(user);
      }
    } catch (err) {
      console.error('Gagal Login:', err);
      let errMsg = 'Koneksi ke server gagal atau Username / NIK dan Kata Sandi tidak cocok.';
      let errTitle = 'Gagal Masuk Akun';
      let errDetails = null;

      if (err.response?.data?.pesan) {
        errMsg = err.response.data.pesan;
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        errDetails = Object.values(err.response.data.errors).flat();
        errMsg = 'Terdapat data yang belum sesuai dengan format yang diminta:';
      }

      setErrorModal({
        isOpen: true,
        title: errTitle,
        message: errMsg,
        details: errDetails
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="login-screen"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e2e8f0 100%)'
      }}
    >
      <NotificationModal
        isOpen={errorModal.isOpen}
        type="error"
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
        onClose={() => setErrorModal({ isOpen: false, title: '', message: '', details: null })}
      />

      <div
        className="login-card reveal-section"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '36px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Tombol Back di Pojok Kiri Atas Card */}
        <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={ArrowLeft01Icon}
            onClick={() => onNavigate && onNavigate('beranda')}
            aria-label="Kembali ke Beranda"
            title="Kembali ke Halaman Publik"
            style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
          />
        </div>

        {/* Brand Header (Clickable to Home) */}
        <div 
          onClick={() => onNavigate && onNavigate('beranda')}
          style={{ textAlign: 'center', marginTop: '12px', marginBottom: '28px', cursor: 'pointer' }}
          title="Kembali ke Beranda"
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              overflow: 'hidden',
              margin: '0 auto 14px',
              boxShadow: '0 4px 12px rgba(0, 128, 128, 0.15)',
              transition: 'transform 0.15s ease'
            }}
          >
            <img
              src={logo}
              alt="Posyandu Loa Duri Ulu"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Posyandu Loa Duri Ulu
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* Form Login Tunggal */}
        <form onSubmit={handleLogin}>
          <div className="field" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Username atau NIK
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#94a3b8'
                }}
              >
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username atau NIK Anda"
                disabled={isLoading}
                autoComplete="username"
                style={{
                  width: '100%',
                  minHeight: '46px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  padding: '0 14px 0 42px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-500, #008080)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 128, 128, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="field" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Kata Sandi
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#94a3b8'
                }}
              >
                <LockIcon size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun"
                disabled={isLoading}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  minHeight: '46px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  padding: '0 42px 0 42px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-500, #008080)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 128, 128, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button with Animated Loading State */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            loadingText=""
            fullWidth
          >
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}