import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  InformationCircleIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Key01Icon,
  ViewOffSlashIcon,
  ViewIcon,
  UserCheck01Icon,
  Building01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const ROLE_LABELS = {
  warga: 'Warga Desa',
  kader: 'Kader Posyandu',
  ketua: 'Ketua Posyandu',
  puskesmas: 'Petugas Puskesmas',
  superadmin: 'Superadmin Desa',
};

export default function GantiPasswordView() {
  const [account, setAccount] = useState(null);

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [showPin, setShowPin] = useState({
    current: false,
    new: false,
    confirmation: false,
  });

  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccount(response.data.data || null);
      } catch (error) {
        console.error('Gagal memuat akun:', error);
        setMessage({
          type: 'error',
          text: 'Data akun pengguna gagal dimuat.',
        });
      } finally {
        setIsLoadingAccount(false);
      }
    };

    fetchAccount();
  }, []);

  const handlePinChange = (event) => {
    const { name, value } = event.target;
    const onlyNumbers = value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      [name]: onlyNumbers,
    }));
  };

  const togglePin = (key) => {
    setShowPin((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.current_password.length !== 6) {
      setMessage({
        type: 'error',
        text: 'PIN saat ini harus tepat 6 digit angka.',
      });
      return;
    }

    if (formData.new_password.length !== 6) {
      setMessage({
        type: 'error',
        text: 'PIN baru harus tepat 6 digit angka.',
      });
      return;
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      setMessage({
        type: 'error',
        text: 'Konfirmasi PIN baru tidak cocok.',
      });
      return;
    }

    if (formData.current_password === formData.new_password) {
      setMessage({
        type: 'error',
        text: 'PIN baru harus berbeda dari PIN saat ini.',
      });
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('auth_token');

      const response = await axios.put(
        '/api/akun/ganti-password',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        type: 'success',
        text: response.data.pesan || 'PIN akun Anda berhasil diperbarui!',
      });

      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });

      setShowPin({
        current: false,
        new: false,
        confirmation: false,
      });
    } catch (error) {
      console.error('Gagal mengganti PIN:', error);
      const validationErrors = error.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors)?.[0]?.[0]
        : null;

      setMessage({
        type: 'error',
        text:
          firstValidationError ||
          error.response?.data?.message ||
          error.response?.data?.pesan ||
          'PIN gagal diperbarui. Pastikan PIN saat ini benar.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabel = ROLE_LABELS[account?.role] || account?.role || 'Pengguna';
  const posyanduName = account?.posyandu?.nama || null;

  return (
    <>
      <style>{`
        .pin-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.3fr);
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 900px) {
          .pin-grid-layout {
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

        <div className="pin-grid-layout">
          {/* KOLOM KIRI: INFO AKUN & KEAMANAN */}
          <div
            className="card"
            style={{
              padding: '28px 24px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface, #ffffff)',
              border: '1.5px solid var(--line, #e2e8f0)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                color: 'var(--primary-teal, #008080)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 900,
                margin: '0 auto 14px',
                border: '2px solid #99f6e4'
              }}
            >
              {account?.name?.charAt(0)?.toUpperCase() || account?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {isLoadingAccount ? (
              <p style={{ color: '#64748b', fontSize: '13px' }}>Memuat profil akun...</p>
            ) : (
              <>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                  {account?.name || account?.username || 'Nama Pengguna'}
                </h3>

                <div style={{ display: 'inline-block', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: 'var(--cyan-bg, #E3F7FB)',
                      color: 'var(--cyan-deep, #0E7C93)',
                      border: '1px solid #b3e8f3'
                    }}
                  >
                    {roleLabel}
                  </span>
                </div>

                <div style={{ textAlign: 'left', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12.5px', color: '#64748b' }}>Username / ID:</span>
                    <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{account?.username || '-'}</strong>
                  </div>
                  {posyanduName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <span style={{ fontSize: '12.5px', color: '#64748b' }}>Posyandu:</span>
                      <strong style={{ fontSize: '12.5px', color: 'var(--primary-teal, #008080)' }}>{posyanduName}</strong>
                    </div>
                  )}
                </div>
              </>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                textAlign: 'left',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                color: 'var(--primary-teal, #008080)',
                fontSize: '12px',
                lineHeight: 1.5,
                border: '1px solid #ccfbf1'
              }}
            >
              <InformationCircleIcon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                PIN baru disimpan dengan enkripsi hash aman. Gunakan kombinasi 6 digit angka yang mudah Anda ingat namun sulit ditebak.
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: FORM GANTI PIN */}
          <div
            className="card"
            style={{
              padding: '28px 24px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface, #ffffff)',
              border: '1.5px solid var(--line, #e2e8f0)'
            }}
          >
            <div style={{ marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Keamanan Akun
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '17px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                  Perbarui PIN Akses (6 Digit)
                </h3>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569'
                }}
              >
                PIN NUMERIK
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {/* PIN SAAT INI */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  PIN Saat Ini *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin.current ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="current-password"
                    name="current_password"
                    maxLength={6}
                    value={formData.current_password}
                    onChange={handlePinChange}
                    placeholder="Masukkan 6 digit PIN saat ini"
                    required
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      padding: '0 44px 0 14px',
                      fontSize: '15px',
                      letterSpacing: showPin.current ? 'normal' : '0.2em',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePin('current')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPin.current ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '20px 0' }}></div>

              {/* PIN BARU */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  PIN Baru *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin.new ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="new-password"
                    name="new_password"
                    maxLength={6}
                    value={formData.new_password}
                    onChange={handlePinChange}
                    placeholder="Masukkan 6 digit PIN baru"
                    required
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      padding: '0 44px 0 14px',
                      fontSize: '15px',
                      letterSpacing: showPin.new ? 'normal' : '0.2em',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePin('new')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPin.new ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
                  </button>
                </div>
              </div>

              {/* KONFIRMASI PIN BARU */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Konfirmasi PIN Baru *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin.confirmation ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="new-password"
                    name="new_password_confirmation"
                    maxLength={6}
                    value={formData.new_password_confirmation}
                    onChange={handlePinChange}
                    placeholder="Ulangi 6 digit PIN baru"
                    required
                    style={{
                      width: '100%',
                      minHeight: '46px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      padding: '0 44px 0 14px',
                      fontSize: '15px',
                      letterSpacing: showPin.confirmation ? 'normal' : '0.2em',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePin('confirmation')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPin.confirmation ? <ViewOffSlashIcon size={18} /> : <ViewIcon size={18} />}
                  </button>
                </div>
              </div>

              {/* ATURAN VALIDASI PIN */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: formData.new_password.length === 6 ? '#f0fdf4' : '#f8fafc',
                    color: formData.new_password.length === 6 ? '#16a34a' : '#64748b',
                    border: `1px solid ${formData.new_password.length === 6 ? '#bbf7d0' : '#e2e8f0'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckmarkCircle01Icon size={13} /> Tepat 6 Angka
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: (formData.new_password && formData.new_password !== formData.current_password) ? '#f0fdf4' : '#f8fafc',
                    color: (formData.new_password && formData.new_password !== formData.current_password) ? '#16a34a' : '#64748b',
                    border: `1px solid ${(formData.new_password && formData.new_password !== formData.current_password) ? '#bbf7d0' : '#e2e8f0'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckmarkCircle01Icon size={13} /> Berbeda dari PIN Lama
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: (formData.new_password && formData.new_password === formData.new_password_confirmation) ? '#f0fdf4' : '#f8fafc',
                    color: (formData.new_password && formData.new_password === formData.new_password_confirmation) ? '#16a34a' : '#64748b',
                    border: `1px solid ${(formData.new_password && formData.new_password === formData.new_password_confirmation) ? '#bbf7d0' : '#e2e8f0'}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckmarkCircle01Icon size={13} /> Konfirmasi Cocok
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Key01Icon}
                loading={isSaving}
                loadingText="Menyimpan PIN Baru..."
                fullWidth
              >
                Perbarui PIN Akun Sekarang
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
