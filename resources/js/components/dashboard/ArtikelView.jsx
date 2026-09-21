import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import ArtikelEditor from './ArtikelEditor';
import {
  Add01Icon,
  Edit02Icon,
  Delete02Icon,
  Activity01Icon,
  Book02Icon,
  FavouriteIcon,
  File01Icon,
  Cancel01Icon,
  ViewIcon,
  ViewOffSlashIcon,
  Search01Icon,
  Calendar01Icon,
  Location01Icon,
  ArrowUpRight01Icon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const CATEGORIES = [
  { id: 'Kesehatan', label: 'Kesehatan', icon: Activity01Icon, color: '#0E7C93', bg: '#E3F7FB', border: '#b3e8f3' },
  { id: 'Nutrisi', label: 'Nutrisi & Gizi', icon: FavouriteIcon, color: '#93348A', bg: '#FBEAF8', border: '#f5cbe7' },
  { id: 'Imunisasi', label: 'Imunisasi', icon: Activity01Icon, color: '#0369a1', bg: '#e0f2fe', border: '#bae6fd' },
  { id: 'Kesehatan Mental', label: 'Kesehatan Mental', icon: FavouriteIcon, color: '#6d28d9', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'Kehamilan', label: 'Kehamilan & Ibu', icon: FavouriteIcon, color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  { id: 'Pendidikan', label: 'Pendidikan & Pola Asuh', icon: Book02Icon, color: '#B5650C', bg: '#FFF1DF', border: '#fedbb0' },
  { id: 'Sosial', label: 'Sosial & Bantuan', icon: FavouriteIcon, color: '#4338ca', bg: '#eef2ff', border: '#c7d2fe' },
  { id: 'Posyandu', label: 'Info & Agenda Posyandu', icon: File01Icon, color: '#2E7D46', bg: '#E7F7EC', border: '#c3ecd0' },
  { id: 'Lainnya', label: 'Lainnya', icon: Book02Icon, color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
];

export default function ArtikelView() {
  const [articles, setArticles] = useState([]);
  const [posyanduList, setPosyanduList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // View mode: 'list' (Katalog) or 'editor' (Studio Editor Halaman Penuh)
  const [viewMode, setViewMode] = useState('list');
  const [editingArticle, setEditingArticle] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'dipublikasikan', 'draf'
  const [posyanduFilter, setPosyanduFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Detail Modal State
  const [selectedDetailArticle, setSelectedDetailArticle] = useState(null);

  // Notifications & Confirmations
  const [message, setMessage] = useState({ type: '', text: '', title: '', details: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmVariant: 'danger'
  });

  // Lock scroll when detail modal is open
  useEffect(() => {
    if (selectedDetailArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedDetailArticle) setSelectedDetailArticle(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDetailArticle]);

  // Fetch Articles & User & Posyandu
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const [pubRes, drafRes, posyanduRes, meRes] = await Promise.all([
        axios.get('/api/artikels?status=dipublikasikan', { headers: authHeader }),
        axios.get('/api/artikels?status=draf', { headers: authHeader }),
        axios.get('/api/profil-posyandu').catch(() => ({ data: { data: [] } })),
        axios.get('/api/me', { headers: authHeader }).catch(() => ({ data: { data: null } }))
      ]);

      const combined = [...(drafRes.data?.data || []), ...(pubRes.data?.data || [])];
      combined.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      setArticles(combined);
      setPosyanduList(posyanduRes.data?.data || []);
      if (meRes.data?.data) {
        setCurrentUser(meRes.data.data);
      }
    } catch (error) {
      console.error('Gagal mengambil artikel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const getPhotoUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `/storage/${path}`;
  };

  const getCategoryMeta = (kat) => {
    return CATEGORIES.find((c) => c.id.toLowerCase() === (kat || '').toLowerCase()) || CATEGORIES[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Open Write New Article Page
  const handleNew = () => {
    setEditingArticle(null);
    setSelectedDetailArticle(null);
    setMessage({ type: '', text: '', title: '', details: null });
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Edit Article Page
  const handleEdit = (article) => {
    setEditingArticle(article);
    setSelectedDetailArticle(null);
    setMessage({ type: '', text: '', title: '', details: null });
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save Article (Create or Update)
  const handleSaveArticle = async (formData, status) => {
    setIsSaving(true);
    setMessage({ type: '', text: '', title: '', details: null });

    try {
      const token = localStorage.getItem('auth_token');
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('kategori', formData.kategori);
      data.append('isi_artikel', formData.isi_artikel);
      data.append('status', status);
      if (formData.posyandu_id) {
        data.append('posyandu_id', formData.posyandu_id);
      }
      if (formData.foto) {
        data.append('foto', formData.foto);
      }

      if (editingArticle?.id) {
        await axios.post(`/api/artikels/${editingArticle.id}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setMessage({
          type: 'success',
          title: 'Artikel Berhasil Diperbarui',
          text: `Artikel "${formData.judul}" berhasil disimpan (${status === 'dipublikasikan' ? 'Dipublikasikan ke publik' : 'Tersimpan sebagai Draf'})!`
        });
      } else {
        await axios.post('/api/artikels', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setMessage({
          type: 'success',
          title: 'Artikel Berhasil Dibuat',
          text: `Artikel baru "${formData.judul}" berhasil dibuat (${status === 'dipublikasikan' ? 'Dipublikasikan ke publik' : 'Tersimpan sebagai Draf'})!`
        });
      }

      setViewMode('list');
      setEditingArticle(null);
      fetchArticles();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Gagal menyimpan:', error);
      const errDetail =
        error.response?.data?.pesan ||
        error.response?.data?.message ||
        'Gagal menyimpan artikel. Pastikan koneksi internet stabil dan ukuran foto maksimal 2MB.';
      setMessage({
        type: 'error',
        title: 'Gagal Menyimpan Artikel',
        text: errDetail
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Publication Status directly from Catalog or Modal
  const toggleStatus = async (id, currentStatus, e) => {
    if (e) e.stopPropagation();
    try {
      const newStatus = currentStatus === 'draf' ? 'dipublikasikan' : 'draf';
      const token = localStorage.getItem('auth_token');

      await axios.post(
        `/api/artikels/${id}`,
        {
          status: newStatus
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchArticles();
      if (selectedDetailArticle && selectedDetailArticle.id === id) {
        setSelectedDetailArticle((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      setMessage({
        type: 'success',
        title: 'Status Artikel Diubah',
        text: `Status artikel berhasil diubah menjadi ${newStatus === 'dipublikasikan' ? 'Dipublikasikan (Publik)' : 'Draf (Internal)'}.`
      });
    } catch (error) {
      console.error('Gagal ubah status:', error);
      const errDetail = error.response?.data?.pesan || error.response?.data?.message || 'Gagal mengubah status artikel.';
      setMessage({
        type: 'error',
        title: 'Gagal Mengubah Status',
        text: errDetail
      });
    }
  };

  // Delete Article Handler
  const handleDelete = (id, judul, e) => {
    if (e) e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Hapus Artikel',
      message: `Apakah Anda yakin ingin menghapus artikel "${judul}" secara permanen? Data yang telah dihapus tidak dapat dipulihkan.`,
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          await axios.delete(`/api/artikels/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (selectedDetailArticle?.id === id) setSelectedDetailArticle(null);
          fetchArticles();
          setMessage({
            type: 'success',
            title: 'Artikel Dihapus',
            text: `Artikel "${judul}" berhasil dihapus secara permanen.`
          });
        } catch (error) {
          console.error('Gagal menghapus:', error);
          const errDetail = error.response?.data?.pesan || error.response?.data?.message || 'Gagal menghapus artikel.';
          setMessage({
            type: 'error',
            title: 'Gagal Menghapus Artikel',
            text: errDetail
          });
        }
      }
    });
  };

  const handleOpenPublicDetail = (articleId) => {
    localStorage.setItem('active_article_id', articleId);
    window.location.hash = 'detail-artikel';
  };

  // Filter articles
  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      (a.judul || '').toLowerCase().includes(q) ||
      (a.isi_artikel || '').toLowerCase().includes(q) ||
      (a.kategori || '').toLowerCase().includes(q) ||
      (a.posyandu?.nama || '').toLowerCase().includes(q) ||
      (a.penulis?.name || '').toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || a.status === statusFilter;

    const matchPosyandu =
      posyanduFilter === 'all' || String(a.posyandu_id || a.posyandu?.id || '') === String(posyanduFilter);

    const matchCategory =
      categoryFilter === 'all' || (a.kategori || '').toLowerCase() === categoryFilter.toLowerCase();

    return matchQuery && matchStatus && matchPosyandu && matchCategory;
  });

  const totalPublished = articles.filter((a) => a.status === 'dipublikasikan').length;
  const totalDraft = articles.filter((a) => a.status === 'draf').length;

  // Render Modal Detail Preview
  const renderDetailModal = () => {
    if (!selectedDetailArticle) return null;
    const a = selectedDetailArticle;
    const catMeta = getCategoryMeta(a.kategori);
    const isDraf = a.status === 'draf';

    const detailContent = (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setSelectedDetailArticle(null)}
      >
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
            animation: 'editorFadeIn 0.2s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedDetailArticle(null)}
            aria-label="Tutup"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <Cancel01Icon size={20} />
          </button>

          {/* Header Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '8px',
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
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: isDraf ? '#fff7ed' : '#f0fdf4',
                color: isDraf ? '#c2410c' : '#15803d',
                border: isDraf ? '1px solid #fed7aa' : '1px solid #bbf7d0'
              }}
            >
              {isDraf ? 'Status: Draf' : 'Status: Publik'}
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #e2e8f0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Location01Icon size={13} color="var(--primary-teal, #008080)" />
              {a.posyandu?.nama ? `Posyandu ${a.posyandu.nama}` : 'Posyandu Desa (Umum)'}
            </span>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: '16px' }}>
            {a.judul}
          </h2>

          {/* Meta Info Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              paddingBottom: '18px',
              marginBottom: '20px',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '13px',
              color: '#64748b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px'
                }}
              >
                {(a.penulis?.name || 'A')[0].toUpperCase()}
              </div>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                {a.penulis?.name || 'Kader Posyandu'} ({a.penulis?.role || 'Pengurus'})
              </span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar01Icon size={15} />
              <span>Diterbitkan: {formatDate(a.published_at || a.created_at)}</span>
            </div>
          </div>

          {/* Cover Image */}
          {a.path_foto && (
            <div
              style={{
                width: '100%',
                maxHeight: '360px',
                borderRadius: '14px',
                overflow: 'hidden',
                marginBottom: '24px',
                backgroundColor: '#0f172a'
              }}
            >
              <img
                src={getPhotoUrl(a.path_foto)}
                alt={a.judul}
                style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Body Content */}
          <div style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
            {a.isi_artikel}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              borderTop: '1px solid #f1f5f9',
              paddingTop: '20px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="ghost"
                size="md"
                icon={isDraf ? ViewIcon : ViewOffSlashIcon}
                onClick={(e) => toggleStatus(a.id, a.status, e)}
                style={{ color: isDraf ? 'var(--primary-teal, #008080)' : '#64748b' }}
              >
                {isDraf ? 'Publikasikan' : 'Jadikan Draf'}
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={Edit02Icon}
                onClick={() => handleEdit(a)}
              >
                Edit di Studio
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowUpRight01Icon}
                onClick={() => handleOpenPublicDetail(a.id)}
              >
                Buka Halaman Publik
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedDetailArticle(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(detailContent, document.body);
  };

  return (
    <>
      <style>{`
        .artikel-card-item {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .artikel-card-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06) !important;
          border-color: var(--primary-teal, #008080) !important;
        }
      `}</style>

      <div style={{ animation: 'fadein 0.3s ease' }}>
        {/* Notification Modal */}
        <NotificationModal
          isOpen={Boolean(message.text || message.title)}
          type={message.type || 'success'}
          title={message.title}
          message={message.text}
          details={message.details}
          onClose={() => setMessage({ type: '', text: '', title: '', details: null })}
        />

        {/* Delete Confirmation Modal */}
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

        {/* Detail Modal Preview in list view */}
        {renderDetailModal()}

        {/* Dynamic View: Studio Editor vs Catalog Grid */}
        {viewMode === 'editor' ? (
          <ArtikelEditor
            editingArticle={editingArticle}
            currentUser={currentUser}
            posyanduList={posyanduList}
            categories={CATEGORIES}
            onSave={handleSaveArticle}
            onCancel={() => {
              setViewMode('list');
              setEditingArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSaving={isSaving}
          />
        ) : (
          <div>
            {/* MAIN CATALOG HEADER & CONTROLS */}
            <div
              className="card"
              style={{
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'var(--surface, #ffffff)',
                border: '1.5px solid var(--line, #e2e8f0)',
                marginBottom: '24px'
              }}
            >
              {/* Top Row: Title, Stats & Tulis Baru Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
                      color: 'var(--primary-teal, #008080)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Book02Icon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
                      Katalog Artikel &amp; Edukasi Kesehatan
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '2px',
                        fontSize: '12.5px',
                        color: '#64748b'
                      }}
                    >
                      <span>Total {articles.length} publikasi</span>
                      <span>&bull;</span>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{totalPublished} Publik</span>
                      <span>&bull;</span>
                      <span style={{ color: '#d97706', fontWeight: 600 }}>{totalDraft} Draf</span>
                    </div>
                  </div>
                </div>

                {/* Button Tulis Baru */}
                <Button
                  variant="primary"
                  size="lg"
                  icon={Add01Icon}
                  onClick={handleNew}
                  style={{
                    boxShadow: '0 4px 14px rgba(0, 128, 128, 0.28)',
                    fontWeight: 800,
                    padding: '10px 22px'
                  }}
                >
                  Tulis Artikel Baru
                </Button>
              </div>

              {/* Filter & Search Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                {/* Search Input */}
                <div style={{ position: 'relative', gridColumn: 'span 1' }}>
                  <Search01Icon
                    size={16}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Cari judul, topik, penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Posyandu Filter */}
                <div>
                  <select
                    value={posyanduFilter}
                    onChange={(e) => setPosyanduFilter(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      padding: '0 10px',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  >
                    <option value="all">Semua Posyandu Penerbit</option>
                    {posyanduList.map((p) => (
                      <option key={p.id} value={p.id}>
                        Posyandu {p.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kategori Filter */}
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      padding: '0 10px',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      outline: 'none'
                    }}
                  >
                    <option value="all">Semua Kategori</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Tabs */}
                <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: '7px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      fontWeight: statusFilter === 'all' ? 700 : 600,
                      backgroundColor: statusFilter === 'all' ? '#ffffff' : 'transparent',
                      color: statusFilter === 'all' ? '#0f172a' : '#64748b',
                      boxShadow: statusFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('dipublikasikan')}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: '7px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      fontWeight: statusFilter === 'dipublikasikan' ? 700 : 600,
                      backgroundColor: statusFilter === 'dipublikasikan' ? '#ffffff' : 'transparent',
                      color: statusFilter === 'dipublikasikan' ? '#16a34a' : '#64748b',
                      boxShadow: statusFilter === 'dipublikasikan' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Publik
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('draf')}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: '7px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      fontWeight: statusFilter === 'draf' ? 700 : 600,
                      backgroundColor: statusFilter === 'draf' ? '#ffffff' : 'transparent',
                      color: statusFilter === 'draf' ? '#c2410c' : '#64748b',
                      boxShadow: statusFilter === 'draf' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Draf
                  </button>
                </div>
              </div>
            </div>

            {/* ARTICLES GRID / CATALOG */}
            {isLoading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#008080',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 12px'
                  }}
                />
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Memuat katalog artikel &amp; edukasi kesehatan...
                </p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px dashed #cbd5e1'
                }}
              >
                <Book02Icon size={44} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                <h4 style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b', margin: '0 0 6px' }}>
                  Tidak Ada Artikel Ditemukan
                </h4>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px' }}>
                  {searchQuery || statusFilter !== 'all' || posyanduFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Tidak ada artikel yang cocok dengan kriteria pencarian/filter Anda.'
                    : 'Belum ada artikel edukasi kesehatan yang dibuat untuk posyandu ini.'}
                </p>
                <Button variant="primary" size="md" icon={Add01Icon} onClick={handleNew}>
                  Tulis Artikel Baru
                </Button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                  gap: '20px'
                }}
              >
                {filteredArticles.map((a) => {
                  const catMeta = getCategoryMeta(a.kategori);
                  const CatIcon = catMeta.icon || Activity01Icon;
                  const isDraf = a.status === 'draf';

                  return (
                    <article
                      key={a.id}
                      className="artikel-card-item"
                      onClick={() => setSelectedDetailArticle(a)}
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      title="Klik untuk melihat rincian artikel lengkap"
                    >
                      {/* Thumbnail Cover Header */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '170px',
                          backgroundColor: '#f1f5f9',
                          overflow: 'hidden'
                        }}
                      >
                        {a.path_foto ? (
                          <img
                            src={getPhotoUrl(a.path_foto)}
                            alt={a.judul}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#94a3b8',
                              backgroundColor: '#f8fafc'
                            }}
                          >
                            <CatIcon size={36} />
                          </div>
                        )}

                        {/* Category Pill */}
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.94)',
                            color: catMeta.color,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                            textTransform: 'uppercase'
                          }}
                        >
                          {catMeta.label}
                        </span>

                        {/* Status Pill */}
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: isDraf ? 'rgba(255, 247, 237, 0.95)' : 'rgba(240, 253, 244, 0.95)',
                            color: isDraf ? '#c2410c' : '#15803d',
                            border: isDraf ? '1px solid #fed7aa' : '1px solid #bbf7d0',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                          }}
                        >
                          {isDraf ? 'Draf' : 'Publik'}
                        </span>
                      </div>

                      {/* Body Content */}
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        {/* Posyandu Publisher Badge */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11.5px',
                            color: '#008080',
                            fontWeight: 700,
                            marginBottom: '8px'
                          }}
                        >
                          <Location01Icon size={14} />
                          <span>
                            {a.posyandu?.nama ? `Posyandu ${a.posyandu.nama}` : 'Posyandu Desa Loa Duri Ulu'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: '15.5px',
                            fontWeight: 800,
                            color: '#0f172a',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {a.judul}
                        </h4>

                        {/* Excerpt */}
                        <p
                          style={{
                            margin: '0 0 16px 0',
                            fontSize: '13px',
                            color: '#64748b',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flexGrow: 1
                          }}
                        >
                          {a.isi_artikel}
                        </p>

                        {/* Author & Date Meta */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: '#94a3b8',
                            paddingTop: '12px',
                            borderTop: '1px solid #f1f5f9'
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: '#475569',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '160px'
                            }}
                          >
                            {a.penulis?.name || 'Kader Posyandu'}
                          </span>
                          <span>{formatDate(a.published_at || a.created_at)}</span>
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 16px',
                          backgroundColor: '#f8fafc',
                          borderTop: '1px solid #f1f5f9'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={ViewIcon}
                          onClick={() => setSelectedDetailArticle(a)}
                          style={{ color: 'var(--primary-teal, #008080)', fontWeight: 700 }}
                        >
                          Lihat
                        </Button>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit02Icon}
                            onClick={() => handleEdit(a)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger-outline"
                            size="sm"
                            icon={Delete02Icon}
                            onClick={(e) => handleDelete(a.id, a.judul, e)}
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
        )}
      </div>
    </>
  );
}
