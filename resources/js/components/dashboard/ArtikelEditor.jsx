import React, { useState, useEffect, useRef, useMemo } from 'react';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import '../../styles/artikel-editor.css';
import {
  ArrowLeft01Icon,
  FloppyDiskIcon,
  CheckmarkCircle01Icon,
  Upload01Icon,
  Delete02Icon,
  Image01Icon,
  Activity01Icon,
  Book02Icon,
  FavouriteIcon,
  File01Icon,
  AlertCircleIcon,
  Cancel01Icon,
  ViewIcon,
  Calendar01Icon,
  Location01Icon,
  SparklesIcon,
  RefreshIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

// Health Education Preset Templates for Village Posyandu
const ARTICLE_TEMPLATES = [
  {
    id: 'mpasi_gizi',
    title: 'Panduan Gizi Balita & Menu MPASI Seimbang Cegah Stunting',
    kategori: 'Nutrisi',
    description: 'Format edukasi gizi balita, menu Isi Piringku, jadwal makan teratur, dan tips mengatasi Gerakan Tutup Mulut (GTM).',
    content: `## Pentingnya Nutrisi 1000 Hari Pertama Kehidupan
Masa 1000 Hari Pertama Kehidupan (HPK) sejak janin dalam kandungan hingga anak berusia 2 tahun merupakan periode emas yang menentukan tumbuh kembang, kecerdasan, dan daya tahan tubuh anak di masa depan.

## Komposisi Menu Seimbang "Isi Piringku" untuk Balita
Untuk mencegah stunting dan kekurangan gizi, pastikan setiap piring makan si kecil mengandung:
- **Karbohidrat**: Nasi pulen, kentang, ubi, atau jagung sebagai sumber energi utama.
- **Protein Hewani**: Telur ayam, ikan kembung/lele, hati ayam, atau daging sapi (wajib diberikan setiap hari).
- **Protein Nabati**: Tempe, tahu, atau kacang-kacangan.
- **Sayur & Buah**: Wortel, bayam, brokoli, pisang, atau pepaya sebagai sumber serat dan vitamin.

> 💡 Tips Kader: Protein hewani seperti telur ayam dan ikan lokal sangat efektif dalam mendukung pertumbuhan tinggi badan balita secara optimal.

## Jadwal & Porsi Pemberian Makan yang Ideal
1. **Sarapan Pagi (07.00 - 08.00)**: Makanan utama bergizi seimbang.
2. **Selingan Pagi (10.00)**: Buah potong segar atau biskuit bergizi.
3. **Makan Siang (12.00 - 13.00)**: Porsi makanan utama lengkap.
4. **Selingan Sore (15.30)**: Kudapan sehat seperti puding susu atau bubur kacang hijau.
5. **Makan Malam (18.30 - 19.30)**: Makanan utama keluarga.

## Tips Menghadapi Anak yang Sedang GTM (Gerakan Tutup Mulut)
- Ciptakan suasana makan yang menyenangkan tanpa paksaan dan hindari gawai (*gadget*).
- Variasikan tekstur, warna, dan cara penyajian makanan agar lebih menarik.
- Batasi durasi makan maksimal 30 menit per sesi.

> ⚠️ Peringatan: Jika berat badan balita tidak mengalami kenaikan selama 2 bulan berturut-turut, segera konsultasikan dengan kader atau bidan desa saat jadwal Posyandu!`
  },
  {
    id: 'jadwal_imunisasi',
    title: 'Jadwal Pelayanan Posyandu & Imunisasi Dasar Lengkap Desa',
    kategori: 'Imunisasi',
    description: 'Format pengumuman jadwal posyandu, daftar imunisasi lengkap, syarat berkas, dan penanganan efek samping ringan.',
    content: `## Jadwal & Lokasi Pelayanan Posyandu Bulan Ini
Posyandu Desa Loa Duri Ulu kembali hadir melayani pemeriksaan kesehatan balita, ibu hamil, dan lansia:
- **Hari / Tanggal**: Sesuai agenda rutin tiap posyandu binaan
- **Waktu Pelayanan**: Pukul 08.30 - 12.00 WITA
- **Tempat**: Balai Posyandu / Balai Pertemuan RT setempat

## Daftar Layanan Kesehatan yang Tersedia
- Penimbangan berat badan dan pengukuran panjang/tinggi badan balita (deteksi dini stunting).
- Pemberian Imunisasi Dasar Lengkap (Hepatitis B, BCG, Polio, DPT-HB-Hib, PCV, Rotavirus, dan MR/Campak).
- Pemberian Vitamin A dosis tinggi dan obat cacing berkala.
- Konsultasi kesehatan ibu hamil dan penyuluhan gizi keluarga.

> 💡 Tips Kader: Bawa Buku KIA (Kesehatan Ibu dan Anak) warna merah muda setiap kali datang ke posyandu untuk pencatatan riwayat kesehatan yang akurat.

## Persiapan Sebelum Membawa Balita ke Posyandu
1. Pastikan anak dalam kondisi sehat, cukup istirahat, dan sudah sarapan.
2. Membawa fotokopi KK/KTP ibu (bagi warga baru).
3. Kenakan pakaian yang longgar dan nyaman pada anak agar mudah saat pemeriksaan.

> ⚠️ Peringatan: Apabila balita mengalami demam ringan setelah imunisasi, berikan kompres hangat di area suntikan dan berikan ASI/cairan lebih banyak sesuai petunjuk bidan desa.`
  },
  {
    id: 'cegah_dbd',
    title: 'Waspada DBD di Musim Hujan: Langkah Gerakan 3M Plus di Lingkungan Rumah',
    kategori: 'Kesehatan',
    description: 'Format edukasi pencegahan penyakit musiman, deteksi dini gejala demam berdarah, dan langkah cepat pertolongan pertama.',
    content: `## Mengapa Kita Perlu Waspada Demam Berdarah (DBD)?
Memasuki musim penghujan, potensi perkembangbiakan nyamuk *Aedes aegypti* pembawa virus Dengue meningkat pesat. Penyakit DBD dapat menyerang siapa saja, terutama anak-anak dan lansia yang memiliki imunitas lebih rentan.

## Tanda & Gejala DBD yang Harus Diwaspadai
- Demam mendadak tinggi yang berlangsung selama 2 hingga 7 hari.
- Nyeri hebat di belakang bola mata, otot sendi, dan kepala.
- Muncul bintik-bintik merah di kulit yang tidak hilang saat ditekan.
- Badan terasa sangat lemas, mual, muntah, dan nafsu makan menurun drastis.

> 💡 Tips Kader: Fase kritis DBD justru terjadi pada hari ke-3 sampai ke-5 saat demam mulai turun. Jangan lengah, tetap pantau asupan cairan si kecil!

## Langkah Nyata Gerakan 3M Plus di Rumah
1. **Menguras**: Bersihkan dan sikat bak mandi, drum air, dan tempat penampungan air minimal 1 kali seminggu.
2. **Menutup**: Tutup rapat semua wadah penyimpanan air bersih agar tidak menjadi sarang bertelur nyamuk.
3. **Mendaur Ulang**: Kubur atau daur ulang barang bekas yang berpotensi menampung air hujan (ban bekas, kaleng, botol plastik).
4. **Plus Tindakan Tambahan**: Gunakan kelambu saat tidur, oleskan losion anti-nyamuk, dan pelihara ikan pemakan jentik di kolam air.

> ⚠️ Peringatan: Jika ditemukan tanda bahaya seperti mimisan, gusi berdarah, nyeri perut hebat, atau muntah terus-menerus, segera bawa ke Puskesmas atau IGD rumah sakit terdekat!`
  },
  {
    id: 'kebugaran_lansia',
    title: 'Panduan Hidup Sehat & Bugar Lansia: Tips Cegah Hipertensi dan Diabetes',
    kategori: 'Kesehatan',
    description: 'Format panduan pola hidup sehat lansia, aktivitas fisik ringan, diet rendah garam/gula, dan pemeriksaan rutin.',
    content: `## Menua dengan Sehat, Aktif, dan Bahagia
Memasuki usia lanjut bukan berarti berhenti produktif. Dengan menjaga pola makan bergizi seimbang dan tetap aktif bergerak, para lansia dapat menikmati hari tua dengan mandiri dan bebas dari komplikasi penyakit degeneratif.

## Pola Makan Sehat untuk Menjaga Tekanan Darah & Gula Darah
- **Batasi Konsumsi Garam (Natrium)**: Maksimal 1 sendok teh garam per hari untuk mencegah lonjakan tekanan darah tinggi (hipertensi).
- **Kurangi Konsumsi Gula & Makanan Manis**: Hindari minuman kemasan berpemanis buatan untuk mengontrol gula darah.
- **Perbanyak Serat & Sayuran Hijau**: Konsumsi labu siam, sayur bayam, kacang panjang, dan buah segar yang mudah dikunyah.
- **Cukupi Kebutuhan Air Putih**: Minum 6-8 gelas air putih sehari secara bertahap untuk menjaga fungsi ginjal.

> 💡 Tips Kader: Senam Lansia bersama yang diadakan di posyandu setiap bulan sangat bermanfaat untuk menjaga kelenturan sendi sekaligus mempererat tali silaturahmi antarwarga.

## Aktivitas Fisik Ringan yang Aman untuk Lansia
1. Jalan kaki santai selama 20-30 menit di pagi hari sambil menikmati sinar matahari pagi.
2. Latihan peregangan ringan dan senam pernapasan.
3. Berkebun ringan di halaman rumah.

> ⚠️ Peringatan: Rutinlah memeriksakan tekanan darah, kadar kolesterol, dan gula darah setiap bulan di Posyandu Lansia Desa Loa Duri Ulu!`
  },
  {
    id: 'hamil_sehat',
    title: 'Panduan Ibu Hamil Sehat: Nutrisi Tepat & Pemantauan Tumbuh Kembang Janin',
    kategori: 'Kehamilan',
    description: 'Format edukasi ibu hamil, konsumsi Tablet Tambah Darah (TTD), asupan asam folat, dan jadwal pemeriksaan USG/bidan.',
    content: `## Menjaga Kesejahteraan Ibu dan Janin Sejak Trimester Pertama
Kesehatan ibu selama masa kehamilan adalah fondasi utama bagi keselamatan persalinan dan pencegahan stunting pada janin sejak dini.

## Kebutuhan Nutrisi Penting Selama Kehamilan
- **Asam Folat & Zat Besi**: Mencegah anemia pada ibu hamil dan mencegah kelainan tabung saraf pada janin. Rutin minum Tablet Tambah Darah (TTD) minimal 90 tablet selama masa kehamilan.
- **Kalsium & Vitamin D**: Mendukung pembentukan tulang dan gigi janin (dapat diperoleh dari susu hamil, ikan teri, tahu, tempe).
- **Protein Tinggi**: Telur rebus, ikan segar, ayam, dan daging tanpa lemak untuk perkembangan otak janin.

> 💡 Tips Kader: Minumlah Tablet Tambah Darah (TTD) pada malam hari sebelum tidur dengan air putih atau air jeruk agar tidak terasa mual dan penyerapan zat besi lebih optimal.

## Jadwal Pemeriksaan Kehamilan (ANC) yang Direkomendasikan
1. **Trimester 1 (0 - 12 minggu)**: Minimal 1 kali pemeriksaan dokter/bidan termasuk pemeriksaan USG awal.
2. **Trimester 2 (13 - 28 minggu)**: Minimal 2 kali pemeriksaan berkala.
3. **Trimester 3 (29 - 40 minggu)**: Minimal 3 kali pemeriksaan untuk persiapan persalinan yang aman.

> ⚠️ Peringatan: Waspadai tanda bahaya kehamilan seperti perdarahan jalan lahir, bengkak pada wajah dan tangan, pusing hebat, atau gerakan janin berkurang drastis!`
  }
];

export default function ArtikelEditor({
  editingArticle,
  currentUser,
  posyanduList = [],
  categories = [],
  onSave,
  onCancel,
  isSaving = false
}) {
  // Main form states
  const [formData, setFormData] = useState({
    judul: editingArticle?.judul || '',
    kategori: editingArticle?.kategori || 'Kesehatan',
    isi_artikel: editingArticle?.isi_artikel || '',
    posyandu_id: editingArticle?.posyandu_id || editingArticle?.posyandu?.id || currentUser?.posyandu_id || '',
    foto: null
  });

  const [fotoPreview, setFotoPreview] = useState(
    editingArticle?.path_foto
      ? {
          url: editingArticle.path_foto.startsWith('http')
            ? editingArticle.path_foto
            : `/storage/${editingArticle.path_foto}`,
          isExisting: true
        }
      : null
  );

  // Editor mode tab: 'edit' | 'preview' | 'seo'
  const [activeTab, setActiveTab] = useState('edit');

  // Modals & UI states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', title: '', details: null });

  // Autosave and dirty tracking
  const [isDirty, setIsDirty] = useState(false);
  const [autosaveText, setAutosaveText] = useState('Draf lokal siap');
  const [recoveredNotice, setRecoveredNotice] = useState(null);

  const fileInputRef = useRef(null);
  const judulInputRef = useRef(null);
  const textareaRef = useRef(null);
  const initialValuesRef = useRef({
    judul: editingArticle?.judul || '',
    kategori: editingArticle?.kategori || 'Kesehatan',
    isi_artikel: editingArticle?.isi_artikel || '',
    posyandu_id: editingArticle?.posyandu_id || editingArticle?.posyandu?.id || currentUser?.posyandu_id || ''
  });

  const autosaveKey = useMemo(() => {
    return `posyandu_art_draft_${editingArticle?.id ? editingArticle.id : 'new'}`;
  }, [editingArticle]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (fotoPreview?.url && !fotoPreview.isExisting) {
        URL.revokeObjectURL(fotoPreview.url);
      }
    };
  }, [fotoPreview]);

  // Check autosave on initial mount
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(autosaveKey);
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        if (parsed && parsed.savedAt && (parsed.judul || parsed.isi_artikel)) {
          // If editing existing and content differs or is newer
          if (!editingArticle || parsed.isi_artikel !== editingArticle.isi_artikel || parsed.judul !== editingArticle.judul) {
            setRecoveredNotice({
              savedAt: new Date(parsed.savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              data: parsed
            });
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca draf lokal:', e);
    }
  }, [autosaveKey, editingArticle]);

  // Debounced autosave
  useEffect(() => {
    const hasChanged =
      formData.judul !== initialValuesRef.current.judul ||
      formData.isi_artikel !== initialValuesRef.current.isi_artikel ||
      formData.kategori !== initialValuesRef.current.kategori ||
      formData.posyandu_id !== initialValuesRef.current.posyandu_id;

    setIsDirty(hasChanged);

    if (!hasChanged) return;

    const timer = setTimeout(() => {
      try {
        const payload = {
          judul: formData.judul,
          kategori: formData.kategori,
          isi_artikel: formData.isi_artikel,
          posyandu_id: formData.posyandu_id,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(autosaveKey, JSON.stringify(payload));
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setAutosaveText(`Tersimpan otomatis pk ${timeStr}`);
      } catch (e) {
        console.warn('Gagal menyimpan draf otomatis:', e);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [formData, autosaveKey]);

  // Keyboard Shortcuts (Ctrl+S / Cmd+S to Save Draft, Ctrl+Shift+S to Publish)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          triggerSave('dipublikasikan');
        } else {
          triggerSave('draf');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b' && activeTab === 'edit') {
        e.preventDefault();
        applyFormat('bold');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i' && activeTab === 'edit') {
        e.preventDefault();
        applyFormat('italic');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, activeTab]);

  // Restore autosaved draft
  const handleRestoreAutosave = () => {
    if (recoveredNotice?.data) {
      setFormData((prev) => ({
        ...prev,
        judul: recoveredNotice.data.judul || prev.judul,
        kategori: recoveredNotice.data.kategori || prev.kategori,
        isi_artikel: recoveredNotice.data.isi_artikel || prev.isi_artikel,
        posyandu_id: recoveredNotice.data.posyandu_id || prev.posyandu_id
      }));
      setRecoveredNotice(null);
      setMessage({
        type: 'success',
        title: 'Draf Dipulihkan',
        text: 'Draf tulisan dari sesi sebelumnya berhasil dimuat ke editor!'
      });
    }
  };

  const handleDismissAutosave = () => {
    try {
      localStorage.removeItem(autosaveKey);
    } catch (e) {}
    setRecoveredNotice(null);
  };

  // Content Analytics
  const wordCount = useMemo(() => {
    return formData.isi_artikel ? formData.isi_artikel.trim().split(/\s+/).filter(Boolean).length : 0;
  }, [formData.isi_artikel]);

  const charCount = formData.isi_artikel?.length || 0;
  const paragraphCount = useMemo(() => {
    return formData.isi_artikel ? formData.isi_artikel.split(/\n+/).filter(Boolean).length : 0;
  }, [formData.isi_artikel]);

  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  // Completeness & Quality Score (0 to 100%)
  const qualityScore = useMemo(() => {
    let score = 0;
    const titleLen = formData.judul?.trim().length || 0;
    if (titleLen >= 5) score += 20;
    if (titleLen >= 20 && titleLen <= 90) score += 10;

    if (charCount >= 20) score += 20;
    if (wordCount >= 80) score += 20;

    if (fotoPreview) score += 15;
    if (formData.kategori) score += 10;
    if (formData.posyandu_id) score += 5;

    return Math.min(100, score);
  }, [formData, charCount, wordCount, fotoPreview]);

  // Validations
  const isJudulValid = (formData.judul?.trim().length || 0) >= 5;
  const isContentValid = charCount >= 20;
  const isCategorySelected = Boolean(formData.kategori);

  // Category helpers
  const selectedCategoryMeta = useMemo(() => {
    return categories.find((c) => c.id.toLowerCase() === (formData.kategori || '').toLowerCase()) || categories[0] || {
      id: 'Kesehatan',
      label: 'Kesehatan',
      icon: Activity01Icon,
      color: '#0E7C93',
      bg: '#E3F7FB',
      border: '#b3e8f3'
    };
  }, [categories, formData.kategori]);

  const CatIcon = selectedCategoryMeta.icon || Activity01Icon;

  // File Upload Handlers
  const handleFileProcess = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        title: 'Format Gambar Tidak Sesuai',
        text: 'Format file tidak didukung. Mohon unggah gambar berformat JPG, JPEG, PNG, atau WEBP.'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: 'error',
        title: 'Ukuran Gambar Terlalu Besar',
        text: `Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimum 2 MB. Mohon kompres atau pilih gambar lain.`
      });
      return;
    }

    if (fotoPreview?.url && !fotoPreview.isExisting) {
      URL.revokeObjectURL(fotoPreview.url);
    }

    setFormData((prev) => ({ ...prev, foto: file }));
    setFotoPreview({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      isExisting: false
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    if (fotoPreview?.url && !fotoPreview.isExisting) {
      URL.revokeObjectURL(fotoPreview.url);
    }
    setFormData((prev) => ({ ...prev, foto: null }));
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  // Text Formatting Helper
  const applyFormat = (action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const fullText = formData.isi_artikel || '';
    const selected = fullText.substring(start, end);

    let prefix = '';
    let suffix = '';
    let defaultText = '';
    let newCursorPos = start;

    switch (action) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        defaultText = selected || 'teks tebal';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        defaultText = selected || 'teks miring';
        break;
      case 'h2':
        prefix = '\n\n## ';
        suffix = '\n';
        defaultText = selected || 'Judul Bagian Utama';
        break;
      case 'h3':
        prefix = '\n\n### ';
        suffix = '\n';
        defaultText = selected || 'Sub-Topik Bahasan';
        break;
      case 'bullet':
        if (selected) {
          const formatted = selected
            .split('\n')
            .map((line) => (line.startsWith('- ') ? line : `- ${line}`))
            .join('\n');
          const newText = fullText.substring(0, start) + formatted + fullText.substring(end);
          setFormData((prev) => ({ ...prev, isi_artikel: newText }));
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + formatted.length);
          }, 50);
          return;
        } else {
          prefix = '\n- ';
          suffix = '\n';
          defaultText = 'Poin informasi pertama';
        }
        break;
      case 'number':
        if (selected) {
          const formatted = selected
            .split('\n')
            .map((line, idx) => `${idx + 1}. ${line.replace(/^\d+\.\s*/, '')}`)
            .join('\n');
          const newText = fullText.substring(0, start) + formatted + fullText.substring(end);
          setFormData((prev) => ({ ...prev, isi_artikel: newText }));
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + formatted.length);
          }, 50);
          return;
        } else {
          prefix = '\n1. ';
          suffix = '\n';
          defaultText = 'Langkah pertama';
        }
        break;
      case 'tip':
        prefix = '\n> 💡 Tips Kader: ';
        suffix = '\n';
        defaultText = selected || 'Tuliskan pesan kunci atau anjuran praktis untuk warga di sini.';
        break;
      case 'alert':
        prefix = '\n> ⚠️ Peringatan: ';
        suffix = '\n';
        defaultText = selected || 'Tuliskan tanda bahaya atau hal yang harus diwaspadai di sini.';
        break;
      case 'divider':
        prefix = '\n\n---\n\n';
        suffix = '';
        defaultText = '';
        break;
      default:
        return;
    }

    const replacement = `${prefix}${defaultText}${suffix}`;
    const newText = fullText.substring(0, start) + replacement + fullText.substring(end);

    setFormData((prev) => ({ ...prev, isi_artikel: newText }));

    setTimeout(() => {
      textarea.focus();
      if (selected) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + defaultText.length);
      } else {
        const selectStart = start + prefix.length;
        const selectEnd = selectStart + defaultText.length;
        textarea.setSelectionRange(selectStart, selectEnd);
      }
    }, 50);
  };

  // Apply Pre-made Template
  const handleApplyTemplate = (tmpl) => {
    setFormData((prev) => ({
      ...prev,
      judul: tmpl.title,
      kategori: tmpl.kategori,
      isi_artikel: tmpl.content
    }));
    setShowTemplateModal(false);
    setMessage({
      type: 'success',
      title: 'Template Berhasil Digunakan',
      text: `Template "${tmpl.title}" telah dimuat. Anda dapat menyesuaikan isi dan detail sesuai kebutuhan!`
    });
  };

  // Save Trigger
  const triggerSave = (status) => {
    const missing = [];
    if (!formData.judul?.trim()) {
      missing.push('Judul artikel belum diisi');
    } else if (formData.judul.trim().length < 5) {
      missing.push('Judul artikel terlalu pendek (minimal 5 karakter)');
    }

    if (!formData.isi_artikel?.trim()) {
      missing.push('Isi narasi artikel belum diisi');
    } else if (formData.isi_artikel.trim().length < 20) {
      missing.push('Isi narasi artikel terlalu pendek (minimal 20 karakter)');
    }

    if (missing.length > 0) {
      setMessage({
        type: 'error',
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi bagian artikel berikut sebelum menyimpan:',
        details: missing
      });
      return;
    }

    // Call parent onSave and clear autosave key on success
    onSave(formData, status);
    try {
      localStorage.removeItem(autosaveKey);
    } catch (e) {}
  };

  // Handle Cancel with safety check
  const handleCancelSafe = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onCancel();
    }
  };

  // Render Markdown-like HTML in Preview Mode
  const renderFormattedPreview = (rawContent) => {
    if (!rawContent) {
      return (
        <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '40px 0', textAlign: 'center' }}>
          Belum ada isi artikel yang ditulis. Mulai ketik di tab "Editor Konten" untuk melihat pratinjau langsung di sini.
        </div>
      );
    }

    const lines = rawContent.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null; // 'ul' | 'ol'

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ol') {
          elements.push(
            <ol key={`ol-${elements.length}`} style={{ paddingLeft: '22px', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              {currentList.map((item, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${elements.length}`} style={{ paddingLeft: '22px', margin: '0 0 16px 0', lineHeight: '1.8' }}>
              {currentList.map((item, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`}>
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`}>
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Tip Callout
      if (trimmed.startsWith('> 💡') || trimmed.startsWith('> Tips')) {
        flushList();
        const tipText = trimmed.replace(/^>\s*(💡\s*)?(Tips\s*Kader:\s*)?/, '');
        elements.push(
          <div key={`tip-${index}`} className="preview-callout-tip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px', color: '#008080' }}>
              <SparklesIcon size={16} />
              <span>Tips Kader Posyandu:</span>
            </div>
            <div>{tipText}</div>
          </div>
        );
        return;
      }

      // Alert Callout
      if (trimmed.startsWith('> ⚠️') || trimmed.startsWith('> Peringatan')) {
        flushList();
        const alertText = trimmed.replace(/^>\s*(⚠️\s*)?(Peringatan:\s*)?/, '');
        elements.push(
          <div key={`alert-${index}`} className="preview-callout-alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px', color: '#b45309' }}>
              <AlertCircleIcon size={16} />
              <span>Perhatian / Tanda Bahaya:</span>
            </div>
            <div>{alertText}</div>
          </div>
        );
        return;
      }

      // Horizontal Rule
      if (trimmed === '---') {
        flushList();
        elements.push(<hr key={`hr-${index}`} className="preview-hr" />);
        return;
      }

      // Bullet List item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmed.replace(/^[-*]\s+/, ''));
        return;
      }

      // Numbered List item
      if (/^\d+\.\s+/.test(trimmed)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmed.replace(/^\d+\.\s+/, ''));
        return;
      }

      // Empty line
      if (!trimmed) {
        flushList();
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${index}`}>
          {trimmed}
        </p>
      );
    });

    flushList();
    return elements;
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const activePosyanduName = useMemo(() => {
    if (!formData.posyandu_id) return 'Terbuka untuk Umum / Seluruh Desa';
    const found = posyanduList.find((p) => String(p.id) === String(formData.posyandu_id));
    return found ? `Posyandu ${found.nama}` : 'Posyandu Desa';
  }, [formData.posyandu_id, posyanduList]);

  // Generated SEO slug preview
  const generatedSlug = useMemo(() => {
    return (formData.judul || 'judul-artikel')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, [formData.judul]);

  const seoSnippet = useMemo(() => {
    if (!formData.isi_artikel) return 'Baca informasi lengkap dan panduan kesehatan keluarga terkini dari Posyandu Desa Loa Duri Ulu.';
    const plain = formData.isi_artikel.replace(/[#*`_>-]/g, '').replace(/\s+/g, ' ').trim();
    return plain.length > 160 ? plain.substring(0, 157) + '...' : plain;
  }, [formData.isi_artikel]);

  return (
    <div className="editor-wrapper">
      {/* Notification Modal */}
      <NotificationModal
        isOpen={Boolean(message.text || message.title)}
        type={message.type || 'success'}
        title={message.title}
        message={message.text}
        details={message.details}
        onClose={() => setMessage({ type: '', text: '', title: '', details: null })}
      />

      {/* Discard Confirmation Modal */}
      <NotificationModal
        isOpen={showDiscardModal}
        type="confirm"
        title="Batalkan Perubahan?"
        message="Anda memiliki perubahan yang belum disimpan ke server. Yakin ingin meninggalkan halaman edit artikel?"
        confirmText="Ya, Tinggalkan"
        cancelText="Lanjut Mengedit"
        confirmVariant="danger"
        isConfirm
        onConfirm={() => {
          setShowDiscardModal(false);
          onCancel();
        }}
        onClose={() => setShowDiscardModal(false)}
      />

      {/* Local Autosave Recovery Banner */}
      {recoveredNotice && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 20px',
            borderRadius: '14px',
            backgroundColor: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            animation: 'editorFadeIn 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e40af' }}>
            <span style={{ fontSize: '18px' }}>💾</span>
            <div>
              <strong>Ditemukan draf otomatis dari sesi sebelumnya ({recoveredNotice.savedAt}).</strong>
              <span style={{ display: 'block', fontSize: '12px', color: '#3b82f6' }}>
                Apakah Anda ingin memulihkan teks yang sebelumnya belum sempat disimpan?
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary" size="sm" onClick={handleRestoreAutosave}>
              Pulihkan Draf
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDismissAutosave}>
              Abaikan
            </Button>
          </div>
        </div>
      )}

      {/* STICKY TOP ACTION NAVIGATION */}
      <nav className="editor-top-nav" aria-label="Aksi Editor Artikel">
        {/* Left: Back & Mode Indicator */}
        <div className="editor-top-nav-left">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft01Icon}
            onClick={handleCancelSafe}
            disabled={isSaving}
            className="editor-back-btn"
            style={{ fontWeight: 700 }}
          >
            <span className="editor-back-text">Kembali ke Katalog</span>
            <span className="editor-back-text-mobile">Kembali</span>
          </Button>

          <div className="editor-status-badge-wrap">
            <span
              className="editor-mode-badge"
              style={{
                fontSize: '12px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: editingArticle ? '#fff7ed' : '#f0fdf4',
                color: editingArticle ? '#c2410c' : '#15803d',
                border: editingArticle ? '1px solid #fed7aa' : '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {editingArticle ? `✏️ Edit #${editingArticle.id}` : '📝 Menulis Baru'}
            </span>

            <span className="editor-autosave-indicator" style={{ fontSize: '11.5px', color: isDirty ? '#d97706' : '#64748b', fontWeight: 600 }}>
              {isDirty ? '● Ada perubahan' : `✓ ${autosaveText}`}
            </span>
          </div>
        </div>

        {/* Center: Tabs Switcher (Tulis vs Pratinjau vs SEO) */}
        <div className="editor-tab-switcher">
          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <span>✍️</span>
            <span>Editor Konten</span>
          </button>
          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span>👁️</span>
            <span>Pratinjau Publik</span>
          </button>
          <button
            type="button"
            className={`editor-tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <span>🔍</span>
            <span>Pratinjau SEO &amp; Sosmed</span>
          </button>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="editor-top-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={FloppyDiskIcon}
            onClick={() => triggerSave('draf')}
            disabled={isSaving}
            style={{ fontWeight: 700 }}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Draf'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={CheckmarkCircle01Icon}
            onClick={() => triggerSave('dipublikasikan')}
            loading={isSaving}
            loadingText="Memproses..."
            style={{
              fontWeight: 800,
              boxShadow: '0 3px 12px rgba(0, 128, 128, 0.28)'
            }}
          >
            Publikasikan
          </Button>
        </div>
      </nav>

      {/* 2-COLUMN MAIN EDITORIAL WORKSPACE */}
      <div className="editor-main-grid">
        {/* LEFT COLUMN: EDITOR CANVAS / PREVIEW */}
        <main style={{ minWidth: 0 }}>
          {activeTab === 'edit' && (
            <article className="editor-canvas-card">
              {/* Title Section */}
              <div>
                <div className="editor-title-label-row">
                  <label
                    htmlFor="article-title-input"
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      color: 'var(--primary-teal, #008080)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    Judul Artikel / Informasi Edukasi
                  </label>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: isJudulValid ? '#16a34a' : '#94a3b8', whiteSpace: 'nowrap' }}>
                    {formData.judul?.length || 0} karakter {isJudulValid ? '✓' : '(Min. 5)'}
                  </span>
                </div>
                <input
                  id="article-title-input"
                  ref={judulInputRef}
                  type="text"
                  className="editor-title-input"
                  placeholder="Tuliskan judul edukasi kesehatan..."
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                />
              </div>

              {/* Editorial Meta Bar (Matching DetailArtikel style) */}
              <div className="editor-meta-bar">
                {/* Author Avatar & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                      color: 'var(--primary-teal, #008080)',
                      fontWeight: 800,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {(currentUser?.name || 'Kader')[0].toUpperCase()}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                      {currentUser?.name || 'Kader Posyandu'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {activePosyanduName}
                    </span>
                  </div>
                </div>

                {/* Date & Category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b' }}>
                    <Calendar01Icon size={14} />
                    <span>{todayFormatted}</span>
                  </div>

                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: selectedCategoryMeta.bg,
                      color: selectedCategoryMeta.color,
                      border: `1px solid ${selectedCategoryMeta.border}`,
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CatIcon size={12} />
                    {selectedCategoryMeta.label}
                  </span>
                </div>
              </div>

              {/* Featured Image / Sampul Section (Drag & Drop) */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {fotoPreview ? (
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#0f172a',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}
                  >
                    <img
                      src={fotoPreview.url}
                      alt="Sampul Artikel"
                      style={{
                        width: '100%',
                        maxHeight: '380px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        display: 'flex',
                        gap: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        padding: '6px 10px',
                        borderRadius: '10px'
                      }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Upload01Icon}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Ganti Foto
                      </Button>
                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={Delete02Icon}
                        onClick={handleRemovePhoto}
                      >
                        Hapus
                      </Button>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: '11.5px',
                        fontWeight: 600
                      }}
                    >
                      📷 {fotoPreview.isExisting ? 'Foto Sampul Tersimpan' : (fotoPreview.size || 'Foto Baru Siap Unggah')}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`editor-dropzone ${isDraggingOver ? 'dragging-active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        boxShadow: '0 2px 8px rgba(0, 128, 128, 0.12)',
                        color: 'var(--primary-teal, #008080)'
                      }}
                    >
                      <Image01Icon size={24} />
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--primary-teal, #008080)' }}>
                      Tarik &amp; Letakkan Foto Sampul di Sini, atau Klik untuk Memilih
                    </p>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Format JPG, PNG, WEBP (Maksimal 2 MB). Disarankan rasio landscape 16:9 untuk hasil terbaik di web &amp; medsos.
                    </span>
                  </div>
                )}
              </div>

              {/* Formatting Helper Toolbar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label
                    htmlFor="article-textarea-input"
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      color: 'var(--primary-teal, #008080)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    Isi Narasi Edukasi &amp; Informasi Posyandu
                  </label>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: isContentValid ? '#16a34a' : '#94a3b8' }}>
                    {charCount} karakter {isContentValid ? '✓' : '(Min. 20)'}
                  </span>
                </div>

                {/* Toolbar */}
                <div className="editor-toolbar">
                  {/* Group 1: Text Styles */}
                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Teks Tebal (Ctrl+B)"
                      onClick={() => applyFormat('bold')}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Teks Miring (Ctrl+I)"
                      onClick={() => applyFormat('italic')}
                    >
                      <em>I</em>
                    </button>
                  </div>

                  <div className="toolbar-divider" />

                  {/* Group 2: Headings */}
                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Sub-Judul Utama (H2)"
                      onClick={() => applyFormat('h2')}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Sub-Bagian (H3)"
                      onClick={() => applyFormat('h3')}
                    >
                      H3
                    </button>
                  </div>

                  <div className="toolbar-divider" />

                  {/* Group 3: Lists */}
                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Daftar Poin (Bullet)"
                      onClick={() => applyFormat('bullet')}
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Daftar Angka (Numbered)"
                      onClick={() => applyFormat('number')}
                    >
                      1. Step
                    </button>
                  </div>

                  <div className="toolbar-divider" />

                  {/* Group 4: Callouts */}
                  <div className="toolbar-group">
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Sisipkan Kotak Tips Kader"
                      onClick={() => applyFormat('tip')}
                    >
                      💡 Tips
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Sisipkan Kotak Peringatan / Waspada"
                      onClick={() => applyFormat('alert')}
                    >
                      ⚠️ Peringatan
                    </button>
                    <button
                      type="button"
                      className="toolbar-btn"
                      title="Garis Pembatas (Divider)"
                      onClick={() => applyFormat('divider')}
                    >
                      — Garis
                    </button>
                  </div>

                  <div className="toolbar-divider" />

                  {/* Group 5: Templates */}
                  <button
                    type="button"
                    className="toolbar-btn toolbar-btn-template"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <span>📋 Gunakan Template Artikel</span>
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  id="article-textarea-input"
                  ref={textareaRef}
                  className="editor-textarea"
                  rows={18}
                  placeholder={`Tuliskan panduan edukasi kesehatan, informasi gizi keluarga, jadwal imunisasi, atau pengumuman posyandu desa di sini...\n\nAnda dapat menggunakan toolbar di atas untuk menambahkan sub-judul (H2/H3), daftar poin, kotak tips praktis, atau gunakan tombol "Gunakan Template Artikel" untuk memulai dengan cepat!`}
                  value={formData.isi_artikel}
                  onChange={(e) => setFormData({ ...formData, isi_artikel: e.target.value })}
                />

                {/* Textarea Analytics Footer Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    fontSize: '12.5px',
                    color: '#64748b',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>
                      <strong>{wordCount}</strong> kata
                    </span>
                    <span>&bull;</span>
                    <span>
                      <strong>{paragraphCount}</strong> paragraf
                    </span>
                    <span>&bull;</span>
                    <span>
                      ⏱️ <strong>~{readingTimeMin} menit</strong> estimasi baca
                    </span>
                  </div>
                  <div style={{ color: isContentValid ? '#16a34a' : '#ea580c', fontWeight: 600 }}>
                    {isContentValid ? '✓ Konten memenuhi standar' : '⚠ Minimal 20 karakter'}
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* PREVIEW TAB: MATCHING PUBLIC DETAIL VIEW */}
          {activeTab === 'preview' && (
            <article className="editor-canvas-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: selectedCategoryMeta.bg,
                    color: selectedCategoryMeta.color,
                    border: `1px solid ${selectedCategoryMeta.border}`,
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedCategoryMeta.label}
                </span>

                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#008080',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Location01Icon size={14} />
                  {activePosyanduName}
                </span>
              </div>

              {/* Preview Title */}
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, margin: 0 }}>
                {formData.judul || 'Judul Artikel Edukasi Kesehatan'}
              </h1>

              {/* Preview Meta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '13px',
                  color: '#64748b'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                      color: 'var(--primary-teal, #008080)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px'
                    }}
                  >
                    {(currentUser?.name || 'K')[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    {currentUser?.name || 'Kader Posyandu'}
                  </span>
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar01Icon size={14} />
                  <span>{todayFormatted}</span>
                </div>
                <span>•</span>
                <span>⏱️ {readingTimeMin} menit baca</span>
              </div>

              {/* Preview Image */}
              {fotoPreview && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#0f172a', maxHeight: '400px' }}>
                  <img
                    src={fotoPreview.url}
                    alt={formData.judul}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {/* Preview Formatted Content */}
              <div className="preview-article-body">
                {renderFormattedPreview(formData.isi_artikel)}
              </div>
            </article>
          )}

          {/* SEO & SOCIAL MEDIA PREVIEW TAB */}
          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Google Search SERP Card */}
              <div className="editor-canvas-card">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    🔍 Pratinjau di Pencarian Google
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                    Simulasi tampilan artikel Anda ketika ditemukan warga di Google Search pada perangkat HP &amp; Komputer.
                  </p>
                </div>

                <div className="seo-google-box">
                  <div className="seo-google-url">
                    <span style={{ fontSize: '14px' }}>🌐</span>
                    <span>posyandu.desa-loaduriulu.id &rsaquo; artikel &rsaquo; {generatedSlug}</span>
                  </div>
                  <div className="seo-google-title">
                    {formData.judul || 'Judul Edukasi Kesehatan Posyandu Desa'} - Portal Posyandu Desa Loa Duri Ulu
                  </div>
                  <p className="seo-google-desc">
                    {todayFormatted} &mdash; {seoSnippet}
                  </p>
                </div>
              </div>

              {/* WhatsApp & Social Media Card */}
              <div className="editor-canvas-card">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    📱 Pratinjau Bagikan ke WhatsApp &amp; Media Sosial
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                    Tampilan cuplikan saat tautan artikel dibagikan kader ke grup WhatsApp warga RT/Desa.
                  </p>
                </div>

                <div style={{ maxWidth: '440px' }}>
                  <div className="social-card-mockup">
                    {fotoPreview ? (
                      <img src={fotoPreview.url} alt="Cover" className="social-card-img" />
                    ) : (
                      <div
                        style={{
                          height: '140px',
                          backgroundColor: '#0f766e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '14px'
                        }}
                      >
                        Posyandu Desa Loa Duri Ulu
                      </div>
                    )}
                    <div className="social-card-body">
                      <div className="social-card-domain">POSYANDU.DESA-LOADURIULU.ID</div>
                      <div className="social-card-title">{formData.judul || 'Judul Artikel Edukasi'}</div>
                      <p className="social-card-desc">{seoSnippet}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT COLUMN: EDITORIAL CONTROL SIDEBAR */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Widget 1: Status & Publikasi */}
          <div className="editor-sidebar-widget">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                    color: 'var(--primary-teal, #008080)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckmarkCircle01Icon size={18} />
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Status &amp; Publikasi
                </h4>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: editingArticle ? '#fff7ed' : '#f0fdf4',
                  color: editingArticle ? '#c2410c' : '#15803d',
                  border: editingArticle ? '1px solid #fed7aa' : '1px solid #bbf7d0'
                }}
              >
                {editingArticle ? 'Edit Mode' : 'Baru'}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button
                variant="primary"
                size="md"
                icon={CheckmarkCircle01Icon}
                onClick={() => triggerSave('dipublikasikan')}
                loading={isSaving}
                loadingText="Memproses Publikasi..."
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontWeight: 800,
                  boxShadow: '0 3px 12px rgba(0, 128, 128, 0.25)',
                  height: '44px'
                }}
              >
                Publikasikan Sekarang
              </Button>

              <Button
                variant="primary"
                size="md"
                icon={FloppyDiskIcon}
                onClick={() => triggerSave('draf')}
                disabled={isSaving}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontWeight: 700,
                  height: '42px'
                }}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan sebagai Draf'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelSafe}
                disabled={isSaving}
                style={{ width: '100%', justifyContent: 'center', marginTop: '2px' }}
              >
                Batal &amp; Kembali
              </Button>
            </div>
          </div>

          {/* Widget 2: Sasaran Posyandu & Kategori */}
          <div className="editor-sidebar-widget">
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#0f172a',
                margin: '0 0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Book02Icon size={18} color="var(--primary-teal, #008080)" />
              Kategori &amp; Sasaran
            </h4>

            {/* Posyandu Select */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="posyandu-select"
                style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}
              >
                Posyandu Penyelenggara:
              </label>
              <select
                id="posyandu-select"
                value={formData.posyandu_id}
                onChange={(e) => setFormData({ ...formData, posyandu_id: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  padding: '0 12px',
                  backgroundColor: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none'
                }}
              >
                <option value="">-- Umum (Seluruh Desa) --</option>
                {posyanduList.map((p) => (
                  <option key={p.id} value={p.id}>
                    Posyandu {p.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Pills */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Topik Kategori Edukasi:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map((c) => {
                  const isSelected = formData.kategori === c.id;
                  const ItemIcon = c.icon || Activity01Icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, kategori: c.id })}
                      style={{
                        border: isSelected ? `2px solid ${c.color}` : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        fontWeight: isSelected ? 800 : 600,
                        backgroundColor: isSelected ? c.bg : '#f8fafc',
                        color: isSelected ? c.color : '#475569',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <ItemIcon size={13} />
                      <span>{c.label}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Widget 3: Live Quality & Completeness Gauge */}
          <div className="editor-sidebar-widget">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#334155', margin: 0 }}>
                Kesiapan Artikel
              </h4>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: qualityScore >= 80 ? '#15803d' : qualityScore >= 50 ? '#d97706' : '#ea580c'
                }}
              >
                {qualityScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: '#f1f5f9', overflow: 'hidden', marginBottom: '14px' }}>
              <div
                style={{
                  width: `${qualityScore}%`,
                  height: '100%',
                  backgroundColor: qualityScore >= 80 ? '#16a34a' : qualityScore >= 50 ? '#f59e0b' : '#ea580c',
                  transition: 'width 0.3s ease, background-color 0.3s ease'
                }}
              />
            </div>

            {/* Checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isJudulValid ? '#15803d' : '#94a3b8' }}>
                <span>{isJudulValid ? '✓' : '○'}</span>
                <span>Judul artikel jelas ({formData.judul?.length || 0} krt)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isContentValid ? '#15803d' : '#94a3b8' }}>
                <span>{isContentValid ? '✓' : '○'}</span>
                <span>Isi edukasi terstruktur ({wordCount} kata)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isCategorySelected ? '#15803d' : '#94a3b8' }}>
                <span>{isCategorySelected ? '✓' : '○'}</span>
                <span>Kategori: {selectedCategoryMeta.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: fotoPreview ? '#15803d' : '#64748b' }}>
                <span>{fotoPreview ? '✓' : '○'}</span>
                <span>{fotoPreview ? 'Foto sampul terpasang' : 'Foto sampul (opsional)'}</span>
              </div>
            </div>
          </div>

          {/* Widget 4: Quick Health Cadre Tips */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '16px',
              backgroundColor: '#f0fdfa',
              border: '1px solid #ccfbf1',
              fontSize: '12.5px',
              color: '#0f766e',
              lineHeight: '1.55'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '6px', color: '#008080' }}>
              <AlertCircleIcon size={16} />
              <span>Panduan Menulis untuk Kader:</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>Gunakan istilah yang mudah dipahami warga.</li>
              <li>Fokuskan pada tips pencegahan yang dapat dilakukan di rumah.</li>
              <li>Sertakan anjuran berkonsultasi di posyandu terdekat.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* MODAL TEMPLATE EDUKASI SELEKTOR */}
      {showTemplateModal && (
        <div className="template-modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="template-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  📋 Pilih Template Edukasi Kesehatan
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                  Pilih kerangka artikel terstruktur yang disesuaikan dengan program kesehatan Posyandu Desa Loa Duri Ulu:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ARTICLE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="template-item-card"
                  onClick={() => handleApplyTemplate(tmpl)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#e6f3f3',
                        color: '#008080'
                      }}
                    >
                      {tmpl.kategori}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-teal, #008080)' }}>
                      Gunakan Template &rarr;
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {tmpl.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                    {tmpl.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Button variant="secondary" size="sm" onClick={() => setShowTemplateModal(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM STICKY BAR */}
      <div className="editor-bottom-bar">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCancelSafe}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={FloppyDiskIcon}
          onClick={() => triggerSave('draf')}
          disabled={isSaving}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Draf
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={CheckmarkCircle01Icon}
          onClick={() => triggerSave('dipublikasikan')}
          loading={isSaving}
          style={{ flex: 1.5, justifyContent: 'center', fontWeight: 800 }}
        >
          Publikasikan
        </Button>
      </div>
    </div>
  );
}
