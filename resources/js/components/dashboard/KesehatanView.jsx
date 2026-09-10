import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  Activity01Icon,
  Calculator01Icon,
  File01Icon,
  FolderOpenIcon,
  Upload01Icon,
  Cancel01Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Baby01Icon,
  UserGroupIcon,
  FavouriteIcon,
  UserCheck01Icon,
  Image01Icon,
  Delete02Icon,
  Calendar03Icon,
  RefreshIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const KELOMPOK_CALC = {
  balita: { title: 'Kalkulator Status Gizi Balita', label: 'Status Pertumbuhan (BB/TB Standar Kemenkes)' },
  remaja: { title: 'Kalkulator IMT Remaja', label: 'Indeks Massa Tubuh (IMT)' },
  hamil: { title: 'Kalkulator IMT Ibu Hamil', label: 'IMT Pra-Hamil & Risiko KEK' },
  lansia: { title: 'Kalkulator IMT Lansia', label: 'Indeks Massa Tubuh Lansia' }
};

const TARGET_GROUPS = [
  {
    id: 'balita',
    title: 'Bayi & Balita',
    age: 'Usia 0–5 Tahun',
    tag: 'Tumbuh Kembang',
    icon: Baby01Icon,
    theme: {
      primary: 'var(--cyan-deep, #0E7C93)',
      accent: 'var(--cyan, #5FC4DB)',
      lightBg: 'var(--cyan-bg, #E3F7FB)',
      lightBorder: '#b3e8f3',
      textColor: 'var(--cyan-deep, #0E7C93)',
      badgeBg: 'var(--cyan-bg, #E3F7FB)'
    }
  },
  {
    id: 'remaja',
    title: 'Remaja',
    age: 'Usia 10–18 Tahun',
    tag: 'IMT & Skrining',
    icon: UserGroupIcon,
    theme: {
      primary: 'var(--orange-deep, #B5650C)',
      accent: 'var(--orange, #F2A65A)',
      lightBg: 'var(--orange-bg, #FFF1DF)',
      lightBorder: '#fedbb0',
      textColor: 'var(--orange-deep, #B5650C)',
      badgeBg: 'var(--orange-bg, #FFF1DF)'
    }
  },
  {
    id: 'hamil',
    title: 'Ibu Hamil',
    age: '& Ibu Menyusui',
    tag: 'KIA & Nutrisi',
    icon: FavouriteIcon,
    theme: {
      primary: 'var(--magenta-deep, #93348A)',
      accent: 'var(--magenta, #D98AD1)',
      lightBg: 'var(--magenta-bg, #FBEAF8)',
      lightBorder: '#f5cbe7',
      textColor: 'var(--magenta-deep, #93348A)',
      badgeBg: 'var(--magenta-bg, #FBEAF8)'
    }
  },
  {
    id: 'lansia',
    title: 'Lansia',
    age: 'Usia ≥60 Tahun',
    tag: 'Usia Emas & Tensi',
    icon: UserCheck01Icon,
    theme: {
      primary: 'var(--green-deep, #2E7D46)',
      accent: 'var(--green, #7FCB93)',
      lightBg: 'var(--green-bg, #E7F7EC)',
      lightBorder: '#c3ecd0',
      textColor: 'var(--green-deep, #2E7D46)',
      badgeBg: 'var(--green-bg, #E7F7EC)'
    }
  }
];

