import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  FloppyDiskIcon,
  PrinterIcon,
  FolderOpenIcon,
  Delete02Icon,
  UserCheck01Icon,
  Activity01Icon,
  Alert02Icon,
  DropletIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Calendar03Icon,
  RefreshIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const today = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);

const TYPES = {
  ibu_hamil: {
    label: 'Ibu Hamil Risiko Tinggi',
    shortLabel: 'Ibu Hamil Risti',
    icon: UserCheck01Icon,
    description: 'Pencatatan data individu ibu hamil dengan faktor risiko tinggi (Risti).',
    theme: {
      primary: 'var(--magenta-deep, #93348A)',
      lightBg: 'var(--magenta-bg, #FBEAF8)',
      lightBorder: '#f5cbe7',
      textColor: 'var(--magenta-deep, #93348A)',
    }
  },
  nifas: {
    label: 'Ibu Nifas & Menyusui',
    shortLabel: 'Ibu Nifas',
    icon: Activity01Icon,
    description: 'Pencatatan kondisi ibu pasca persalinan, masa nifas, dan suplementasi Vitamin A.',
    theme: {
      primary: 'var(--cyan-deep, #0E7C93)',
      lightBg: 'var(--cyan-bg, #E3F7FB)',
      lightBorder: '#b3e8f3',
      textColor: 'var(--cyan-deep, #0E7C93)',
    }
  },
  kematian_nifas: {
    label: 'Kasus Kematian Ibu Nifas',
    shortLabel: 'Kematian Nifas',
    icon: Alert02Icon,
    description: 'Pencatatan dan pelaporan kasus kematian ibu pada masa nifas.',
    theme: {
      primary: 'var(--rose-deep, #93000A)',
      lightBg: 'var(--rose-bg, #FFDAD6)',
      lightBorder: '#fcc5c1',
      textColor: 'var(--rose-deep, #93000A)',
    }
  },
  diare: {
    label: 'Warga Penderita Diare',
    shortLabel: 'Penderita Diare',
    icon: DropletIcon,
    description: 'Pencatatan kasus diare warga, pemberian oralit, serta rujukan fasilitas kesehatan.',
    theme: {
      primary: 'var(--orange-deep, #B5650C)',
      lightBg: 'var(--orange-bg, #FFF1DF)',
      lightBorder: '#fedbb0',
      textColor: 'var(--orange-deep, #B5650C)',
    }
  },
};

const emptyCommon = {
  nama: '',
  umur: '',
  alamat: '',
  tanggal: today(),
  catatan: '',
};

const emptyDetail = {
  ibu_hamil: {
    usia_kehamilan_minggu: '',
    tekanan_darah: '',
    risiko: 'Risiko Tinggi',
  },
  nifas: {
    tanggal_melahirkan: '',
    hari_nifas: '',
    vitamin_a: 'Ya',
  },
  kematian_nifas: {
    tanggal_melahirkan: '',
    hari_nifas: '',
    penyebab: '',
  },
  diare: {
    lama_hari: '',
    oralit: 'Ya',
    dirujuk: 'Tidak',
  },
};

