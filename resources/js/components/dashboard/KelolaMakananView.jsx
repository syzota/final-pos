import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../common/Button';
import NotificationModal from '../common/NotificationModal';
import {
  InformationCircleIcon,
  Search01Icon,
  Add01Icon,
  Edit02Icon,
  Delete02Icon,
  KitchenUtensilsIcon,
  Cancel01Icon,
  FloppyDiskIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const PRESET_MAKANAN = [
  { nama_makanan: 'Nasi Putih (1 centong / 100g)', kalori: 130 },
  { nama_makanan: 'Nasi Goreng (1 porsi)', kalori: 267 },
  { nama_makanan: 'Mie Ayam (1 mangkuk)', kalori: 330 },
  { nama_makanan: 'Bakso Sapi (1 mangkuk)', kalori: 326 },
  { nama_makanan: 'Sate Ayam (10 tusuk)', kalori: 340 },
  { nama_makanan: 'Soto Ayam (1 mangkuk)', kalori: 220 },
  { nama_makanan: 'Rendang Sapi (1 potong)', kalori: 195 },
  { nama_makanan: 'Gado-Gado (1 porsi)', kalori: 318 },
  { nama_makanan: 'Tempe Goreng (1 potong)', kalori: 34 },
  { nama_makanan: 'Tahu Goreng (1 potong)', kalori: 35 },
  { nama_makanan: 'Ayam Goreng (1 potong)', kalori: 260 },
  { nama_makanan: 'Ikan Bakar (1 potong)', kalori: 150 },
  { nama_makanan: 'Telur Mata Sapi (1 butir)', kalori: 92 },
  { nama_makanan: 'Telur Rebus (1 butir)', kalori: 77 },
  { nama_makanan: 'Sayur Sop (1 mangkuk)', kalori: 70 },
  { nama_makanan: 'Sayur Asem (1 mangkuk)', kalori: 80 },
  { nama_makanan: 'Pisang Goreng (1 potong)', kalori: 140 },
  { nama_makanan: 'Roti Tawar (1 lembar)', kalori: 75 },
  { nama_makanan: 'Susu Sapi (1 gelas)', kalori: 146 },
  { nama_makanan: 'Es Teh Manis (1 gelas)', kalori: 90 },
  { nama_makanan: 'Kopi Manis (1 cangkir)', kalori: 70 },
];

export default function KelolaMakananView() {
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama_makanan: '', kalori_per_porsi: '' });
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '', title: '', details: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmVariant: 'danger'
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('/api/makanan/manage', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFoods(response.data.data || []);
    } catch (err) {
      console.error('Gagal memuat data makanan', err);
      if (err.response?.status === 403) {
        setMessage({
          type: 'error',
          title: 'Akses Ditolak',
          text: 'Kamu tidak memiliki akses untuk mengelola data makanan.'
        });
      }
    }
  };

  const filteredFoods = foods.filter(food =>
    (food.nama_makanan || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nama_makanan: '', kalori_per_porsi: '' });
    setSelectedPreset('');
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingId(food.id);
    setFormData({ nama_makanan: food.nama_makanan, kalori_per_porsi: food.kalori_per_porsi });
    setSelectedPreset('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nama_makanan: '', kalori_per_porsi: '' });
    setSelectedPreset('');
  };

  const handlePresetChange = (e) => {
    const val = e.target.value;
    setSelectedPreset(val);
    if (!val) return;
    const found = PRESET_MAKANAN.find(p => p.nama_makanan === val);
    if (found) {
      setFormData({
        nama_makanan: found.nama_makanan,
        kalori_per_porsi: String(found.kalori)
      });
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    const missing = [];
    if (!formData.nama_makanan?.trim()) {
      missing.push('Nama makanan belum diisi');
    }
    if (!formData.kalori_per_porsi || Number(formData.kalori_per_porsi) <= 0) {
      missing.push('Jumlah kalori per porsi harus diisi dengan angka positif (> 0 kkal)');
    }

    if (missing.length > 0) {
      setMessage({
        type: 'error',
        title: 'Data Makanan Belum Lengkap',
        text: 'Mohon lengkapi formulir sebelum menyimpan:',
        details: missing
      });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      if (editingId) {
        await axios.put(`/api/makanan/${editingId}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({
          type: 'success',
          title: 'Berhasil Diperbarui',
          text: `Menu "${formData.nama_makanan}" berhasil diperbarui.`
        });
      } else {
        await axios.post('/api/makanan', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({
          type: 'success',
          title: 'Berhasil Ditambahkan',
          text: `Menu "${formData.nama_makanan}" berhasil ditambahkan ke referensi.`
        });
      }
      closeModal();
      fetchFoods();
    } catch (err) {
      const errDetail = err.response?.data?.pesan || err.response?.data?.message || 'Gagal menyimpan data makanan.';
      setMessage({
        type: 'error',
        title: 'Gagal Menyimpan Data',
        text: errDetail
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id, nama) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Hapus Makanan',
      message: `Apakah Anda yakin ingin menghapus menu "${nama}" dari daftar referensi kalori posyandu? Tindakan ini tidak dapat dibatalkan.`,
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          await axios.delete(`/api/makanan/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setFoods(foods.filter(f => f.id !== id));
          setMessage({
            type: 'success',
            title: 'Menu Dihapus',
            text: `Menu "${nama}" berhasil dihapus dari basis data posyandu.`
          });
        } catch (err) {
          const errDetail = err.response?.data?.pesan || err.response?.data?.message || 'Gagal menghapus data makanan.';
          setMessage({
            type: 'error',
            title: 'Gagal Menghapus Makanan',
            text: errDetail
          });
        }
      }
    });
  };

  return (
    <div style={{ animation: 'fadein 0.3s ease' }}>
      {/* Banner Panduan */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: 'var(--primary-teal-light, #e6f3f3)',
          border: '1px solid #99f6e4',
          color: 'var(--primary-teal, #008080)',
          fontSize: '13.5px',
          fontWeight: 600,
          marginBottom: '20px'
        }}
      >
        <InformationCircleIcon size={20} style={{ flexShrink: 0 }} />
        <span>Daftar makanan di sini digunakan sebagai referensi porsi dan kalori pada fitur Kalkulator Kesehatan Warga.</span>
      </div>

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

      {/* Card Utama: Tabel CRUD Makanan */}
      <div
        className="card"
        style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--line, #e2e8f0)'
        }}
      >
        {/* Header & Aksi */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
              Daftar Referensi Makanan
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--ink-soft, #64748b)' }}>
              Total {foods.length} makanan terdaftar di posyandu
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search01Icon
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  padding: '0 12px 0 38px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Add01Icon}
              onClick={openAddModal}
            >
              Tambah Makanan
            </Button>
          </div>
        </div>

        {/* Tabel Data */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '13.5px'
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700, width: '60px' }}>No</th>
                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>Nama Makanan / Porsi</th>
                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700, width: '180px' }}>Kalori per Porsi</th>
                <th style={{ padding: '12px 16px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700, textAlign: 'center', width: '160px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                    <KitchenUtensilsIcon size={36} style={{ margin: '0 auto 8px', color: '#cbd5e1' }} />
                    <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
                      {searchQuery ? `Tidak ada makanan yang cocok dengan "${searchQuery}"` : 'Belum ada data referensi makanan.'}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>
                      Klik tombol "+ Tambah Makanan" di atas untuk menambahkan makanan baru.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredFoods.map((food, idx) => (
                  <tr
                    key={food.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#fff7ed',
                            color: '#c2410c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <KitchenUtensilsIcon size={16} />
                        </div>
                        <span>{food.nama_makanan}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#fff7ed',
                          color: '#c2410c',
                          fontWeight: 800,
                          fontSize: '13px'
                        }}
                      >
                        {food.kalori_per_porsi} kkal
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit02Icon}
                          onClick={() => openEditModal(food)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger-outline"
                          size="sm"
                          icon={Delete02Icon}
                          onClick={() => handleDelete(food.id, food.nama_makanan)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Makanan */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
            animation: 'fadein 0.2s ease'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1.5px solid #e2e8f0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
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
                  <KitchenUtensilsIcon size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                    {editingId ? 'Edit Data Makanan' : 'Tambah Makanan Baru'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {editingId ? 'Perbarui nama atau kalori per porsi' : 'Isi form atau pilih dari rekomendasi standar'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <Cancel01Icon size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave}>
              {/* Preset Quick Fill (Hanya saat tambah baru) */}
              {!editingId && (
                <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Pilih Cepat dari Rekomendasi Standar (Opsional):
                  </label>
                  <select
                    value={selectedPreset}
                    onChange={handlePresetChange}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      padding: '0 10px',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                      color: '#334155'
                    }}
                  >
                    <option value="">-- Ketik manual atau pilih rekomendasi --</option>
                    {PRESET_MAKANAN.map((preset, idx) => (
                      <option key={idx} value={preset.nama_makanan}>
                        {preset.nama_makanan} ({preset.kalori} kkal)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Input Nama Makanan */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Nama Makanan & Ukuran Porsi <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nasi Goreng (1 porsi) atau Apel (1 buah)"
                  value={formData.nama_makanan}
                  onChange={(e) => setFormData({ ...formData, nama_makanan: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    padding: '0 12px',
                    fontSize: '13.5px',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Input Kalori */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Kalori per Porsi (kkal) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="5000"
                  placeholder="Contoh: 150"
                  value={formData.kalori_per_porsi}
                  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onChange={(e) => setFormData({ ...formData, kalori_per_porsi: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    padding: '0 12px',
                    fontSize: '13.5px',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={FloppyDiskIcon}
                  loading={isLoading}
                  loadingText="Menyimpan..."
                >
                  Simpan Makanan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}