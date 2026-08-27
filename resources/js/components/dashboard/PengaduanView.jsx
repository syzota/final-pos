import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PengaduanView() {
  const [tab, setTab] = useState(0);

  // Sub-chip active index states
  const [subTab0, setSubTab0] = useState(0);
  const [subTab1, setSubTab1] = useState(0);
  const [subTab2, setSubTab2] = useState(0);
  const [subTab3, setSubTab3] = useState(0);
  const [subTab4, setSubTab4] = useState(0);

  // === STATE UNTUK API ===
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State Dinamis untuk Formulir Identifikasi (Kiri)
  const [formIden, setFormIden] = useState({});
  const [fotoIden, setFotoIden] = useState(null);

  // State untuk Pengaduan Masyarakat (Kanan)
  const [formPengaduan, setFormPengaduan] = useState({
    nama_pelapor: '', jenis_kelamin: 'L', nik: '', no_hp: '', alamat: '', isi_keluhan: '', lokasi_masalah: ''
  });
  const [lampiranPengaduan, setLampiranPengaduan] = useState(null);

  // === STATE UNTUK REKAP TABEL & MODAL ===
  const [rekapPengaduan, setRekapPengaduan] = useState([]);
  const [rekapFormulir, setRekapFormulir] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);

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

  // =========================================================================
  // FUNGSI SAKTI: VALIDASI INPUT & FILE
  // =========================================================================
  const handleIdenChange = (e) => {
    setFormIden({ ...formIden, [e.target.name]: e.target.value });
  };

  const handlePengaduanChange = (e) => {
    let { name, value } = e.target;

    // PERBAIKAN: Paksa NIK hanya menerima Angka & Maksimal 16 Digit
    if (name === 'nik') {
      value = value.replace(/\D/g, '');
      if (value.length > 16) value = value.substring(0, 16);
    }
    // PERBAIKAN: Paksa No HP hanya menerima Angka & Maksimal 15 Digit
    if (name === 'no_hp') {
      value = value.replace(/\D/g, '');
      if (value.length > 15) value = value.substring(0, 15);
    }

    setFormPengaduan({ ...formPengaduan, [name]: value });
  };

  // PERBAIKAN: Satpam Pengecek File (Cegah format aneh & ukuran terlalu besar)
  const handleFileChange = (e, setFileState) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFileState(null);
      return;
    }

    // Daftar tipe file yang diizinkan
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: `Gagal: File "${file.name}" ditolak! Hanya boleh format JPG, PNG, PDF, DOC, atau DOCX.` });
        e.target.value = ''; // Kosongkan input
        setFileState(null);
        return;
      }
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: `Gagal: Ukuran file "${file.name}" terlalu besar! Maksimal 2MB.` });
        e.target.value = ''; // Kosongkan input
        setFileState(null);
        return;
      }
    }

    setMessage({ type: '', text: '' }); // Bersihkan error jika lulus sensor
    setFileState(files);
  };

  // Reset form saat ganti sub-tab atau tab
  const resetFormIden = () => {
    setFormIden({});
    setFotoIden(null);
    setMessage({ type: '', text: '' });
  };

  // =========================================================================
  // HELPER PENCEGAH LAYAR PUTIH DI MODAL (ANTI-BUG)
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
    let cleanPath = path.replace(/\\/g, '/'); // Perbaikan Windows Path
    if (cleanPath.startsWith('http')) return cleanPath;
    cleanPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
    return `/storage/${cleanPath}`;
  };

  // === MAP NAMA BIDANG & SUB-BIDANG UNTUK BACKEND ===
  const BIDANG_MAP = ['pendidikan', 'pekerjaan_umum', 'perumahan_rakyat', 'trantibumlinmas', 'sosial'];

  const getSubBidangName = () => {
    if (tab === 0) return ['Anak Usia Dini (0-6 th)', 'Perpustakaan / Pojok Baca', 'Literasi Digital Ortu', 'Inventaris APE'][subTab0];
    if (tab === 1) return ['Edukasi Air Bersih & Limbah', 'Identifikasi Embung Air Baku', 'Jaringan Air Perdesaan', 'Sumur Air Tanah', 'Pembangunan Jalan Desa'][subTab1];
    if (tab === 2) return ['Rumah Tidak Layak Huni', 'KIE Lingkungan Bersih & Sehat', 'Pemanfaatan Pekarangan', 'Biopori Rumah Tangga'][subTab2];
    if (tab === 3) return ['Korban Trauma & Psikososial', 'Penyuluhan & Evaluasi Trauma', 'KIE & Simulasi Bencana', 'Insiden Kamtibmas', 'Sosialisasi Pencegahan', 'Patroli Keamanan'][subTab3];
    if (tab === 4) return ['KIE Gender & Inklusi Sosial', 'Pendataan Fakir Miskin', 'Verifikasi Sosial-Ekonomi', 'Penyaluran Bantuan Sosial'][subTab4];
    return 'Lainnya';
  };

  // === SUBMIT FORMULIR IDENTIFIKASI ===
  const submitIdentifikasi = async () => {
    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('bidang', BIDANG_MAP[tab]);
      formData.append('sub_bidang', getSubBidangName());
      formData.append('data_formulir', JSON.stringify(formIden));

      if (fotoIden) {
        for (let i = 0; i < fotoIden.length; i++) formData.append(`dokumentasi_foto[${i}]`, fotoIden[i]);
      }

      const response = await axios.post('/api/formulir-identifikasi', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      resetFormIden();
      // Bersihkan input file secara manual
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');

      setMessage({ type: 'success', text: response.data.pesan });
      fetchRekap();

    } catch (err) {
      const pesanAsli = err.response?.data?.pesan || err.response?.data?.message || err.message;
      setMessage({ type: 'error', text: `Gagal menyimpan formulir: ${pesanAsli}` });
    } finally {
      setIsLoading(false);
    }
  };

  // === SUBMIT PENGADUAN MASYARAKAT ===
  const submitPengaduan = async () => {
    // Validasi Akhir sebelum dikirim ke server
    if (formPengaduan.nik.length !== 16) {
      setMessage({ type: 'error', text: 'Gagal: NIK Pelapor harus tepat 16 digit angka!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true); setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();

      formData.append('bidang', BIDANG_MAP[tab]);
      Object.keys(formPengaduan).forEach(key => {
        formData.append(key, formPengaduan[key]);
      });

      if (lampiranPengaduan) {
        for (let i = 0; i < lampiranPengaduan.length; i++) formData.append(`lampiran[${i}]`, lampiranPengaduan[i]);
      }

      const response = await axios.post('/api/pengaduan-masyarakat', formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      setMessage({ type: 'success', text: response.data.pesan });
      setFormPengaduan({ nama_pelapor: '', jenis_kelamin: 'L', nik: '', no_hp: '', alamat: '', isi_keluhan: '', lokasi_masalah: '' });
      setLampiranPengaduan(null);
      // Bersihkan input file secara manual
      document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');

      fetchRekap();
    } catch (err) {
      const pesanAsli = err.response?.data?.pesan || err.response?.data?.message || err.message;
      setMessage({ type: 'error', text: `Gagal mengirim pengaduan: ${pesanAsli}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bidang Main Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
        <button className={`tab-btn ${tab === 0 ? 'active' : ''}`} onClick={() => { setTab(0); resetFormIden(); }}>
          <i className="bi bi-book-fill me-1"></i>Pendidikan
        </button>
        <button className={`tab-btn ${tab === 1 ? 'active' : ''}`} onClick={() => { setTab(1); resetFormIden(); }}>
          <i className="bi bi-droplet-fill me-1"></i>Pekerjaan Umum
        </button>
        <button className={`tab-btn ${tab === 2 ? 'active' : ''}`} onClick={() => { setTab(2); resetFormIden(); }}>
          <i className="bi bi-house-door-fill me-1"></i>Perumahan Rakyat
        </button>
        <button className={`tab-btn ${tab === 3 ? 'active' : ''}`} onClick={() => { setTab(3); resetFormIden(); }}>
          <i className="bi bi-shield-fill-check me-1"></i>Trantibumlinmas
        </button>
        <button className={`tab-btn ${tab === 4 ? 'active' : ''}`} onClick={() => { setTab(4); resetFormIden(); }}>
          <i className="bi bi-heart-fill me-1"></i>Sosial
        </button>
      </div>

      {message.text && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
          <b>Info Sistem:</b> {message.text}
        </div>
      )}

      {/* ===== 0. PENDIDIKAN ===== */}
      {tab === 0 && (
        <div id="bidang-0">
          <div className="grid grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-book-fill me-2" style={{ color: 'var(--orange-deep)' }}></i>Formulir Identifikasi — Pendidikan</h3>
              </div>
              <div className="tabs" style={{ marginBottom: '16px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
                <div className={`form-chip ${subTab0 === 0 ? 'active' : ''}`} onClick={() => { setSubTab0(0); resetFormIden(); }}>Anak Usia Dini (0–6 th)</div>
                <div className={`form-chip ${subTab0 === 1 ? 'active' : ''}`} onClick={() => { setSubTab0(1); resetFormIden(); }}>Perpustakaan / Pojok Baca</div>
                <div className={`form-chip ${subTab0 === 2 ? 'active' : ''}`} onClick={() => { setSubTab0(2); resetFormIden(); }}>Literasi Digital Ortu</div>
                <div className={`form-chip ${subTab0 === 3 ? 'active' : ''}`} onClick={() => { setSubTab0(3); resetFormIden(); }}>Inventaris APE</div>
              </div>

              {/* LAMPIRAN 1: FORM PENDATAAN ANAK USIA DINI */}
              {subTab0 === 0 && (
                <div className="form-grid">
                  <div className="form-field">
                    <label>Nama Anak</label>
                    <input name="nama_anak" value={formIden.nama_anak || ''} onChange={handleIdenChange} placeholder="Sesuai KK/Pengakuan" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-field">
                      <label>Umur (Tahun)</label>
                      <input type="number" name="umur_tahun" value={formIden.umur_tahun || ''} onChange={handleIdenChange} placeholder="mis. 3" min="0" max="6" />
                    </div>
                    <div className="form-field">
                      <label>Umur (Bulan)</label>
                      <input type="number" name="umur_bulan" value={formIden.umur_bulan || ''} onChange={handleIdenChange} placeholder="mis. 4" min="0" max="11" />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Nama Orang Tua</label>
                    <input name="nama_ortu" value={formIden.nama_ortu || ''} onChange={handleIdenChange} placeholder="Ibu atau Ayah yg hadir" />
                  </div>

                  <div className="form-field">
                    <label>Alamat (RT/RW/Dusun)</label>
                    <input name="alamat" value={formIden.alamat || ''} onChange={handleIdenChange} placeholder="mis. RT 03" />
                  </div>

                  <div className="form-field">
                    <label>Status PAUD</label>
                    <select name="status_paud" value={formIden.status_paud || 'Tidak'} onChange={handleIdenChange}>
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Nama PAUD</label>
                    <input
                      name="nama_paud"
                      value={formIden.nama_paud || ''}
                      onChange={handleIdenChange}
                      placeholder={formIden.status_paud === 'Ya' ? "Tulis nama PAUD" : "Kosongkan (Beri tanda '-')"}
                      disabled={formIden.status_paud !== 'Ya'}
                      style={{ backgroundColor: formIden.status_paud !== 'Ya' ? 'var(--surface-container)' : '#fff' }}
                    />
                  </div>

                  <div className="form-field full">
                    <label>Catatan Perkembangan</label>
                    <textarea rows="2" name="catatan_perkembangan" value={formIden.catatan_perkembangan || ''} onChange={handleIdenChange} placeholder="mis. Sesuai usia, perlu stimulasi bicara, sangat aktif..."></textarea>
                  </div>
                </div>
              )}

              {/* LAMPIRAN 2: IDENTIFIKASI PERPUSTAKAAN / POJOK BACA */}
              {subTab0 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Fasilitas (Perpustakaan/Pojok Baca)</label><input name="nama_fasilitas" value={formIden.nama_fasilitas || ''} onChange={handleIdenChange} placeholder="mis. Perpustakaan Desa Harapan" /></div>
                  <div className="form-field"><label>Ketersediaan Fasilitas</label><select name="ketersediaan" value={formIden.ketersediaan || 'Ada'} onChange={handleIdenChange}><option value="Ada">Ada</option><option value="Tidak">Tidak</option></select></div>
                  <div className="form-field"><label>Jumlah Buku</label><input type="text" name="jumlah_buku" value={formIden.jumlah_buku || ''} onChange={handleIdenChange} placeholder="mis. 120 buku cerita" /></div>
                  <div className="form-field"><label>Kondisi Buku & Fasilitas</label><select name="kondisi" value={formIden.kondisi || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Cukup">Cukup</option><option value="Kurang">Kurang</option></select></div>
                  <div className="form-field"><label>Akses Masyarakat</label><select name="akses" value={formIden.akses || 'Mudah'} onChange={handleIdenChange}><option value="Mudah">Mudah</option><option value="Sulit">Sulit</option></select></div>
                  <div className="form-field full"><label>Petugas Pengelola</label><input name="pengelola" value={formIden.pengelola || ''} onChange={handleIdenChange} placeholder="mis. Kader, PKK Desa, Karang Taruna" /></div>
                  <div className="form-field full"><label>Catatan / Kebutuhan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="mis. Butuh rak baru, perlu update buku cerita anak..."></textarea></div>
                </div>
              )}

              {/* LAMPIRAN 3: LITERASI DIGITAL ORTU */}
              {subTab0 === 2 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Orang Tua</label><input name="nama_ortu" value={formIden.nama_ortu || ''} onChange={handleIdenChange} placeholder="Ibu/Ayah yg hadir" /></div>
                  <div className="form-field"><label>Nama Anak</label><input name="nama_anak" value={formIden.nama_anak || ''} onChange={handleIdenChange} placeholder="Nama anak usia dini" /></div>
                  <div className="form-field"><label>Tingkat Literasi Digital</label><select name="tingkat_literasi" value={formIden.tingkat_literasi || 'Rendah'} onChange={handleIdenChange}><option value="Rendah">Rendah (Belum terbiasa aplikasi)</option><option value="Sedang">Sedang (Bisa WA & aplikasi dasar)</option><option value="Tinggi">Tinggi (Mahir pakai aplikasi edukasi)</option></select></div>
                  <div className="form-field"><label>Fasilitas HP/Gawai</label><select name="fasilitas_hp" value={formIden.fasilitas_hp || 'Ya'} onChange={handleIdenChange}><option value="Ya">Ya (Punya & memadai)</option><option value="Tidak">Tidak (Tidak punya/sering error)</option></select></div>
                  <div className="form-field"><label>Kebutuhan Aplikasi Edukasi</label><input name="kebutuhan_aplikasi" value={formIden.kebutuhan_aplikasi || ''} onChange={handleIdenChange} placeholder="mis. Video edukasi, aplikasi membaca" /></div>
                  <div className="form-field"><label>Materi Pelatihan Diterima</label><input name="materi_pelatihan" value={formIden.materi_pelatihan || ''} onChange={handleIdenChange} placeholder="mis. Cara mengunduh aplikasi" /></div>
                  <div className="form-field full"><label>Catatan Tambahan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="mis. HP memori penuh, hambatan sinyal, dll..."></textarea></div>
                </div>
              )}

              {/* LAMPIRAN 4: INVENTARIS APE */}
              {subTab0 === 3 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Jenis Alat Peraga Edukasi (APE)</label><input name="jenis_ape" value={formIden.jenis_ape || ''} onChange={handleIdenChange} placeholder="mis. Balok susun, Puzzle kayu, Poster" /></div>
                  <div className="form-field"><label>Jumlah Tersedia</label><input name="jumlah" value={formIden.jumlah || ''} onChange={handleIdenChange} placeholder="mis. 5 set, 12 pcs" /></div>
                  <div className="form-field"><label>Kondisi Saat Ini</label><select name="kondisi" value={formIden.kondisi || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Rusak Ringan">Rusak Ringan</option><option value="Rusak Berat">Rusak Berat</option></select></div>
                  <div className="form-field"><label>Prioritas Kebutuhan</label><select name="prioritas" value={formIden.prioritas || 'Sedang'} onChange={handleIdenChange}><option value="Tinggi">Tinggi (Sangat mendesak)</option><option value="Sedang">Sedang</option><option value="Rendah">Rendah</option></select></div>
                  <div className="form-field full"><label>Kebutuhan Tambahan</label><input name="kebutuhan" value={formIden.kebutuhan || ''} onChange={handleIdenChange} placeholder="mis. Butuh 2 set puzzle baru" /></div>
                  <div className="form-field full"><label>Catatan Observasi</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="mis. APE jarang digunakan, kader butuh pelatihan cara pakai..."></textarea></div>
                </div>
              )}

              {/* TAMBAHAN: Upload File untuk Identifikasi */}
              <div className="form-field full" style={{ marginTop: '12px' }}>
                <label>Unggah Dokumentasi Foto / Bukti (Opsional)</label>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setFotoIden)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
              </div>

              <button onClick={submitIdentifikasi} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px' }}>{isLoading ? 'Menyimpan...' : 'Simpan Formulir'}</button>
            </div>

            {/* LAMPIRAN 6: ASPIRASI MASYARAKAT BIDANG PENDIDIKAN */}
            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-chat-right-quote-fill me-2" style={{ color: 'var(--magenta-deep)' }}></i>Aspirasi Masyarakat — Pendidikan</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
                Catat aspirasi, usulan, dan kebutuhan warga terkait pendidikan sesuai format standar desa.
              </p>

            <div className="form-grid">
                <div className="form-field">
                  <label>Tanggal Penyampaian</label>
                  <input type="date" name="tanggal_penyampaian" value={formPengaduan.tanggal_penyampaian || ''} onChange={handlePengaduanChange} />
                </div>
                <div className="form-field">
                  <label>Penerima Aspirasi</label>
                  <input name="penerima_aspirasi" value={formPengaduan.penerima_aspirasi || ''} onChange={handlePengaduanChange} placeholder="mis. Rina (Kader Pendidikan)" />
                </div>

                <div className="form-field">
                  <label>Nama Pengusul</label>
                  <input name="nama_pelapor" value={formPengaduan.nama_pelapor || ''} onChange={handlePengaduanChange} placeholder="mis. Siti Aminah" />
                </div>

                {/* --- 3 KOTAK TAMBAHAN YANG SEBELUMNYA HILANG --- */}
                <div className="form-field">
                  <label>Jenis Kelamin</label>
                  <select name="jenis_kelamin" value={formPengaduan.jenis_kelamin || 'P'} onChange={handlePengaduanChange}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>No. KTP (NIK)</label>
                  <input name="nik" value={formPengaduan.nik || ''} onChange={handlePengaduanChange} placeholder="Wajib 16 digit" />
                  <span className="field-note"><i className="bi bi-lock-fill me-1"></i>Hanya terlihat Kader</span>
                </div>
                <div className="form-field">
                  <label>No. HP (Opsional)</label>
                  <input name="no_hp" value={formPengaduan.no_hp || ''} onChange={handlePengaduanChange} placeholder="08xx-xxxx-xxxx" />
                </div>
                {/* ----------------------------------------------- */}

                <div className="form-field full">
                  <label>Alamat Lengkap</label>
                  <input name="alamat" value={formPengaduan.alamat || ''} onChange={handlePengaduanChange} placeholder="mis. RT 02 / RW 05, Desa Mulawarman" />
                </div>

                <div className="form-field full">
                  <label>Jenis Aspirasi</label>
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
                  <label>Uraian Aspirasi / Masukan</label>
                  <textarea name="isi_keluhan" value={formPengaduan.isi_keluhan || ''} onChange={handlePengaduanChange} rows="3" placeholder="mis. Perlu penambahan buku bacaan PAUD karena jumlah buku di perpustakaan desa sangat terbatas..."></textarea>
                </div>

                <div className="form-field">
                  <label>Urgensi / Tingkat Prioritas</label>
                  <select name="urgensi" value={formPengaduan.urgensi || 'Sedang'} onChange={handlePengaduanChange}>
                    <option value="Tinggi">Tinggi (Harus segera ditangani)</option>
                    <option value="Sedang">Sedang (Penting tapi tidak mendesak)</option>
                    <option value="Rendah">Rendah (Bisa jangka menengah)</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label>Rekomendasi (Kader)</label>
                  <textarea name="rekomendasi" value={formPengaduan.rekomendasi || ''} onChange={handlePengaduanChange} rows="2" placeholder="mis. Diusulkan masuk dalam rencana pengadaan sarana perpustakaan tahun depan..."></textarea>
                </div>

                <div className="form-field full">
                  <label>Unggah Lampiran (Opsional)</label>
                  <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setLampiranPengaduan)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
                </div>
              </div>
              <button onClick={submitPengaduan} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                {isLoading ? 'Mengirim...' : 'Simpan Aspirasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 1. PEKERJAAN UMUM ===== */}
      {tab === 1 && (
        <div id="bidang-1">
          <div className="grid grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-droplet-fill me-2" style={{ color: 'var(--cyan-deep)' }}></i>Formulir Identifikasi — Pekerjaan Umum</h3>
              </div>
              <div className="tabs" style={{ marginBottom: '16px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
                <div className={`form-chip ${subTab1 === 0 ? 'active' : ''}`} onClick={() => { setSubTab1(0); resetFormIden(); }}>Edukasi Air &amp; Limbah</div>
                <div className={`form-chip ${subTab1 === 1 ? 'active' : ''}`} onClick={() => { setSubTab1(1); resetFormIden(); }}>Embung Air Baku</div>
                <div className={`form-chip ${subTab1 === 2 ? 'active' : ''}`} onClick={() => { setSubTab1(2); resetFormIden(); }}>Jaringan Air Perdesaan</div>
                <div className={`form-chip ${subTab1 === 3 ? 'active' : ''}`} onClick={() => { setSubTab1(3); resetFormIden(); }}>Sumur Air Tanah</div>
                <div className={`form-chip ${subTab1 === 4 ? 'active' : ''}`} onClick={() => { setSubTab1(4); resetFormIden(); }}>Pembangunan Jalan Desa</div>
              </div>

              {subTab1 === 0 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader/Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi form" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi / RT</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="mis. RT 04 Dusun Harapan" /></div>
                  <div className="form-field full"><label>Temuan Lapangan – Air Bersih</label><input name="temuan_air" value={formIden.temuan_air || ''} onChange={handleIdenChange} placeholder="mis. Air keruh, sumber (sumur/PDAM), keluhan warga" /></div>
                  <div className="form-field full"><label>Temuan Lapangan – Limbah Domestik</label><input name="temuan_limbah" value={formIden.temuan_limbah || ''} onChange={handleIdenChange} placeholder="mis. Ada/tidak SPAL, limbah dialirkan kemana" /></div>
                  <div className="form-field full"><label>Kebutuhan / Permasalahan</label><textarea rows="2" name="kebutuhan" value={formIden.kebutuhan || ''} onChange={handleIdenChange} placeholder="mis. Tidak ada SPAL, air meluap saat hujan"></textarea></div>
                  <div className="form-field full"><label>Rekomendasi / Langkah Lanjut</label><textarea rows="2" name="rekomendasi" value={formIden.rekomendasi || ''} onChange={handleIdenChange} placeholder="Saran kepada desa atau lintas sektor"></textarea></div>
                </div>
              )}

              {subTab1 === 1 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader/Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi form" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi Embung</label><input name="lokasi_embung" value={formIden.lokasi_embung || ''} onChange={handleIdenChange} placeholder="Nama embung atau titik koordinat" /></div>
                  <div className="form-field full"><label>Kondisi Fisik Embung</label><input name="kondisi_fisik" value={formIden.kondisi_fisik || ''} onChange={handleIdenChange} placeholder="mis. Terawat, rusak, berlumut, pendangkalan, ada sampah" /></div>
                  <div className="form-field full"><label>Permasalahan</label><textarea rows="2" name="permasalahan" value={formIden.permasalahan || ''} onChange={handleIdenChange} placeholder="mis. Banyak sedimen, dinding retak, debit kecil"></textarea></div>
                  <div className="form-field full"><label>Tindakan yang Dibutuhkan</label><textarea rows="2" name="tindakan" value={formIden.tindakan || ''} onChange={handleIdenChange} placeholder="mis. Pembersihan sedimen, perbaikan dinding, pasang pagar"></textarea></div>
                </div>
              )}

              {subTab1 === 2 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader/Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi form" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi / Jalur Pipa</label><input name="lokasi_pipa" value={formIden.lokasi_pipa || ''} onChange={handleIdenChange} placeholder="RT/Dusun atau jalur jaringan yang dicek" /></div>
                  <div className="form-field full"><label>Kerusakan / Permasalahan</label><input name="kerusakan" value={formIden.kerusakan || ''} onChange={handleIdenChange} placeholder="mis. Pipa bocor, pipa pecah, tekanan rendah, tidak mengalir" /></div>
                  <div className="form-field full"><label>Penyebab (Jika Diketahui)</label><input name="penyebab" value={formIden.penyebab || ''} onChange={handleIdenChange} placeholder="mis. Usia pipa, akar pohon, konstruksi" /></div>
                  <div className="form-field full"><label>Rekomendasi</label><textarea rows="2" name="rekomendasi" value={formIden.rekomendasi || ''} onChange={handleIdenChange} placeholder="mis. Perbaikan pipa, penggantian, laporan ke PU desa"></textarea></div>
                </div>
              )}

              {subTab1 === 3 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader/Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi form" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Pemilik / Bangunan</label><input name="pemilik" value={formIden.pemilik || ''} onChange={handleIdenChange} placeholder="Nama keluarga atau lokasi sumur" /></div>
                  <div className="form-field full"><label>Kondisi Sumur</label><input name="kondisi_sumur" value={formIden.kondisi_sumur || ''} onChange={handleIdenChange} placeholder="mis. Dalam, kering, keruh, retak, gangan air rendah, dinding roboh" /></div>
                  <div className="form-field full"><label>Risiko Sanitasi</label><input name="risiko_sanitasi" value={formIden.risiko_sanitasi || ''} onChange={handleIdenChange} placeholder="mis. Dekat kandang, dekat septik tank, lokasi banjir" /></div>
                  <div className="form-field full"><label>Tindakan Rehabilitasi</label><textarea rows="2" name="tindakan" value={formIden.tindakan || ''} onChange={handleIdenChange} placeholder="mis. Pembersihan, pengerukan, perbaikan dinding, peningkatan bibir sumur"></textarea></div>
                </div>
              )}

              {subTab1 === 4 && (
                <div className="form-grid">
                  <div className="form-field"><label>Nama Kader/Petugas</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Pengisi form" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi Ruas Jalan</label><input name="lokasi_jalan" value={formIden.lokasi_jalan || ''} onChange={handleIdenChange} placeholder="RT/Dusun/titik koordinat" /></div>
                  <div className="form-field full"><label>Kondisi Jalan</label><input name="kondisi_jalan" value={formIden.kondisi_jalan || ''} onChange={handleIdenChange} placeholder="mis. Baik, rusak ringan/sedang/berat, berlubang, tergenang, belum pengerasan" /></div>
                  <div className="form-field full"><label>Dampak ke Masyarakat</label><input name="dampak" value={formIden.dampak || ''} onChange={handleIdenChange} placeholder="mis. Sulit dilalui, menghambat akses sekolah/posyandu, membahayakan" /></div>
                  <div className="form-field full"><label>Usulan Tindakan</label><textarea rows="2" name="usulan_tindakan" value={formIden.usulan_tindakan || ''} onChange={handleIdenChange} placeholder="mis. Pengaspalan, pengerasan, perbaikan drainase, pengurugan jalan"></textarea></div>
                </div>
              )}

              {/* TAMBAHAN: Upload File untuk Identifikasi */}
              <div className="form-field full" style={{ marginTop: '12px' }}>
                <label>Unggah Dokumentasi Foto / Bukti (Opsional)</label>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setFotoIden)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
              </div>

              <button onClick={submitIdentifikasi} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px' }}>{isLoading ? 'Menyimpan...' : 'Simpan Formulir'}</button>
            </div>

            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-megaphone-fill me-2" style={{ color: 'var(--magenta-deep)' }}></i>Pengaduan Masyarakat — Pekerjaan Umum</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
                Gunakan formulir ini untuk menampung keluhan masyarakat terkait infrastruktur desa dan sanitasi.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama warga pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field"><label>No. KTP</label><input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit" /><span className="field-note"><i className="bi bi-lock-fill me-1"></i>Hanya terlihat Kader</span></div>
                <div className="form-field"><label>No. HP (Opsional)</label><input name="no_hp" value={formPengaduan.no_hp} onChange={handlePengaduanChange} placeholder="08xx-xxxx-xxxx" /></div>
                <div className="form-field full"><label>Alamat Warga</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat lengkap pelapor" /></div>

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
                <div className="form-field full"><label>Lokasi Masalah/Usulan (Opsional)</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="mis. Jalan Utama RT 05" /></div>

                <div className="form-field full"><label>Persyaratan Kelengkapan Aduan</label>
                  <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setLampiranPengaduan)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
                  <span className="field-note">Unggah Surat/Permohonan RT atau Foto lokasi titik pembangunan sarana prasarana.</span>
                </div>
              </div>
              <button onClick={submitPengaduan} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>{isLoading ? 'Mengirim...' : 'Simpan Pengaduan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 2. PERUMAHAN RAKYAT ===== */}
      {tab === 2 && (
        <div id="bidang-2">
          <div className="grid grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-house-door-fill me-2" style={{ color: 'var(--green-deep)' }}></i>Formulir Identifikasi — Perumahan Rakyat</h3>
              </div>
              <div className="tabs" style={{ marginBottom: '16px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
                <div className={`form-chip ${subTab2 === 0 ? 'active' : ''}`} onClick={() => { setSubTab2(0); resetFormIden(); }}>Rumah Layak Huni (RHLH)</div>
                <div className={`form-chip ${subTab2 === 1 ? 'active' : ''}`} onClick={() => { setSubTab2(1); resetFormIden(); }}>KIE Lingkungan Bersih</div>
                <div className={`form-chip ${subTab2 === 2 ? 'active' : ''}`} onClick={() => { setSubTab2(2); resetFormIden(); }}>Pemanfaatan Pekarangan</div>
                <div className={`form-chip ${subTab2 === 3 ? 'active' : ''}`} onClick={() => { setSubTab2(3); resetFormIden(); }}>Biopori Rumah Tangga</div>
              </div>

              {subTab2 === 0 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kepala Keluarga</label><input name="nama_kk" value={formIden.nama_kk || ''} onChange={handleIdenChange} placeholder="Tulis nama KK sesuai KTP" /></div>
                  <div className="form-field full"><label>Alamat</label><input name="alamat" value={formIden.alamat || ''} onChange={handleIdenChange} placeholder="Tulis dusun/RT/RW" /></div>

                  <div className="form-field"><label>Struktur Atap</label><select name="struktur_atap" value={formIden.struktur_atap || 'Genteng'} onChange={handleIdenChange}><option value="Genteng">Genteng</option><option value="Seng">Seng</option><option value="Atap Bocor">Atap Bocor</option></select></div>
                  <div className="form-field"><label>Struktur Dinding</label><select name="struktur_dinding" value={formIden.struktur_dinding || 'Tembok'} onChange={handleIdenChange}><option value="Papan">Papan</option><option value="Semi Permanen">Semi Permanen</option><option value="Tembok">Tembok</option></select></div>
                  <div className="form-field"><label>Struktur Lantai</label><select name="struktur_lantai" value={formIden.struktur_lantai || 'Keramik'} onChange={handleIdenChange}><option value="Plester/Semen">Plester/Semen</option><option value="Tanah">Tanah</option><option value="Keramik">Keramik</option></select></div>
                  <div className="form-field"><label>Ventilasi</label><select name="ventilasi" value={formIden.ventilasi || 'Cukup'} onChange={handleIdenChange}><option value="Cukup">Cukup</option><option value="Kurang">Kurang</option></select></div>
                  <div className="form-field"><label>Pencahayaan</label><select name="pencahayaan" value={formIden.pencahayaan || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Kurang">Kurang</option></select></div>
                  <div className="form-field"><label>Jamban Sehat</label><select name="jamban_sehat" value={formIden.jamban_sehat || 'Ada'} onChange={handleIdenChange}><option value="Ada">Ada</option><option value="Tidak Ada">Tidak Ada</option></select></div>

                  <div className="form-field full"><label>Kategori Rumah</label><select name="kategori_rumah" value={formIden.kategori_rumah || 'Layak Huni'} onChange={handleIdenChange} style={{ fontWeight: 'bold' }}><option value="Layak Huni">Layak Huni</option><option value="RTLH">RTLH (Rumah Tidak Layak Huni)</option></select></div>
                  <div className="form-field full"><label>Catatan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Masukkan kerusakan khusus..."></textarea></div>
                </div>
              )}

              {subTab2 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Warga</label><input name="nama_warga" value={formIden.nama_warga || ''} onChange={handleIdenChange} placeholder="Isi sesuai daftar hadir" /></div>
                  <div className="form-field"><label>Akses Air Bersih</label><select name="akses_air" value={formIden.akses_air || 'Sumur Bor'} onChange={handleIdenChange}><option value="Sumur Bor">Sumur Bor</option><option value="Jaringan Desa">Jaringan Desa</option><option value="Sungai">Sungai</option></select></div>
                  <div className="form-field"><label>Pengelolaan Sampah</label><select name="pengelolaan_sampah" value={formIden.pengelolaan_sampah || 'Dipilah'} onChange={handleIdenChange}><option value="Dipilah">Dipilah</option><option value="Dibakar">Dibakar</option><option value="Ditimbun">Ditimbun</option></select></div>
                  <div className="form-field full"><label>Kebiasaan Kebersihan</label><input name="kebiasaan_kebersihan" value={formIden.kebiasaan_kebersihan || ''} onChange={handleIdenChange} placeholder="mis. Cuci tangan pakai sabun, dsb." /></div>
                  <div className="form-field full"><label>Catatan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Masukkan kendala (misal saluran mampet)..."></textarea></div>
                </div>
              )}

              {subTab2 === 2 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Warga</label><input name="nama_warga" value={formIden.nama_warga || ''} onChange={handleIdenChange} placeholder="Isi nama lengkap" /></div>
                  <div className="form-field full"><label>Jenis Tanaman</label><input name="jenis_tanaman" value={formIden.jenis_tanaman || ''} onChange={handleIdenChange} placeholder="mis. Kangkung, cabai, sereh, dsb." /></div>
                  <div className="form-field"><label>Teknik</label><select name="teknik" value={formIden.teknik || 'Tanah Langsung'} onChange={handleIdenChange}><option value="Polybag">Polybag</option><option value="Hidroponik">Hidroponik</option><option value="Tanah Langsung">Tanah Langsung</option></select></div>
                  <div className="form-field"><label>Kondisi Pekarangan</label><select name="kondisi_pekarangan" value={formIden.kondisi_pekarangan || 'Luas'} onChange={handleIdenChange}><option value="Sempit">Sempit</option><option value="Luas">Luas</option></select></div>
                  <div className="form-field full"><label>Catatan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="mis. Kebutuhan bibit, pupuk, atau pelatihan..."></textarea></div>
                </div>
              )}

              {subTab2 === 3 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Warga</label><input name="nama_warga" value={formIden.nama_warga || ''} onChange={handleIdenChange} placeholder="Nama warga yang membuat biopori" /></div>
                  <div className="form-field"><label>Jumlah Biopori</label><input type="number" name="jumlah_biopori" value={formIden.jumlah_biopori || ''} onChange={handleIdenChange} placeholder="mis. 1-5 lubang" /></div>
                  <div className="form-field"><label>Lokasi</label><select name="lokasi" value={formIden.lokasi || 'Pekarangan Depan'} onChange={handleIdenChange}><option value="Pekarangan Depan">Pekarangan Depan</option><option value="Pekarangan Belakang">Pekarangan Belakang</option></select></div>
                  <div className="form-field full"><label>Manfaat</label><input name="manfaat" value={formIden.manfaat || ''} onChange={handleIdenChange} placeholder="mis. Penyerapan air, kompos, dll." /></div>
                  <div className="form-field full"><label>Catatan</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="mis. Kendala alat, tanah keras, dsb."></textarea></div>
                </div>
              )}

              {/* TAMBAHAN: Upload File untuk Identifikasi */}
              <div className="form-field full" style={{ marginTop: '12px' }}>
                <label>Unggah Dokumentasi Foto / Bukti (Opsional)</label>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setFotoIden)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
              </div>

              <button onClick={submitIdentifikasi} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px' }}>{isLoading ? 'Menyimpan...' : 'Simpan Formulir'}</button>
            </div>

            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-megaphone-fill me-2" style={{ color: 'var(--magenta-deep)' }}></i>Pengaduan Masyarakat — Perumahan Rakyat</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
                Gunakan formulir ini untuk menampung usulan bantuan rumah, bibit pekarangan, dan keluhan perumahan.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama warga pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field"><label>No. KTP</label><input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit" /><span className="field-note"><i className="bi bi-lock-fill me-1"></i>Hanya terlihat Kader</span></div>
                <div className="form-field"><label>No. HP (Opsional)</label><input name="no_hp" value={formPengaduan.no_hp} onChange={handlePengaduanChange} placeholder="08xx-xxxx-xxxx" /></div>
                <div className="form-field full"><label>Alamat Warga</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat lengkap pelapor" /></div>

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

                <div className="form-field full"><label>Deskripsi Pengaduan / Usulan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan keluhan/kebutuhan bantuan secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Masalah/Usulan (Opsional)</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="mis. RT 03" /></div>

                <div className="form-field full">
                  <label>Persyaratan Kelengkapan Aduan</label>
                  <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setLampiranPengaduan)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
                  <div className="field-note" style={{ marginTop: '8px', lineHeight: '1.4' }}>
                    <b>Mohon lampirkan (Bila Ada):</b><br />
                    - Foto copy KTP & KK<br />
                    - Surat Pernyataan Belum Pernah Menerima Bantuan<br />
                    - Surat Keterangan Penghasilan dari Desa<br />
                    - Foto copy Surat Tanah<br />
                    - Foto Kondisi Rumah (3 sisi)
                  </div>
                </div>
              </div>
              <button onClick={submitPengaduan} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>{isLoading ? 'Mengirim...' : 'Simpan Pengaduan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 3. TRANTIBUMLINMAS ===== */}
      {tab === 3 && (
        <div id="bidang-3">
          <div className="grid grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-shield-fill-check me-2" style={{ color: 'var(--violet-deep)' }}></i>Form Identifikasi & Laporan — Trantibumlinmas</h3>
              </div>
              <div className="tabs" style={{ marginBottom: '16px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
                <div className={`form-chip ${subTab3 === 0 ? 'active' : ''}`} onClick={() => { setSubTab3(0); resetFormIden(); }}>Identifikasi Trauma</div>
                <div className={`form-chip ${subTab3 === 1 ? 'active' : ''}`} onClick={() => { setSubTab3(1); resetFormIden(); }}>Penyuluhan Trauma</div>
                <div className={`form-chip ${subTab3 === 2 ? 'active' : ''}`} onClick={() => { setSubTab3(2); resetFormIden(); }}>KIE & Simulasi Bencana</div>
                <div className={`form-chip ${subTab3 === 3 ? 'active' : ''}`} onClick={() => { setSubTab3(3); resetFormIden(); }}>Insiden Kamtibmas</div>
                <div className={`form-chip ${subTab3 === 4 ? 'active' : ''}`} onClick={() => { setSubTab3(4); resetFormIden(); }}>Sosialisasi Kamtibmas</div>
                <div className={`form-chip ${subTab3 === 5 ? 'active' : ''}`} onClick={() => { setSubTab3(5); resetFormIden(); }}>Patroli Keamanan</div>
              </div>

              {subTab3 === 0 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Korban</label><input name="nama_korban" value={formIden.nama_korban || ''} onChange={handleIdenChange} placeholder="Tulis nama lengkap korban" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', gridColumn: '1 / -1' }}>
                    <div className="form-field"><label>Usia (Tahun)</label><input type="number" name="usia" value={formIden.usia || ''} onChange={handleIdenChange} placeholder="mis. 8" /></div>
                    <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formIden.jenis_kelamin || 'L'} onChange={handleIdenChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                  </div>
                  <div className="form-field full"><label>Alamat / Lokasi Pengungsian</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="mis. Posko SDN 05" /></div>
                  <div className="form-field full"><label>Jenis Paparan Bencana</label><input name="jenis_bencana" value={formIden.jenis_bencana || ''} onChange={handleIdenChange} placeholder="mis. Banjir bandang, gempa" /></div>
                  <div className="form-field full"><label>Gejala Trauma yang Tampak</label><input name="gejala_trauma" value={formIden.gejala_trauma || ''} onChange={handleIdenChange} placeholder="mis. Menangis, sulit tidur, linglung" /></div>
                  <div className="form-field full"><label>Kebutuhan Dukungan Psikososial</label><input name="kebutuhan" value={formIden.kebutuhan || ''} onChange={handleIdenChange} placeholder="mis. Pendampingan ibu-anak, konseling" /></div>
                  <div className="form-field"><label>Kondisi Keluarga</label><input name="kondisi_keluarga" value={formIden.kondisi_keluarga || ''} onChange={handleIdenChange} placeholder="mis. Bersama ibu" /></div>
                  <div className="form-field"><label>Rencana Tindak Lanjut</label><input name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="mis. Observasi 1 minggu" /></div>
                  <div className="form-field full"><label>Petugas Asesmen</label><input name="nama_petugas" value={formIden.nama_petugas || ''} onChange={handleIdenChange} placeholder="Nama kader/petugas" /></div>
                </div>
              )}

              {subTab3 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kegiatan Penyuluhan</label><input name="nama_kegiatan" value={formIden.nama_kegiatan || ''} onChange={handleIdenChange} placeholder="mis. Penyuluhan Pemulihan Trauma Anak" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu</label><input name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} placeholder="mis. 09.00–11.00" /></div>
                  <div className="form-field"><label>Lokasi</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="mis. Balai Desa Mekar Sari" /></div>
                  <div className="form-field"><label>Sasaran Peserta</label><input name="sasaran" value={formIden.sasaran || ''} onChange={handleIdenChange} placeholder="mis. Ibu & Anak" /></div>
                  <div className="form-field full"><label>Materi Penyuluhan</label><textarea rows="2" name="materi" value={formIden.materi || ''} onChange={handleIdenChange} placeholder="mis. Mengenali gejala trauma, teknik relaksasi"></textarea></div>
                  <div className="form-field"><label>Petugas / Fasilitator</label><input name="fasilitator" value={formIden.fasilitator || ''} onChange={handleIdenChange} placeholder="mis. Siti (Kader), Psikolog" /></div>
                  <div className="form-field"><label>Catatan Alat / Logistik</label><input name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="mis. Siapkan tikar & alat gambar" /></div>
                </div>
              )}

              {subTab3 === 2 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kegiatan Kesiapsiagaan</label><input name="nama_kegiatan" value={formIden.nama_kegiatan || ''} onChange={handleIdenChange} placeholder="mis. Simulasi Evakuasi Gempa Bumi" /></div>
                  <div className="form-field"><label>Jenis Kegiatan</label><select name="jenis_kegiatan" value={formIden.jenis_kegiatan || 'Simulasi'} onChange={handleIdenChange}><option value="KIE">KIE (Edukasi)</option><option value="Simulasi">Simulasi</option><option value="Keduanya">Keduanya</option><option value="Lainnya">Lainnya</option></select></div>
                  <div className="form-field"><label>Tanggal Pelaksanaan</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Jumlah Peserta</label><input type="number" name="jumlah_peserta" value={formIden.jumlah_peserta || ''} onChange={handleIdenChange} placeholder="48" /></div>
                  <div className="form-field"><label>Unsur Peserta</label><input name="unsur_peserta" value={formIden.unsur_peserta || ''} onChange={handleIdenChange} placeholder="Masyarakat, Pelajar, Lansia" /></div>
                  <div className="form-field full"><label>Materi / Metode</label><input name="materi" value={formIden.materi || ''} onChange={handleIdenChange} placeholder="mis. Ceramah + Simulasi Lapangan Drop Cover Hold" /></div>
                  <div className="form-field full"><label>Capaian & Respon Peserta</label><textarea rows="2" name="capaian" value={formIden.capaian || ''} onChange={handleIdenChange} placeholder="mis. Antusias, 85% warga memahami jalur evakuasi..."></textarea></div>
                  <div className="form-field full"><label>Hambatan & Tindak Lanjut</label><textarea rows="2" name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="mis. Lansia lambat, perlu relawan pendamping khusus..."></textarea></div>
                </div>
              )}

              {subTab3 === 3 && (
                <div className="form-grid">
                  <div className="form-field"><label>Tanggal Kejadian</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu Kejadian</label><input type="time" name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field full"><label>Lokasi (RT/RW/Area)</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="mis. RT 02 / RW 01" /></div>
                  <div className="form-field full"><label>Jenis Insiden</label><input name="jenis_insiden" value={formIden.jenis_insiden || ''} onChange={handleIdenChange} placeholder="mis. Keributan, Pencurian, Pohon Tumbang" /></div>
                  <div className="form-field full"><label>Kronologi Singkat</label><textarea rows="2" name="kronologi" value={formIden.kronologi || ''} onChange={handleIdenChange} placeholder="Ceritakan urutan kejadian secara objektif..."></textarea></div>
                  <div className="form-field full"><label>Dampak / Korban</label><input name="dampak" value={formIden.dampak || ''} onChange={handleIdenChange} placeholder="mis. Tidak ada korban, kerugian 1 unit motor" /></div>
                  <div className="form-field full"><label>Tindak Lanjut yang Dilakukan</label><textarea rows="2" name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="mis. Mediasi oleh RT, laporan ke Bhabinkamtibmas..."></textarea></div>
                  <div className="form-field full"><label>Petugas / Pelapor</label><input name="petugas" value={formIden.petugas || ''} onChange={handleIdenChange} placeholder="Nama kader / Linmas / Satpol PP" /></div>
                </div>
              )}

              {subTab3 === 4 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Tema Sosialisasi</label><input name="tema" value={formIden.tema || ''} onChange={handleIdenChange} placeholder="mis. Pencegahan Pencurian Motor & Keamanan Rumah" /></div>
                  <div className="form-field"><label>Tanggal</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu</label><input name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} placeholder="mis. 16.00-17.30" /></div>
                  <div className="form-field full"><label>Lokasi / Sasaran</label><input name="lokasi" value={formIden.lokasi || ''} onChange={handleIdenChange} placeholder="mis. Balai RW 02, Sasaran: Remaja & Warga" /></div>
                  <div className="form-field"><label>Metode</label><input name="metode" value={formIden.metode || ''} onChange={handleIdenChange} placeholder="Ceramah / Diskusi" /></div>
                  <div className="form-field"><label>Jumlah Peserta</label><input type="number" name="jumlah_peserta" value={formIden.jumlah_peserta || ''} onChange={handleIdenChange} placeholder="36" /></div>
                  <div className="form-field full"><label>Isu Keamanan yang Teridentifikasi</label><textarea rows="2" name="isu_keamanan" value={formIden.isu_keamanan || ''} onChange={handleIdenChange} placeholder="mis. Area gelap di jalan kecil rawan pencurian..."></textarea></div>
                  <div className="form-field full"><label>Tindak Lanjut Direkomendasikan</label><input name="tindak_lanjut" value={formIden.tindak_lanjut || ''} onChange={handleIdenChange} placeholder="mis. Pemasangan lampu jalan & patroli malam" /></div>
                </div>
              )}

              {subTab3 === 5 && (
                <div className="form-grid">
                  <div className="form-field"><label>Tanggal Patroli</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Waktu</label><input name="waktu" value={formIden.waktu || ''} onChange={handleIdenChange} placeholder="mis. 19.00–22.00 WITA" /></div>
                  <div className="form-field full"><label>Area / Wilayah Patroli</label><input name="wilayah" value={formIden.wilayah || ''} onChange={handleIdenChange} placeholder="mis. RT 03, RT 04, Jalan Melati" /></div>
                  <div className="form-field"><label>Metode Patroli</label><select name="metode" value={formIden.metode || 'Jalan Kaki'} onChange={handleIdenChange}><option value="Jalan Kaki">Jalan Kaki</option><option value="Sepeda Motor">Sepeda Motor</option><option value="Mobil">Mobil</option><option value="Gabungan">Gabungan</option></select></div>
                  <div className="form-field"><label>Petugas Bertugas</label><input name="petugas" value={formIden.petugas || ''} onChange={handleIdenChange} placeholder="mis. Ahmad, Rudi (Linmas)" /></div>
                  <div className="form-field full"><label>Tujuan Patroli / Operasi</label><input name="tujuan" value={formIden.tujuan || ''} onChange={handleIdenChange} placeholder="mis. Monitoring daerah rawan & antisipasi kerumunan" /></div>
                  <div className="form-field full"><label>Temuan Selama Patroli</label><textarea rows="2" name="temuan" value={formIden.temuan || ''} onChange={handleIdenChange} placeholder="mis. Ditemukan rumah pintu tidak terkunci, lampu jalan mati..."></textarea></div>
                  <div className="form-field full"><label>Tindakan & Rekomendasi Lanjut</label><textarea rows="2" name="tindakan" value={formIden.tindakan || ''} onChange={handleIdenChange} placeholder="mis. Imbauan kepada pemilik rumah, usul perbaikan lampu..."></textarea></div>
                </div>
              )}

              {/* TAMBAHAN: Upload File untuk Identifikasi */}
              <div className="form-field full" style={{ marginTop: '12px' }}>
                <label>Unggah Dokumentasi Foto / Bukti (Opsional)</label>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setFotoIden)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
              </div>

              <button onClick={submitIdentifikasi} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px' }}>{isLoading ? 'Menyimpan Laporan...' : 'Simpan Laporan'}</button>
            </div>

            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-chat-right-quote-fill me-2" style={{ color: 'var(--magenta-deep)' }}></i>Pengaduan — Trantibumlinmas</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
                Gunakan form ini untuk mencatat laporan warga terkait gangguan ketertiban umum dan perlindungan masyarakat.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field"><label>No. KTP</label><input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit" /><span className="field-note"><i className="bi bi-lock-fill me-1"></i>Hanya terlihat Kader</span></div>
                <div className="form-field"><label>No. HP (Opsional)</label><input name="no_hp" value={formPengaduan.no_hp} onChange={handlePengaduanChange} placeholder="08xx-xxxx-xxxx" /></div>
                <div className="form-field full"><label>Alamat / RT Warga</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat pelapor" /></div>

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

                <div className="form-field full"><label>Deskripsi Pengaduan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan laporan kejadian / kebutuhan keamanan secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Masalah/Titik Rawan</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="mis. Perempatan Jalan Melati" /></div>

                <div className="form-field full">
                  <label>Persyaratan Kelengkapan Aduan</label>
                  <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setLampiranPengaduan)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
                  <div className="field-note" style={{ marginTop: '8px', lineHeight: '1.4' }}>
                    <b>Mohon lampirkan:</b><br />
                    - Foto copy Kartu Tanda Penduduk (KTP)<br />
                    - Foto copy Kartu Keluarga (KK)<br />
                    - Foto bukti kejadian / lokasi rawan (Bila ada)
                  </div>
                </div>
              </div>
              <button onClick={submitPengaduan} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>{isLoading ? 'Mengirim...' : 'Simpan Pengaduan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 4. SOSIAL ===== */}
      {tab === 4 && (
        <div id="bidang-4">
          <div className="grid grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-heart-fill me-2" style={{ color: 'var(--rose-deep)' }}></i>Form Identifikasi — Sosial</h3>
              </div>
              <div className="tabs" style={{ marginBottom: '16px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
                <div className={`form-chip ${subTab4 === 0 ? 'active' : ''}`} onClick={() => { setSubTab4(0); resetFormIden(); }}>KIE Gender & Inklusi</div>
                <div className={`form-chip ${subTab4 === 1 ? 'active' : ''}`} onClick={() => { setSubTab4(1); resetFormIden(); }}>Pendataan Fakir Miskin</div>
                <div className={`form-chip ${subTab4 === 2 ? 'active' : ''}`} onClick={() => { setSubTab4(2); resetFormIden(); }}>Verifikasi Sosial-Ekonomi</div>
                <div className={`form-chip ${subTab4 === 3 ? 'active' : ''}`} onClick={() => { setSubTab4(3); resetFormIden(); }}>Penyaluran Bantuan Sosial</div>
              </div>

              {subTab4 === 0 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Peserta</label><input name="nama_peserta" value={formIden.nama_peserta || ''} onChange={handleIdenChange} placeholder="Tulis nama lengkap sesuai identitas" /></div>
                  <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formIden.jenis_kelamin || 'P'} onChange={handleIdenChange}><option value="P">Perempuan</option><option value="L">Laki-laki</option></select></div>
                  <div className="form-field"><label>No HP</label><input name="no_hp" value={formIden.no_hp || ''} onChange={handleIdenChange} placeholder="mis. 0812... (Tulis 'Tidak ada' jika tak punya)" /></div>
                  <div className="form-field full"><label>Kelompok Rentan</label><input name="kelompok_rentan" value={formIden.kelompok_rentan || ''} onChange={handleIdenChange} placeholder="mis. Lansia, Disabilitas, Ibu Hamil, Anak, dll (Tulis '-' jika tidak ada)" /></div>
                </div>
              )}

              {subTab4 === 1 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kepala Keluarga</label><input name="nama_kk" value={formIden.nama_kk || ''} onChange={handleIdenChange} placeholder="Tulis sesuai KTP atau identitas resmi" /></div>
                  <div className="form-field full"><label>Alamat Lengkap</label><input name="alamat" value={formIden.alamat || ''} onChange={handleIdenChange} placeholder="Cantumkan RT/RW, Dusun, Desa/Kelurahan" /></div>
                  <div className="form-field"><label>Jumlah Anggota Keluarga</label><input type="number" name="jumlah_anggota" value={formIden.jumlah_anggota || ''} onChange={handleIdenChange} placeholder="Total dalam satu rumah" /></div>
                  <div className="form-field"><label>Status Rumah</label><select name="status_rumah" value={formIden.status_rumah || 'Tidak Layak'} onChange={handleIdenChange}><option value="Layak">Layak</option><option value="Tidak Layak">Tidak Layak</option></select></div>
                  <div className="form-field full"><label>Penghasilan / Bulan</label><input name="penghasilan" value={formIden.penghasilan || ''} onChange={handleIdenChange} placeholder="mis. Rp 800.000 (Tulis 'Tidak Tetap' jika tak menentu)" /></div>
                  <div className="form-field full"><label>Disabilitas</label><input name="disabilitas" value={formIden.disabilitas || ''} onChange={handleIdenChange} placeholder="Tulis jenis disabilitas jika ada (mis. fisik, sensorik). Tulis '-' jika tidak." /></div>
                  <div className="form-field full"><label>Keterangan Tambahan</label><textarea rows="2" name="keterangan" value={formIden.keterangan || ''} onChange={handleIdenChange} placeholder="mis. Ibu sakit kronis, rumah rawan longsor..."></textarea></div>
                </div>
              )}

              {subTab4 === 2 && (
                <div className="form-grid">
                  <div className="form-field"><label>Kondisi Fisik Rumah</label><select name="kondisi_rumah" value={formIden.kondisi_rumah || 'Tidak Layak'} onChange={handleIdenChange}><option value="Layak">Layak</option><option value="Tidak Layak">Tidak Layak</option></select></div>
                  <div className="form-field"><label>Penghasilan</label><select name="penghasilan" value={formIden.penghasilan || 'Tidak Tetap'} onChange={handleIdenChange}><option value="Tetap">Tetap</option><option value="Tidak Tetap">Tidak Tetap</option><option value="Tidak Ada">Tidak Ada</option></select></div>
                  <div className="form-field"><label>Aset Produktif</label><select name="aset_produktif" value={formIden.aset_produktif || 'Tidak Ada'} onChange={handleIdenChange}><option value="Ada">Ada</option><option value="Tidak Ada">Tidak Ada</option></select></div>
                  <div className="form-field"><label>Beban Tanggungan</label><select name="beban_tanggungan" value={formIden.beban_tanggungan || 'Tinggi'} onChange={handleIdenChange}><option value="Rendah">Rendah</option><option value="Sedang">Sedang</option><option value="Tinggi">Tinggi</option></select></div>
                  <div className="form-field"><label>Risiko Khusus</label><select name="risiko_khusus" value={formIden.risiko_khusus || 'Tidak Ada'} onChange={handleIdenChange}><option value="Lansia">Lansia</option><option value="Disabilitas">Disabilitas</option><option value="Penyakit Kronis">Penyakit Kronis</option><option value="Tidak Ada">Tidak Ada</option></select></div>
                  <div className="form-field"><label>Skor Kerentanan (1–5)</label><select name="skor" value={formIden.skor || '3'} onChange={handleIdenChange} style={{ fontWeight: 'bold' }}><option value="1">1 - Sangat Baik</option><option value="2">2 - Cukup Baik</option><option value="3">3 - Rentan Sedang</option><option value="4">4 - Rentan Tinggi</option><option value="5">5 - Sangat Rentan</option></select></div>
                  <div className="form-field full"><label>Catatan Detail</label><textarea rows="2" name="catatan" value={formIden.catatan || ''} onChange={handleIdenChange} placeholder="Penjelasan rinci keadaan rumah, aset, disabilitas..."></textarea></div>
                </div>
              )}

              {subTab4 === 3 && (
                <div className="form-grid">
                  <div className="form-field full"><label>Nama Kegiatan & Lokasi</label><input name="nama_kegiatan" value={formIden.nama_kegiatan || ''} onChange={handleIdenChange} placeholder="mis. Penyaluran BLT di Balai Desa" /></div>
                  <div className="form-field"><label>Tanggal Penyaluran</label><input type="date" name="tanggal" value={formIden.tanggal || ''} onChange={handleIdenChange} /></div>
                  <div className="form-field"><label>Jenis Bantuan</label><input name="jenis_bantuan" value={formIden.jenis_bantuan || ''} onChange={handleIdenChange} placeholder="mis. Sembako, BLT" /></div>
                  <div className="form-field full"><label>Nama Penerima</label><input name="nama_penerima" value={formIden.nama_penerima || ''} onChange={handleIdenChange} placeholder="Sesuai KTP/KK" /></div>
                  <div className="form-field"><label>NIK Penerima</label><input name="nik_penerima" value={formIden.nik_penerima || ''} onChange={handleIdenChange} placeholder="16 digit" /></div>
                  <div className="form-field"><label>Jumlah / Volume</label><input name="jumlah" value={formIden.jumlah || ''} onChange={handleIdenChange} placeholder="mis. 10 kg beras, Rp300.000" /></div>
                  <div className="form-field"><label>Metode Penyaluran</label><select name="metode" value={formIden.metode || 'Langsung'} onChange={handleIdenChange}><option value="Langsung">Langsung</option><option value="Diwakili">Diwakili</option><option value="Titipan">Titipan</option><option value="Pindah Alamat">Pindah Alamat</option></select></div>
                  <div className="form-field"><label>Kondisi Barang</label><select name="kondisi" value={formIden.kondisi || 'Baik'} onChange={handleIdenChange}><option value="Baik">Baik</option><option value="Rusak">Rusak</option><option value="Kurang Lengkap">Kurang Lengkap</option><option value="Tidak Layak">Tidak Layak</option></select></div>
                  <div className="form-field full"><label>Alamat & Keterangan</label><textarea rows="2" name="keterangan" value={formIden.keterangan || ''} onChange={handleIdenChange} placeholder="mis. RT 02. Catatan: penerima tidak hadir..."></textarea></div>
                </div>
              )}

              {/* TAMBAHAN: Upload File untuk Identifikasi */}
              <div className="form-field full" style={{ marginTop: '12px' }}>
                <label>Unggah Dokumentasi Foto / Bukti (Opsional)</label>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setFotoIden)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
              </div>

              <button onClick={submitIdentifikasi} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px' }}>{isLoading ? 'Menyimpan...' : 'Simpan Formulir'}</button>
            </div>

            <div className="card">
              <div className="section-head">
                <h3><i className="bi bi-chat-right-quote-fill me-2" style={{ color: 'var(--magenta-deep)' }}></i>Pengaduan Masyarakat — Sosial</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 500 }}>
                Gunakan form ini untuk mencatat laporan kebutuhan bansos, inklusi, maupun identifikasi fakir miskin.
              </p>

              <div className="form-grid">
                <div className="form-field"><label>Nama Pelapor</label><input name="nama_pelapor" value={formPengaduan.nama_pelapor} onChange={handlePengaduanChange} placeholder="Nama pelapor" /></div>
                <div className="form-field"><label>Jenis Kelamin</label><select name="jenis_kelamin" value={formPengaduan.jenis_kelamin} onChange={handlePengaduanChange}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                <div className="form-field"><label>No. KTP</label><input name="nik" value={formPengaduan.nik} onChange={handlePengaduanChange} placeholder="16 digit" /><span className="field-note"><i className="bi bi-lock-fill me-1"></i>Hanya terlihat Kader</span></div>
                <div className="form-field"><label>No. HP (Opsional)</label><input name="no_hp" value={formPengaduan.no_hp} onChange={handlePengaduanChange} placeholder="08xx-xxxx-xxxx" /></div>
                <div className="form-field full"><label>Alamat / RT Warga</label><input name="alamat" value={formPengaduan.alamat} onChange={handlePengaduanChange} placeholder="Alamat pelapor" /></div>

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

                <div className="form-field full"><label>Deskripsi Pengaduan</label><textarea name="isi_keluhan" value={formPengaduan.isi_keluhan} onChange={handlePengaduanChange} rows="3" placeholder="Uraikan laporan/kebutuhan secara rinci..."></textarea></div>
                <div className="form-field full"><label>Lokasi Masalah/Usulan (Opsional)</label><input name="lokasi_masalah" value={formPengaduan.lokasi_masalah} onChange={handlePengaduanChange} placeholder="mis. RT 04" /></div>

                <div className="form-field full">
                  <label>Persyaratan Kelengkapan Aduan</label>
                  <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setLampiranPengaduan)} style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '6px', width: '100%' }} />
                  <div className="field-note" style={{ marginTop: '8px', lineHeight: '1.4' }}>
                    <b>Mohon lampirkan:</b><br />
                    - Foto copy Kartu Tanda Penduduk (KTP)<br />
                    - Surat Pernyataan dari Pemerintah Desa/Kelurahan Untuk Tindak Lanjut
                  </div>
                </div>
              </div>
              <button onClick={submitPengaduan} disabled={isLoading} className="btn btn-violet" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>{isLoading ? 'Mengirim...' : 'Simpan Pengaduan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TABEL REKAP DINAMIS BAWAH (BERLAKU UNTUK SEMUA BIDANG)
          ========================================================================= */}
      {(() => {
        const bidangSaatIni = BIDANG_MAP[tab];
        const namaBidang = ['Pendidikan', 'Pekerjaan Umum', 'Perumahan Rakyat', 'Trantibumlinmas', 'Sosial'][tab];

        // Filter data dengan aman
        const dataPengaduanFilter = rekapPengaduan?.filter(item => item.bidang === bidangSaatIni) || [];
        const dataFormulirFilter = rekapFormulir?.filter(item => item.bidang === bidangSaatIni) || [];
        const belumSelesai = dataPengaduanFilter.filter(item => item.status !== 'selesai').length;

        return (
          <div className="grid grid-2" style={{ marginTop: '16px' }}>
            {/* --- KIRI: REKAP FORMULIR --- */}
            <div className="card">
              <div className="section-head">
                <h3>Rekap Formulir {namaBidang}</h3>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr><th>Tanggal</th><th>Sub-Bidang</th><th>Aksi</th></tr>
                  </thead>
                  <tbody>
                    {dataFormulirFilter.length > 0 ? (
                      dataFormulirFilter.map((item, idx) => (
                        <tr key={idx}>
                          <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                          <td><span style={{ fontWeight: '600', color: '#333' }}>{item.sub_bidang || '-'}</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => setSelectedForm(item)}>
                              <i className="bi bi-eye me-1"></i>Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada formulir tersimpan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- KANAN: REKAP PENGADUAN --- */}
            <div className="card">
              <div className="section-head">
                <h3>Rekap Pengaduan {namaBidang}</h3>
                {belumSelesai > 0 && <span className="badge badge-orange">{belumSelesai} belum ditindak</span>}
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr><th>Pelapor</th><th>Isi Singkat</th><th>Status</th><th>Aksi</th></tr>
                  </thead>
                  <tbody>
                    {dataPengaduanFilter.length > 0 ? (
                      dataPengaduanFilter.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.nama_pelapor || 'Warga'}</td>
                          <td>{(item.isi_keluhan || '').substring(0, 30)}{(item.isi_keluhan || '').length > 30 ? '...' : ''}</td>
                          <td>
                            <span className={`badge ${item.status === 'menunggu' ? 'badge-rose' : item.status === 'diproses' ? 'badge-orange' : 'badge-green'}`}>
                              {item.status === 'menunggu' ? 'Baru' : item.status === 'diproses' ? 'Diproses' : 'Selesai'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => setSelectedPengaduan(item)}>
                              <i className="bi bi-eye"></i> Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada pengaduan di bidang ini.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================
          MODAL POP-UP DETAIL FORMULIR
          ========================================= */}
      {selectedForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            position: 'relative', backgroundColor: '#fff', borderRadius: '12px', padding: '24px'
          }}>
            <button
              onClick={() => setSelectedForm(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
            >
              &times;
            </button>

            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--violet-deep)' }}>Detail Formulir</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{selectedForm.sub_bidang || '-'}</p>
            </div>

            <table className="table">
              <tbody>
                <tr>
                  <td style={{ width: '40%', color: '#666', fontSize: '13px' }}>Tanggal Kirim</td>
                  <td><b>{new Date(selectedForm.created_at).toLocaleString('id-ID')}</b></td>
                </tr>
                {Object.entries(getSafeObject(selectedForm.data_formulir)).map(([key, value], idx) => (
                  <tr key={idx}>
                    <td style={{ color: '#666', textTransform: 'capitalize', fontSize: '13px' }}>
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
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <div style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}><b>Bukti Dokumentasi:</b></div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {fotoArr.map((file_path, idx) => (
                        <a key={idx} href={getFileUrl(file_path)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                          <i className="bi bi-image me-1"></i>Lihat File {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className="btn btn-violet" onClick={() => setSelectedForm(null)}>Tutup Rincian</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL POP-UP DETAIL PENGADUAN
          ========================================= */}
      {selectedPengaduan && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            position: 'relative', backgroundColor: '#fff', borderRadius: '12px', padding: '24px'
          }}>
            <button
              onClick={() => setSelectedPengaduan(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
            >
              &times;
            </button>

            <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--magenta-deep)' }}>Detail Pengaduan</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'capitalize' }}>Bidang: {(selectedPengaduan.bidang || '').replace(/_/g, ' ')}</p>
            </div>

            <table className="table">
              <tbody>
                <tr>
                  <td style={{ width: '35%', color: '#666', fontSize: '13px' }}>Tanggal Lapor</td>
                  <td><b>{new Date(selectedPengaduan.created_at).toLocaleString('id-ID')}</b></td>
                </tr>
                <tr><td style={{ color: '#666', fontSize: '13px' }}>Nama Pelapor</td><td><b>{selectedPengaduan.nama_pelapor} ({selectedPengaduan.jenis_kelamin})</b></td></tr>
                <tr><td style={{ color: '#666', fontSize: '13px' }}>NIK</td><td><b>{selectedPengaduan.nik}</b></td></tr>
                <tr><td style={{ color: '#666', fontSize: '13px' }}>No. HP</td><td><b>{selectedPengaduan.no_hp || '-'}</b></td></tr>
                <tr><td style={{ color: '#666', fontSize: '13px' }}>Alamat</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.alamat || '-'}</b></td></tr>
                <tr><td style={{ color: '#666', fontSize: '13px' }}>Lokasi Masalah</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.lokasi_masalah || '-'}</b></td></tr>
                <tr><td style={{ color: '#666', fontSize: '13px' }}>Isi Keluhan</td><td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><b>{selectedPengaduan.isi_keluhan}</b></td></tr>
                <tr>
                  <td style={{ color: '#666', fontSize: '13px' }}>Status Saat Ini</td>
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
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <div style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}><b>Bukti Lampiran:</b></div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {lampiranArr.map((file_path, idx) => (
                        <a key={idx} href={getFileUrl(file_path)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                          <i className="bi bi-image me-1"></i>Lihat File {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button className="btn btn-violet" onClick={() => setSelectedPengaduan(null)}>Tutup Rincian</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}