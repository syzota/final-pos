import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  Add01Icon,
  Edit02Icon,
  Delete02Icon,
  Image01Icon,
  Activity01Icon,
  Book02Icon,
  FavouriteIcon,
  File01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Upload01Icon,
  RefreshIcon,
  Cancel01Icon,
  ViewIcon,
  ViewOffSlashIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const CATEGORIES = [
  { id: 'Kesehatan', label: 'Kesehatan', icon: Activity01Icon, color: 'var(--cyan-deep, #0E7C93)', bg: 'var(--cyan-bg, #E3F7FB)', border: '#b3e8f3' },
  { id: 'Pendidikan', label: 'Pendidikan', icon: Book02Icon, color: 'var(--orange-deep, #B5650C)', bg: 'var(--orange-bg, #FFF1DF)', border: '#fedbb0' },
  { id: 'Sosial', label: 'Sosial & Bantuan', icon: FavouriteIcon, color: 'var(--magenta-deep, #93348A)', bg: 'var(--magenta-bg, #FBEAF8)', border: '#f5cbe7' },
  { id: 'Posyandu', label: 'Info Posyandu', icon: File01Icon, color: 'var(--green-deep, #2E7D46)', bg: 'var(--green-bg, #E7F7EC)', border: '#c3ecd0' },
];

