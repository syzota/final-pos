import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { Plus, Pencil, Trash, Image, Activity, BookText, Heart, FileText, CheckCircle2, EyeOff } from 'lucide-react';

export default function ArtikelView() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Sesuaikan nama field dengan tabel di database (isi -> isi_artikel)
  const [formData, setFormData] = useState({ judul: '', kategori: 'Kesehatan', isi_artikel: '', foto: null });
  const [isLoading, setIsLoading] = useState(true);

  // Referensi untuk input file tersembunyi
  const fileInputRef = useRef(null);
  const ARTIKEL_ICON = {
    Kesehatan: ['i-activity', 'cyan'],
    Nutrisi: ['i-activity', 'green'],
    Imunisasi: ['i-activity', 'violet'],
    'Kesehatan Mental': ['i-heart', 'magenta'],
    Kehamilan: ['i-heart', 'rose'],
    Pendidikan: ['i-book', 'orange'],
    Sosial: ['i-leaf', 'green'],
    Lainnya: ['i-file', 'magenta']
  };

  // 1. Fungsi Ambil Data dari API
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      // Karena API defaultnya hanya mengambil yang 'dipublikasikan',
      // kita tembak 2 kali (Draf & Publikasi) lalu gabungkan agar tampil semua di Dashboard.
      const [pubRes, drafRes] = await Promise.all([
        axios.get('/api/artikels?status=dipublikasikan', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/artikels?status=draf', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const combined = [...drafRes.data.data, ...pubRes.data.data];
      // Urutkan berdasarkan yang terbaru
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setArticles(combined);
    } catch (error) {
      console.error("Gagal mengambil artikel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // 2. Fungsi Persiapan Edit & Tambah Baru
  const handleEdit = (id) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setEditingId(id);
      setFormData({ judul: article.judul, kategori: article.kategori, isi_artikel: article.isi_artikel, foto: null });
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input file
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({ judul: '', kategori: 'Kesehatan', isi_artikel: '', foto: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] });
    }
  };

  // 3. Fungsi Simpan (Buat Baru & Update)
  const handleSave = async (status) => {
    if (!formData.judul || !formData.isi_artikel) return alert('Judul dan isi artikel wajib diisi.');

    try {
      const token = localStorage.getItem('auth_token');
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('kategori', formData.kategori);
      data.append('isi_artikel', formData.isi_artikel);
      data.append('status', status);
      if (formData.foto) data.append('foto', formData.foto);

      if (editingId) {
        // Blok update tanpa _method: 'PUT'
        await axios.post(`/api/artikels/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Artikel berhasil diperbarui!');
      } else {
        await axios.post('/api/artikels', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert('Artikel baru berhasil disimpan!');
      }

      handleNew();
      fetchArticles(); // Segarkan daftar artikel
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan artikel. Pastikan semua data benar dan gambar tidak melebihi 2MB.");
    }
  };

  // 4. Fungsi Ubah Status Cepat (Draf <-> Publikasi)
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'draf' ? 'dipublikasikan' : 'draf';
      const token = localStorage.getItem('auth_token');

      // Blok ubah status tanpa _method: 'PUT'
      await axios.post(`/api/artikels/${id}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchArticles();
    } catch (error) {
      console.error("Gagal ubah status:", error);
      alert("Gagal mengubah status artikel.");
    }
  };

  // 5. Fungsi Hapus
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini secara permanen?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/artikels/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (editingId === id) handleNew();
        fetchArticles();
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus artikel.");
      }
    }
  };

  return (
    <div className="grid grid-2 articles-main-grid" style={{ gridTemplateColumns: '1.1fr 1fr' }}>

      {/* Kolom Kiri: Daftar Artikel */}
      <div>
        <div className="section-head">
          <h3>Artikel &amp; Berita Posyandu</h3>
          <button className="btn btn-violet btn-sm" onClick={handleNew}>
            <Plus className="me-1" />Tulis Artikel
          </button>
        </div>

        <div className="grid grid-2 articles-list-grid">
          {isLoading ? (
            <p style={{ gridColumn: '1/-1', color: 'var(--ink-soft)' }}>Memuat data artikel...</p>
          ) : articles.length === 0 ? (
            <p style={{ gridColumn: '1/-1', color: 'var(--ink-soft)', fontWeight: 600, fontSize: '12.5px', padding: '8px 2px' }}>Belum ada artikel.</p>
          ) : (
            articles.map(a => {
              const [ico, color] = ARTIKEL_ICON[a.kategori] || ARTIKEL_ICON.Lainnya;
              const IconComponent = a.kategori === 'Kesehatan' ? Activity : a.kategori === 'Pendidikan' ? BookText : a.kategori === 'Sosial' ? Heart : FileText;
              const isDraf = a.status === 'draf';

              return (
                <div key={a.id} className={`article-card ${isDraf ? 'is-draft' : ''} ${editingId === a.id ? 'editing' : ''}`}>
                  <div
                    className="article-thumb"
                    style={{
                      background: `var(--${color}-bg)`,
                      color: `var(--${color}-deep)`,
                      overflow: 'hidden',
                      padding: a.path_foto ? '0' : undefined // Hilangkan padding jika ada gambar
                    }}
                  >
                    {a.path_foto ? (
                      <img
                        src={`/storage/${a.path_foto}`}
                        alt={a.judul}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <i className={`${bsIcon}`} style={{ fontSize: '22px' }}></i>
                    )}
                  </div>
                  <div className="article-body">
                    <span className="article-cat" style={{ color: `var(--${color}-deep)` }}>{a.kategori}</span>
                    <p className="article-title">{a.judul}</p>
                    <div className="article-status-row">
                      <p className="article-meta">{a.penulis?.name || 'Penulis'}</p>
                      <span className={`badge ${isDraf ? 'badge-orange' : 'badge-green'}`}>{isDraf ? 'Draf' : 'Dipublikasikan'}</span>
                    </div>
                  </div>
                  <div className="article-actions">
                    <button onClick={() => handleEdit(a.id)}><Pencil className="me-1" />Edit</button>
                    <button onClick={() => toggleStatus(a.id, a.status)}>
                      {isDraf ? <CheckCircle2 size={16} className="me-1" /> : <EyeOff size={16} className="me-1" />}
                      {isDraf ? 'Publikasikan' : 'Jadikan Draf'}
                    </button>
                    <button className="act-danger" onClick={() => handleDelete(a.id)}><Trash className="me-1" />Hapus</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Kolom Kanan: Form Artikel */}
      <div className="card">
        <div className="section-head"><h3>{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3></div>

        {editingId && (
          <div className="article-form-hint active">
            <Pencil className="me-1" /><span>Mengedit: {formData.judul}</span>
            <button type="button" onClick={handleNew}>Batal, tulis baru</button>
          </div>
        )}

        <div className="form-field" style={{ marginBottom: '12px' }}>
          <label>Judul</label>
          <input value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} placeholder="Judul artikel" />
        </div>

        <div className="form-field" style={{ marginBottom: '12px' }}>
          <label>Kategori</label>
          <select
            value={formData.kategori}
            onChange={(e) =>
              setFormData({
                ...formData,
                kategori: e.target.value
              })
            }
          >
            <option value="Kesehatan">Kesehatan</option>
            <option value="Nutrisi">Nutrisi</option>
            <option value="Imunisasi">Imunisasi</option>
            <option value="Kesehatan Mental">Kesehatan Mental</option>
            <option value="Kehamilan">Kehamilan</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Sosial">Sosial</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="form-field" style={{ marginBottom: '12px' }}>
          <label>Isi Artikel</label>
          <textarea rows="6" value={formData.isi_artikel} onChange={(e) => setFormData({ ...formData, isi_artikel: e.target.value })} placeholder="Tulis isi artikel di sini..."></textarea>
        </div>

        {/* Tombol Unggah Gambar */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          className="upload-box"
          style={{ marginBottom: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', border: '1px dashed #ccc', borderRadius: '6px' }}
          onClick={() => fileInputRef.current.click()}
        >
          <Image className="me-2" />
          <span>
            {formData.foto ? <b>{formData.foto.name}</b> : <span><b>Tambah foto</b> pendukung (opsional)</span>}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleSave('draf')}>
            Simpan Draf
          </button>
          <button className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleSave('dipublikasikan')}>
            Publikasikan
          </button>
        </div>
      </div>
    </div>
  );
}