const formatDate = (date) => {
  if (!date) return '-';
  const rawDate = String(date);
  const parsedDate = rawDate.includes('T')
    ? new Date(rawDate)
    : new Date(`${rawDate}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

const formatMonth = (month) => {
  if (!month) return '-';
  const [year, m] = month.split('-');
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Number(year), Number(m) - 1, 1));
};

export default function DataTambahanIndividuView({ posyandu = '' }) {
  const [activeType, setActiveType] = useState('ibu_hamil');
  const [common, setCommon] = useState(emptyCommon);
  const [detail, setDetail] = useState(emptyDetail.ibu_hamil);

  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', title: '', details: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmVariant: 'danger'
  });
  const [printRows, setPrintRows] = useState([]);

  const token = localStorage.getItem('auth_token');

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const changeType = (type) => {
    setActiveType(type);
    setCommon({
      ...emptyCommon,
      tanggal: today(),
    });
    setDetail({ ...emptyDetail[type] });
    setMessage({ type: '', text: '', title: '', details: null });
  };

  const fetchRows = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/data-tambahan-individu', {
        ...config,
        params: {
          bulan: filterMonth || undefined,
        },
      });
      setRows(response.data.data || []);
    } catch (error) {
      console.error('Gagal memuat Data Tambahan', error);
      setMessage({
        type: 'error',
        title: 'Gagal Memuat Data',
        text:
          error.response?.data?.pesan ||
          error.response?.data?.message ||
          'Gagal mengambil data sasaran khusus.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [filterMonth]);

  const handleCommonChange = (event) => {
    const { name, value } = event.target;
    setCommon((prev) => ({
      ...prev,
      [name]: name === 'umur' ? value.replace(/[^0-9]/g, '') : value,
    }));
  };

  const handleDetailChange = (event) => {
    const { name, value } = event.target;
    setDetail((prev) => ({
      ...prev,
      [name]: ['usia_kehamilan_minggu', 'hari_nifas', 'lama_hari'].includes(name)
        ? value.replace(/[^0-9]/g, '')
        : value,
    }));
  };

  const resetForm = () => {
    setCommon({
      ...emptyCommon,
      tanggal: today(),
    });
    setDetail({ ...emptyDetail[activeType] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const missing = [];
    if (!common.nama?.trim()) missing.push('Nama sasaran / warga belum diisi');
    if (!common.umur || Number(common.umur) <= 0) missing.push('Umur sasaran belum diisi dengan nilai yang valid (> 0)');
    if (!common.tanggal) missing.push('Tanggal pencatatan belum ditentukan');

    if (activeType === 'ibu_hamil') {
      if (!detail.usia_kehamilan_minggu || Number(detail.usia_kehamilan_minggu) <= 0) {
        missing.push('Usia kehamilan (minggu) wajib diisi');
      }
    } else if (activeType === 'kematian_nifas') {
      if (!detail.penyebab?.trim()) {
        missing.push('Penyebab kematian ibu nifas wajib diisi');
      }
    } else if (activeType === 'diare') {
      if (!detail.lama_hari || Number(detail.lama_hari) <= 0) {
        missing.push('Lama diare (hari) wajib diisi');
      }
    }

    if (missing.length > 0) {
      setMessage({
        type: 'error',
        title: 'Data Sasaran Belum Lengkap',
        text: 'Mohon periksa dan lengkapi isian formulir berikut sebelum menyimpan:',
        details: missing
      });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '', title: '', details: null });

    try {
      const payload = {
        jenis: activeType,
        nama: common.nama,
        umur: Number(common.umur),
        alamat: common.alamat || null,
        tanggal: common.tanggal,
        detail,
        catatan: common.catatan || null,
      };

      const response = await axios.post(
        '/api/data-tambahan-individu',
        payload,
        config
      );

      setMessage({
        type: 'success',
        title: 'Data Berhasil Disimpan',
        text: response.data.pesan || 'Data sasaran khusus berhasil disimpan ke register SIP Posyandu.',
      });

      resetForm();
      await fetchRows();
    } catch (error) {
      console.error('Gagal menyimpan Data Tambahan', error);
      const validation = error.response?.data?.errors;
      let errDetails = null;
      let firstValidation = '';
      if (validation && typeof validation === 'object') {
        errDetails = Object.values(validation).flat();
        firstValidation = errDetails[0];
      }

      setMessage({
        type: 'error',
        title: 'Gagal Menyimpan Data Sasaran',
        text: firstValidation || error.response?.data?.pesan || error.response?.data?.message || 'Data gagal disimpan. Pastikan isian formulir sesuai.',
        details: errDetails && errDetails.length > 1 ? errDetails : null
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, nama) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Hapus Data Sasaran',
      message: `Apakah Anda yakin ingin menghapus data sasaran ${nama ? `"${nama}"` : ''} dari sistem register?`,
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/data-tambahan-individu/${id}`, config);
          setMessage({
            type: 'success',
            title: 'Data Dihapus',
            text: 'Data sasaran khusus berhasil dihapus dari sistem.'
          });
          await fetchRows();
        } catch (error) {
          console.error('Gagal menghapus data', error);
          setMessage({
            type: 'error',
            title: 'Gagal Menghapus Data',
            text: error.response?.data?.pesan || error.response?.data?.message || 'Data gagal dihapus.'
          });
        }
      }
    });
  };

  const generateReport = async () => {
    try {
      const response = await axios.get('/api/data-tambahan-individu', {
        ...config,
        params: {
          bulan: filterMonth || undefined,
        },
      });

      const data = response.data.data || [];
      setPrintRows(data);

      setTimeout(() => {
        window.print();
      }, 150);
    } catch (error) {
      console.error('Gagal membuat laporan', error);
      setMessage({
        type: 'error',
        text: 'Laporan gagal dibuat.',
      });
    }
  };

  const currentTheme = TYPES[activeType]?.theme || TYPES.ibu_hamil.theme;
  const ActiveIcon = TYPES[activeType]?.icon || UserCheck01Icon;

  const renderDetailFields = () => {
    if (activeType === 'ibu_hamil') {
      return (
        <>
          <div className="form-field">
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Usia Kehamilan (Minggu) *
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="45"
              name="usia_kehamilan_minggu"
              value={detail.usia_kehamilan_minggu}
              onChange={handleDetailChange}
              placeholder="Contoh: 28"
              required
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Hitungan minggu dari HPHT
            </span>
          </div>

          <div className="form-field">
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Tekanan Darah (mmHg)
            </label>
            <input
              type="text"
              name="tekanan_darah"
              value={detail.tekanan_darah}
              onChange={handleDetailChange}
              placeholder="Contoh: 120/80 atau 140/90"
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Sistol / Diastol hasil tensimeter
            </span>
          </div>

          <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Klasifikasi Faktor Risiko
            </label>
            <select
              name="risiko"
              value={detail.risiko}
              onChange={handleDetailChange}
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '14px' }}
            >
              <option value="Risiko Tinggi">Risiko Tinggi (Risti: Usia &lt;20/&gt;35 th, Anemia, Hipertensi, KEK)</option>
              <option value="Normal">Normal / Terpantau Sehat</option>
            </select>
          </div>
        </>
      );
    }

    if (activeType === 'nifas') {
      return (
        <>
          <div className="form-field">
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Tanggal Melahirkan
            </label>
            <input
              type="date"
              name="tanggal_melahirkan"
              value={detail.tanggal_melahirkan}
              onChange={handleDetailChange}
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
          </div>

          <div className="form-field">
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Hari Nifas Ke-
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="60"
              name="hari_nifas"
              value={detail.hari_nifas}
              onChange={handleDetailChange}
              placeholder="Contoh: 7"
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Rentang masa nifas (1-42 hari)
            </span>
          </div>

          <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Mendapat Kapsul Vitamin A Merah (200.000 IU)
            </label>
            <select
              name="vitamin_a"
              value={detail.vitamin_a}
              onChange={handleDetailChange}
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '14px' }}
            >
              <option value="Ya">Ya (Sudah Diberikan 2 Kapsul)</option>
              <option value="Tidak">Belum / Tidak Diberikan</option>
            </select>
          </div>
        </>
      );
    }

    if (activeType === 'kematian_nifas') {
      return (
        <>
          <div className="form-field">
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Tanggal Melahirkan
            </label>
            <input
              type="date"
              name="tanggal_melahirkan"
              value={detail.tanggal_melahirkan}
              onChange={handleDetailChange}
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
          </div>

          <div className="form-field">
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Meninggal pada Hari Nifas Ke-
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              name="hari_nifas"
              value={detail.hari_nifas}
              onChange={handleDetailChange}
              placeholder="Contoh: 3"
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
          </div>

          <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Penyebab Kematian Singkat *
            </label>
            <input
              type="text"
              name="penyebab"
              value={detail.penyebab}
              onChange={handleDetailChange}
              placeholder="Contoh: Perdarahan post-partum / Eklampsia / Infeksi"
              required
              style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="form-field">
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Lama Menderita Diare (Hari) *
          </label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            name="lama_hari"
            value={detail.lama_hari}
            onChange={handleDetailChange}
            placeholder="Contoh: 2"
            required
            style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
          />
        </div>

        <div className="form-field">
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Mendapat Oralit &amp; Tablet Zink
          </label>
          <select
            name="oralit"
            value={detail.oralit}
            onChange={handleDetailChange}
            style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '14px' }}
          >
            <option value="Ya">Ya (Sudah Diberikan Oralit &amp; Zink)</option>
            <option value="Tidak">Tidak Diberikan</option>
          </select>
        </div>

        <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
            Dirujuk ke Fasilitas Kesehatan / Puskesmas
          </label>
          <select
            name="dirujuk"
            value={detail.dirujuk}
            onChange={handleDetailChange}
            style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '14px' }}
          >
            <option value="Tidak">Tidak Perlu Rujuk (Bisa Ditangani Mandiri/Kader)</option>
            <option value="Ya">Ya (Dirujuk ke Puskesmas Loa Duri)</option>
          </select>
        </div>
      </>
    );
  };

  const detailSummary = (row) => {
    const d = row.detail || {};
    if (row.jenis === 'ibu_hamil') {
      return `${d.usia_kehamilan_minggu || '-'} mgg • ${d.risiko || 'Risti'} • TD: ${d.tekanan_darah || '-'}`;
    }
    if (row.jenis === 'nifas') {
      return `Hari ke-${d.hari_nifas || '-'} • Vit A: ${d.vitamin_a || '-'}`;
    }
    if (row.jenis === 'kematian_nifas') {
      return `Hari ke-${d.hari_nifas || '-'} • ${d.penyebab || '-'}`;
    }
    return `${d.lama_hari || '-'} hari • Oralit: ${d.oralit || '-'} • Rujuk: ${d.dirujuk || '-'}`;
  };

  const grouped = Object.keys(TYPES).reduce((acc, type) => {
    acc[type] = printRows.filter((row) => row.jenis === type);
    return acc;
  }, {});

  return (
    <>
      <style>{`
        .dti-tab-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 1080px) {
          .dti-tab-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 580px) {
          .dti-tab-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .dti-tab-btn {
          min-width: 0;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          border-width: 1.5px;
          border-style: solid;
          cursor: pointer;
          text-align: left;
          outline: none;
          min-height: 60px;
          box-sizing: border-box;
          transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
        }
        .dti-tab-btn:hover {
          transform: translateY(-1px);
        }
        .dti-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .dti-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .dti-print-only {
          display: none;
        }
        @media print {
          .dti-no-print {
            display: none !important;
          }
          .dti-print-only {
            display: block !important;
            padding: 24px;
            background: #ffffff;
            color: #000000;
            font-family: Arial, sans-serif;
          }
        }
      `}</style>

      <div className="dti-no-print">
        {/* Modal Notifikasi */}
        <NotificationModal
          isOpen={Boolean(message.text || message.title)}
          type={message.type || 'success'}
          title={message.title}
          message={message.text}
          details={message.details}
          onClose={() => setMessage({ type: '', text: '', title: '', details: null })}
        />

        {/* Modal Konfirmasi Hapus */}
        <NotificationModal
          isOpen={confirmModal.isOpen}
          type="confirm"
          title={confirmModal.title}
          message={confirmModal.message}
          confirmVariant={confirmModal.confirmVariant || 'danger'}
          isConfirm
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onConfirm={() => {
            if (confirmModal.onConfirm) confirmModal.onConfirm();
            setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, confirmVariant: 'danger' });
          }}
          onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, confirmVariant: 'danger' })}
        />

        {/* 1. HEADER: SEGMENTED TABS KATEGORI SASARAN KHUSUS */}
        <div
          className="card"
          style={{
            marginBottom: '24px',
            padding: '20px 24px',
            borderRadius: '16px',
            backgroundColor: 'var(--surface, #ffffff)',
            border: '1.5px solid var(--line, #e2e8f0)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                  color: 'var(--primary-teal, #008080)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Activity01Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                  Pencatatan Sasaran Khusus
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)', fontWeight: 500, marginTop: '2px' }}>
                  Pilih kategori kondisi khusus warga untuk dicatat dan direkapitulasi dalam register SIP
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  height: '44px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Button
                variant="primary"
                size="md"
                fullWidth
                icon={PrinterIcon}
                onClick={generateReport}
              >
                Cetak Laporan
              </Button>
            </div>
          </div>

          <div className="dti-tab-grid">
            {Object.entries(TYPES).map(([key, item]) => {
              const isSelected = activeType === key;
              const TabIcon = item.icon;
              return (
                <button
                  key={key}
                  type="button"
                  className="dti-tab-btn"
                  onClick={() => changeType(key)}
                  style={{
                    borderColor: isSelected ? item.theme.primary : item.theme.lightBorder,
                    backgroundColor: isSelected ? item.theme.primary : item.theme.lightBg,
                    color: isSelected ? '#ffffff' : item.theme.textColor
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                      color: isSelected ? '#ffffff' : item.theme.primary,
                      border: isSelected ? 'none' : `1px solid ${item.theme.lightBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <TabIcon size={20} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 800,
                        lineHeight: 1.25,
                        color: isSelected ? '#ffffff' : item.theme.textColor,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.shortLabel}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        marginTop: '2px',
                        color: isSelected ? 'rgba(255, 255, 255, 0.85)' : 'var(--ink-soft, #64748b)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <NotificationModal
          isOpen={Boolean(message.text)}
          type={message.type || 'success'}
          message={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />

        {/* 2. MAIN GRID: FORM INPUT & DAFTAR RIWAYAT */}
        <div className="dti-main-grid">
          {/* FORM INPUT SASARAN KHUSUS */}
          <div
            id="dti-form-container"
            className="card"
            style={{
              minWidth: 0,
              padding: '24px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface, #ffffff)',
              border: '1.5px solid var(--line, #e2e8f0)'
            }}
          >
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentTheme.primary }}></span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: currentTheme.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Form Input Aktif
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                  {TYPES[activeType].label}
                </h3>
              </div>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: '10px',
                  backgroundColor: currentTheme.lightBg,
                  color: currentTheme.textColor,
                  border: `1px solid ${currentTheme.lightBorder}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <ActiveIcon size={14} />
                <span>{TYPES[activeType].shortLabel}</span>
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nama Lengkap Warga *</label>
                  <input
                    type="text"
                    name="nama"
                    value={common.nama}
                    onChange={handleCommonChange}
                    placeholder="Contoh: Ibu Siti Rahmawati"
                    required
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Umur (Tahun) *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="120"
                    name="umur"
                    value={common.umur}
                    onChange={handleCommonChange}
                    placeholder="Contoh: 28"
                    required
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                </div>

                <div className="form-field">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tanggal Pencatatan *</label>
                  <input
                    type="date"
                    name="tanggal"
                    value={common.tanggal}
                    onChange={handleCommonChange}
                    required
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                </div>

                <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Alamat Singkat / RT</label>
                  <input
                    type="text"
                    name="alamat"
                    value={common.alamat}
                    onChange={handleCommonChange}
                    placeholder="Contoh: RT 03 Dusun Karya Bersama"
                    style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* SECTION DETAIL KHUSUS */}
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: currentTheme.lightBg, border: `1px solid ${currentTheme.lightBorder}`, marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: currentTheme.textColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                  Parameter Khusus {TYPES[activeType].shortLabel}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {renderDetailFields()}
                </div>
              </div>

              <div className="form-field full" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Catatan Kader (Opsional)</label>
                <textarea
                  name="catatan"
                  value={common.catatan}
                  onChange={handleCommonChange}
                  rows="2"
                  placeholder="Keterangan tambahan atau tindakan kader..."
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px', outline: 'none' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={FloppyDiskIcon}
                  loading={saving}
                  loadingText="Menyimpan..."
                  fullWidth
                >
                  Simpan Data
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={resetForm}
                  disabled={saving}
                  fullWidth
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>

          {/* KANAN: DAFTAR DATA BULAN INI */}
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
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Riwayat Pencatatan
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Periode {formatMonth(filterMonth)}
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
                {rows.length} Data
              </span>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>Memuat riwayat data...</p>
            ) : rows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <FolderOpenIcon size={36} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>Belum Ada Data</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Pencatatan pada bulan {formatMonth(filterMonth)} masih kosong.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rows.map((row) => {
                  const typeItem = TYPES[row.jenis] || TYPES.ibu_hamil;
                  return (
                    <div
                      key={row.id}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: typeItem.theme.lightBg,
                            color: typeItem.theme.textColor,
                            border: `1px solid ${typeItem.theme.lightBorder}`,
                            textTransform: 'uppercase'
                          }}
                        >
                          {typeItem.shortLabel}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                          {formatDate(row.tanggal)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                            {row.nama} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '12px' }}>({row.umur} th)</span>
                          </h4>
                          <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                            {row.alamat || 'Alamat tidak dicantumkan'}
                          </span>
                        </div>
                        <Button
                          variant="danger-outline"
                          size="sm"
                          icon={Delete02Icon}
                          onClick={() => handleDelete(row.id, row.nama)}
                        >
                          Hapus
                        </Button>
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        {detailSummary(row)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          LAPORAN CETAK A4 KHUSUS
          ===================================================== */}
      <div className="dti-print-only">
        <div style={{ borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SISTEM INFORMASI POSYANDU DESA LOA DURI ULU
            </div>
            <h1 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 900 }}>
              LAPORAN DATA SASARAN KHUSUS & RISTI
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#333' }}>
              Posyandu: {posyandu || 'Loa Duri Ulu'} • Ibu Hamil Risti, Nifas, Kematian Nifas, & Diare
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <div>Periode Pelaporan:</div>
            <strong>{formatMonth(filterMonth)}</strong>
          </div>
        </div>

        {Object.entries(TYPES).map(([type, info], index) => (
          <section key={type} style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
              {index + 1}. {info.label}
            </h3>

            {grouped[type]?.length === 0 ? (
              <p style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#666', margin: 0 }}>Nihil (Tidak ada kasus yang dicatat)</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '35px' }}>No</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Nama Warga</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '50px' }}>Umur</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '85px' }}>Tanggal</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Alamat</th>
                    <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Detail Parameter</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[type]?.map((row, i) => (
                    <tr key={row.id}>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', fontWeight: 700 }}>{row.nama}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{row.umur} th</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'center' }}>{formatDate(row.tanggal)}</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{row.alamat || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{detailSummary(row)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', fontSize: '12px' }}>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <p style={{ margin: 0 }}>Kader / Petugas,</p>
            <div style={{ height: '50px' }}></div>
            <strong>( ........................................ )</strong>
          </div>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <p style={{ margin: 0 }}>Ketua Posyandu,</p>
            <div style={{ height: '50px' }}></div>
            <strong>( ........................................ )</strong>
          </div>
        </div>
      </div>
    </>
  );
}