export default function ArtikelView() {
  const [articles, setArticles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ judul: '', kategori: 'Kesehatan', isi_artikel: '', foto: null });
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fotoPreview?.url) URL.revokeObjectURL(fotoPreview.url);
    };
  }, [fotoPreview]);

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
      setFormData({
        judul: article.judul || '',
        kategori: article.kategori || 'Kesehatan',
        isi_artikel: article.isi_artikel || '',
        foto: null
      });
      if (fotoPreview?.url) URL.revokeObjectURL(fotoPreview.url);
      setFotoPreview(article.path_foto ? { url: `/storage/${article.path_foto}`, isExisting: true } : null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage({ type: '', text: '' });
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({ judul: '', kategori: 'Kesehatan', isi_artikel: '', foto: null });
    if (fotoPreview?.url && !fotoPreview.isExisting) URL.revokeObjectURL(fotoPreview.url);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setMessage({ type: '', text: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Format file tidak didukung. Mohon unggah gambar (JPG, PNG, WEBP).' });
      return;
    }

    if (fotoPreview?.url && !fotoPreview.isExisting) URL.revokeObjectURL(fotoPreview.url);

    setFormData({ ...formData, foto: file });
    setFotoPreview({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      isExisting: false
    });
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    if (fotoPreview?.url && !fotoPreview.isExisting) URL.revokeObjectURL(fotoPreview.url);
    setFormData({ ...formData, foto: null });
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (status) => {
    if (!formData.judul || !formData.isi_artikel) {
      setMessage({ type: 'error', text: 'Judul dan isi artikel wajib diisi lengkap.' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

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
        setMessage({ type: 'success', text: `Artikel berhasil diperbarui (${status === 'dipublikasikan' ? 'Dipublikasikan' : 'Draf'})!` });
      } else {
        await axios.post('/api/artikels', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: `Artikel baru berhasil dibuat (${status === 'dipublikasikan' ? 'Dipublikasikan' : 'Draf'})!` });
      }

      handleNew();
      fetchArticles();
    } catch (error) {
      console.error('Gagal menyimpan:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan artikel. Pastikan ukuran foto tidak melebihi 2MB.' });
    } finally {
      setIsSaving(false);
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
      setMessage({ type: 'success', text: `Status artikel diubah menjadi ${newStatus === 'dipublikasikan' ? 'Dipublikasikan' : 'Draf'}.` });
    } catch (error) {
      console.error('Gagal ubah status:', error);
      setMessage({ type: 'error', text: 'Gagal mengubah status artikel.' });
    }
  };

  const handleDelete = async (id, judul) => {
    if (window.confirm(`Yakin ingin menghapus artikel "${judul}" secara permanen?`)) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/artikels/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (editingId === id) handleNew();
        fetchArticles();
        setMessage({ type: 'success', text: 'Artikel berhasil dihapus.' });
      } catch (error) {
        console.error('Gagal menghapus:', error);
        setMessage({ type: 'error', text: 'Gagal menghapus artikel.' });
      }
    }
  };

  const getCategoryMeta = (kat) => {
    return CATEGORIES.find(c => c.id === kat) || CATEGORIES[0];
  };

  return (
    <>
      <style>{`
        .artikel-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .artikel-grid-layout {
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

        <div className="artikel-grid-layout">
          {/* KOLOM KIRI: KATALOG ARTIKEL & BERITA */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  <Book02Icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
                    Katalog Artikel & Berita
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                    Total {articles.length} publikasi desa
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNew}
                style={{
                  minHeight: '36px',
                  padding: '0 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-teal, #008080)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0, 128, 128, 0.2)'
                }}
              >
                <Add01Icon size={14} /> + Tulis Baru
              </button>
            </div>

            {isLoading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '36px' }}>Memuat katalog artikel...</p>
            ) : articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <Book02Icon size={36} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#334155', margin: '0 0 4px' }}>Belum Ada Artikel</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Mulai tulis artikel edukasi kesehatan untuk warga desa.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '580px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {articles.map(a => {
                  const catMeta = getCategoryMeta(a.kategori);
                  const CatIcon = catMeta.icon;
                  const isDraf = a.status === 'draf';
                  const isBeingEdited = editingId === a.id;

                  return (
                    <article
                      key={a.id}
                      style={{
                        borderRadius: '14px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                        border: isBeingEdited ? '2px solid var(--primary-teal, #008080)' : '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '14px', padding: '14px' }}>
                        {/* Thumbnail Cover */}
                        <div
                          style={{
                            width: '100px',
                            height: '80px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            flexShrink: 0,
                            position: 'relative'
                          }}
                        >
                          {a.path_foto ? (
                            <img
                              src={`/storage/${a.path_foto}`}
                              alt={a.judul}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                              <CatIcon size={28} />
                            </div>
                          )}
                        </div>

                        {/* Text Detail */}
                        <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: catMeta.bg,
                                color: catMeta.color,
                                border: `1px solid ${catMeta.border}`,
                                textTransform: 'uppercase'
                              }}
                            >
                              {catMeta.label}
                            </span>
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: isDraf ? '#fff7ed' : '#f0fdf4',
                                color: isDraf ? '#c2410c' : '#15803d',
                                border: isDraf ? '1px solid #fed7aa' : '1px solid #bbf7d0'
                              }}
                            >
                              {isDraf ? 'Draf' : 'Publik'}
                            </span>
                          </div>

                          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.judul}
                          </h4>

                          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {a.isi_artikel}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={isDraf ? ViewIcon : ViewOffSlashIcon}
                          onClick={() => toggleStatus(a.id, a.status)}
                          style={{ color: isDraf ? 'var(--primary-teal, #008080)' : '#64748b' }}
                        >
                          {isDraf ? 'Publikasikan' : 'Jadikan Draf'}
                        </Button>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit02Icon}
                            onClick={() => handleEdit(a.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger-outline"
                            size="sm"
                            icon={Delete02Icon}
                            onClick={() => handleDelete(a.id, a.judul)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* KOLOM KANAN: FORM EDITOR ARTIKEL */}
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
            <div style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-teal, #008080)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {editingId ? 'Mode Pengeditan' : 'Editor Publikasi'}
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)' }}>
                  {editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                </h3>
              </div>
              {editingId && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNew}
                >
                  Batal Edit
                </Button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Kategori Artikel</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', backgroundColor: '#fff', fontSize: '13.5px' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Judul Artikel *</label>
                <input
                  type="text"
                  placeholder="Contoh: Panduan Gizi Seimbang Balita Usia 1-3 Tahun"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  style={{ width: '100%', minHeight: '44px', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0 12px', fontSize: '13.5px' }}
                />
              </div>

              {/* FOTO SAMPUL UPLOADER */}
              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Foto Sampul Artikel (Opsional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {fotoPreview ? (
                  <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#0f172a' }}>
                      <img src={fotoPreview.url} alt="Sampul" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>Foto sampul dipilih</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Ganti
                        </Button>
                        <Button
                          variant="danger-outline"
                          size="sm"
                          onClick={handleRemovePhoto}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #99f6e4',
                      borderRadius: '12px',
                      padding: '22px 16px',
                      textAlign: 'center',
                      backgroundColor: '#f0fdfa',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload01Icon size={24} color="var(--primary-teal, #008080)" style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: '0 0 4px', fontSize: '13.5px', fontWeight: 800, color: 'var(--primary-teal, #008080)' }}>
                      Pilih Foto dari Galeri / Kamera HP
                    </p>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Ketuk di sini untuk memilih gambar &bull; Format JPG, PNG, WEBP</span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Isi Lengkap Artikel *</label>
                <textarea
                  rows="6"
                  placeholder="Tulis artikel kesehatan secara terstruktur dan informatif..."
                  value={formData.isi_artikel}
                  onChange={(e) => setFormData({ ...formData, isi_artikel: e.target.value })}
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '12px', fontSize: '13.5px', lineHeight: 1.5, outline: 'none' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleSave('draf')}
                  disabled={isSaving}
                  style={{ flex: 1 }}
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Draf'}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSave('dipublikasikan')}
                  loading={isSaving}
                  loadingText="Memproses..."
                  style={{ flex: 1.2 }}
                >
                  Publikasikan Sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}