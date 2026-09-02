import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Activity,
  BookText,
  Heart,
  FileText,
  CheckCircle2,
  EyeOff,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function ArtikelView() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ judul: '', kategori: 'Kesehatan', isi_artikel: '', foto: null });
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      const [pubRes, drafRes] = await Promise.all([
        axios.get('/api/artikels?status=dipublikasikan', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/artikels?status=draf', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const combined = [...(drafRes.data?.data || []), ...(pubRes.data?.data || [])];
      combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setArticles(combined);
    } catch (error) {
      console.error('Gagal mengambil artikel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleEdit = (id) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      setEditingId(id);
      setFormData({ judul: article.judul, kategori: article.kategori, isi_artikel: article.isi_artikel, foto: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleSave = async (status) => {
    if (!formData.judul || !formData.isi_artikel) {
      return alert('Judul dan isi artikel wajib diisi.');
    }

    try {
      const token = localStorage.getItem('auth_token');
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('kategori', formData.kategori);
      data.append('isi_artikel', formData.isi_artikel);
      data.append('status', status);
      if (formData.foto) data.append('foto', formData.foto);

      if (editingId) {
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
      fetchArticles();
    } catch (error) {
      console.error('Gagal menyimpan:', error);
      alert('Gagal menyimpan artikel. Pastikan semua data benar dan gambar tidak melebihi 2MB.');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'draf' ? 'dipublikasikan' : 'draf';
      const token = localStorage.getItem('auth_token');

      await axios.post(`/api/artikels/${id}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchArticles();
    } catch (error) {
      console.error('Gagal ubah status:', error);
      alert('Gagal mengubah status artikel.');
    }
  };

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
        console.error('Gagal menghapus:', error);
        alert('Gagal menghapus artikel.');
      }
    }
  };

  const getCategoryIcon = (kat) => {
    if (kat === 'Kesehatan') return Activity;
    if (kat === 'Pendidikan') return BookText;
    if (kat === 'Sosial') return Heart;
    return FileText;
  };

  return (
    <div style={{ animation: 'fadein 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Kolom Kiri: Daftar Artikel */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Katalog Artikel & Berita
            </h3>
            <button
              type="button"
              onClick={handleNew}
              style={{
                minHeight: '38px',
                padding: '0 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-teal, #008080)',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} /> Tulis Artikel
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isLoading ? (
              <p style={{ color: '#64748b' }}>Memuat data artikel...</p>
            ) : articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                <p style={{ margin: 0, fontWeight: 600 }}>Belum ada artikel ditulis.</p>
              </div>
            ) : (
              articles.map(a => {
                const IconComponent = getCategoryIcon(a.kategori);
                const isDraf = a.status === 'draf';

                return (
                  <article
                    key={a.id}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      border: editingId === a.id ? '2px solid var(--primary-teal, #008080)' : '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Image di Atas */}
                    <div style={{ width: '100%', height: '160px', overflow: 'hidden', backgroundColor: '#f1f5f9', position: 'relative' }}>
                      {a.path_foto ? (
                        <img
                          src={`/storage/${a.path_foto}`}
                          alt={a.judul}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <IconComponent size={36} />
                        </div>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          color: '#008080',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase'
                        }}
                      >
                        {a.kategori}
                      </span>
                    </div>

                    {/* Konten Teks di Bawah */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                        {a.judul}
                      </h4>

                      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {a.isi_artikel}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: 'auto' }}>
                        <span className={`badge ${isDraf ? 'badge-orange' : 'badge-green'}`} style={{ fontSize: '11px' }}>
                          {isDraf ? 'Draf' : 'Dipublikasikan'}
                        </span>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(a.id)}
                            style={{ minHeight: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(a.id, a.status)}
                            style={{ minHeight: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                          >
                            {isDraf ? <CheckCircle2 size={12} color="#16a34a" /> : <EyeOff size={12} color="#ea580c" />}
                            {isDraf ? 'Terbitkan' : 'Draf'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(a.id)}
                            style={{ minHeight: '32px', padding: '0 8px', borderRadius: '6px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Kolom Kanan: Form Editor Artikel */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </h3>
            {editingId && (
              <span style={{ fontSize: '12px', color: '#008080', fontWeight: 600 }}>
                Sedang mengedit naskah artikel
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Judul Artikel</label>
              <input
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="mis. Pentingnya Imunisasi Dasar Lengkap Bagi Balita"
                style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Kategori Topik</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
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

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Isi Naskah Artikel</label>
              <textarea
                rows="7"
                value={formData.isi_artikel}
                onChange={(e) => setFormData({ ...formData, isi_artikel: e.target.value })}
                placeholder="Tulis uraian edukasi kesehatan yang jelas dan bermanfaat bagi warga..."
                style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '12px', fontSize: '13.5px', lineHeight: '1.5' }}
              ></textarea>
            </div>

            {/* Upload Foto */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <ImageIcon size={24} style={{ margin: '0 auto 6px', color: '#008080' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                {formData.foto ? formData.foto.name : 'Ketuk untuk tambah foto sampul (Opsional)'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleSave('draf')}
                style={{ flex: 1, minHeight: '44px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', justifyContent: 'center' }}
              >
                Simpan Draf
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSave('dipublikasikan')}
                style={{ flex: 1, minHeight: '44px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', justifyContent: 'center', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', border: 'none' }}
              >
                Publikasikan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}