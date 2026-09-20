import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import NotificationModal from '../common/NotificationModal';
import Button from '../common/Button';

import {
  Book02Icon,
  DropletIcon,
  Home01Icon,
  Shield01Icon,
  FavouriteIcon,
  Comment01Icon,
  LockIcon,
  Megaphone01Icon,
  ViewIcon,
  Image01Icon,
  Cancel01Icon,
  Upload01Icon,
  File01Icon,
  Delete02Icon,
  CheckmarkCircle01Icon,
  Activity01Icon,
  Add01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

// === KONFIGURASI 5 BIDANG SPM SESUAI STANDAR DESA ===
const SPM_CATEGORIES = [
  {
    id: 0,
    key: 'pendidikan',
    title: 'Pendidikan',
    subtitle: 'PAUD, Literasi & Sarana',
    tag: 'SPM Pendidikan',
    icon: Book02Icon,
    theme: {
      primary: 'var(--cyan-deep, #0E7C93)',
      accent: 'var(--cyan, #5FC4DB)',
      lightBg: 'var(--cyan-bg, #E3F7FB)',
      lightBorder: '#b3e8f3',
      textColor: 'var(--cyan-deep, #0E7C93)',
    }
  },
  {
    id: 1,
    key: 'pekerjaan_umum',
    title: 'Pekerjaan Umum',
    subtitle: 'Air, Sanitasi & Jalan',
    tag: 'SPM PU',
    icon: DropletIcon,
    theme: {
      primary: 'var(--orange-deep, #B5650C)',
      accent: 'var(--orange, #F2A65A)',
      lightBg: 'var(--orange-bg, #FFF1DF)',
      lightBorder: '#fedbb0',
      textColor: 'var(--orange-deep, #B5650C)',
    }
  },
  {
    id: 2,
    key: 'perumahan_rakyat',
    title: 'Perumahan',
    subtitle: 'RTLH & Hunian Sehat',
    tag: 'SPM Perumahan',
    icon: Home01Icon,
    theme: {
      primary: 'var(--magenta-deep, #93348A)',
      accent: 'var(--magenta, #D98AD1)',
      lightBg: 'var(--magenta-bg, #FBEAF8)',
      lightBorder: '#f5cbe7',
      textColor: 'var(--magenta-deep, #93348A)',
    }
  },
  {
    id: 3,
    key: 'trantibumlinmas',
    title: 'Trantibum',
    subtitle: 'Ketertiban & Bencana',
    tag: 'SPM Trantibum',
    icon: Shield01Icon,
    theme: {
      primary: 'var(--violet-deep, #5B21B6)',
      accent: '#8b5cf6',
      lightBg: 'var(--violet-bg, #F3E8FF)',
      lightBorder: '#ddd6fe',
      textColor: 'var(--violet-deep, #5B21B6)',
    }
  },
  {
    id: 4,
    key: 'sosial',
    title: 'Sosial',
    subtitle: 'Bansos & Disabilitas',
    tag: 'SPM Sosial',
    icon: FavouriteIcon,
    theme: {
      primary: 'var(--green-deep, #2E7D46)',
      accent: 'var(--green, #7FCB93)',
      lightBg: 'var(--green-bg, #E7F7EC)',
      lightBorder: '#c3ecd0',
      textColor: 'var(--green-deep, #2E7D46)',
    }
  }
];

export default function PengaduanView() {
  const [tab, setTab] = useState(0);

  // Sub-chip active index states
  const [subTab0, setSubTab0] = useState(0);
  const [subTab1, setSubTab1] = useState(0);
  const [subTab2, setSubTab2] = useState(0);
  const [subTab3, setSubTab3] = useState(0);
  const [subTab4, setSubTab4] = useState(0);

  // File input refs
  const fileInputIdenRef = useRef(null);
  const fileInputPengaduanRef = useRef(null);

  // === STATE UNTUK API ===
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewFilter, setViewFilter] = useState('all'); // 'all', 'form', 'aduan'

  // State Dinamis untuk Formulir Identifikasi (Kiri)
  const [formIden, setFormIden] = useState({});
  const [fotoIden, setFotoIden] = useState([]);

  // State untuk Pengaduan Masyarakat (Kanan)
  const [formPengaduan, setFormPengaduan] = useState({
    nama_pelapor: '', jenis_kelamin: 'L', nik: '', no_hp: '', alamat: '', isi_keluhan: '', lokasi_masalah: ''
  });
  const [lampiranPengaduan, setLampiranPengaduan] = useState([]);

  // === STATE UNTUK REKAP TABEL & MODAL ===
  const [rekapPengaduan, setRekapPengaduan] = useState([]);
  const [rekapFormulir, setRekapFormulir] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [showAllRekap, setShowAllRekap] = useState(false);

  // Hak akses hapus data yang sudah disubmit
  let currentAuthUser = {};
  try {
    currentAuthUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  } catch (e) {
    currentAuthUser = {};
  }

  const currentRole = currentAuthUser?.role || '';
  const currentUserId = currentAuthUser?.id || null;

  // Kader boleh hapus Formulir miliknya sendiri (backend tetap memverifikasi).
  // Ketua / Superadmin dapat menghapus Formulir.
  const canDeleteFinalForm = ['kader', 'ketua', 'superadmin'].includes(currentRole);

  // Pengaduan belum punya kader_id pembuat, jadi hapus final dibatasi Ketua/Superadmin.
  const canDeleteFinalPengaduan = ['ketua', 'superadmin'].includes(currentRole);

  useEffect(() => {
    if (selectedForm || selectedPengaduan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedForm) setSelectedForm(null);
        if (selectedPengaduan) setSelectedPengaduan(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedForm, selectedPengaduan]);

  const fetchRekap = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const [resPengaduan, resFormulir] = await Promise.all([
        axios.get('/api/pengaduan-masyarakat', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/formulir-identifikasi', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setRekapPengaduan(resPengaduan.data?.data || []);
      setRekapFormulir(resFormulir.data?.data || []);
    } catch (err) {
      console.error('Gagal mengambil data rekap:', err);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, []);

  // Hapus data yang sudah disubmit / final.
  const handleDeleteFinal = async (type, item) => {
    const isForm = type === 'form';
    const namaData = isForm
      ? `Formulir ${item?.sub_bidang || ''}`
      : `Pengaduan ${item?.nama_pelapor || ''}`;

    const yakin = window.confirm(
      `Yakin ingin menghapus ${namaData.trim()}?\n\nData dan lampiran akan dihapus permanen dan tidak dapat dipulihkan.`
    );

    if (!yakin) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth_token');

      const endpoint = isForm
        ? `/api/formulir-identifikasi/${item.id}`
        : `/api/pengaduan-masyarakat/${item.id}`;

      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (isForm && selectedForm?.id === item.id) {
        setSelectedForm(null);
      }

      if (!isForm && selectedPengaduan?.id === item.id) {
        setSelectedPengaduan(null);
      }

      setMessage({
        type: 'success',
        text:
          response.data?.pesan ||
          (isForm
            ? 'Data formulir berhasil dihapus.'
            : 'Pengaduan berhasil dihapus.')
      });

      await fetchRekap();
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.pesan ||
          err.response?.data?.message ||
          'Gagal menghapus data.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // VALIDASI INPUT & FILE
  // =========================================================================
  const handleIdenChange = (e) => {
    let { name, value } = e.target;
    // Paksa Nomor HP / Telp hanya menerima digit
    if (name.includes('hp') || name.includes('telp') || name.includes('telepon') || name.includes('kontak')) {
      value = value.replace(/\D/g, '');
      if (value.length > 15) value = value.substring(0, 15);
    }
    setFormIden({ ...formIden, [name]: value });
  };

  const handlePengaduanChange = (e) => {
    let { name, value } = e.target;

    // Paksa NIK hanya menerima Angka & Maksimal 16 Digit
    if (name === 'nik') {
      value = value.replace(/\D/g, '');
      if (value.length > 16) value = value.substring(0, 16);
    }
    // Paksa No HP hanya menerima Angka & Maksimal 15 Digit
    if (name === 'no_hp' || name === 'telepon' || name === 'kontak') {
      value = value.replace(/\D/g, '');
      if (value.length > 15) value = value.substring(0, 15);
    }

    setFormPengaduan({ ...formPengaduan, [name]: value });
  };

  // Pengecek File & Append (Dukungan pemilihan file bertahap / tombol '+')
  const handleFileAppend = (e, setFileState) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB per file, sama dengan backend

    const validFiles = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: `File "${file.name}" ditolak! Hanya boleh format JPG, PNG, PDF, DOC, atau DOCX.` });
        continue;
      }
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: `Ukuran file "${file.name}" terlalu besar! Maksimal 2MB per file.` });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFileState(prev => {
        const current = Array.isArray(prev) ? prev : [];
        const existingKeys = new Set(current.map(f => `${f.name}_${f.size}`));
        const toAdd = validFiles.filter(f => !existingKeys.has(`${f.name}_${f.size}`));
        return [...current, ...toAdd];
      });
      setMessage({ type: '', text: '' });
    }
    e.target.value = '';
  };

  // Reset form saat ganti sub-tab atau tab
  const resetFormIden = () => {
    setFormIden({});
    setFotoIden([]);
    setLoadedDraftIdenId(null);
    setMessage({ type: '', text: '' });
    if (fileInputIdenRef.current) fileInputIdenRef.current.value = '';
  };

  // =========================================================================
  // HELPER DATA & FILE URL
  // =========================================================================
  const getArrayData = (rawData) => {
    if (!rawData) return [];
    let arr = [];
    if (Array.isArray(rawData)) {
      arr = rawData;
    } else {
      try {
        let parsed = JSON.parse(rawData);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        arr = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        arr = [rawData];
      }
    }
    return arr.filter(item => item && typeof item === 'string');
  };

  const getSafeObject = (rawData) => {
    if (!rawData) return {};
    if (typeof rawData === 'object') return rawData;
    try {
      return JSON.parse(rawData) || {};
    } catch (e) { return {}; }
  };

  const getFileUrl = (path) => {
    if (!path) return '';
    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('http')) return cleanPath;
    cleanPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
    return `/storage/${cleanPath}`;
  };

  // === MAP NAMA BIDANG & SUB-BIDANG UNTUK BACKEND ===
  const BIDANG_MAP = ['pendidikan', 'pekerjaan_umum', 'perumahan_rakyat', 'trantibumlinmas', 'sosial'];

  const SUB_BIDANG_MAP = [
  [
    'Anak Usia Dini (0-6 th)',
    'Perpustakaan / Pojok Baca',
    'Literasi Digital Ortu',
    'Inventaris APE'
  ],
  [
    'Edukasi Air Bersih & Limbah',
    'Identifikasi Embung Air Baku',
    'Jaringan Air Perdesaan',
    'Sumur Air Tanah',
    'Pembangunan Jalan Desa'
  ],
  [
    'Rumah Tidak Layak Huni',
    'KIE Lingkungan Bersih & Sehat',
    'Pemanfaatan Pekarangan',
    'Biopori Rumah Tangga'
  ],
  [
    'Korban Trauma & Psikososial',
    'Penyuluhan & Evaluasi Trauma',
    'KIE & Simulasi Bencana',
    'Insiden Kamtibmas',
    'Sosialisasi Pencegahan',
    'Patroli Keamanan'
  ],
  [
    'KIE Gender & Inklusi Sosial',
    'Pendataan Fakir Miskin',
    'Verifikasi Sosial-Ekonomi',
    'Penyaluran Bantuan Sosial'
  ]
];
const getSubBidangName = () => {
  const currentSubTabs = [
    subTab0,
    subTab1,
    subTab2,
    subTab3,
    subTab4
  ];

  return (
    SUB_BIDANG_MAP[tab]?.[
      currentSubTabs[tab]
    ] || 'Lainnya'
  );
};

  // === SUBMIT FORMULIR IDENTIFIKASI ===
  const submitIdentifikasi = async () => {
    const filledEntries = Object.entries(formIden || {}).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        String(value).trim().length > 0
    );

    if (filledEntries.length === 0) {
      setMessage({
        type: 'error',
        text: 'Formulir masih kosong! Mohon isi data identifikasi lapangan sebelum menyimpan.'
      });
      return;
    }

    const hasIdentifier =
      formIden.nama_anak?.trim() ||
      formIden.nama_warga?.trim() ||
      formIden.nama_kk?.trim() ||
      formIden.nama_korban?.trim() ||
      formIden.nama_peserta?.trim() ||
      formIden.nama_penerima?.trim() ||
      formIden.nama_ortu?.trim() ||
      formIden.pemilik?.trim() ||
      formIden.nama_fasilitas?.trim() ||
      formIden.nama_kegiatan?.trim() ||
      formIden.nama_paud?.trim() ||
      formIden.jenis_ape?.trim() ||
      formIden.lokasi_embung?.trim() ||
      formIden.lokasi_pipa?.trim() ||
      formIden.lokasi_jalan?.trim() ||
      formIden.lokasi?.trim() ||
      formIden.wilayah?.trim() ||
      formIden.pengelola?.trim() ||
      formIden.petugas?.trim() ||
      formIden.fasilitator?.trim() ||
      formIden.nama_petugas?.trim();

    if (!hasIdentifier) {
      setMessage({
        type: 'error',
        text: 'Mohon lengkapi nama subjek, kegiatan, fasilitas, petugas, atau lokasi peninjauan.'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('bidang', BIDANG_MAP[tab]);
      formData.append('sub_bidang', getSubBidangName());
      formData.append('data_formulir', JSON.stringify(formIden));
      formData.append('status_form', 'final');

      // Jika berasal dari draf yang dimuat, ubah draf tersebut menjadi final.
      if (loadedDraftIdenId) {
        formData.append('draft_id', loadedDraftIdenId);
      }

      if (fotoIden?.length > 0) {
        fotoIden.forEach((file, index) => {
          formData.append(`dokumentasi_foto[${index}]`, file);
        });
      }

      const response = await axios.post(
        '/api/formulir-identifikasi',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setLoadedDraftIdenId(null);
      setDraftRefreshKey(prev => prev + 1);
      resetFormIden();

      setMessage({
        type: 'success',
        text: response.data.pesan || 'Formulir identifikasi berhasil disimpan.'
      });

      fetchRekap();
    } catch (err) {
      const pesanAsli =
        err.response?.data?.pesan ||
        err.response?.data?.message ||
        err.message;

      setMessage({
        type: 'error',
        text: `Gagal menyimpan formulir: ${pesanAsli}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // === SUBMIT PENGADUAN MASYARAKAT ===
  const submitPengaduan = async () => {
    if (!formPengaduan.nama_pelapor?.trim()) {
      setMessage({
        type: 'error',
        text: 'Gagal: Nama Pelapor wajib diisi.'
      });
      return;
    }

    if (!formPengaduan.nik?.trim()) {
      setMessage({
        type: 'error',
        text: 'Gagal: NIK Pelapor wajib diisi.'
      });
      return;
    }

    if (formPengaduan.nik.length !== 16) {
      setMessage({
        type: 'error',
        text: 'Gagal: NIK Pelapor harus tepat 16 digit angka!'
      });
      return;
    }

    if (!formPengaduan.alamat?.trim()) {
      setMessage({
        type: 'error',
        text: 'Gagal: Alamat Pelapor wajib diisi.'
      });
      return;
    }

    if (!formPengaduan.isi_keluhan?.trim()) {
      setMessage({
        type: 'error',
        text: 'Gagal: Isi Aspirasi / Keluhan wajib diisi.'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('bidang', BIDANG_MAP[tab]);
      formData.append('status_form', 'final');

      // Jika berasal dari draf yang dimuat, ubah draf tersebut menjadi final.
      if (loadedDraftPengaduanId) {
        formData.append('draft_id', loadedDraftPengaduanId);
      }

      Object.keys(formPengaduan).forEach(key => {
        const value = formPengaduan[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          formData.append(key, value);
        }
      });

      if (lampiranPengaduan?.length > 0) {
        lampiranPengaduan.forEach((file, index) => {
          formData.append(`lampiran[${index}]`, file);
        });
      }

      const response = await axios.post(
        '/api/pengaduan-masyarakat',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setLoadedDraftPengaduanId(null);
      setDraftRefreshKey(prev => prev + 1);

      setFormPengaduan({
        nama_pelapor: '',
        jenis_kelamin: 'L',
        nik: '',
        no_hp: '',
        alamat: '',
        isi_keluhan: '',
        lokasi_masalah: ''
      });

      setLampiranPengaduan([]);

      if (fileInputPengaduanRef.current) {
        fileInputPengaduanRef.current.value = '';
      }

      setMessage({
        type: 'success',
        text: response.data.pesan || 'Aspirasi / pengaduan warga berhasil dikirim.'
      });

      fetchRekap();
    } catch (err) {
      const pesanAsli =
        err.response?.data?.pesan ||
        err.response?.data?.message ||
        err.message;

      setMessage({
        type: 'error',
        text: `Gagal mengirim pengaduan: ${pesanAsli}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // MULTI DRAFT DATABASE FORMULIR & PENGADUAN
  // ============================================================
  const [draftRefreshKey, setDraftRefreshKey] = useState(0);
  const [draftIdenDb, setDraftIdenDb] = useState([]);
  const [draftPengaduanDb, setDraftPengaduanDb] = useState([]);
  const [loadedDraftIdenId, setLoadedDraftIdenId] = useState(null);
  const [loadedDraftPengaduanId, setLoadedDraftPengaduanId] = useState(null);

  const fetchDraftStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      const [resIden, resPengaduan] = await Promise.all([
        axios.get('/api/formulir-identifikasi/draft', {
          params: {
            bidang: BIDANG_MAP[tab]
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),

        axios.get('/api/pengaduan-masyarakat/draft', {
          params: {
            bidang: BIDANG_MAP[tab]
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      setDraftIdenDb(
        Array.isArray(resIden.data?.data)
          ? resIden.data.data
          : []
      );

      setDraftPengaduanDb(
        Array.isArray(resPengaduan.data?.data)
          ? resPengaduan.data.data
          : []
      );
    } catch (err) {
      console.error('Gagal mengambil draf:', err);
    }
  };

  // Saat pindah bidang, draft yang sedang dibuka dilepas.
  useEffect(() => {
    setLoadedDraftIdenId(null);
    setLoadedDraftPengaduanId(null);
  }, [tab]);

  // Refresh daftar draft tanpa melepas draft yang sedang dibuka.
  // Ini mencegah klik "Update Draf" membuat record baru/duplikat.
  useEffect(() => {
    fetchDraftStatus();
  }, [tab, draftRefreshKey]);

  const handleNewDraftIden = () => {
    setLoadedDraftIdenId(null);
    setFormIden({});
    setFotoIden([]);

    if (fileInputIdenRef.current) {
      fileInputIdenRef.current.value = '';
    }

    setMessage({
      type: '',
      text: ''
    });
  };

  const handleNewDraftPengaduan = () => {
    setLoadedDraftPengaduanId(null);

    setFormPengaduan({
      nama_pelapor: '',
      jenis_kelamin: 'L',
      nik: '',
      no_hp: '',
      alamat: '',
      isi_keluhan: '',
      lokasi_masalah: ''
    });

    setLampiranPengaduan([]);

    if (fileInputPengaduanRef.current) {
      fileInputPengaduanRef.current.value = '';
    }

    setMessage({
      type: '',
      text: ''
    });
  };

  // =============================
  // SIMPAN / UPDATE DRAF FORMULIR
  // =============================
  const handleSaveDraftIden = async () => {
    const filledEntries = Object.entries(formIden || {}).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        String(value).trim().length > 0
    );

    if (
      filledEntries.length === 0 &&
      fotoIden.length === 0
    ) {
      setMessage({
        type: 'error',
        text: 'Formulir masih kosong! Belum ada data untuk disimpan sebagai draf.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('bidang', BIDANG_MAP[tab]);
      formData.append('sub_bidang', getSubBidangName());
      formData.append('data_formulir', JSON.stringify(formIden));
      formData.append('status_form', 'draft');

      // Ada ID = update draf yang sedang dibuka.
      // Tidak ada ID = buat draf baru.
      if (loadedDraftIdenId) {
        formData.append('draft_id', loadedDraftIdenId);
      }

      fotoIden.forEach((file, index) => {
        formData.append(`dokumentasi_foto[${index}]`, file);
      });

      const response = await axios.post(
        '/api/formulir-identifikasi',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setLoadedDraftIdenId(
        response.data?.data?.id || null
      );

      setDraftRefreshKey(prev => prev + 1);

      setMessage({
        type: 'success',
        text: loadedDraftIdenId
          ? 'Draf formulir berhasil diperbarui.'
          : 'Draf formulir baru berhasil disimpan.'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.pesan ||
          err.response?.data?.message ||
          'Gagal menyimpan draf formulir.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // MUAT DRAF FORMULIR
  // =============================
  const handleLoadDraftIden = (draft) => {
    const data = getSafeObject(
      draft.data_formulir
    );

    const indexSub =
      SUB_BIDANG_MAP[tab]?.indexOf(
        draft.sub_bidang
      );

    if (indexSub >= 0) {
      if (tab === 0) setSubTab0(indexSub);
      if (tab === 1) setSubTab1(indexSub);
      if (tab === 2) setSubTab2(indexSub);
      if (tab === 3) setSubTab3(indexSub);
      if (tab === 4) setSubTab4(indexSub);
    }

    setFormIden(data);
    setFotoIden([]);
    setLoadedDraftIdenId(draft.id);

    if (fileInputIdenRef.current) {
      fileInputIdenRef.current.value = '';
    }

    setMessage({
      type: 'success',
      text: 'Draf formulir berhasil dimuat.'
    });
  };

  // =============================
  // SIMPAN / UPDATE DRAF PENGADUAN
  // =============================
  const handleSaveDraftPengaduan = async () => {
    const filledEntries = Object.entries(
      formPengaduan || {}
    ).filter(
      ([key, value]) =>
        key !== 'jenis_kelamin' &&
        value !== null &&
        value !== undefined &&
        String(value).trim().length > 0
    );

    if (
      filledEntries.length === 0 &&
      lampiranPengaduan.length === 0
    ) {
      setMessage({
        type: 'error',
        text: 'Formulir pengaduan masih kosong! Belum ada data untuk disimpan sebagai draf.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('bidang', BIDANG_MAP[tab]);
      formData.append('status_form', 'draft');

      if (loadedDraftPengaduanId) {
        formData.append(
          'draft_id',
          loadedDraftPengaduanId
        );
      }

      Object.keys(formPengaduan).forEach(key => {
        const value = formPengaduan[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          formData.append(key, value);
        }
      });

      lampiranPengaduan.forEach(
        (file, index) => {
          formData.append(
            `lampiran[${index}]`,
            file
          );
        }
      );

      const response = await axios.post(
        '/api/pengaduan-masyarakat',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setLoadedDraftPengaduanId(
        response.data?.data?.id || null
      );

      setDraftRefreshKey(prev => prev + 1);

      setMessage({
        type: 'success',
        text: loadedDraftPengaduanId
          ? 'Draf pengaduan berhasil diperbarui.'
          : 'Draf pengaduan baru berhasil disimpan.'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.pesan ||
          err.response?.data?.message ||
          'Gagal menyimpan draf pengaduan.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // MUAT DRAF PENGADUAN
  // =============================
  const handleLoadDraftPengaduan = (draft) => {
    setFormPengaduan({
      nama_pelapor: draft.nama_pelapor || '',
      jenis_kelamin: draft.jenis_kelamin || 'L',
      nik: draft.nik || '',
      no_hp: draft.no_hp || '',
      alamat: draft.alamat || '',
      tanggal_penyampaian: draft.tanggal_penyampaian
        ? String(draft.tanggal_penyampaian).substring(0, 10)
        : '',
      penerima_aspirasi: draft.penerima_aspirasi || '',
      jenis_aspirasi: draft.jenis_aspirasi || '',
      // Empat bidang memakai nama field "jenis_pengaduan" di UI.
      // Nilainya tetap berasal dari kolom jenis_aspirasi di database.
      jenis_pengaduan: draft.jenis_aspirasi || '',
      isi_keluhan: draft.isi_keluhan || '',
      lokasi_masalah: draft.lokasi_masalah || '',
      urgensi: draft.urgensi || 'Sedang',
      rekomendasi: draft.rekomendasi || '',
      tindak_lanjut: draft.tindak_lanjut || ''
    });

    setLampiranPengaduan([]);
    setLoadedDraftPengaduanId(draft.id);

    if (fileInputPengaduanRef.current) {
      fileInputPengaduanRef.current.value = '';
    }

    setMessage({
      type: 'success',
      text: 'Draf pengaduan berhasil dimuat.'
    });
  };

  // =============================
  // HAPUS SATU DRAF
  // =============================
  const handleDeleteDraft = async (
    type,
    draft
  ) => {
    try {
      const token =
        localStorage.getItem('auth_token');

      const endpoint =
        type === 'iden'
          ? `/api/formulir-identifikasi/draft/${draft.id}`
          : `/api/pengaduan-masyarakat/draft/${draft.id}`;

      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (
        type === 'iden' &&
        loadedDraftIdenId === draft.id
      ) {
        handleNewDraftIden();
      }

      if (
        type === 'aduan' &&
        loadedDraftPengaduanId === draft.id
      ) {
        handleNewDraftPengaduan();
      }

      setDraftRefreshKey(prev => prev + 1);

      setMessage({
        type: 'success',
        text: 'Draf berhasil dihapus.'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err.response?.data?.pesan ||
          err.response?.data?.message ||
          'Gagal menghapus draf.'
      });
    }
  };

  // =============================
  // TOMBOL ACTION + DAFTAR DRAF
  // =============================
  const renderActionButtons = (
    type = 'iden'
  ) => {
    const drafts =
      type === 'iden'
        ? draftIdenDb
        : draftPengaduanDb;

    const loadedId =
      type === 'iden'
        ? loadedDraftIdenId
        : loadedDraftPengaduanId;

    return (
      <div style={{ marginTop: '20px' }}>
        {drafts.length > 0 && (
          <div
            style={{
              marginBottom: '12px',
              maxHeight: '240px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '7px'
            }}
          >
            {drafts.map((draft, index) => {
              const isLoaded =
                loadedId === draft.id;

              const title =
                type === 'iden'
                  ? (
                      draft.identitas ||
                      draft.sub_bidang ||
                      `Draf ${index + 1}`
                    )
                  : (
                      draft.nama_pelapor ||
                      draft.isi_keluhan?.substring(0, 45) ||
                      `Draf ${index + 1}`
                    );

              return (
                <div
                  key={draft.id}
                  style={{
                    backgroundColor:
                      isLoaded
                        ? '#ecfdf5'
                        : '#fffbeb',
                    border:
                      isLoaded
                        ? '1px solid #86efac'
                        : '1px solid #fde68a',
                    borderRadius: '9px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      minWidth: 0,
                      flex: 1
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#334155',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {title}
                    </div>

                    <div
                      style={{
                        fontSize: '10.5px',
                        color: '#64748b',
                        marginTop: '2px'
                      }}
                    >
                      {type === 'iden'
                        ? draft.sub_bidang
                        : 'Pengaduan'}

                      {' • '}

                      {draft.updated_at
                        ? new Date(
                            draft.updated_at
                          ).toLocaleString(
                            'id-ID'
                          )
                        : ''}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '5px',
                      flexShrink: 0
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        type === 'iden'
                          ? handleLoadDraftIden(
                              draft
                            )
                          : handleLoadDraftPengaduan(
                              draft
                            )
                      }
                      disabled={isLoaded}
                      style={{
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        backgroundColor:
                          isLoaded
                            ? '#16a34a'
                            : '#f59e0b',
                        color: '#fff',
                        fontSize: '11px',
                        cursor:
                          isLoaded
                            ? 'default'
                            : 'pointer',
                        fontWeight: 700
                      }}
                    >
                      {isLoaded
                        ? 'Sedang Dibuka'
                        : 'Muat'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteDraft(
                          type,
                          draft
                        )
                      }
                      style={{
                        border:
                          '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '4px 7px',
                        backgroundColor: '#fff',
                        color: '#dc2626',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loadedId && (
          <button
            type="button"
            onClick={
              type === 'iden'
                ? handleNewDraftIden
                : handleNewDraftPengaduan
            }
            style={{
              width: '100%',
              marginBottom: '8px',
              border: '1px dashed #94a3b8',
              backgroundColor: '#f8fafc',
              color: '#334155',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            + Buat Draf Baru
          </button>
        )}

        <div
          style={{
            display: 'flex',
            gap: '10px'
          }}
        >
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isLoading}
            onClick={
              type === 'iden'
                ? handleSaveDraftIden
                : handleSaveDraftPengaduan
            }
            style={{ flex: 1 }}
          >
            {loadedId
              ? 'Update Draf'
              : 'Simpan Draf Baru'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={
              type === 'iden'
                ? submitIdentifikasi
                : submitPengaduan
            }
            disabled={isLoading}
            loading={isLoading}
            loadingText={
              type === 'iden'
                ? 'Menyimpan...'
                : 'Mengirim...'
            }
            style={{ flex: 1 }}
          >
            {type === 'iden'
              ? 'Simpan Data'
              : 'Kirim Pengaduan'}
          </Button>
        </div>
      </div>
    );
  };

  // === RENDER DROPZONE UPLOAD FILE DENGAN TOMBOL TAMBAH DOKUMEN & HAPUS INDIVIDUAL ===
  const renderUploadBox = (fileState, setFileState, inputRef, label, note, extraReqs = null) => {
    const files = Array.isArray(fileState) ? fileState : (fileState ? Array.from(fileState) : []);
    const hasFiles = files.length > 0;

    return (
      <div className="form-field full" style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
          {label}
        </label>
        <input
          type="file"
          ref={inputRef}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          onChange={(e) => handleFileAppend(e, setFileState)}
          style={{ display: 'none' }}
        />

        {hasFiles && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
            {files.map((file, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  fontSize: '12.5px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <File01Icon size={16} color="var(--primary-teal, #008080)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.name}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '11px', flexShrink: 0 }}>
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileState(files.filter((_, i) => i !== idx));
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Hapus file ini"
                >
                  <Cancel01Icon size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              flex: 1,
              border: '2px dashed #cbd5e1',
              borderRadius: '10px',
              padding: hasFiles ? '10px 14px' : '16px 14px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--primary-teal, #008080)',
              fontWeight: 700,
              fontSize: '13px'
            }}
          >
            {hasFiles ? <Add01Icon size={18} /> : <Upload01Icon size={18} />}
            <span>{hasFiles ? '+ Tambah File' : 'Klik untuk Unggah Berkas / Foto'}</span>
          </button>
          {hasFiles && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Delete02Icon}
              onClick={() => {
                setFileState([]);
                if (inputRef.current) inputRef.current.value = '';
              }}
              title="Reset Semua File"
            >
              Reset
            </Button>
          )}
        </div>

        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
          {note || 'Format: JPG, PNG, PDF, DOC (Maks. 5MB per file)'}
        </div>

        {extraReqs && (
          <div style={{ marginTop: '8px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#64748b', lineHeight: 1.5 }}>
            {extraReqs}
          </div>
        )}
      </div>
    );
  };

  const getFormulirSubjek = (item) => {
    // Prioritas utama: kolom identitas dari database
    if (item?.identitas && String(item.identitas).trim() !== '') {
      return item.identitas;
    }

    // Fallback untuk data lama yang belum punya kolom identitas
    const data = getSafeObject(item.data_formulir);

    return (
      data.nama_anak ||
      data.nama_warga ||
      data.nama_kk ||
      data.nama_korban ||
      data.nama_peserta ||
      data.nama_penerima ||
      data.nama_ortu ||
      data.pemilik ||
      data.nama_fasilitas ||
      data.nama_kegiatan ||
      data.jenis_ape ||
      data.lokasi_embung ||
      data.lokasi_pipa ||
      data.lokasi_jalan ||
      data.lokasi ||
      data.pengelola ||
      data.nama_petugas ||
      '-'
    );
  };

  const currentCategory = SPM_CATEGORIES[tab] || SPM_CATEGORIES[0];
  const CurrentIcon = currentCategory.icon;

  // Data filter rekap untuk bidang saat ini
  const bidangSaatIni = BIDANG_MAP[tab];
  const dataPengaduanFilter = rekapPengaduan?.filter(item => item.bidang === bidangSaatIni) || [];
  const dataFormulirFilter = rekapFormulir?.filter(item => item.bidang === bidangSaatIni) || [];
  const belumSelesai = dataPengaduanFilter.filter(item => item.status !== 'selesai').length;

  const displayFormulir = showAllRekap ? dataFormulirFilter : dataFormulirFilter.slice(0, 3);
  const displayPengaduan = showAllRekap ? dataPengaduanFilter : dataPengaduanFilter.slice(0, 3);

  return (
    <>
      <style>{`
        .spm-tab-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 1200px) {
          .spm-tab-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 768px) {
          .spm-tab-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .spm-tab-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .spm-tab-btn {
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
          transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
        }
        .spm-tab-btn:hover {
          transform: translateY(-1px);
        }
        /* Fokus Tampilan Formulir Selector */
        .spm-focus-bar {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 22px;
          padding: 16px 20px;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .spm-focus-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .spm-focus-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .spm-focus-btn {
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #f8fafc;
          color: #1e293b;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
          outline: none;
        }
        .spm-focus-btn:hover {
          background-color: #ffffff;
          border-color: #94a3b8;
          color: #0f172a;
          transform: translateY(-1px);
        }
        .spm-focus-btn.active-all {
          background-color: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(15, 23, 42, 0.25);
          transform: translateY(-1px);
        }
        .spm-focus-btn.active-form {
          background-color: var(--primary-teal, #008080);
          border-color: var(--primary-teal, #008080);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(0, 128, 128, 0.28);
          transform: translateY(-1px);
        }
        .spm-focus-btn.active-aduan {
          background-color: var(--orange-deep, #B5650C);
          border-color: var(--orange-deep, #B5650C);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(181, 101, 12, 0.28);
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .spm-focus-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 14px;
            gap: 12px;
          }
          .spm-focus-buttons {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
            gap: 8px;
          }
          .spm-focus-btn {
            width: 100%;
            min-height: 48px;
            font-size: 14px;
            justify-content: center;
          }
        }

        /* Sub-Tabs Pills */
        .spm-sub-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          background-color: #f8fafc;
          padding: 8px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          margin-bottom: 22px;
        }
        .spm-sub-pill {
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          color: #1e293b;
          background-color: #ffffff;
          border: 1.5px solid #cbd5e1;
          cursor: pointer;
          transition: transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          box-sizing: border-box;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          line-height: 1.3;
          outline: none;
        }
        .spm-sub-pill:hover {
          color: #0f172a;
          border-color: #94a3b8;
          background-color: #f1f5f9;
          transform: translateY(-1px);
        }
        .spm-sub-pill.active {
          background-color: var(--primary-teal, #008080);
          border-color: var(--primary-teal, #008080);
          color: #ffffff !important;
          font-weight: 800;
          box-shadow: 0 3px 10px rgba(0, 128, 128, 0.28);
          transform: translateY(-1px);
        }
        @media (max-width: 640px) {
          .spm-sub-pills {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 10px;
          }
          .spm-sub-pill {
            width: 100%;
            text-align: center;
            font-size: 14px;
            min-height: 48px;
          }
        }
        .spm-form-card {
          padding: 24px;
          border-radius: 16px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }
        .spm-form-card .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          display: block;
          margin-bottom: 6px;
        }
        .spm-form-card .form-field input,
        .spm-form-card .form-field select {
          width: 100%;
          min-height: 44px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          padding: 0 12px;
          font-size: 14px;
          background-color: #ffffff;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .spm-form-card .form-field input:focus,
        .spm-form-card .form-field select:focus {
          border-color: var(--primary-teal, #008080);
          box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.12);
        }
        .spm-form-card .form-field textarea {
          width: 100%;
          min-height: 90px;
          resize: vertical;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          font-size: 14px;
          background-color: #ffffff;
          box-sizing: border-box;
          outline: none;
          line-height: 1.5;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .spm-form-card .form-field textarea:focus {
          border-color: var(--primary-teal, #008080);
          box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.12);
        }
        .spm-work-grid.spm-mode-form > div:nth-child(2) {
          display: none !important;
        }
        .spm-work-grid.spm-mode-aduan > div:nth-child(1) {
          display: none !important;
        }
        .spm-work-grid.spm-mode-form > div:nth-child(1),
        .spm-work-grid.spm-mode-aduan > div:nth-child(2) {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>

      {/* 1. TOP CARD: 5-KOLOM TILE GRID SPM */}
      <div
        className="card"
        style={{
          marginBottom: '24px',
          padding: '20px 24px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                color: 'var(--primary-teal, #008080)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Activity01Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Bidang Standar Pelayanan Minimal (SPM) Desa
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                Pilih bidang SPM untuk mencatat formulir identifikasi, menghimpun aspirasi warga, & mengelola rekap
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '11.5px', fontWeight: 700, padding: '6px 12px' }}>
              {currentCategory.tag} Aktif
            </span>
          </div>
        </div>

        {/* 5 Bidang Interactive Tile Grid */}
        <div className="spm-tab-grid">
          {SPM_CATEGORIES.map((cat) => {
            const isSelected = tab === cat.id;
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                className="spm-tab-btn"
                onClick={() => {
                  setTab(cat.id);
                  resetFormIden();
                }}
                style={{
                  borderColor: isSelected ? cat.theme.primary : cat.theme.lightBorder,
                  backgroundColor: isSelected ? cat.theme.primary : cat.theme.lightBg,
                  color: isSelected ? '#ffffff' : cat.theme.textColor,
                  boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                    color: isSelected ? '#ffffff' : cat.theme.primary,
                    border: isSelected ? 'none' : `1px solid ${cat.theme.lightBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <IconComp size={20} />
                </div>
                <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      lineHeight: 1.25,
                      color: isSelected ? '#ffffff' : cat.theme.textColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {cat.title}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      marginTop: '2px',
                      color: isSelected ? 'rgba(255, 255, 255, 0.85)' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {cat.subtitle}
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

      {/* 2. MIDDLE WORKING AREA: (IDENTIFIKASI LAPANGAN + ASPIRASI WARGA) */}
      <div style={{ marginBottom: '28px' }}>
        {/* Selector Mode Tampilan (Point 8) */}
        {/* Selector Mode Tampilan */}
        <div className="spm-focus-bar">
          <div className="spm-focus-title">
            <ViewIcon size={18} color="var(--primary-teal, #008080)" />
            <span>Fokus Tampilan Formulir:</span>
          </div>
          <div className="spm-focus-buttons">
            <button
              type="button"
              onClick={() => setViewFilter('all')}
              className={`spm-focus-btn ${viewFilter === 'all' ? 'active-all' : ''}`}
            >
              <span>👁️</span>
              <span>Semua (Berdampingan)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewFilter('form')}
              className={`spm-focus-btn ${viewFilter === 'form' ? 'active-form' : ''}`}
            >
              <span>📝</span>
              <span>Formulir Identifikasi Lapangan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewFilter('aduan')}
              className={`spm-focus-btn ${viewFilter === 'aduan' ? 'active-aduan' : ''}`}
            >
              <span>📢</span>
              <span>Pengaduan &amp; Aspirasi Warga</span>
            </button>
          </div>
        </div>

        {/* ===== 0. PENDIDIKAN ===== */}
        {tab === 0 && (
          <div className={`grid ${viewFilter === 'all' ? 'grid-2' : ''} spm-work-grid spm-mode-${viewFilter}`} style={{ gap: '24px', alignItems: 'start' }}>
            {/* KIRI: FORMULIR IDENTIFIKASI PENDIDIKAN */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Book02Icon size={20} color="var(--cyan-deep, #0E7C93)" />
                  Formulir Identifikasi — Pendidikan
                </h3>
              </div>

              {/* Sub-Tabs Pills */}
              <div className="spm-sub-pills">
                <button type="button" className={`spm-sub-pill ${subTab0 === 0 ? 'active' : ''}`} onClick={() => { setSubTab0(0); resetFormIden(); }}>
                  Anak Usia Dini (0–6 th)
                </button>
                <button type="button" className={`spm-sub-pill ${subTab0 === 1 ? 'active' : ''}`} onClick={() => { setSubTab0(1); resetFormIden(); }}>
                  Perpustakaan / Pojok Baca
                </button>
                <button type="button" className={`spm-sub-pill ${subTab0 === 2 ? 'active' : ''}`} onClick={() => { setSubTab0(2); resetFormIden(); }}>
                  Literasi Digital Ortu
                </button>
                <button type="button" className={`spm-sub-pill ${subTab0 === 3 ? 'active' : ''}`} onClick={() => { setSubTab0(3); resetFormIden(); }}>
                  Inventaris APE
                </button>
              </div>

              {/* LAMPIRAN 1: ANAK USIA DINI */}
              {subTab0 === 0 && (
                <div className="form-grid">
                  <div className="form-field full">
                    <label>Nama Anak *</label>
                    <input name="nama_anak" value={formIden.nama_anak || ''} onChange={handleIdenChange} placeholder="Sesuai KK / Pengakuan orang tua" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', gridColumn: '1 / -1' }}>
                    <div className="form-field">
                      <label>Umur (Tahun)</label>
                      <input type="number" name="umur_tahun" value={formIden.umur_tahun || ''} onChange={handleIdenChange} placeholder="Contoh: 3" min="0" max="6" />
                    </div>
                    <div className="form-field">
                      <label>Umur (Bulan)</label>
                      <input type="number" name="umur_bulan" value={formIden.umur_bulan || ''} onChange={handleIdenChange} placeholder="Contoh: 4" min="0" max="11" />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Nama Orang Tua</label>
                    <input name="nama_ortu" value={formIden.nama_ortu || ''} onChange={handleIdenChange} placeholder="Ibu atau Ayah yang mendampingi" />
                  </div>

                  <div className="form-field">
                    <label>Alamat (RT / Dusun)</label>
                    <input name="alamat" value={formIden.alamat || ''} onChange={handleIdenChange} placeholder="Contoh: RT 03 Dusun Harapan" />
                  </div>

                  <div className="form-field">
                    <label>Status Mengikuti PAUD</label>
                    <select name="status_paud" value={formIden.status_paud || 'Tidak'} onChange={handleIdenChange}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Nama Lembaga PAUD</label>
                    <input
                      name="nama_paud"
                      value={formIden.nama_paud || ''}
                      onChange={handleIdenChange}
                      placeholder={formIden.status_paud === 'Ya' ? "Tulis nama PAUD" : "Beri tanda '-' jika tidak"}
                      disabled={formIden.status_paud !== 'Ya'}
                      style={{ backgroundColor: formIden.status_paud !== 'Ya' ? '#f1f5f9' : '#fff' }}
                    />
                  </div>

                  <div className="form-field full">
                    <label>Catatan Perkembangan Anak</label>
                    <textarea rows="2" name="catatan_perkembangan" value={formIden.catatan_perkembangan || ''} onChange={handleIdenChange} placeholder="Contoh: Sesuai usia, perlu stimulasi bicara, sangat aktif..."></textarea>
                  </div>
                </div>
              )}

              {/* LAMPIRAN 2: PERPUSTAKAAN / POJOK BACA */}
              {subTab0 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Fasilitas (Perpustakaan/Pojok Baca)</label><input name="nama_fasilitas" value={formIden.nama_fasilitas || ''} onChange={handleIdenChange} placeholder="Contoh: Perpustakaan Desa Harapan" /></div>
                  <div className="form-field"><label>Ketersediaan Fasilitas</label><select name="ketersediaan" value={formIden.ketersediaan || 'Ada'} onChange={handleIdenChange}><option value="Ada">Ada</option><option value="Tidak">Tidak</option></select></div>
                  <div className="form-field"><label>Jumlah Buku Tersedia</label><input type="text" name="jumlah_buku" value={formIden.jumlah_buku || ''} onChange={handleIdenChange} placeholder="Contoh: 120 buku cerita" /></div>
                  <div className="form-field"><label>Kondisi Fasilitas</label><select name="kondisi" value={formIden.kondisi || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Cukup">Cukup</option><option value="Kurang">Kurang</option></select></div>
                  <div className="form-field"><label>Akses Warga</label><select name="akses" value={formIden.akses || 'Mudah'} onChange={handleIdenChange}><option value="Mudah">Mudah</option><option value="Sulit">Sulit</option></select></div>
                  <div className="form-field full"><label>Petugas Pengelola</label><input name="pengelola" value={formIden.pengelola || ''} onChange={handleIdenChange} placeholder="Contoh: Kader, PKK Desa, Karang Taruna" /></div>
                  <div className="form-field full"><label>Catatan / Kebutuhan Tambahan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Contoh: Butuh rak baru, perlu update buku cerita anak..."></textarea></div>
                </div>
              )}

              {/* LAMPIRAN 3: LITERASI DIGITAL ORTU */}
              {subTab0 === 2 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Orang Tua</label><input name="nama_ortu" value={formIden.nama_ortu || ''} onChange={handleIdenChange} placeholder="Ibu/Ayah yg hadir" /></div>
                  <div className="form-field"><label>Nama Anak</label><input name="nama_anak" value={formIden.nama_anak || ''} onChange={handleIdenChange} placeholder="Nama anak usia dini" /></div>
                  <div className="form-field"><label>Tingkat Literasi Digital</label><select name="tingkat_literasi" value={formIden.tingkat_literasi || 'Rendah'} onChange={handleIdenChange}><option value="Rendah">Rendah (Belum terbiasa aplikasi)</option><option value="Sedang">Sedang (Bisa WA & aplikasi dasar)</option><option value="Tinggi">Tinggi (Mahir pakai aplikasi edukasi)</option></select></div>
                  <div className="form-field"><label>Fasilitas HP / Gawai</label><select name="fasilitas_hp" value={formIden.fasilitas_hp || 'Ya'} onChange={handleIdenChange}><option value="Ya">Ya (Punya & memadai)</option><option value="Tidak">Tidak (Tidak punya/sering error)</option></select></div>
                  <div className="form-field"><label>Kebutuhan Aplikasi Edukasi</label><input name="kebutuhan_aplikasi" value={formIden.kebutuhan_aplikasi || ''} onChange={handleIdenChange} placeholder="Contoh: Video edukasi, aplikasi membaca" /></div>
                  <div className="form-field"><label>Materi Pelatihan Diterima</label><input name="materi_pelatihan" value={formIden.materi_pelatihan || ''} onChange={handleIdenChange} placeholder="Contoh: Cara mengunduh aplikasi" /></div>
                  <div className="form-field full"><label>Catatan Tambahan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Contoh: HP memori penuh, hambatan sinyal, dll..."></textarea></div>
                </div>
              )}

              {/* LAMPIRAN 4: INVENTARIS APE */}
              {subTab0 === 3 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Jenis Alat Peraga Edukasi (APE)</label><input name="jenis_ape" value={formIden.jenis_ape || ''} onChange={handleIdenChange} placeholder="Contoh: Balok susun, Puzzle kayu, Poster" /></div>
                  <div className="form-field"><label>Jumlah Tersedia</label><input name="jumlah" value={formIden.jumlah || ''} onChange={handleIdenChange} placeholder="Contoh: 5 set, 12 pcs" /></div>
                  <div className="form-field"><label>Kondisi Saat Ini</label><select name="kondisi" value={formIden.kondisi || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Rusak Ringan">Rusak Ringan</option><option value="Rusak Berat">Rusak Berat</option></select></div>
                  <div className="form-field"><label>Prioritas Kebutuhan</label><select name="prioritas" value={formIden.prioritas || 'Sedang'} onChange={handleIdenChange}><option value="Tinggi">Tinggi (Sangat mendesak)</option><option value="Sedang">Sedang</option><option value="Rendah">Rendah</option></select></div>
                  <div className="form-field full"><label>Kebutuhan Tambahan</label><input name="kebutuhan" value={formIden.kebutuhan || ''} onChange={handleIdenChange} placeholder="Contoh: Butuh 2 set puzzle baru" /></div>
                  <div className="form-field full"><label>Catatan Observasi</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Contoh: APE jarang digunakan, kader butuh pelatihan cara pakai..."></textarea></div>
                </div>
              )}

              {/* File Upload Dropzone Identifikasi */}
              {renderUploadBox(
                fotoIden,
                setFotoIden,
                fileInputIdenRef,
                'Unggah Dokumentasi Foto / Bukti Lapangan (Opsional)',
                'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
              )}

              {renderActionButtons('iden')}
            </div>

            {/* KANAN: ASPIRASI MASYARAKAT BIDANG PENDIDIKAN */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Comment01Icon size={20} color="var(--primary-teal, #008080)" />
                  Aspirasi Masyarakat — Pendidikan
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                Catat aspirasi, usulan, dan kebutuhan warga terkait pendidikan sesuai format standar desa.
              </p>

              <div className="form-grid">
                <div className="form-field">
                  <label>Tanggal Penyampaian</label>
                  <input type="date" name="tanggal_penyampaian" value={formPengaduan.tanggal_penyampaian || ''} onChange={handlePengaduanChange} />
                </div>
                <div className="form-field">
                  <label>Penerima Aspirasi</label>
                  <input name="penerima_aspirasi" value={formPengaduan.penerima_aspirasi || ''} onChange={handlePengaduanChange} placeholder="Contoh: Rina (Kader Pendidikan)" />
                </div>

                <div className="form-field">
                  <label>Nama Pengusul / Warga</label>
                  <input name="nama_pelapor" value={formPengaduan.nama_pelapor || ''} onChange={handlePengaduanChange} placeholder="Contoh: Siti Aminah" />
                </div>

                <div className="form-field">
                  <label>Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={formPengaduan.jenis_kelamin || 'P'} onChange={handlePengaduanChange}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>No. KTP (NIK Warga)</label>
                  <input name="nik" value={formPengaduan.nik || ''} onChange={handlePengaduanChange} placeholder="Wajib 16 digit angka" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <LockIcon size={12} /> Hanya terlihat oleh Kader/Admin
                  </div>
                </div>

                <div className="form-field">
                  <label>No. HP / WhatsApp (Opsional)</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={15}
                    name="no_hp"
                    value={formPengaduan.no_hp || ''}
                    onChange={handlePengaduanChange}
                    placeholder="081234567890"
                  /></div>

                <div className="form-field full">
                  <label>Alamat Lengkap Warga</label>
                  <input name="alamat" value={formPengaduan.alamat || ''} onChange={handlePengaduanChange} placeholder="Contoh: RT 02 / RW 05, Desa Mulawarman" />
                </div>

                <div className="form-field full">
                  <label>Jenis Aspirasi Pendidikan</label>
                  <select name="jenis_aspirasi" value={formPengaduan.jenis_aspirasi || '1. Sarana Pendidikan'} onChange={handlePengaduanChange} style={{ fontWeight: 'bold' }}>
                    <option value="1. Sarana Pendidikan">1. Sarana Pendidikan</option>
                    <option value="2. Penguatan Literasi">2. Penguatan Literasi</option>
                    <option value="3. Kegiatan PAUD">3. Kegiatan PAUD</option>
                    <option value="4. Kebutuhan APE (Alat Peraga Edukatif)">4. Kebutuhan APE (Alat Peraga Edukatif)</option>
                    <option value="5. Pelatihan/Workshop">5. Pelatihan/Workshop</option>
                    <option value="6. Lainnya">6. Lainnya</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label>Uraian Aspirasi / Masukan Warga</label>
                  <textarea name="isi_keluhan" value={formPengaduan.isi_keluhan || ''} onChange={handlePengaduanChange} rows="3" placeholder="Contoh: Perlu penambahan buku bacaan PAUD karena jumlah buku di perpustakaan desa sangat terbatas..."></textarea>
                </div>

                <div className="form-field full">
                  <label>Urgensi / Tingkat Prioritas</label>
                  <select name="urgensi" value={formPengaduan.urgensi || 'Sedang'} onChange={handlePengaduanChange}>
                    <option value="Tinggi">Tinggi (Harus segera ditangani)</option>
                    <option value="Sedang">Sedang (Penting tapi tidak mendesak)</option>
                    <option value="Rendah">Rendah (Bisa jangka menengah)</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label>Rekomendasi Kader</label>
                  <textarea name="rekomendasi" value={formPengaduan.rekomendasi || ''} onChange={handlePengaduanChange} rows="2" placeholder="Contoh: Diusulkan masuk dalam rencana pengadaan sarana perpustakaan tahun depan..."></textarea>
                </div>

                {/* File Upload Dropzone Pengaduan */}
                {renderUploadBox(
                  lampiranPengaduan,
                  setLampiranPengaduan,
                  fileInputPengaduanRef,
                  'Unggah Lampiran Pendukung (Opsional)',
                  'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
                )}
              </div>

              {renderActionButtons('aduan')}
            </div>
          </div>
        )}

        {/* ===== 1. PEKERJAAN UMUM ===== */}
        {tab === 1 && (
          <div className={`grid ${viewFilter === 'all' ? 'grid-2' : ''} spm-work-grid spm-mode-${viewFilter}`} style={{ gap: '24px', alignItems: 'start' }}>
            {/* KIRI: FORMULIR IDENTIFIKASI PEKERJAAN UMUM */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DropletIcon size={20} color="var(--orange-deep, #B5650C)" />
                  Formulir Identifikasi — Pekerjaan Umum
                </h3>
              </div>

              {/* Sub-Tabs Pills */}
              <div className="spm-sub-pills">
                <button type="button" className={`spm-sub-pill ${subTab1 === 0 ? 'active' : ''}`} onClick={() => { setSubTab1(0); resetFormIden(); }}>
                  Edukasi Air &amp; Limbah
                </button>
                <button type="button" className={`spm-sub-pill ${subTab1 === 1 ? 'active' : ''}`} onClick={() => { setSubTab1(1); resetFormIden(); }}>
                  Embung Air Baku
                </button>
                <button type="button" className={`spm-sub-pill ${subTab1 === 2 ? 'active' : ''}`} onClick={() => { setSubTab1(2); resetFormIden(); }}>
                  Jaringan Air Perdesaan
                </button>
                <button type="button" className={`spm-sub-pill ${subTab1 === 3 ? 'active' : ''}`} onClick={() => { setSubTab1(3); resetFormIden(); }}>
                  Sumur Air Tanah
                </button>
                <button type="button" className={`spm-sub-pill ${subTab1 === 4 ? 'active' : ''}`} onClick={() => { setSubTab1(4); resetFormIden(); }}>
                  Pembangunan Jalan Desa
                </button>
              </div>

              {subTab1 === 0 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader / Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi formulir" /></div>
                  <div className="form-field"><label>Tanggal Peninjauan</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi / RT</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="Contoh: RT 04 Dusun Harapan" /></div>
                  <div className="form-field full"><label>Temuan Lapangan – Air Bersih</label><input name="temuan_air" value={formIden.temuan_air || ''} onChange={handleIdenChange} placeholder="Contoh: Air keruh, sumber sumur/PDAM, keluhan warga" /></div>
                  <div className="form-field full"><label>Temuan Lapangan – Limbah Domestik</label><input name="temuan_limbah" value={formIden.temuan_limbah || ''} onChange={handleIdenChange} placeholder="Contoh: Ada/tidak SPAL, limbah dialirkan ke selokan terbuka" /></div>
                  <div className="form-field full"><label>Kebutuhan / Permasalahan</label><textarea rows="2" name="kebutuhan" value={formIden.kebutuhan || ''} onChange={handleIdenChange} placeholder="Contoh: Tidak ada SPAL, air meluap saat hujan"></textarea></div>
                  <div className="form-field full"><label>Rekomendasi / Langkah Lanjut</label><textarea rows="2" name="rekomendasi" value={formIden.rekomendasi || ''} onChange={handleIdenChange} placeholder="Saran kepada desa atau dinas terkait"></textarea></div>
                </div>
              )}

              {subTab1 === 1 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader / Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi formulir" /></div>
                  <div className="form-field"><label>Tanggal Peninjauan</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi Embung</label><input name="lokasi_embung" value={formIden.lokasi_embung || ''} onChange={handleIdenChange} placeholder="Nama embung atau titik lokasi" /></div>
                  <div className="form-field full"><label>Kondisi Fisik Embung</label><input name="kondisi_fisik" value={formIden.kondisi_fisik || ''} onChange={handleIdenChange} placeholder="Contoh: Terawat, retak, pendangkalan, ada sampah" /></div>
                  <div className="form-field full"><label>Permasalahan Utama</label><textarea rows="2" name="permasalahan" value={formIden.permasalahan || ''} onChange={handleIdenChange} placeholder="Contoh: Banyak sedimen, dinding retak, debit air kecil"></textarea></div>
                  <div className="form-field full"><label>Tindakan yang Dibutuhkan</label><textarea rows="2" name="tindakan" value={formIden.tindakan || ''} onChange={handleIdenChange} placeholder="Contoh: Pembersihan sedimen, perbaikan dinding, pasang pagar"></textarea></div>
                </div>
              )}

              {subTab1 === 2 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader / Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi formulir" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi / Jalur Pipa</label><input name="lokasi_pipa" value={formIden.lokasi_pipa || ''} onChange={handleIdenChange} placeholder="RT/Dusun atau jalur jaringan yang diperiksa" /></div>
                  <div className="form-field full"><label>Kerusakan / Permasalahan</label><input name="kerusakan" value={formIden.kerusakan || ''} onChange={handleIdenChange} placeholder="Contoh: Pipa bocor, pipa pecah, tekanan rendah" /></div>
                  <div className="form-field full"><label>Penyebab Kerusakan</label><input name="penyebab" value={formIden.penyebab || ''} onChange={handleIdenChange} placeholder="Contoh: Usia pipa, akar pohon, longsoran tanah" /></div>
                  <div className="form-field full"><label>Rekomendasi</label><textarea rows="2" name="rekomendasi" value={formIden.rekomendasi || ''} onChange={handleIdenChange} placeholder="Contoh: Perbaikan pipa, penggantian, laporan ke BUMDes/PU"></textarea></div>
                </div>
              )}

              {subTab1 === 3 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader / Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi formulir" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Pemilik / Bangunan</label><input name="pemilik" value={formIden.pemilik || ''} onChange={handleIdenChange} placeholder="Nama keluarga atau lokasi sumur umum" /></div>
                  <div className="form-field full"><label>Kondisi Sumur</label><input name="kondisi_sumur" value={formIden.kondisi_sumur || ''} onChange={handleIdenChange} placeholder="Contoh: Kering, keruh, retak, dinding roboh" /></div>
                  <div className="form-field full"><label>Risiko Sanitasi</label><input name="risiko_sanitasi" value={formIden.risiko_sanitasi || ''} onChange={handleIdenChange} placeholder="Contoh: Dekat kandang ternak, dekat septik tank (<10m)" /></div>
                  <div className="form-field full"><label>Tindakan Rehabilitasi</label><textarea rows="2" name="tindakan" value={formIden.tindakan || ''} onChange={handleIdenChange} placeholder="Contoh: Kuras sumur, peninggian bibir sumur, pasang cincin penahan"></textarea></div>
                </div>
              )}

              {subTab1 === 4 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader / Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi formulir" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi Ruas Jalan</label><input name="lokasi_jalan" value={formIden.lokasi_jalan || ''} onChange={handleIdenChange} placeholder="Contoh: Jalan Poros RT 04 menuju Posyandu" /></div>
                  <div className="form-field full"><label>Kondisi Jalan</label><input name="kondisi_jalan" value={formIden.kondisi_jalan || ''} onChange={handleIdenChange} placeholder="Contoh: Rusak berat, berlubang, tergenang lumpur" /></div>
                  <div className="form-field full"><label>Dampak ke Masyarakat</label><input name="dampak" value={formIden.dampak || ''} onChange={handleIdenChange} placeholder="Contoh: Sulit dilalui ambulans/anak sekolah, rawan kecelakaan" /></div>
                  <div className="form-field full"><label>Usulan Tindakan</label><textarea rows="2" name="usulan_tindakan" value={formIden.usulan_tindakan || ''} onChange={handleIdenChange} placeholder="Contoh: Pengaspalan, perbaikan drainase samping, pengurukan jalan"></textarea></div>
                </div>
              )}

              {renderUploadBox(
                fotoIden,
                setFotoIden,
                fileInputIdenRef,
                'Unggah Dokumentasi Foto / Bukti Lapangan (Opsional)',
                'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
              )}

              {renderActionButtons('iden')}
            </div>

            {/* KANAN: PENGADUAN MASYARAKAT PEKERJAAN UMUM */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Megaphone01Icon size={20} color="var(--orange-deep, #B5650C)" />
                  Pengaduan Masyarakat — Pekerjaan Umum
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                Gunakan formulir ini untuk menampung keluhan masyarakat terkait infrastruktur desa, air bersih, dan sanitasi.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor *</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama warga pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field">
                  <label>No. KTP (NIK Warga)</label>
                  <input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit angka" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <LockIcon size={12} /> Hanya terlihat oleh Kader/Admin
                  </div>
                </div>
                <div className="form-field"><label>No. HP (Opsional)</label><input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                  name="no_hp"
                  value={formPengaduan.no_hp || ''}
                  onChange={handlePengaduanChange}
                  placeholder="081234567890"
                /></div>
                <div className="form-field full"><label>Alamat Warga Pelapor</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat lengkap pelapor" /></div>

                <div className="form-field full">
                  <label>Jenis Pengaduan (Pekerjaan Umum)</label>
                  <select name="jenis_pengaduan" value={formPengaduan.jenis_pengaduan || 'Pemenuhan Kebutuhan Pokok Air Bersih'} onChange={handlePengaduanChange} style={{ fontWeight: 'bold' }}>
                    <option value="Pemenuhan Kebutuhan Pokok Air Bersih">Pemenuhan Kebutuhan Pokok Air Bersih</option>
                    <option value="Pengelolaan Limbah Domestik/Rumah Tangga">Pengelolaan Limbah Domestik/Rumah Tangga</option>
                    <option value="Penyediaan WC">Penyediaan WC</option>
                    <option value="Pengelolaan Sampah">Pengelolaan Sampah</option>
                    <option value="Identifikasi/Pemeliharaan Embung Air Baku">Identifikasi/Pemeliharaan Embung Air Baku</option>
                    <option value="Pemeliharaan Jaringan Air Pedesaan">Pemeliharaan Jaringan Air Pedesaan</option>
                    <option value="Identifikasi/Rehabilitasi Sumur Air Tanah Untuk Air Baku">Identifikasi/Rehabilitasi Sumur Air Tanah Untuk Air Baku</option>
                    <option value="Identifikasi Kebutuhan Pembangunan Jalan Desa">Identifikasi Kebutuhan Pembangunan Jalan Desa</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="form-field full"><label>Deskripsi Pengaduan / Keluhan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan keluhan/masalah secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Masalah / Titik Kerusakan</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="Contoh: Jalan Utama RT 05 dekat jembatan" /></div>

                {renderUploadBox(
                  lampiranPengaduan,
                  setLampiranPengaduan,
                  fileInputPengaduanRef,
                  'Unggah Foto Kerusakan / Surat Permohonan RT (Opsional)',
                  'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
                )}
              </div>

              {renderActionButtons('aduan')}
            </div>
          </div>
        )}

        {/* ===== 2. PERUMAHAN RAKYAT ===== */}
        {tab === 2 && (
          <div className={`grid ${viewFilter === 'all' ? 'grid-2' : ''} spm-work-grid spm-mode-${viewFilter}`} style={{ gap: '24px', alignItems: 'start' }}>
            {/* KIRI: FORMULIR IDENTIFIKASI PERUMAHAN */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Home01Icon size={20} color="var(--magenta-deep, #93348A)" />
                  Formulir Identifikasi — Perumahan Rakyat
                </h3>
              </div>

              {/* Sub-Tabs Pills */}
              <div className="spm-sub-pills">
                <button type="button" className={`spm-sub-pill ${subTab2 === 0 ? 'active' : ''}`} onClick={() => { setSubTab2(0); resetFormIden(); }}>
                  Rumah Layak Huni (RTLH)
                </button>
                <button type="button" className={`spm-sub-pill ${subTab2 === 1 ? 'active' : ''}`} onClick={() => { setSubTab2(1); resetFormIden(); }}>
                  KIE Lingkungan Bersih
                </button>
                <button type="button" className={`spm-sub-pill ${subTab2 === 2 ? 'active' : ''}`} onClick={() => { setSubTab2(2); resetFormIden(); }}>
                  Pemanfaatan Pekarangan
                </button>
                <button type="button" className={`spm-sub-pill ${subTab2 === 3 ? 'active' : ''}`} onClick={() => { setSubTab2(3); resetFormIden(); }}>
                  Biopori Rumah Tangga
                </button>
              </div>

              {subTab2 === 0 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kepala Keluarga</label><input name="nama_kk" value={formIden.nama_kk || ''} onChange={handleIdenChange} placeholder="Tulis nama KK sesuai KTP" /></div>
                  <div className="form-field full"><label>Alamat Rumah</label><input name="alamat" value={formIden.alamat || ''} onChange={handleIdenChange} placeholder="Tulis dusun/RT/RW" /></div>

                  <div className="form-field"><label>Struktur Atap</label><select name="struktur_atap" value={formIden.struktur_atap || 'Genteng'} onChange={handleIdenChange}><option value="Genteng">Genteng</option><option value="Seng">Seng</option><option value="Atap Bocor">Atap Bocor</option></select></div>
                  <div className="form-field"><label>Struktur Dinding</label><select name="struktur_dinding" value={formIden.struktur_dinding || 'Tembok'} onChange={handleIdenChange}><option value="Papan">Papan</option><option value="Semi Permanen">Semi Permanen</option><option value="Tembok">Tembok</option></select></div>
                  <div className="form-field"><label>Struktur Lantai</label><select name="struktur_lantai" value={formIden.struktur_lantai || 'Keramik'} onChange={handleIdenChange}><option value="Plester/Semen">Plester/Semen</option><option value="Tanah">Tanah</option><option value="Keramik">Keramik</option></select></div>
                  <div className="form-field"><label>Ventilasi Udara</label><select name="ventilasi" value={formIden.ventilasi || 'Cukup'} onChange={handleIdenChange}><option value="Cukup">Cukup</option><option value="Kurang">Kurang</option></select></div>
                  <div className="form-field"><label>Pencahayaan</label><select name="pencahayaan" value={formIden.pencahayaan || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Kurang">Kurang</option></select></div>
                  <div className="form-field"><label>Jamban Sehat</label><select name="jamban_sehat" value={formIden.jamban_sehat || 'Ada'} onChange={handleIdenChange}><option value="Ada">Ada</option><option value="Tidak Ada">Tidak Ada</option></select></div>

                  <div className="form-field full"><label>Kategori Rumah</label><select name="kategori_rumah" value={formIden.kategori_rumah || 'Layak Huni'} onChange={handleIdenChange} style={{ fontWeight: 'bold' }}><option value="Layak Huni">Layak Huni</option><option value="RTLH">RTLH (Rumah Tidak Layak Huni)</option></select></div>
                  <div className="form-field full"><label>Catatan Khusus / Kerusakan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Masukkan kerusakan khusus atau kebutuhan renovasi..."></textarea></div>
                </div>
              )}

              {subTab2 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Warga</label><input name="nama_warga" value={formIden.nama_warga || ''} onChange={handleIdenChange} placeholder="Isi sesuai daftar hadir" /></div>
                  <div className="form-field"><label>Akses Air Bersih</label><select name="akses_air" value={formIden.akses_air || 'Sumur Bor'} onChange={handleIdenChange}><option value="Sumur Bor">Sumur Bor</option><option value="Jaringan Desa">Jaringan Desa</option><option value="Sungai">Sungai</option></select></div>
                  <div className="form-field"><label>Pengelolaan Sampah</label><select name="pengelolaan_sampah" value={formIden.pengelolaan_sampah || 'Dipilah'} onChange={handleIdenChange}><option value="Dipilah">Dipilah</option><option value="Dibakar">Dibakar</option><option value="Ditimbun">Ditimbun</option></select></div>
                  <div className="form-field full"><label>Kebiasaan Kebersihan</label><input name="kebiasaan_kebersihan" value={formIden.kebiasaan_kebersihan || ''} onChange={handleIdenChange} placeholder="Contoh: Cuci tangan pakai sabun, ada tempat sampah tertutup" /></div>
                  <div className="form-field full"><label>Catatan Evaluasi Lingkungan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Masukkan kendala (misal saluran mampet, genangan air)..."></textarea></div>
                </div>
              )}

              {subTab2 === 2 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Warga</label><input name="nama_warga" value={formIden.nama_warga || ''} onChange={handleIdenChange} placeholder="Isi nama lengkap" /></div>
                  <div className="form-field full"><label>Jenis Tanaman Pangan</label><input name="jenis_tanaman" value={formIden.jenis_tanaman || ''} onChange={handleIdenChange} placeholder="Contoh: Kangkung, cabai, sereh, terong, toga" /></div>
                  <div className="form-field"><label>Teknik Budidaya</label><select name="teknik" value={formIden.teknik || 'Tanah Langsung'} onChange={handleIdenChange}><option value="Polybag">Polybag</option><option value="Hidroponik">Hidroponik</option><option value="Tanah Langsung">Tanah Langsung</option></select></div>
                  <div className="form-field"><label>Kondisi Pekarangan</label><select name="kondisi_pekarangan" value={formIden.kondisi_pekarangan || 'Luas'} onChange={handleIdenChange}><option value="Sempit">Sempit</option><option value="Luas">Luas</option></select></div>
                  <div className="form-field full"><label>Catatan / Kebutuhan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Contoh: Kebutuhan bibit, pupuk kompos, atau pelatihan hidroponik..."></textarea></div>
                </div>
              )}

              {subTab2 === 3 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Warga</label><input name="nama_warga" value={formIden.nama_warga || ''} onChange={handleIdenChange} placeholder="Nama warga pembuat biopori" /></div>
                  <div className="form-field"><label>Jumlah Lubang Biopori</label><input type="number" name="jumlah_biopori" value={formIden.jumlah_biopori || ''} onChange={handleIdenChange} placeholder="Contoh: 3 lubang" /></div>
                  <div className="form-field"><label>Lokasi Pemasangan</label><select name="lokasi" value={formIden.lokasi || 'Pekarangan Depan'} onChange={handleIdenChange}><option value="Pekarangan Depan">Pekarangan Depan</option><option value="Pekarangan Belakang">Pekarangan Belakang</option></select></div>
                  <div className="form-field full"><label>Manfaat Utama</label><input name="manfaat" value={formIden.manfaat || ''} onChange={handleIdenChange} placeholder="Contoh: Penyerapan air hujan, pembuatan kompos organik" /></div>
                  <div className="form-field full"><label>Catatan / Kendala</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Contoh: Kendala alat bor biopori, tanah keras..."></textarea></div>
                </div>
              )}

              {renderUploadBox(
                fotoIden,
                setFotoIden,
                fileInputIdenRef,
                'Unggah Dokumentasi Foto / Bukti Lapangan (Opsional)',
                'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
              )}

              {renderActionButtons('iden')}
            </div>

            {/* KANAN: PENGADUAN MASYARAKAT PERUMAHAN RAKYAT */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Megaphone01Icon size={20} color="var(--magenta-deep, #93348A)" />
                  Pengaduan Masyarakat — Perumahan Rakyat
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                Gunakan formulir ini untuk menampung usulan bantuan rumah layak huni, sanitasi, dan pekarangan.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor *</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama warga pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field">
                  <label>No. KTP (NIK Warga)</label>
                  <input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit angka" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <LockIcon size={12} /> Hanya terlihat oleh Kader/Admin
                  </div>
                </div>
                  <div className="form-field"><label>No. HP (Opsional)</label><input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={15}
                    name="no_hp"
                    value={formPengaduan.no_hp || ''}
                    onChange={handlePengaduanChange}
                    placeholder="081234567890"
                  /></div>
                <div className="form-field full"><label>Alamat Lengkap Warga</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat lengkap pelapor" /></div>

                <div className="form-field full">
                  <label>Jenis Pengaduan (Perumahan Rakyat)</label>
                  <select name="jenis_pengaduan" value={formPengaduan.jenis_pengaduan || 'Penyediaan dan Rehabilitasi Rumah yang Layak Huni'} onChange={handlePengaduanChange} style={{ fontWeight: 'bold' }}>
                    <option value="Penyediaan dan Rehabilitasi Rumah yang Layak Huni">Penyediaan dan Rehabilitasi Rumah yang Layak Huni</option>
                    <option value="Komunikasi, Informasi, dan Edukasi Perilaku Hidup Bersih dan Sehat">Komunikasi, Informasi, dan Edukasi Perilaku Hidup Bersih dan Sehat</option>
                    <option value="Pengelolaan Pekarangan Rumah Untuk Budidaya Tanaman Pangan Lokal">Pengelolaan Pekarangan Rumah Untuk Budidaya Tanaman Pangan Lokal</option>
                    <option value="Pembuatan Biopori">Pembuatan Biopori</option>
                    <option value="Pembuatan Hidroponik di Pekarangan Rumah">Pembuatan Hidroponik di Pekarangan Rumah</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="form-field full"><label>Deskripsi Pengaduan / Usulan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan keluhan/kebutuhan bantuan perumahan secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Rumah / Usulan</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="Contoh: RT 03 Dusun Mekar Sari" /></div>

                {renderUploadBox(
                  lampiranPengaduan,
                  setLampiranPengaduan,
                  fileInputPengaduanRef,
                  'Unggah Persyaratan / Foto Rumah (Opsional)',
                  'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)',
                  (
                    <div>
                      <b>Dokumen Pelengkap Disarankan:</b>
                      <ul style={{ margin: '4px 0 0', paddingLeft: '16px' }}>
                        <li>Foto copy KTP &amp; KK</li>
                        <li>Surat Keterangan Penghasilan / Tidak Mampu dari Desa</li>
                        <li>Foto Kondisi Fisik Rumah (Tampak Depan, Samping, Dalam)</li>
                      </ul>
                    </div>
                  )
                )}
              </div>

              {renderActionButtons('aduan')}
            </div>
          </div>
        )}

        {/* ===== 3. TRANTIBUMLINMAS ===== */}
        {tab === 3 && (
          <div className={`grid ${viewFilter === 'all' ? 'grid-2' : ''} spm-work-grid spm-mode-${viewFilter}`} style={{ gap: '24px', alignItems: 'start' }}>
            {/* KIRI: FORMULIR IDENTIFIKASI TRANTIBUM */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield01Icon size={20} color="var(--violet-deep, #5B21B6)" />
                  Formulir Identifikasi &amp; Laporan — Trantibumlinmas
                </h3>
              </div>

              {/* Sub-Tabs Pills */}
              <div className="spm-sub-pills">
                <button type="button" className={`spm-sub-pill ${subTab3 === 0 ? 'active' : ''}`} onClick={() => { setSubTab3(0); resetFormIden(); }}>
                  Identifikasi Trauma
                </button>
                <button type="button" className={`spm-sub-pill ${subTab3 === 1 ? 'active' : ''}`} onClick={() => { setSubTab3(1); resetFormIden(); }}>
                  Penyuluhan Trauma
                </button>
                <button type="button" className={`spm-sub-pill ${subTab3 === 2 ? 'active' : ''}`} onClick={() => { setSubTab3(2); resetFormIden(); }}>
                  KIE &amp; Simulasi Bencana
                </button>
                <button type="button" className={`spm-sub-pill ${subTab3 === 3 ? 'active' : ''}`} onClick={() => { setSubTab3(3); resetFormIden(); }}>
                  Insiden Kamtibmas
                </button>
                <button type="button" className={`spm-sub-pill ${subTab3 === 4 ? 'active' : ''}`} onClick={() => { setSubTab3(4); resetFormIden(); }}>
                  Sosialisasi Kamtibmas
                </button>
                <button type="button" className={`spm-sub-pill ${subTab3 === 5 ? 'active' : ''}`} onClick={() => { setSubTab3(5); resetFormIden(); }}>
                  Patroli Keamanan
                </button>
              </div>

              {subTab3 === 0 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Korban</label><input name="nama_korban" value={formIden.nama_korban || ''} onChange={handleIdenChange} placeholder="Tulis nama lengkap korban" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', gridColumn: '1 / -1' }}>
                    <div className="form-field"><label>Usia (Tahun)</label><input type="number" name="usia" value={formIden.usia || ''} onChange={handleIdenChange} placeholder="Contoh: 8" /></div>
                    <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formIden.jenis_kelamin || 'L'} onChange={handleIdenChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                  </div>
                  <div className="form-field full"><label>Alamat / Lokasi Pengungsian</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="Contoh: Posko Balai Desa RT 03" /></div>
                  <div className="form-field full"><label>Jenis Paparan Bencana</label><input name="jenis_bencana" value={formIden.jenis_bencana || ''} onChange={handleIdenChange} placeholder="Contoh: Banjir luapan sungai, kebakaran pemukiman" /></div>
                  <div className="form-field full"><label>Gejala Trauma yang Tampak</label><input name="gejala_trauma" value={formIden.gejala_trauma || ''} onChange={handleIdenChange} placeholder="Contoh: Menangis histeris, sulit tidur, linglung, takut suara keras" /></div>
                  <div className="form-field full"><label>Kebutuhan Dukungan Psikososial</label><input name="kebutuhan" value={formIden.kebutuhan || ''} onChange={handleIdenChange} placeholder="Contoh: Pendampingan ibu-anak, konseling profesional" /></div>
                  <div className="form-field"><label>Kondisi Keluarga</label><input name="kondisi_keluarga" value={formIden.kondisi_keluarga || ''} onChange={handleIdenChange} placeholder="Contoh: Didampingi ibu &amp; nenek" /></div>
                  <div className="form-field"><label>Rencana Tindak Lanjut</label><input name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="Contoh: Observasi 1 minggu, rujukan psikolog" /></div>
                  <div className="form-field full"><label>Petugas Asesmen</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Nama kader / petugas Linmas" /></div>
                </div>
              )}

              {subTab3 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kegiatan Penyuluhan</label><input name="nama_kegiatan" value={formIden.nama_kegiatan || ''} onChange={handleIdenChange} placeholder="Contoh: Penyuluhan Pemulihan Trauma Pasca Bencana" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu Pelaksanaan</label><input type="time" name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Lokasi Kegiatan</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="Contoh: Balai Desa Mekar Sari" /></div>
                  <div className="form-field"><label>Sasaran Peserta</label><input name="sasaran" value={formIden.sasaran || ''} onChange={handleIdenChange} placeholder="Contoh: Ibu &amp; Anak Korban Bencana" /></div>
                  <div className="form-field full"><label>Materi Penyuluhan</label><textarea rows="2" name="materi" value={formIden.materi || ''} onChange={handleIdenChange} placeholder="Contoh: Mengenali gejala trauma pada anak, teknik relaksasi mandiri"></textarea></div>
                  <div className="form-field"><label>Petugas / Fasilitator</label><input name="fasilitator" value={formIden.fasilitator || ''} onChange={handleIdenChange} placeholder="Contoh: Siti (Kader), Tim Psikososial PMI" /></div>
                  <div className="form-field"><label>Catatan Logistik</label><input name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Contoh: Siapkan alat menggambar &amp; konsumsi" /></div>
                </div>
              )}

              {subTab3 === 2 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kegiatan Kesiapsiagaan</label><input name="nama_kegiatan" value={formIden.nama_kegiatan || ''} onChange={handleIdenChange} placeholder="Contoh: Simulasi Evakuasi Bencana Banjir" /></div>
                  <div className="form-field"><label>Jenis Kegiatan</label><select name="jenis_kegiatan" value={formIden.jenis_kegiatan || 'Simulasi'} onChange={handleIdenChange}><option value="KIE">KIE (Edukasi)</option><option value="Simulasi">Simulasi Lapangan</option><option value="Keduanya">Keduanya</option><option value="Lainnya">Lainnya</option></select></div>
                  <div className="form-field"><label>Tanggal Pelaksanaan</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Jumlah Peserta</label><input type="number" name="jumlah_peserta" value={formIden.jumlah_peserta || ''} onChange={handleIdenChange} placeholder="Contoh: 48" /></div>
                  <div className="form-field"><label>Unsur Peserta</label><input name="unsur_peserta" value={formIden.unsur_peserta || ''} onChange={handleIdenChange} placeholder="Masyarakat, Pelajar, Lansia, Relawan" /></div>
                  <div className="form-field full"><label>Materi / Metode</label><input name="materi" value={formIden.materi || ''} onChange={handleIdenChange} placeholder="Contoh: Pengenalan sirene bahaya, jalur evakuasi aman" /></div>
                  <div className="form-field full"><label>Capaian &amp; Respon Peserta</label><textarea rows="2" name="capaian" value={formIden.capaian || ''} onChange={handleIdenChange} placeholder="Contoh: Antusias, 90% warga memahami titik kumpul evakuasi..."></textarea></div>
                  <div className="form-field full"><label>Hambatan &amp; Tindak Lanjut</label><textarea rows="2" name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="Contoh: Evakuasi lansia butuh tandu khusus &amp; relawan pendamping..."></textarea></div>
                </div>
              )}

              {subTab3 === 3 && (
                <div className="form-grid">
                  <div className="form-field"><label>Tanggal Kejadian</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu Kejadian</label><input type="time" name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi Kejadian (RT/RW/Area)</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="Contoh: RT 02 / RW 01 Jalan Melati" /></div>
                  <div className="form-field full"><label>Jenis Insiden</label><input name="jenis_insiden" value={formIden.jenis_insiden || ''} onChange={handleIdenChange} placeholder="Contoh: Keributan warga, Pencurian, Pohon Tumbang" /></div>
                  <div className="form-field full"><label>Kronologi Singkat Kejadian</label><textarea rows="2" name="kronologi" value={formIden.kronologi || ''} onChange={handleIdenChange} placeholder="Ceritakan urutan kejadian secara objektif..."></textarea></div>
                  <div className="form-field full"><label>Dampak / Kerugian</label><input name="dampak" value={formIden.dampak || ''} onChange={handleIdenChange} placeholder="Contoh: Tidak ada korban luka, kerugian materil..." /></div>
                  <div className="form-field full"><label>Tindak Lanjut yang Dilakukan</label><textarea rows="2" name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="Contoh: Mediasi oleh RT &amp; Kadus, koordinasi Bhabinkamtibmas..."></textarea></div>
                  <div className="form-field full"><label>Petugas / Pelapor</label><input name="petugas" value={formIden.petugas || ''} onChange={handleIdenChange} placeholder="Nama Linmas / Satpol PP / Warga" /></div>
                </div>
              )}

              {subTab3 === 4 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Tema Sosialisasi</label><input name="tema" value={formIden.tema || ''} onChange={handleIdenChange} placeholder="Contoh: Pencegahan Pencurian Kendaraan &amp; Ronda Malam" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu Pelaksanaan</label><input type="time" name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi / Sasaran Warga</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="Contoh: Balai Pertemuan RT 03, Sasaran: Kepala Keluarga" /></div>
                  <div className="form-field"><label>Metode Kegiatan</label><input name="metode" value={formIden.metode || ''} onChange={handleIdenChange} placeholder="Ceramah &amp; Diskusi Terbuka" /></div>
                  <div className="form-field"><label>Jumlah Peserta</label><input type="number" name="jumlah_peserta" value={formIden.jumlah_peserta || ''} onChange={handleIdenChange} placeholder="Contoh: 36" /></div>
                  <div className="form-field full"><label>Isu Keamanan yang Teridentifikasi</label><textarea rows="2" name="isu_keamanan" value={formIden.isu_keamanan || ''} onChange={handleIdenChange} placeholder="Contoh: Area gelap di jalan tembus rawan tindak kejahatan..."></textarea></div>
                  <div className="form-field full"><label>Tindak Lanjut Direkomendasikan</label><input name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="Contoh: Pasang 2 titik lampu jalan &amp; jadwalkan ronda" /></div>
                </div>
              )}

              {subTab3 === 5 && (
                <div className="form-grid">
                  <div className="form-field"><label>Tanggal Patroli</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu Patroli</label><input type="time" name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Area / Wilayah Patroli</label><input name="wilayah" value={formIden.wilayah || ''} onChange={handleIdenChange} placeholder="Contoh: Lingkungan RT 01 s/d RT 05 dan fasilitas umum" /></div>
                  <div className="form-field"><label>Metode Patroli</label><select name="metode" value={formIden.metode || 'Jalan Kaki'} onChange={handleIdenChange}><option value="Jalan Kaki">Jalan Kaki</option><option value="Sepeda Motor">Sepeda Motor</option><option value="Mobil">Mobil</option><option value="Gabungan">Gabungan</option></select></div>
                  <div className="form-field"><label>Petugas Bertugas</label><input name="petugas" value={formIden.petugas || ''} onChange={handleIdenChange} placeholder="Contoh: Rudi, Slamet (Anggota Linmas)" /></div>
                  <div className="form-field full"><label>Tujuan Patroli / Sasaran</label><input name="tujuan" value={formIden.tujuan || ''} onChange={handleIdenChange} placeholder="Contoh: Monitoring titik rawan &amp; pos kamling" /></div>
                  <div className="form-field full"><label>Temuan Selama Patroli</label><textarea rows="2" name="temuan" value={formIden.temuan || ''} onChange={handleIdenChange} placeholder="Contoh: Situasi kondusif, terdapat 1 titik lampu jalan padam..."></textarea></div>
                  <div className="form-field full"><label>Tindakan &amp; Rekomendasi Lanjut</label><textarea rows="2" name="tindakan" value={formIden.tindakan || ''} onChange={handleIdenChange} placeholder="Contoh: Koordinasi perbaikan lampu jalan ke kantor desa..."></textarea></div>
                </div>
              )}

              {renderUploadBox(
                fotoIden,
                setFotoIden,
                fileInputIdenRef,
                'Unggah Dokumentasi Foto / Bukti Lapangan (Opsional)',
                'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
              )}

              {renderActionButtons('iden')}
            </div>

            {/* KANAN: PENGADUAN MASYARAKAT TRANTIBUMLINMAS */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Comment01Icon size={20} color="var(--violet-deep, #5B21B6)" />
                  Pengaduan — Trantibumlinmas
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                Gunakan form ini untuk mencatat laporan warga terkait gangguan ketertiban umum dan perlindungan masyarakat.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor *</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama warga pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field">
                  <label>No. KTP (NIK Warga)</label>
                  <input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit angka" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <LockIcon size={12} /> Hanya terlihat oleh Kader/Admin
                  </div>
                </div>
                <div className="form-field"><label>No. HP (Opsional)</label><input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                  name="no_hp"
                  value={formPengaduan.no_hp || ''}
                  onChange={handlePengaduanChange}
                  placeholder="081234567890"
                /></div>
                <div className="form-field full"><label>Alamat Warga Pelapor</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat lengkap pelapor" /></div>

                <div className="form-field full">
                  <label>Jenis Pengaduan (Trantibumlinmas)</label>
                  <select name="jenis_pengaduan" value={formPengaduan.jenis_pengaduan || '1) Penyuluhan dan Rehabilitasi Trauma Pasca Bencana'} onChange={handlePengaduanChange} style={{ fontWeight: 'bold' }}>
                    <option value="1) Penyuluhan dan Rehabilitasi Trauma Pasca Bencana">1) Penyuluhan dan Rehabilitasi Trauma Pasca Bencana</option>
                    <option value="2) Komunikasi, Informasi, dan Edukasi Terhadap Kesiapsiagaan Bencana">2) Komunikasi, Informasi, dan Edukasi Terhadap Kesiapsiagaan Bencana</option>
                    <option value="3) Deteksi Dini dan Cegah Dini Gangguan Trantibumlinmas">3) Deteksi Dini dan Cegah Dini Gangguan Trantibumlinmas</option>
                    <option value="4) Pembinaan dan Penyuluhan Pelaksanaan Patroli Pengamanan">4) Pembinaan dan Penyuluhan Pelaksanaan Patroli Pengamanan</option>
                    <option value="5) Pemberdayaan Perlindungan Masyarakat">5) Pemberdayaan Perlindungan Masyarakat</option>
                    <option value="6) Perbaikan Poskamling">6) Perbaikan Poskamling</option>
                    <option value="7) Penyediaan APAR">7) Penyediaan APAR</option>
                    <option value="8) Penyediaan Alat Deteksi Bencana">8) Penyediaan Alat Deteksi Bencana</option>
                    <option value="9) Lainnya">9) Lainnya</option>
                  </select>
                </div>

                <div className="form-field full"><label>Deskripsi Pengaduan / Gangguan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan laporan kejadian / kebutuhan keamanan secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Masalah / Titik Rawan</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="Contoh: Perempatan Jalan Melati RT 03" /></div>

                {renderUploadBox(
                  lampiranPengaduan,
                  setLampiranPengaduan,
                  fileInputPengaduanRef,
                  'Unggah Bukti Lampiran / Foto Kejadian (Opsional)',
                  'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)',
                  (
                    <div>
                      <b>Dokumen Disarankan:</b> Foto KTP/KK pelapor atau foto kondisi fisik lokasi rawan / insiden.
                    </div>
                  )
                )}
              </div>

              {renderActionButtons('aduan')}
            </div>
          </div>
        )}

        {/* ===== 4. SOSIAL ===== */}
        {tab === 4 && (
          <div className={`grid ${viewFilter === 'all' ? 'grid-2' : ''} spm-work-grid spm-mode-${viewFilter}`} style={{ gap: '24px', alignItems: 'start' }}>
            {/* KIRI: FORMULIR IDENTIFIKASI SOSIAL */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FavouriteIcon size={20} color="var(--green-deep, #2E7D46)" />
                  Formulir Identifikasi — Sosial
                </h3>
              </div>

              {/* Sub-Tabs Pills */}
              <div className="spm-sub-pills">
                <button type="button" className={`spm-sub-pill ${subTab4 === 0 ? 'active' : ''}`} onClick={() => { setSubTab4(0); resetFormIden(); }}>
                  KIE Gender &amp; Inklusi
                </button>
                <button type="button" className={`spm-sub-pill ${subTab4 === 1 ? 'active' : ''}`} onClick={() => { setSubTab4(1); resetFormIden(); }}>
                  Pendataan Fakir Miskin
                </button>
                <button type="button" className={`spm-sub-pill ${subTab4 === 2 ? 'active' : ''}`} onClick={() => { setSubTab4(2); resetFormIden(); }}>
                  Verifikasi Sosial-Ekonomi
                </button>
                <button type="button" className={`spm-sub-pill ${subTab4 === 3 ? 'active' : ''}`} onClick={() => { setSubTab4(3); resetFormIden(); }}>
                  Penyaluran Bantuan Sosial
                </button>
              </div>

              {subTab4 === 0 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Peserta</label><input name="nama_peserta" value={formIden.nama_peserta || ''} onChange={handleIdenChange} placeholder="Tulis nama lengkap sesuai identitas" /></div>
                  <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formIden.jenis_kelamin || 'P'} onChange={handleIdenChange}><option value="P">Perempuan</option><option value="L">Laki-laki</option></select></div>
                  <div className="form-field">
                    <label>No. HP (Opsional)</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={15}
                      name="no_hp"
                      value={formIden.no_hp || ''}
                      onChange={handleIdenChange}
                      placeholder="081234567890"
                    />
                  </div>
                  <div className="form-field full"><label>Kelompok Rentan</label><input name="kelompok_rentan" value={formIden.kelompok_rentan || ''} onChange={handleIdenChange} placeholder="Contoh: Lansia, Disabilitas, Ibu Hamil, Anak Yatim" /></div>
                </div>
              )}

              {subTab4 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kepala Keluarga</label><input name="nama_kk" value={formIden.nama_kk || ''} onChange={handleIdenChange} placeholder="Tulis sesuai KTP atau identitas resmi" /></div>
                  <div className="form-field full"><label>Alamat Lengkap</label><input name="alamat" value={formIden.alamat || ''} onChange={handleIdenChange} placeholder="Cantumkan RT/RW, Dusun, Desa" /></div>
                  <div className="form-field"><label>Jumlah Anggota Keluarga</label><input type="number" name="jumlah_anggota" value={formIden.jumlah_anggota || ''} onChange={handleIdenChange} placeholder="Total orang dlm 1 rumah" /></div>
                  <div className="form-field"><label>Status Rumah Tinggal</label><select name="status_rumah" value={formIden.status_rumah || 'Tidak Layak'} onChange={handleIdenChange}><option value="Layak">Layak</option><option value="Tidak Layak">Tidak Layak</option></select></div>
                  <div className="form-field full"><label>Estimasi Penghasilan / Bulan</label><input name="penghasilan" value={formIden.penghasilan || ''} onChange={handleIdenChange} placeholder="Contoh: Rp 800.000 (Tulis 'Tidak Tetap' jika tak tentu)" /></div>
                  <div className="form-field full"><label>Anggota Disabilitas</label><input name="disabilitas" value={formIden.disabilitas || ''} onChange={handleIdenChange} placeholder="Tulis jenis disabilitas jika ada. Tulis '-' jika tidak ada." /></div>
                  <div className="form-field full"><label>Keterangan Tambahan</label><textarea rows="2" name="keterangan" value={formIden.keterangan || ''} onChange={handleIdenChange} placeholder="Contoh: Lansia sebatang kara, sakit menahun..."></textarea></div>
                </div>
              )}

              {subTab4 === 2 && (
                <div className="form-grid">
                  <div className="form-field"><label>Kondisi Fisik Rumah</label><select name="kondisi_rumah" value={formIden.kondisi_rumah || 'Tidak Layak'} onChange={handleIdenChange}><option value="Layak">Layak</option><option value="Tidak Layak">Tidak Layak</option></select></div>
                  <div className="form-field"><label>Kepemilikan Penghasilan</label><select name="penghasilan" value={formIden.penghasilan || 'Tidak Tetap'} onChange={handleIdenChange}><option value="Tetap">Tetap</option><option value="Tidak Tetap">Tidak Tetap</option><option value="Tidak Ada">Tidak Ada</option></select></div>
                  <div className="form-field"><label>Aset Produktif</label><select name="aset_produktif" value={formIden.aset_produktif || 'Tidak Ada'} onChange={handleIdenChange}><option value="Ada">Ada</option><option value="Tidak Ada">Tidak Ada</option></select></div>
                  <div className="form-field"><label>Beban Tanggungan Keluarga</label><select name="beban_tanggungan" value={formIden.beban_tanggungan || 'Tinggi'} onChange={handleIdenChange}><option value="Rendah">Rendah</option><option value="Sedang">Sedang</option><option value="Tinggi">Tinggi</option></select></div>
                  <div className="form-field"><label>Risiko Khusus</label><select name="risiko_khusus" value={formIden.risiko_khusus || 'Tidak Ada'} onChange={handleIdenChange}><option value="Lansia">Lansia</option><option value="Disabilitas">Disabilitas</option><option value="Penyakit Kronis">Penyakit Kronis</option><option value="Tidak Ada">Tidak Ada</option></select></div>
                  <div className="form-field"><label>Skor Kerentanan (1–5)</label><select name="skor" value={formIden.skor || '3'} onChange={handleIdenChange} style={{ fontWeight: 'bold' }}><option value="1">1 - Sangat Baik</option><option value="2">2 - Cukup Baik</option><option value="3">3 - Rentan Sedang</option><option value="4">4 - Rentan Tinggi</option><option value="5">5 - Sangat Rentan</option></select></div>
                  <div className="form-field full"><label>Catatan Detail Verifikasi</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Penjelasan rinci keadaan rumah, aset, dan kondisi khusus..."></textarea></div>
                </div>
              )}

              {subTab4 === 3 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kegiatan Penyaluran</label><input name="nama_kegiatan" value={formIden.nama_kegiatan || ''} onChange={handleIdenChange} placeholder="Contoh: Penyaluran Bantuan Sembako BLT Desa" /></div>
                  <div className="form-field"><label>Tanggal Penyaluran</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Jenis Bantuan</label><input name="jenis_bantuan" value={formIden.jenis_bantuan || ''} onChange={handleIdenChange} placeholder="Contoh: Sembako, BLT-Dana Desa, PKH" /></div>
                  <div className="form-field full"><label>Nama Penerima Manfaat</label><input name="nama_penerima" value={formIden.nama_penerima || ''} onChange={handleIdenChange} placeholder="Sesuai identitas KTP/KK" /></div>
                  <div className="form-field"><label>NIK Penerima</label><input name="nik_penerima" value={formIden.nik_penerima || ''} onChange={handleIdenChange} placeholder="16 digit angka" /></div>
                  <div className="form-field"><label>Jumlah / Volume Bantuan</label><input name="jumlah" value={formIden.jumlah || ''} onChange={handleIdenChange} placeholder="Contoh: 10 kg beras, Rp300.000" /></div>
                  <div className="form-field"><label>Metode Penyaluran</label><select name="metode" value={formIden.metode || 'Langsung'} onChange={handleIdenChange}><option value="Langsung">Langsung</option><option value="Diwakili">Diwakili</option><option value="Titipan">Titipan</option><option value="Pindah Alamat">Pindah Alamat</option></select></div>
                  <div className="form-field"><label>Kondisi Barang Bantuan</label><select name="kondisi" value={formIden.kondisi || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Kurang Lengkap">Kurang Lengkap</option><option value="Tidak Layak">Tidak Layak</option></select></div>
                  <div className="form-field full"><label>Alamat &amp; Keterangan Tambahan</label><textarea rows="2" name="keterangan" value={formIden.keterangan || ''} onChange={handleIdenChange} placeholder="Contoh: RT 02. Penerima sakit sehingga diwakili anak kandung..."></textarea></div>
                </div>
              )}

              {renderUploadBox(
                fotoIden,
                setFotoIden,
                fileInputIdenRef,
                'Unggah Dokumentasi Foto / Bukti Lapangan (Opsional)',
                'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)'
              )}

              {renderActionButtons('iden')}
            </div>

            {/* KANAN: PENGADUAN MASYARAKAT SOSIAL */}
            <div className="spm-form-card">
              <div className="section-head" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Comment01Icon size={20} color="var(--green-deep, #2E7D46)" />
                  Pengaduan Masyarakat — Sosial
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                Gunakan form ini untuk mencatat laporan kebutuhan bansos, inklusi sosial, maupun pendataan warga rentan.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor *</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama warga pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field">
                  <label>No. KTP (NIK Warga)</label>
                  <input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit angka" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <LockIcon size={12} /> Hanya terlihat oleh Kader/Admin
                  </div>
                </div>
                <div className="form-field"><label>No. HP (Opsional)</label><input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={15}
                  name="no_hp"
                  value={formPengaduan.no_hp || ''}
                  onChange={handlePengaduanChange}
                  placeholder="081234567890"
                /></div>
                <div className="form-field full"><label>Alamat Warga Pelapor</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat lengkap pelapor" /></div>

                <div className="form-field full">
                  <label>Jenis Pengaduan (Sosial)</label>
                  <select name="jenis_pengaduan" value={formPengaduan.jenis_pengaduan || 'KIE: Kesetaraan dan Keadilan Gender'} onChange={handlePengaduanChange} style={{ fontWeight: 'bold' }}>
                    <option value="KIE: Kesetaraan dan Keadilan Gender">KIE: Kesetaraan dan Keadilan Gender</option>
                    <option value="KIE: Disabilitas">KIE: Disabilitas</option>
                    <option value="KIE: Kesiapsiagaan Bencana">KIE: Kesiapsiagaan Bencana</option>
                    <option value="KIE: Inklusi Sosial">KIE: Inklusi Sosial</option>
                    <option value="Identifikasi dan Pendataan Fakir Miskin/Masyarakat Tidak Mampu">Identifikasi dan Pendataan Fakir Miskin/Masyarakat Tidak Mampu</option>
                    <option value="Penyaluran Bantuan Sosial">Penyaluran Bantuan Sosial</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="form-field full"><label>Deskripsi Pengaduan / Usulan Bantuan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan laporan/kebutuhan bansos secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Masalah / Wilayah</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="Contoh: RT 04 Dusun Mekar Harapan" /></div>

                {renderUploadBox(
                  lampiranPengaduan,
                  setLampiranPengaduan,
                  fileInputPengaduanRef,
                  'Unggah Dokumen Pelengkap / Foto (Opsional)',
                  'Format: JPG, PNG, PDF, DOC (Maks. 2MB per file)',
                  (
                    <div>
                      <b>Dokumen Pelengkap:</b> Foto copy KTP/KK atau Surat Keterangan dari Pemerintah Desa / RT setempat.
                    </div>
                  )
                )}
              </div>

              {renderActionButtons('aduan')}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM SECTION: REKAPITULASI TERPADU BIDANG SPM TERPILIH */}
      <div
        className="card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CurrentIcon size={20} color={currentCategory.theme.primary} />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Rekapitulasi Data — {currentCategory.title}
              </h3>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Riwayat data formulir identifikasi &amp; aspirasi/pengaduan masyarakat bidang {currentCategory.title}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '11.5px', fontWeight: 700 }}>
              {dataFormulirFilter.length} Formulir
            </span>
            <span className="badge badge-orange" style={{ fontSize: '11.5px', fontWeight: 700 }}>
              {dataPengaduanFilter.length} Pengaduan ({belumSelesai} Baru)
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '16px' }}>
          {/* --- KIRI: REKAP FORMULIR --- */}
          <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', backgroundColor: '#fafbfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                Formulir Identifikasi Lapangan
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                {dataFormulirFilter.length} Tersimpan
              </span>
            </div>

            <div className="table-responsive">
              <table className="table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Sub-Bidang</th>
                    <th>Identitas / Subjek</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayFormulir.length > 0 ? (
                    displayFormulir.map((item, idx) => (
                      <tr key={idx}>
                        <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                        <td><span style={{ fontWeight: 600, color: '#1e293b' }}>{item.sub_bidang || '-'}</span></td>
                        <td><span style={{ color: '#475569', fontWeight: 600 }}>{getFormulirSubjek(item)}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            icon={ViewIcon}
                            onClick={() => setSelectedForm(item)}
                          >
                            Detail
                          </Button>
                          {canDeleteFinalForm && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleDeleteFinal('form', item)}
                              style={{
                                marginLeft: '6px',
                                border: '1px solid #fecaca',
                                backgroundColor: '#fff',
                                color: '#dc2626',
                                borderRadius: '7px',
                                padding: '6px 9px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Delete02Icon size={14} />
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '24px 16px', color: '#94a3b8' }}>
                        <File01Icon size={24} style={{ margin: '0 auto 6px', display: 'block', color: '#cbd5e1' }} />
                        Belum ada formulir identifikasi di bidang ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- KANAN: REKAP PENGADUAN --- */}
          <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', backgroundColor: '#fafbfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                Pengaduan &amp; Aspirasi Warga
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                {dataPengaduanFilter.length} Laporan
              </span>
            </div>

            <div className="table-responsive">
              <table className="table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Pelapor</th>
                    <th>Keluhan</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPengaduan.length > 0 ? (
                    displayPengaduan.map((item, idx) => (
                      <tr key={idx}>
                        <td><b>{item.nama_pelapor || 'Warga'}</b></td>
                        <td>{(item.isi_keluhan || '').substring(0, 24)}{(item.isi_keluhan || '').length > 24 ? '...' : ''}</td>
                        <td>
                          <span className={`badge ${item.status === 'menunggu' ? 'badge-rose' : item.status === 'diproses' ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: '11px' }}>
                            {item.status === 'menunggu' ? 'Baru' : item.status === 'diproses' ? 'Diproses' : 'Selesai'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            icon={ViewIcon}
                            onClick={() => setSelectedPengaduan(item)}
                          >
                            Detail
                          </Button>
                          {canDeleteFinalPengaduan && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleDeleteFinal('pengaduan', item)}
                              style={{
                                marginLeft: '6px',
                                border: '1px solid #fecaca',
                                backgroundColor: '#fff',
                                color: '#dc2626',
                                borderRadius: '7px',
                                padding: '6px 9px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Delete02Icon size={14} />
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '24px 16px', color: '#94a3b8' }}>
                        <Comment01Icon size={24} style={{ margin: '0 auto 6px', display: 'block', color: '#cbd5e1' }} />
                        Belum ada pengaduan di bidang ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tombol Lihat Semua Rekap */}
        {(dataFormulirFilter.length > 3 || dataPengaduanFilter.length > 3) && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowAllRekap(!showAllRekap)}
            >
              {showAllRekap ? 'Tampilkan Lebih Ringkas (3 Teratas)' : `Tampilkan Semua Data (${dataFormulirFilter.length + dataPengaduanFilter.length} Data)`}
            </Button>
          </div>
        )}
      </div>

      {/* =========================================
          MODAL DETAIL FORMULIR
          ========================================= */}
      {selectedForm && createPortal(
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => setSelectedForm(null)}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
        >
          <div
            className="card"
            style={{
              width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
              position: 'relative', backgroundColor: '#fff', borderRadius: '16px', padding: '28px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedForm(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', color: '#64748b', zIndex: 10
              }}
              aria-label="Tutup"
            >
              <Cancel01Icon size={16} />
            </button>

            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--primary-teal, #008080)', margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>Detail Formulir Identifikasi</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px', fontWeight: 600 }}>{selectedForm.sub_bidang || '-'}</p>
            </div>

            <table className="table">
              <tbody>
                <tr>
                  <td style={{ width: '40%', color: '#64748b', fontSize: '13px' }}>Tanggal Kirim</td>
                  <td><b>{new Date(selectedForm.created_at).toLocaleString('id-ID')}</b></td>
                </tr>
                {Object.entries(getSafeObject(selectedForm.data_formulir)).map(([key, value], idx) => (
                  <tr key={idx}>
                    <td style={{ color: '#64748b', textTransform: 'capitalize', fontSize: '13px' }}>
                      {key.replace(/_/g, ' ')}
                    </td>
                    <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{value || '-'}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* AREA LAMPIRAN FOTO/DOKUMEN IDENTIFIKASI */}
            {(() => {
              const fotoArr = getArrayData(selectedForm.dokumentasi_foto);
              if (fotoArr.length > 0) {
                return (
                  <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#334155', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Dokumentasi Lapangan:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {fotoArr.map((file_path, idx) => (
                        <Button
                          key={idx}
                          as="a"
                          href={getFileUrl(file_path)}
                          target="_blank"
                          rel="noreferrer"
                          variant="secondary"
                          size="sm"
                          icon={Image01Icon}
                          style={{ textDecoration: 'none' }}
                        >
                          Lihat Berkas {idx + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Button variant="primary" size="md" onClick={() => setSelectedForm(null)}>Tutup Rincian</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================
          MODAL DETAIL PENGADUAN
          ========================================= */}
      {selectedPengaduan && createPortal(
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => setSelectedPengaduan(null)}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
        >
          <div
            className="card"
            style={{
              width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
              position: 'relative', backgroundColor: '#fff', borderRadius: '16px', padding: '28px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPengaduan(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#f1f5f9', border: 'none', borderRadius: '50%',
                width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', color: '#64748b', zIndex: 10
              }}
              aria-label="Tutup"
            >
              <Cancel01Icon size={16} />
            </button>

            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--primary-teal, #008080)', margin: '0 0 4px', fontSize: '18px', fontWeight: 800 }}>Detail Pengaduan &amp; Aspirasi</h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13.5px', textTransform: 'capitalize', fontWeight: 600 }}>
                Bidang: {(selectedPengaduan.bidang || '').replace(/_/g, ' ')}
              </p>
            </div>

            <table className="table">
              <tbody>
                <tr>
                  <td style={{ width: '35%', color: '#64748b', fontSize: '13px' }}>Tanggal Lapor</td>
                  <td><b>{new Date(selectedPengaduan.created_at).toLocaleString('id-ID')}</b></td>
                </tr>
                <tr><td style={{ color: '#64748b', fontSize: '13px' }}>Nama Pelapor</td><td><b>{selectedPengaduan.nama_pelapor} ({selectedPengaduan.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})</b></td></tr>
                <tr><td style={{ color: '#64748b', fontSize: '13px' }}>NIK</td><td><b>{selectedPengaduan.nik || '-'}</b></td></tr>
                <tr><td style={{ color: '#64748b', fontSize: '13px' }}>No. HP</td><td><b>{selectedPengaduan.no_hp || '-'}</b></td></tr>
                <tr><td style={{ color: '#64748b', fontSize: '13px' }}>Alamat Warga</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.alamat || '-'}</b></td></tr>
                <tr><td style={{ color: '#64748b', fontSize: '13px' }}>Lokasi Masalah</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.lokasi_masalah || '-'}</b></td></tr>
                <tr><td style={{ color: '#64748b', fontSize: '13px' }}>Isi Aspirasi / Keluhan</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.isi_keluhan}</b></td></tr>
                <tr>
                  <td style={{ color: '#64748b', fontSize: '13px' }}>Status Tindak Lanjut</td>
                  <td>
                    <span className={`badge ${selectedPengaduan.status === 'menunggu' ? 'badge-rose' : selectedPengaduan.status === 'diproses' ? 'badge-orange' : 'badge-green'}`}>
                      {selectedPengaduan.status === 'menunggu' ? 'Baru (Menunggu)' : selectedPengaduan.status === 'diproses' ? 'Sedang Diproses' : 'Selesai Ditindak'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* AREA LAMPIRAN FOTO/DOKUMEN PENGADUAN */}
            {(() => {
              const lampiranArr = getArrayData(selectedPengaduan.lampiran);
              if (lampiranArr.length > 0) {
                return (
                  <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#334155', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Bukti Lampiran Pengaduan:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {lampiranArr.map((file_path, idx) => (
                        <Button
                          key={idx}
                          as="a"
                          href={getFileUrl(file_path)}
                          target="_blank"
                          rel="noreferrer"
                          variant="secondary"
                          size="sm"
                          icon={Image01Icon}
                          style={{ textDecoration: 'none' }}
                        >
                          Lihat Berkas {idx + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Button variant="primary" size="md" onClick={() => setSelectedPengaduan(null)}>Tutup Rincian</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}