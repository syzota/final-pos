import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import logo from '../assets/images/common/logo-header.jpeg';
import { Loader2, ArrowLeft, Eye, EyeOff, Lock, User, ShieldAlert } from 'lucide-react';

export default function Login({ onNavigate, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!username.trim() || !password) {
      setError('Username / NIK dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    setError('');

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
      if (err.response && err.response.data && err.response.data.pesan) {
        setError(err.response.data.pesan);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const firstErr = Object.values(err.response.data.errors)[0];
        setError(Array.isArray(firstErr) ? firstErr[0] : firstErr);
      } else {
        setError('Koneksi ke server gagal atau Username / NIK dan Kata Sandi tidak cocok.');
      }
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
      <div
        className="login-card"
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
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('beranda')}
          aria-label="Kembali ke Beranda"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#f1f5f9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            transition: 'background 0.2s ease'
          }}
          title="Kembali ke Halaman Publik"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              overflow: 'hidden',
              margin: '0 auto 14px',
              boxShadow: '0 4px 12px rgba(0, 128, 128, 0.15)'
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
                <User size={18} />
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
              Kata Sandi / PIN
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
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi atau 6 digit PIN"
                disabled={isLoading}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  minHeight: '46px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  padding: '0 44px 0 42px',
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '13px',
                marginBottom: '18px',
                lineHeight: '1.4'
              }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button with Animated Loading State */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              minHeight: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-500, #008080)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 700,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 128, 128, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <span>Masuk ke Sistem</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}