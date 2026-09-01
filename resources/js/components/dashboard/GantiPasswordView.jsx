import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/gantiPassword.css';

import { ShieldAlert, Info, CheckCircle2, Key, CircleAlert, EyeOff, Eye } from 'lucide-react';

const ROLE_LABELS = {
  warga: 'Warga',
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
          text: 'Data akun gagal dimuat.',
        });
      } finally {
        setIsLoadingAccount(false);
      }
    };

    fetchAccount();
  }, []);

  const handlePinChange = (event) => {
    const { name, value } = event.target;

    // Semua PIN pada fitur baru harus angka dan maksimal 6 digit.
    const onlyNumbers = value
      .replace(/\D/g, '')
      .slice(0, 6);

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
        text: 'PIN saat ini harus 6 digit.',
      });
      return;
    }

    if (formData.new_password.length !== 6) {
      setMessage({
        type: 'error',
        text: 'PIN baru harus tepat 6 digit.',
      });
      return;
    }

    if (
      formData.new_password !==
      formData.new_password_confirmation
    ) {
      setMessage({
        type: 'error',
        text: 'Konfirmasi PIN baru tidak cocok.',
      });
      return;
    }

    if (
      formData.current_password ===
      formData.new_password
    ) {
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
        text:
          response.data.pesan ||
          'PIN berhasil diperbarui.',
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

      const validationErrors =
        error.response?.data?.errors;

      const firstValidationError = validationErrors
        ? Object.values(validationErrors)?.[0]?.[0]
        : null;

      setMessage({
        type: 'error',
        text:
          firstValidationError ||
          error.response?.data?.message ||
          error.response?.data?.pesan ||
          'PIN gagal diperbarui.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabel =
    ROLE_LABELS[account?.role] ||
    account?.role ||
    '-';

  const posyanduName =
    account?.posyandu?.nama || null;

  return (
    <div className="account-pin-page">

      <section className="account-pin-hero">
        <div>
          <span className="account-pin-eyebrow">
            KEAMANAN AKUN
          </span>

          <h2>Ganti PIN Akun</h2>

          <p>
            Gunakan PIN 6 digit yang mudah Anda ingat,
            tetapi tidak mudah ditebak orang lain.
          </p>
        </div>

        <div className="account-pin-hero-icon">
          <ShieldAlert />
        </div>
      </section>


      {message.text && (
        <div
          className={`account-pin-alert account-pin-alert--${message.type}`}
        >
          <i
            className={
              message.type === 'success'
                ? 'bi bi-check-circle-fill'
                : 'bi bi-exclamation-circle-fill'
            }
          ></i>

          <span>{message.text}</span>
        </div>
      )}


      <div className="account-pin-layout">

        <aside className="account-pin-profile-card">
          <div className="account-pin-avatar">
            {account?.name?.charAt(0)?.toUpperCase() ||
              account?.username?.charAt(0)?.toUpperCase() ||
              'U'}
          </div>

          {isLoadingAccount ? (
            <p className="account-pin-loading">
              Memuat akun...
            </p>
          ) : (
            <>
              <h3>
                {account?.name ||
                  account?.username ||
                  'Pengguna'}
              </h3>

              <span className="account-pin-role">
                {roleLabel}
              </span>

              <div className="account-pin-account-info">
                <div>
                  <span>Username</span>
                  <strong>
                    {account?.username || '-'}
                  </strong>
                </div>

                {posyanduName && (
                  <div>
                    <span>Posyandu</span>
                    <strong>{posyanduName}</strong>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="account-pin-security-note">
            <Info />

            <p>
              PIN baru akan disimpan sebagai hash di
              database. PIN asli tidak disimpan dalam
              bentuk teks biasa.
            </p>
          </div>
        </aside>


        <section className="account-pin-form-card">

          <div className="account-pin-form-head">
            <div>
              <span className="account-pin-section-label">
                PERBARUI PIN
              </span>

              <h3>Buat PIN Baru</h3>

              <p>
                Masukkan PIN lama untuk memastikan bahwa
                perubahan dilakukan oleh pemilik akun.
              </p>
            </div>

            <span className="account-pin-six-badge">
              6 DIGIT
            </span>
          </div>


          <form onSubmit={handleSubmit}>

            <div className="account-pin-field">
              <label htmlFor="current_password">
                PIN Saat Ini
                <span>*</span>
              </label>

              <div className="account-pin-input-wrap">
                <input
                  id="current_password"
                  type={
                    showPin.current
                      ? 'text'
                      : 'password'
                  }
                  inputMode="numeric"
                  autoComplete="current-password"
                  name="current_password"
                  maxLength="6"
                  value={formData.current_password}
                  onChange={handlePinChange}
                  placeholder="Masukkan 6 digit PIN saat ini"
                  required
                />

                <button
                  type="button"
                  className="account-pin-eye"
                  onClick={() =>
                    togglePin('current')
                  }
                  aria-label={
                    showPin.current
                      ? 'Sembunyikan PIN'
                      : 'Tampilkan PIN'
                  }
                >
                  <i
                    className={
                      showPin.current
                        ? 'bi bi-eye-slash-fill'
                        : 'bi bi-eye-fill'
                    }
                  ></i>
                </button>
              </div>
            </div>


            <div className="account-pin-divider"></div>


            <div className="account-pin-field">
              <label htmlFor="new_password">
                PIN Baru
                <span>*</span>
              </label>

              <div className="account-pin-input-wrap">
                <input
                  id="new_password"
                  type={
                    showPin.new
                      ? 'text'
                      : 'password'
                  }
                  inputMode="numeric"
                  autoComplete="new-password"
                  name="new_password"
                  maxLength="6"
                  value={formData.new_password}
                  onChange={handlePinChange}
                  placeholder="Buat 6 digit PIN baru"
                  required
                />

                <button type="button" className="toggle-password" onClick={() => togglePin('new')}>
                    {showPin.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>


            <div className="account-pin-field">
              <label htmlFor="new_password_confirmation">
                Konfirmasi PIN Baru
                <span>*</span>
              </label>

              <div className="account-pin-input-wrap">
                <input
                  id="new_password_confirmation"
                  type={
                    showPin.confirmation
                      ? 'text'
                      : 'password'
                  }
                  inputMode="numeric"
                  autoComplete="new-password"
                  name="new_password_confirmation"
                  maxLength="6"
                  value={
                    formData.new_password_confirmation
                  }
                  onChange={handlePinChange}
                  placeholder="Ulangi 6 digit PIN baru"
                  required
                />

                <button type="button" className="toggle-password" onClick={() => togglePin('confirmation')}>
                    {showPin.confirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>


            <div className="account-pin-rules">
              <div>
                <CheckCircle2 />
                Tepat 6 digit angka
              </div>

              <div>
                <CheckCircle2 />
                Berbeda dari PIN lama
              </div>

              <div>
                <CheckCircle2 />
                Konfirmasi harus sama
              </div>
            </div>


            <button
              type="submit"
              className="account-pin-submit"
              disabled={isSaving}
            >
              <Key />

              {isSaving
                ? 'Memperbarui PIN...'
                : 'Simpan PIN Baru'}
            </button>

          </form>

        </section>

      </div>

    </div>
  );
}