export default function KesehatanView() {
  const [target, setTarget] = useState('balita');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [draftSuccessModal, setDraftSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  
  // === STATE FOTO DOKUMENTASI (HANYA 1 FOTO) ===
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Cleanup object URL preview saat unmount
  useEffect(() => {
    return () => {
      if (fotoPreview?.url) {
        URL.revokeObjectURL(fotoPreview.url);
      }
    };
  }, [fotoPreview]);

  // === STATE MODAL DRAF ===
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftList, setDraftList] = useState([]);
  const [isFetchingDrafts, setIsFetchingDrafts] = useState(false);

  // === STATE DATA WARGA ===
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [daftarRemaja, setDaftarRemaja] = useState([]);
  const [daftarIbu, setDaftarIbu] = useState([]);
  const [daftarLansia, setDaftarLansia] = useState([]);

  // === HELPER FORMAT TANGGAL INDONESIA ===
  const formatIndonesianDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // === HELPER KATEGORI DRAF ===
  const getDraftCategoryInfo = (category) => {
    switch (category) {
      case 'balita':
        return { label: 'Bayi & Balita', bg: 'var(--cyan-bg, #E3F7FB)', color: 'var(--cyan-deep, #0E7C93)', border: 'rgba(95, 196, 219, 0.45)' };
      case 'remaja':
        return { label: 'Remaja', bg: 'var(--orange-bg, #FFF1DF)', color: 'var(--orange-deep, #B5650C)', border: 'rgba(242, 166, 90, 0.45)' };
      case 'hamil':
      case 'ibu':
        return { label: 'Ibu Hamil', bg: 'var(--magenta-bg, #FBEAF8)', color: 'var(--magenta-deep, #93348A)', border: 'rgba(217, 138, 209, 0.45)' };
      case 'lansia':
        return { label: 'Orang Tua / Lansia', bg: 'var(--green-bg, #E7F7EC)', color: 'var(--green-deep, #2E7D46)', border: 'rgba(127, 203, 147, 0.45)' };
      default:
        return { label: 'Pemeriksaan', bg: 'var(--surface-container-low, #EFF4FF)', color: 'var(--ink-soft, #414751)', border: 'var(--line, #C1C7D3)' };
    }
  };

  // === HELPER AMBIL NAMA WARGA UNTUK DRAF ===
  const getDraftPersonName = (draft) => {
    const draftCategory = draft.kategori || target;
    if (draftCategory === 'balita') {
      if (draft.anak?.nama_anak) return draft.anak.nama_anak;
      const found = daftarAnak.find(a => a.id?.toString() === draft.anak_id?.toString());
      return found ? found.nama_anak : 'Nama Balita Belum Dipilih';
    }
    if (draftCategory === 'remaja') {
      if (draft.remaja?.nama_remaja) return draft.remaja.nama_remaja;
      const found = daftarRemaja.find(r => r.id?.toString() === draft.remaja_id?.toString());
      return found ? found.nama_remaja : (draft.nama_remaja_baru || 'Nama Remaja Belum Dipilih');
    }
    if (draftCategory === 'hamil' || draftCategory === 'ibu') {
      if (draft.ibu?.nama_lengkap) return draft.ibu.nama_lengkap;
      const found = daftarIbu.find(i => i.id?.toString() === draft.ibu_id?.toString());
      return found ? found.nama_lengkap : (draft.nama_ibu_baru || 'Nama Ibu Hamil Belum Dipilih');
    }
    if (draftCategory === 'lansia') {
      if (draft.lansia?.nama_lengkap) return draft.lansia.nama_lengkap;
      const found = daftarLansia.find(l => l.id?.toString() === draft.lansia_id?.toString());
      return found ? found.nama_lengkap : (draft.nama_lansia_baru || 'Nama Lansia Belum Dipilih');
    }
    return 'Draf Pemeriksaan';
  };

  // === STATE FORM ===
  const [balitaData, setBalitaData] = useState({
    pemeriksaan_id: '',
    anak_id: '',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    umur_bulan: '',
    berat_badan: '',
    tinggi_badan: '',
    lingkar_kepala: '',
    lingkar_lengan: '',
    catatan_perkembangan: '',
    status_gizi: 'Normal'
  });
  const [imunisasi, setImunisasi] = useState([]);

  const [remajaData, setRemajaData] = useState({
    pemeriksaan_id: '',
    remaja_id: '',
    nama_remaja_baru: '',
    jenis_kelamin_baru: 'L',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    umur_tahun: '',
    berat_badan: '',
    tinggi_badan: '',
    tekanan_darah: '',
    status_imt: 'Normal'
  });

  const [hamilData, setHamilData] = useState({
    pemeriksaan_id: '',
    ibu_id: '',
    nama_ibu_baru: '',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    usia_kehamilan_minggu: '',
    berat_badan: '',
    tinggi_badan: '',
    tekanan_darah: '',
    lingkar_perut: '',
    lingkar_lengan: '',
    status_kek: 'Tidak',
    anemia: 'Tidak',
    status_imt: 'Normal'
  });

  const [lansiaData, setLansiaData] = useState({
    pemeriksaan_id: '',
    lansia_id: '',
    nama_lansia_baru: '',
    jenis_kelamin_baru: 'L',
    tanggal_periksa: new Date().toISOString().split('T')[0],
    berat_badan: '',
    tinggi_badan: '',
    lingkar_pinggang: '',
    tekanan_darah: '',
    tensi: 'Normal',
    gula_darah: '',
    nadi: '',
    status_imt: 'Normal'
  });

  // === AMBIL DATA DARI API ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [resAnak, resRemaja, resIbu, resLansia] = await Promise.all([
          axios.get('/api/warga/anak', { headers }),
          axios.get('/api/warga/remaja', { headers }),
          axios.get('/api/warga/ibu', { headers }),
          axios.get('/api/warga/lansia', { headers })
        ]);

        setDaftarAnak(resAnak.data.data || []);
        setDaftarRemaja(resRemaja.data.data || []);
        setDaftarIbu(resIbu.data.data || []);
        setDaftarLansia(resLansia.data.data || []);
      } catch (error) {
        console.error('Gagal memuat data warga:', error);
      }
    };
    fetchData();
  }, []);

  // Kunci scroll saat modal draf atau modal status terbuka
  useEffect(() => {
    if (showDraftModal || draftSuccessModal.isOpen || errorModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDraftModal, draftSuccessModal.isOpen, errorModal.isOpen]);

  // === FITUR DRAF: BUKA MODAL & AMBIL SEMUA DATA DRAF ===
  const openDraftModal = async () => {
    setShowDraftModal(true);
    setIsFetchingDrafts(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/draf-pemeriksaan/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDraftList(response.data.data || []);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Gagal mengambil daftar draf tersimpan.' });
    } finally {
      setIsFetchingDrafts(false);
    }
  };

  // === FITUR DRAF: MASUKKAN DATA KE DALAM FORM & SESUAIKAN KATEGORI SASARAN ===
  const handleSelectDraft = (draft) => {
    const draftCategory = draft.kategori || target;
    setTarget(draftCategory);

    if (draftCategory === 'balita') {
      setBalitaData({
        ...balitaData,
        pemeriksaan_id: draft.id,
        anak_id: draft.anak_id ? draft.anak_id.toString() : '',
        tanggal_periksa: draft.tanggal_periksa || new Date().toISOString().split('T')[0],
        umur_bulan: draft.umur_bulan || '',
        berat_badan: draft.berat_badan || '',
        tinggi_badan: draft.tinggi_badan || '',
        lingkar_kepala: draft.lingkar_kepala || '',
        lingkar_lengan: draft.lingkar_lengan || '',
        catatan_perkembangan: draft.catatan_perkembangan || '',
        status_gizi: draft.status_gizi || 'Normal'
      });
      if (draft.imunisasi) {
        try {
          const imuList = typeof draft.imunisasi === 'string' ? JSON.parse(draft.imunisasi) : draft.imunisasi;
          if (Array.isArray(imuList)) setImunisasi(imuList);
          else setImunisasi([]);
        } catch {
          setImunisasi([]);
        }
      } else {
        setImunisasi([]);
      }
    } else if (draftCategory === 'remaja') {
      setRemajaData({
        ...remajaData,
        pemeriksaan_id: draft.id,
        remaja_id: draft.remaja_id ? draft.remaja_id.toString() : '',
        nama_remaja_baru: draft.nama_remaja_baru || '',
        jenis_kelamin_baru: draft.jenis_kelamin_baru || 'L',
        tanggal_periksa: draft.tanggal_periksa || new Date().toISOString().split('T')[0],
        umur_tahun: draft.umur_tahun || '',
        berat_badan: draft.berat_badan || '',
        tinggi_badan: draft.tinggi_badan || '',
        tekanan_darah: draft.tekanan_darah || '',
        status_imt: draft.status_imt || 'Normal'
      });
    } else if (draftCategory === 'hamil' || draftCategory === 'ibu') {
      setHamilData({
        ...hamilData,
        pemeriksaan_id: draft.id,
        ibu_id: draft.ibu_id ? draft.ibu_id.toString() : '',
        nama_ibu_baru: draft.nama_ibu_baru || '',
        tanggal_periksa: draft.tanggal_periksa || new Date().toISOString().split('T')[0],
        usia_kehamilan_minggu: draft.usia_kehamilan_minggu || '',
        berat_badan: draft.berat_badan || '',
        tinggi_badan: draft.tinggi_badan || '',
        tekanan_darah: draft.tekanan_darah || '',
        lingkar_perut: draft.lingkar_perut || '',
        lingkar_lengan: draft.lingkar_lengan || '',
        status_kek: draft.status_kek || 'Tidak',
        anemia: draft.anemia || 'Tidak',
        status_imt: draft.status_imt || 'Normal'
      });
    } else if (draftCategory === 'lansia') {
      setLansiaData({
        ...lansiaData,
        pemeriksaan_id: draft.id,
        lansia_id: draft.lansia_id ? draft.lansia_id.toString() : '',
        nama_lansia_baru: draft.nama_lansia_baru || '',
        jenis_kelamin_baru: draft.jenis_kelamin_baru || 'L',
        tanggal_periksa: draft.tanggal_periksa || new Date().toISOString().split('T')[0],
        berat_badan: draft.berat_badan || '',
        tinggi_badan: draft.tinggi_badan || '',
        lingkar_pinggang: draft.lingkar_pinggang || '',
        tekanan_darah: draft.tekanan_darah || '',
        tensi: draft.tensi || 'Normal',
        gula_darah: draft.gula_darah || '',
        nadi: draft.nadi || '',
        status_imt: draft.status_imt || 'Normal'
      });
    }

    setShowDraftModal(false);
    setMessage({
      type: 'success',
      text: `Draf ${getDraftCategoryInfo(draftCategory).label} berhasil dimuat ke dalam form.`
    });
  };

  // === HANDLER FOTO DOKUMENTASI (HANYA 1 FOTO) ===
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorModal({
        isOpen: true,
        title: 'Format File Tidak Didukung',
        message: 'Mohon unggah file berupa foto/gambar (JPG, PNG, atau WEBP).'
      });
      return;
    }

    if (fotoPreview?.url) {
      URL.revokeObjectURL(fotoPreview.url);
    }

    setFotoFile(file);
    setFotoPreview({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB'
    });
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    if (fotoPreview?.url) {
      URL.revokeObjectURL(fotoPreview.url);
    }
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleImunisasi = (namaVaksin) => {
    if (imunisasi.includes(namaVaksin)) setImunisasi(imunisasi.filter(item => item !== namaVaksin));
    else setImunisasi([...imunisasi, namaVaksin]);
  };

  // === KALKULATOR STANDAR IMT & GIZI ===
  const calculateIMT = (bb, tb_cm, rules) => {
    if (bb > 0 && tb_cm > 0) {
      const imt = bb / ((tb_cm / 100) ** 2);
      if (rules === 'hamil') {
        if (imt < 18.5) return 'Kurang (Risiko KEK)';
        if (imt >= 25 && imt < 29.9) return 'Berlebih';
        if (imt >= 30) return 'Obesitas';
        return 'Normal';
      } else {
        if (imt < 18.5) return 'Kurus';
        if (imt >= 25 && imt < 29.9) return 'Gemuk';
        if (imt >= 30) return 'Obesitas';
        return 'Normal';
      }
    }
    return 'Normal';
  };

  const calculateBalitaStatus = (bb, tb_cm) => {
    if (bb > 0 && tb_cm > 0) {
      const imt = bb / ((tb_cm / 100) ** 2);
      if (imt < 13.5) return 'Gizi Kurang (Wasted)';
      if (imt > 20) return 'Gizi Lebih (Obesitas)';
      if (imt >= 18.5) return 'Berisiko Gizi Lebih';
      return 'Gizi Baik (Normal)';
    }
    return 'Normal';
  };

  // === HANDLERS INPUT FORM ===
  const handleBalitaChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...balitaData, [name]: value };
    if (name === 'anak_id') {
      const selected = daftarAnak.find(a => a.id.toString() === value);
      if (selected) {
        const birthDate = new Date(selected.tanggal_lahir);
        const today = new Date();
        let ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 - birthDate.getMonth() + today.getMonth();
        updated.umur_bulan = ageMonths > 0 ? ageMonths : 0;
      }
    }
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      const bbVal = name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan);
      const tbVal = name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan);
      updated.status_gizi = calculateBalitaStatus(bbVal, tbVal);
    }
    setBalitaData(updated);
  };

  const handleRemajaChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...remajaData, [name]: value };
    if (name === 'remaja_id' && value !== 'baru') {
      const selected = daftarRemaja.find(r => r.id.toString() === value);
      if (selected) {
        const birthDate = new Date(selected.tanggal_lahir);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        updated.umur_tahun = age > 0 ? age : 0;
      }
    }
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      const bbVal = name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan);
      const tbVal = name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan);
      updated.status_imt = calculateIMT(bbVal, tbVal, 'remaja');
    }
    setRemajaData(updated);
  };

  const handleHamilChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...hamilData, [name]: value };
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      const bbVal = name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan);
      const tbVal = name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan);
      updated.status_imt = calculateIMT(bbVal, tbVal, 'hamil');
    }
    if (name === 'lingkar_lengan') {
      const lila = parseFloat(value);
      if (!isNaN(lila) && lila > 0) {
        updated.status_kek = lila < 23.5 ? 'Ya' : 'Tidak';
      }
    }
    setHamilData(updated);
  };

  const handleLansiaChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...lansiaData, [name]: value };
    if (name === 'berat_badan' || name === 'tinggi_badan') {
      const bbVal = name === 'berat_badan' ? parseFloat(value) : parseFloat(updated.berat_badan);
      const tbVal = name === 'tinggi_badan' ? parseFloat(value) : parseFloat(updated.tinggi_badan);
      updated.status_imt = calculateIMT(bbVal, tbVal, 'lansia');
    }
    if (name === 'tekanan_darah') {
      const parts = value.split('/');
      if (parts.length === 2) {
        const sys = parseInt(parts[0], 10);
        const dia = parseInt(parts[1], 10);
        if (!isNaN(sys) && !isNaN(dia)) {
          if (sys >= 140 || dia >= 90) updated.tensi = 'Tinggi';
          else if (sys < 90 || dia < 60) updated.tensi = 'Rendah';
          else updated.tensi = 'Normal';
        }
      }
    }
    setLansiaData(updated);
  };

  // === VALIDASI URUTAN PENGISIAN FORM (SEQUENTIAL VALIDATION) ===
  const getFieldValidation = (kelompok, fieldName) => {
    if (kelompok === 'balita') {
      const hasSubsequent = Boolean(
        balitaData.umur_bulan ||
        balitaData.berat_badan ||
        balitaData.tinggi_badan ||
        balitaData.lingkar_kepala ||
        balitaData.catatan_perkembangan ||
        imunisasi.length > 0
      );

      if (fieldName === 'anak_id') {
        if (!balitaData.anak_id && hasSubsequent) {
          return { isError: true, message: 'Kolom ini wajib dipilih terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'berat_badan') {
        const hasAfterBB = Boolean(balitaData.tinggi_badan || balitaData.lingkar_kepala || balitaData.catatan_perkembangan);
        if (!balitaData.berat_badan && hasAfterBB) {
          return { isError: true, message: 'Kolom berat badan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'tinggi_badan') {
        const hasAfterTB = Boolean(balitaData.lingkar_kepala || balitaData.catatan_perkembangan);
        if (!balitaData.tinggi_badan && hasAfterTB) {
          return { isError: true, message: 'Kolom tinggi badan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      }
    } else if (kelompok === 'remaja') {
      const hasSubsequent = Boolean(
        remajaData.umur_tahun ||
        remajaData.tekanan_darah ||
        remajaData.berat_badan ||
        remajaData.tinggi_badan
      );

      if (fieldName === 'remaja_id') {
        if (!remajaData.remaja_id && hasSubsequent) {
          return { isError: true, message: 'Kolom ini wajib dipilih terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'nama_remaja_baru') {
        if (remajaData.remaja_id === 'baru' && !remajaData.nama_remaja_baru && hasSubsequent) {
          return { isError: true, message: 'Nama remaja baru wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'umur_tahun') {
        const hasAfterUmur = Boolean(remajaData.tekanan_darah || remajaData.berat_badan || remajaData.tinggi_badan);
        if (!remajaData.umur_tahun && hasAfterUmur) {
          return { isError: true, message: 'Kolom umur wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'tekanan_darah') {
        const hasAfterTD = Boolean(remajaData.berat_badan || remajaData.tinggi_badan);
        if (!remajaData.tekanan_darah && hasAfterTD) {
          return { isError: true, message: 'Kolom tekanan darah wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'berat_badan') {
        const hasAfterBB = Boolean(remajaData.tinggi_badan);
        if (!remajaData.berat_badan && hasAfterBB) {
          return { isError: true, message: 'Kolom berat badan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      }
    } else if (kelompok === 'hamil') {
      const hasSubsequent = Boolean(
        hamilData.usia_kehamilan_minggu ||
        hamilData.tekanan_darah ||
        hamilData.berat_badan ||
        hamilData.tinggi_badan ||
        hamilData.lingkar_lengan
      );

      if (fieldName === 'ibu_id') {
        if (!hamilData.ibu_id && hasSubsequent) {
          return { isError: true, message: 'Kolom ini wajib dipilih terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'nama_ibu_baru') {
        if (hamilData.ibu_id === 'baru' && !hamilData.nama_ibu_baru && hasSubsequent) {
          return { isError: true, message: 'Nama ibu baru wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'usia_kehamilan_minggu') {
        const hasAfterUsia = Boolean(hamilData.tekanan_darah || hamilData.berat_badan || hamilData.tinggi_badan || hamilData.lingkar_lengan);
        if (!hamilData.usia_kehamilan_minggu && hasAfterUsia) {
          return { isError: true, message: 'Kolom usia kehamilan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'tekanan_darah') {
        const hasAfterTD = Boolean(hamilData.berat_badan || hamilData.tinggi_badan || hamilData.lingkar_lengan);
        if (!hamilData.tekanan_darah && hasAfterTD) {
          return { isError: true, message: 'Kolom tensi darah wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'berat_badan') {
        const hasAfterBB = Boolean(hamilData.tinggi_badan || hamilData.lingkar_lengan);
        if (!hamilData.berat_badan && hasAfterBB) {
          return { isError: true, message: 'Kolom berat badan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'tinggi_badan') {
        const hasAfterTB = Boolean(hamilData.lingkar_lengan);
        if (!hamilData.tinggi_badan && hasAfterTB) {
          return { isError: true, message: 'Kolom tinggi badan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      }
    } else if (kelompok === 'lansia') {
      const hasSubsequent = Boolean(
        lansiaData.gula_darah ||
        lansiaData.tekanan_darah ||
        lansiaData.berat_badan ||
        lansiaData.tinggi_badan
      );

      if (fieldName === 'lansia_id') {
        if (!lansiaData.lansia_id && hasSubsequent) {
          return { isError: true, message: 'Kolom ini wajib dipilih terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'nama_lansia_baru') {
        if (lansiaData.lansia_id === 'baru' && !lansiaData.nama_lansia_baru && hasSubsequent) {
          return { isError: true, message: 'Nama lansia baru wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'gula_darah') {
        const hasAfterGula = Boolean(lansiaData.tekanan_darah || lansiaData.berat_badan || lansiaData.tinggi_badan);
        if (!lansiaData.gula_darah && hasAfterGula) {
          return { isError: true, message: 'Kolom gula darah wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'tekanan_darah') {
        const hasAfterTD = Boolean(lansiaData.berat_badan || lansiaData.tinggi_badan);
        if (!lansiaData.tekanan_darah && hasAfterTD) {
          return { isError: true, message: 'Kolom tekanan darah wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      } else if (fieldName === 'berat_badan') {
        const hasAfterBB = Boolean(lansiaData.tinggi_badan);
        if (!lansiaData.berat_badan && hasAfterBB) {
          return { isError: true, message: 'Kolom berat badan wajib diisi terlebih dahulu dan tidak boleh kosong' };
        }
      }
    }

    return { isError: false, message: '' };
  };

  const submitData = async (url, formData, resetStateCallback, isDraft = false) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (isDraft) {
        setDraftSuccessModal({
          isOpen: true,
          title: 'Berhasil Tersimpan',
          message: response.data?.pesan || 'Draf pemeriksaan telah berhasil disimpan. Anda dapat melanjutkan pengisian form atau memuat draf ini kembali kapan saja.'
        });
      } else {
        setMessage({ type: 'success', text: response.data?.pesan || 'Data pemeriksaan berhasil disimpan.' });
      }

      resetStateCallback();
      if (fotoPreview?.url) URL.revokeObjectURL(fotoPreview.url);
      setFotoFile(null);
      setFotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      let pesanError = err.response?.data?.message || err.response?.data?.pesan || err.message;
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        pesanError = err.response.data.errors[firstErrorKey][0];
      }
      setErrorModal({
        isOpen: true,
        title: 'Gagal Menyimpan Data',
        message: pesanError || 'Terjadi kesalahan saat menyimpan data pemeriksaan. Silakan periksa kembali kelengkapan form.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (kelompok, statusForm) => {
    const isDraft = statusForm === 'draft';
    const formData = new FormData();
    formData.append('status_form', statusForm);
    if (fotoFile) {
      formData.append('dokumentasi_foto[]', fotoFile);
    }

    const appendSafeData = (dataObj, targetIdField) => {
      if (dataObj.pemeriksaan_id) formData.append('pemeriksaan_id', dataObj.pemeriksaan_id);

      Object.keys(dataObj).forEach(k => {
        if (k === 'pemeriksaan_id') return;
        let val = dataObj[k];

        if (dataObj[targetIdField] !== 'baru' && k.includes('_baru')) return;
        if (val !== '' && val !== null && val !== undefined) {
          formData.append(k, val);
        }
      });
    };

    if (kelompok === 'balita') {
      if (statusForm === 'final' && !balitaData.anak_id) {
        setErrorModal({
          isOpen: true,
          title: 'Nama Anak Belum Dipilih',
          message: 'Silakan pilih nama anak / balita yang terdaftar sebelum menyimpan data final.'
        });
        return;
      }
      appendSafeData(balitaData, 'anak_id');
      imunisasi.forEach((item, index) => formData.append(`imunisasi[${index}]`, item));
      submitData('/api/pemeriksaan-balita', formData, () => {
        if (statusForm === 'final') {
          setBalitaData({
            pemeriksaan_id: '',
            anak_id: '',
            tanggal_periksa: new Date().toISOString().split('T')[0],
            umur_bulan: '',
            berat_badan: '',
            tinggi_badan: '',
            lingkar_kepala: '',
            lingkar_lengan: '',
            catatan_perkembangan: '',
            status_gizi: 'Normal'
          });
          setImunisasi([]);
        }
      }, isDraft);
    } else if (kelompok === 'remaja') {
      if (statusForm === 'final' && !remajaData.remaja_id && !remajaData.nama_remaja_baru) {
        setErrorModal({
          isOpen: true,
          title: 'Nama Remaja Belum Dipilih',
          message: 'Silakan pilih nama remaja terdaftar atau masukkan nama baru sebelum menyimpan data final.'
        });
        return;
      }
      appendSafeData(remajaData, 'remaja_id');
      submitData('/api/pemeriksaan-remaja', formData, () => {
        if (statusForm === 'final') {
          setRemajaData({
            pemeriksaan_id: '',
            remaja_id: '',
            nama_remaja_baru: '',
            jenis_kelamin_baru: 'L',
            tanggal_periksa: new Date().toISOString().split('T')[0],
            umur_tahun: '',
            berat_badan: '',
            tinggi_badan: '',
            tekanan_darah: '',
            status_imt: 'Normal'
          });
        }
      }, isDraft);
    } else if (kelompok === 'hamil') {
      if (statusForm === 'final' && !hamilData.ibu_id && !hamilData.nama_ibu_baru) {
        setErrorModal({
          isOpen: true,
          title: 'Nama Ibu Hamil Belum Dipilih',
          message: 'Silakan pilih nama ibu hamil terdaftar atau masukkan nama baru sebelum menyimpan data final.'
        });
        return;
      }
      appendSafeData(hamilData, 'ibu_id');
      submitData('/api/pemeriksaan-hamil', formData, () => {
        if (statusForm === 'final') {
          setHamilData({
            pemeriksaan_id: '',
            ibu_id: '',
            nama_ibu_baru: '',
            tanggal_periksa: new Date().toISOString().split('T')[0],
            usia_kehamilan_minggu: '',
            berat_badan: '',
            tinggi_badan: '',
            tekanan_darah: '',
            lingkar_perut: '',
            lingkar_lengan: '',
            status_kek: 'Tidak',
            anemia: 'Tidak',
            status_imt: 'Normal'
          });
        }
      }, isDraft);
    } else if (kelompok === 'lansia') {
      if (statusForm === 'final' && !lansiaData.lansia_id && !lansiaData.nama_lansia_baru) {
        setErrorModal({
          isOpen: true,
          title: 'Nama Lansia Belum Dipilih',
          message: 'Silakan pilih nama orang tua / lansia terdaftar atau masukkan nama baru sebelum menyimpan data final.'
        });
        return;
      }
      appendSafeData(lansiaData, 'lansia_id');
      submitData('/api/pemeriksaan-lansia', formData, () => {
        if (statusForm === 'final') {
          setLansiaData({
            pemeriksaan_id: '',
            lansia_id: '',
            nama_lansia_baru: '',
            jenis_kelamin_baru: 'L',
            tanggal_periksa: new Date().toISOString().split('T')[0],
            berat_badan: '',
            tinggi_badan: '',
            lingkar_pinggang: '',
            tekanan_darah: '',
            tensi: 'Normal',
            gula_darah: '',
            nadi: '',
            status_imt: 'Normal'
          });
        }
      }, isDraft);
    }
  };

  const getKalkulatorResult = () => {
    if (target === 'balita') return balitaData.status_gizi;
    if (target === 'remaja') return remajaData.status_imt;
    if (target === 'hamil') return hamilData.status_imt;
    if (target === 'lansia') return lansiaData.status_imt;
    return 'Normal';
  };

  const getTargetTitle = () => {
    if (target === 'balita') return 'Pemeriksaan Bayi & Balita';
    if (target === 'remaja') return 'Pemeriksaan Kesehatan Remaja';
    if (target === 'hamil') return 'Pemeriksaan Ibu Hamil';
    return 'Pemeriksaan Orang Tua & Lansia';
  };

  const currentTargetGroup = TARGET_GROUPS.find((g) => g.id === target) || TARGET_GROUPS[0];

  return (
    <>
      {/* POP-UP MODAL PILIH DRAF (SEMUA KATEGORI SASARAN) */}
      {showDraftModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setShowDraftModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '28px',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Semua Sasaran Pemeriksaan
                </span>
                <h3 style={{ margin: '2px 0 0', color: '#0f172a', fontSize: '19px', fontWeight: 800 }}>
                  Draf Pemeriksaan Tersimpan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDraftModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s ease' }}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            {isFetchingDrafts ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '36px' }}>Memuat seluruh draf tersimpan...</p>
            ) : draftList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
                <File01Icon size={36} style={{ margin: '0 auto 10px', color: '#94a3b8' }} />
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>Belum Ada Draf Tersimpan</p>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>Semua draf pemeriksaan yang Anda simpan akan muncul di sini.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {draftList.map(draft => {
                  const personName = getDraftPersonName(draft);
                  const catInfo = getDraftCategoryInfo(draft.kategori);
                  return (
                    <div
                      key={`${draft.kategori || 'draft'}-${draft.id}`}
                      className="draft-item-card"
                      onClick={() => handleSelectDraft(draft)}
                    >
                      {/* Baris Atas: Label Sasaran (Badge) + Tanggal Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '3px 10px',
                              borderRadius: '8px',
                              backgroundColor: catInfo.bg,
                              color: catInfo.color,
                              border: `1px solid ${catInfo.border}`,
                              fontSize: '11px',
                              fontWeight: 800,
                              letterSpacing: '0.02em',
                              textTransform: 'uppercase'
                            }}
                          >
                            {catInfo.label}
                          </span>

                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 10px',
                              borderRadius: '8px',
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <Calendar03Icon size={12} color="#64748b" />
                            {formatIndonesianDate(draft.tanggal_periksa)}
                          </span>
                        </div>

                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                          ID #{draft.id}
                        </span>
                      </div>

                      {/* Nama Warga */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f0fdfa', color: 'var(--primary-teal, #008080)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <UserCheck01Icon size={16} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                            {personName}
                          </h4>
                        </div>
                      </div>

                      {/* Ringkasan Parameter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '11.5px', color: '#64748b' }}>
                        {draft.berat_badan && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            BB: <b>{draft.berat_badan} kg</b>
                          </span>
                        )}
                        {draft.tinggi_badan && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            TB: <b>{draft.tinggi_badan} cm</b>
                          </span>
                        )}
                        {draft.tekanan_darah && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            TD: <b>{draft.tekanan_darah}</b>
                          </span>
                        )}
                        {draft.umur_bulan && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            Umur: <b>{draft.umur_bulan} bln</b>
                          </span>
                        )}
                        {draft.umur_tahun && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            Umur: <b>{draft.umur_tahun} thn</b>
                          </span>
                        )}
                        {draft.usia_kehamilan_minggu && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            Hamil: <b>{draft.usia_kehamilan_minggu} mgg</b>
                          </span>
                        )}
                        {draft.gula_darah && (
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            Gula: <b>{draft.gula_darah} mg/dL</b>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Universal Notification Modal untuk Draft / Success */}
      <NotificationModal
        isOpen={draftSuccessModal.isOpen}
        type="success"
        title={draftSuccessModal.title || 'Berhasil Tersimpan'}
        message={draftSuccessModal.message}
        onClose={() => setDraftSuccessModal({ ...draftSuccessModal, isOpen: false })}
        confirmText="Oke, Mengerti"
      />

      {/* Universal Notification Modal untuk Error / Validasi Form */}
      <NotificationModal
        isOpen={errorModal.isOpen}
        type="error"
        title={errorModal.title || 'Gagal Menyimpan Data'}
        message={errorModal.message}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        confirmText="Tutup & Perbaiki Form"
      />

      {/* Universal Notification Modal untuk Pesan Sistem */}
      <NotificationModal
        isOpen={Boolean(message.text)}
        type={message.type || 'success'}
        message={message.text}
        onClose={() => setMessage({ type: '', text: '' })}
      />

      {/* STYLES KHUSUS LAYOUT KESEHATAN */}
      <style>{`
        .sasaran-tab-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 1080px) {
          .sasaran-tab-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 580px) {
          .sasaran-tab-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .sasaran-btn {
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
        .sasaran-btn:hover {
          transform: translateY(-1px);
        }
        .kesehatan-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .kesehatan-content-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .draft-item-card {
          padding: 16px 18px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.18s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .draft-item-card:hover {
          border-color: var(--primary-teal, #008080) !important;
          background-color: #f0fdfa !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 128, 128, 0.08);
        }
        .photo-dropzone {
          position: relative;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 28px 16px;
          text-align: center;
          background-color: #f8fafc;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .photo-dropzone:hover {
          border-color: var(--primary-teal, #008080) !important;
          background-color: #f0fdfa !important;
        }
      `}</style>

      {/* 1. HEADER: SEGMENTED TAB BAR SASARAN PEMERIKSAAN */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
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
                justifyContent: 'center'
              }}
            >
              <Activity01Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                Kelompok Sasaran Pemeriksaan
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)', fontWeight: 500, marginTop: '2px' }}>
                Pilih kategori sasaran warga untuk input data fisik, status gizi & riwayat kesehatan
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openDraftModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
              border: '1.5px solid #99f6e4',
              color: 'var(--primary-teal, #008080)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <FolderOpenIcon size={18} color="var(--primary-teal, #008080)" />
            <span>Lihat Draf Tersimpan</span>
          </button>
        </div>

        {/* Direct Grid of Target Buttons */}
        <div className="sasaran-tab-grid">
          {TARGET_GROUPS.map((k) => {
            const isSelected = target === k.id;
            const IconComp = k.icon;
            return (
              <button
                key={k.id}
                type="button"
                className="sasaran-btn"
                onClick={() => {
                  setTarget(k.id);
                  setMessage({ type: '', text: '' });
                }}
                style={{
                  borderColor: isSelected ? k.theme.primary : k.theme.lightBorder,
                  backgroundColor: isSelected ? k.theme.primary : k.theme.lightBg,
                  color: isSelected ? '#ffffff' : k.theme.textColor
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : '#ffffff',
                    color: isSelected ? '#ffffff' : k.theme.primary,
                    border: isSelected ? 'none' : `1px solid ${k.theme.lightBorder}`,
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
                      color: isSelected ? '#ffffff' : k.theme.textColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {k.title}
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      marginTop: '2px',
                      color: isSelected ? 'rgba(255, 255, 255, 0.85)' : 'var(--ink-soft, #64748b)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {k.age}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {message.text && message.type === 'success' && (
        <div
          style={{
            padding: '14px 18px',
            marginBottom: '20px',
            borderRadius: '12px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckmarkCircle01Icon size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* 2. FORM GRID & KALKULATOR */}
      <div className="kesehatan-content-grid">
        {/* KIRI: FORM ISIAN */}
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
          {/* Eyebrow & Headline Form Header */}
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentTargetGroup.theme.primary }}></span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: currentTargetGroup.theme.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Formulir Pemeriksaan Aktif
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                {getTargetTitle()}
              </h3>
            </div>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '10px',
                backgroundColor: currentTargetGroup.theme.lightBg,
                color: currentTargetGroup.theme.textColor,
                border: `1px solid ${currentTargetGroup.theme.lightBorder}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentTargetGroup.theme.primary }}></span>
              {currentTargetGroup.age}
            </span>
          </div>

          {/* FORM BALITA */}
          {target === 'balita' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Pilih Nama Anak</label>
                <select
                  name="anak_id"
                  value={balitaData.anak_id}
                  onChange={handleBalitaChange}
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('balita', 'anak_id').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('balita', 'anak_id').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <option value="">-- Pilih Anak Terdaftar --</option>
                  {daftarAnak.map((a) => (
                    <option key={a.id} value={a.id}>{a.nama_anak} ({a.jenis_kelamin})</option>
                  ))}
                </select>
                {getFieldValidation('balita', 'anak_id').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('balita', 'anak_id').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Umur (Bulan)</label>
                <input
                  type="number"
                  name="umur_bulan"
                  value={balitaData.umur_bulan}
                  onChange={handleBalitaChange}
                  placeholder="Otomatis..."
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }}
                />
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="berat_badan"
                  value={balitaData.berat_badan}
                  onChange={handleBalitaChange}
                  placeholder="mis. 10.5"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('balita', 'berat_badan').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('balita', 'berat_badan').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('balita', 'berat_badan').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('balita', 'berat_badan').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  name="tinggi_badan"
                  value={balitaData.tinggi_badan}
                  onChange={handleBalitaChange}
                  placeholder="mis. 78.5"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('balita', 'tinggi_badan').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('balita', 'tinggi_badan').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('balita', 'tinggi_badan').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('balita', 'tinggi_badan').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Lingkar Kepala (cm)</label>
                <input type="number" step="0.1" name="lingkar_kepala" value={balitaData.lingkar_kepala} onChange={handleBalitaChange} placeholder="mis. 45" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Catatan Perkembangan Anak</label>
                <textarea rows="2" name="catatan_perkembangan" value={balitaData.catatan_perkembangan} onChange={handleBalitaChange} placeholder="Catatan nafsu makan, keaktifan motorik..." style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '10px 12px' }}></textarea>
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>Status Imunisasi Diberikan Hari Ini</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['BCG', 'Polio I', 'Polio II', 'DPT-HB I', 'DPT-HB II', 'Campak', 'Vitamin A'].map(v => {
                    const isSelected = imunisasi.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => toggleImunisasi(v)}
                        style={{
                          minHeight: '36px',
                          border: isSelected ? '1px solid #16a34a' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#16a34a' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#475569',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => handleSubmit('balita', 'draft')}
                  disabled={isLoading}
                  style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, cursor: 'pointer' }}
                >
                  Simpan Draf
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('balita', 'final')}
                  disabled={isLoading}
                  style={{ flex: 1, minHeight: '44px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Data Final'}
                </button>
              </div>
            </div>
          )}

          {/* FORM REMAJA */}
          {target === 'remaja' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Pilih Nama Remaja</label>
                <select
                  name="remaja_id"
                  value={remajaData.remaja_id}
                  onChange={handleRemajaChange}
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('remaja', 'remaja_id').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('remaja', 'remaja_id').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <option value="">-- Pilih Remaja Terdaftar --</option>
                  {daftarRemaja.map((r) => (
                    <option key={r.id} value={r.id}>{r.nama_remaja} ({r.jenis_kelamin})</option>
                  ))}
                  <option value="baru">+ Tambah Remaja Baru...</option>
                </select>
                {getFieldValidation('remaja', 'remaja_id').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('remaja', 'remaja_id').message}</span>
                  </div>
                )}
              </div>

              {remajaData.remaja_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Ketik Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama_remaja_baru"
                      value={remajaData.nama_remaja_baru}
                      onChange={handleRemajaChange}
                      placeholder="mis. Dimas Aditya"
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        borderRadius: '10px',
                        border: getFieldValidation('remaja', 'nama_remaja_baru').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        backgroundColor: getFieldValidation('remaja', 'nama_remaja_baru').isError ? '#fff5f5' : '#ffffff',
                        padding: '0 12px',
                        outline: 'none'
                      }}
                    />
                    {getFieldValidation('remaja', 'nama_remaja_baru').isError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                        <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                        <span>{getFieldValidation('remaja', 'nama_remaja_baru').message}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin_baru"
                      value={remajaData.jenis_kelamin_baru}
                      onChange={handleRemajaChange}
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0 12px',
                        outline: 'none'
                      }}
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Umur (Tahun)</label>
                <input
                  type="number"
                  name="umur_tahun"
                  value={remajaData.umur_tahun}
                  onChange={handleRemajaChange}
                  placeholder="mis. 15"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('remaja', 'umur_tahun').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('remaja', 'umur_tahun').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('remaja', 'umur_tahun').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('remaja', 'umur_tahun').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tekanan Darah (mmHg)</label>
                <input
                  type="text"
                  name="tekanan_darah"
                  value={remajaData.tekanan_darah}
                  onChange={handleRemajaChange}
                  placeholder="mis. 110/70"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('remaja', 'tekanan_darah').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('remaja', 'tekanan_darah').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('remaja', 'tekanan_darah').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('remaja', 'tekanan_darah').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="berat_badan"
                  value={remajaData.berat_badan}
                  onChange={handleRemajaChange}
                  placeholder="mis. 48"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('remaja', 'berat_badan').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('remaja', 'berat_badan').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('remaja', 'berat_badan').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('remaja', 'berat_badan').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input type="number" step="0.1" name="tinggi_badan" value={remajaData.tinggi_badan} onChange={handleRemajaChange} placeholder="mis. 155" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleSubmit('remaja', 'draft')}
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  Simpan Draf
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSubmit('remaja', 'final')}
                  loading={isLoading}
                  loadingText="Menyimpan..."
                  style={{ flex: 1 }}
                >
                  Simpan Data Final
                </Button>
              </div>
            </div>
          )}

          {/* FORM IBU HAMIL */}
          {target === 'hamil' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Nama Ibu Hamil</label>
                <select
                  name="ibu_id"
                  value={hamilData.ibu_id}
                  onChange={handleHamilChange}
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('hamil', 'ibu_id').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('hamil', 'ibu_id').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <option value="">-- Pilih Ibu Hamil Terdaftar --</option>
                  {daftarIbu.map((i) => (
                    <option key={i.id} value={i.id}>{i.nama_lengkap}</option>
                  ))}
                  <option value="baru">+ Tambah Ibu Baru...</option>
                </select>
                {getFieldValidation('hamil', 'ibu_id').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('hamil', 'ibu_id').message}</span>
                  </div>
                )}
              </div>

              {hamilData.ibu_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Ketik Nama Lengkap Ibu Hamil</label>
                    <input
                      type="text"
                      name="nama_ibu_baru"
                      value={hamilData.nama_ibu_baru}
                      onChange={handleHamilChange}
                      placeholder="mis. Siti Aminah"
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        borderRadius: '10px',
                        border: getFieldValidation('hamil', 'nama_ibu_baru').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        backgroundColor: getFieldValidation('hamil', 'nama_ibu_baru').isError ? '#fff5f5' : '#ffffff',
                        padding: '0 12px',
                        outline: 'none'
                      }}
                    />
                    {getFieldValidation('hamil', 'nama_ibu_baru').isError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                        <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                        <span>{getFieldValidation('hamil', 'nama_ibu_baru').message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Usia Kehamilan (Minggu)</label>
                <input
                  type="number"
                  name="usia_kehamilan_minggu"
                  value={hamilData.usia_kehamilan_minggu}
                  onChange={handleHamilChange}
                  placeholder="mis. 24"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('hamil', 'usia_kehamilan_minggu').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('hamil', 'usia_kehamilan_minggu').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('hamil', 'usia_kehamilan_minggu').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('hamil', 'usia_kehamilan_minggu').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tensi Darah (mmHg)</label>
                <input
                  type="text"
                  name="tekanan_darah"
                  value={hamilData.tekanan_darah}
                  onChange={handleHamilChange}
                  placeholder="mis. 110/80"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('hamil', 'tekanan_darah').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('hamil', 'tekanan_darah').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('hamil', 'tekanan_darah').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('hamil', 'tekanan_darah').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="berat_badan"
                  value={hamilData.berat_badan}
                  onChange={handleHamilChange}
                  placeholder="mis. 58"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('hamil', 'berat_badan').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('hamil', 'berat_badan').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('hamil', 'berat_badan').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('hamil', 'berat_badan').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  name="tinggi_badan"
                  value={hamilData.tinggi_badan}
                  onChange={handleHamilChange}
                  placeholder="mis. 158"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('hamil', 'tinggi_badan').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('hamil', 'tinggi_badan').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('hamil', 'tinggi_badan').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('hamil', 'tinggi_badan').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Lingkar Lengan / LILA (cm)</label>
                <input type="number" step="0.1" name="lingkar_lengan" value={hamilData.lingkar_lengan} onChange={handleHamilChange} placeholder="mis. 24.5" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleSubmit('hamil', 'draft')}
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  Simpan Draf
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSubmit('hamil', 'final')}
                  loading={isLoading}
                  loadingText="Menyimpan..."
                  style={{ flex: 1 }}
                >
                  Simpan Data Final
                </Button>
              </div>
            </div>
          )}

          {/* FORM LANSIA */}
          {target === 'lansia' && (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-field full" style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Pilih Nama Orang Tua / Lansia</label>
                <select
                  name="lansia_id"
                  value={lansiaData.lansia_id}
                  onChange={handleLansiaChange}
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('lansia', 'lansia_id').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('lansia', 'lansia_id').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <option value="">-- Pilih Lansia Terdaftar --</option>
                  {daftarLansia.map((l) => (
                    <option key={l.id} value={l.id}>{l.nama_lengkap} ({l.jenis_kelamin})</option>
                  ))}
                  <option value="baru">+ Tambah Lansia Baru...</option>
                </select>
                {getFieldValidation('lansia', 'lansia_id').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('lansia', 'lansia_id').message}</span>
                  </div>
                )}
              </div>

              {lansiaData.lansia_id === 'baru' && (
                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Ketik Nama Lengkap Lansia</label>
                    <input
                      type="text"
                      name="nama_lansia_baru"
                      value={lansiaData.nama_lansia_baru}
                      onChange={handleLansiaChange}
                      placeholder="mis. H. Sulaiman"
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        borderRadius: '10px',
                        border: getFieldValidation('lansia', 'nama_lansia_baru').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        backgroundColor: getFieldValidation('lansia', 'nama_lansia_baru').isError ? '#fff5f5' : '#ffffff',
                        padding: '0 12px',
                        outline: 'none'
                      }}
                    />
                    {getFieldValidation('lansia', 'nama_lansia_baru').isError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                        <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                        <span>{getFieldValidation('lansia', 'nama_lansia_baru').message}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-field">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin_baru"
                      value={lansiaData.jenis_kelamin_baru}
                      onChange={handleLansiaChange}
                      style={{
                        width: '100%',
                        minHeight: '44px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        padding: '0 12px',
                        outline: 'none'
                      }}
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Gula Darah (mg/dL)</label>
                <input
                  type="number"
                  name="gula_darah"
                  value={lansiaData.gula_darah}
                  onChange={handleLansiaChange}
                  placeholder="mis. 110"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('lansia', 'gula_darah').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('lansia', 'gula_darah').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('lansia', 'gula_darah').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('lansia', 'gula_darah').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tekanan Darah (mmHg)</label>
                <input
                  type="text"
                  name="tekanan_darah"
                  value={lansiaData.tekanan_darah}
                  onChange={handleLansiaChange}
                  placeholder="mis. 130/85"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('lansia', 'tekanan_darah').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('lansia', 'tekanan_darah').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('lansia', 'tekanan_darah').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('lansia', 'tekanan_darah').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Berat Badan (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="berat_badan"
                  value={lansiaData.berat_badan}
                  onChange={handleLansiaChange}
                  placeholder="mis. 60"
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    borderRadius: '10px',
                    border: getFieldValidation('lansia', 'berat_badan').isError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                    backgroundColor: getFieldValidation('lansia', 'berat_badan').isError ? '#fff5f5' : '#ffffff',
                    padding: '0 12px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                {getFieldValidation('lansia', 'berat_badan').isError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
                    <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                    <span>{getFieldValidation('lansia', 'berat_badan').message}</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Tinggi Badan (cm)</label>
                <input type="number" step="0.1" name="tinggi_badan" value={lansiaData.tinggi_badan} onChange={handleLansiaChange} placeholder="mis. 160" style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </div>

              <div className="form-field full" style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleSubmit('lansia', 'draft')}
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  Simpan Draf
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSubmit('lansia', 'final')}
                  loading={isLoading}
                  loadingText="Menyimpan..."
                  style={{ flex: 1 }}
                >
                  Simpan Data Final
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* KANAN: KALKULATOR HASIL + MICROCOPY APA ITU IMT + DOKUMENTASI */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Box Kalkulator Otomatis Sesuai Warna Sasaran */}
          <div
            className="card"
            style={{
              padding: '22px',
              borderRadius: '16px',
              backgroundColor: currentTargetGroup.theme.lightBg,
              border: `1.5px solid ${currentTargetGroup.theme.lightBorder}`,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ffffff', color: currentTargetGroup.theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${currentTargetGroup.theme.lightBorder}` }}>
                <Calculator01Icon size={20} />
              </div>
              <h3 style={{ color: currentTargetGroup.theme.textColor, fontSize: '16px', fontWeight: 800, margin: 0 }}>
                {KELOMPOK_CALC[target].title}
              </h3>
            </div>

            <p style={{ fontSize: '12.5px', color: currentTargetGroup.theme.textColor, lineHeight: '1.5', margin: '0 0 14px 0', opacity: 0.95 }}>
              <b>Apa itu IMT?</b> Indeks Massa Tubuh (IMT) adalah rasio perbandingan berat terhadap tinggi badan yang digunakan untuk mendeteksi dini risiko stunting, gizi kurang, atau obesitas.
            </p>

            <div style={{ padding: '18px', background: '#ffffff', borderRadius: '12px', border: `1px solid ${currentTargetGroup.theme.lightBorder}`, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ink-faint, #717783)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                Hasil Penilaian Otomatis
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: currentTargetGroup.theme.primary, marginBottom: '4px' }}>
                {getKalkulatorResult()}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft, #414751)', fontWeight: 600 }}>
                {KELOMPOK_CALC[target].label}
              </div>
            </div>
          </div>

          {/* Box Upload & Preview Dokumentasi Foto (Hanya 1 Foto) */}
          <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdfa', color: 'var(--primary-teal, #008080)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image01Icon size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Dokumentasi Foto Pemeriksaan
                  </h3>
                </div>
              </div>
              {fotoPreview && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckmarkCircle01Icon size={13} /> 1 Foto Dipilih
                </span>
              )}
            </div>

            {/* Hidden Single File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {fotoPreview ? (
              /* PREVIEW SINGLE FOTO */
              <div
                style={{
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#0f172a' }}>
                  <img
                    src={fotoPreview.url}
                    alt={fotoPreview.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {fotoPreview.size}
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={fotoPreview.name}>
                      {fotoPreview.name}
                    </p>
                    <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '2px' }}>
                      Foto dokumentasi kegiatan pemeriksaan
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <RefreshIcon size={14} /> Ganti Foto
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fff1f2',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Delete02Icon size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* DROPZONE AREA JIKA BELUM ADA FOTO */
              <div
                className="photo-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#f0fdfa',
                    color: 'var(--primary-teal, #008080)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    border: '1px solid #ccfbf1'
                  }}
                >
                  <Upload01Icon size={22} />
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                  Ketuk untuk unggah foto dokumentasi
                </p>
                <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Maksimal 1 foto (Format JPG, PNG, WEBP &bull; Maks. 2MB)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}