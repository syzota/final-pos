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
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Cancel01Icon,
  FloppyDiskIcon,
  RefreshIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

const EXTERNAL_API_MOCK = [
  { nama_makanan: 'Nasi Putih (1 centong / 100g)', kalori_per_porsi: 130, kategori: 'Pokok' },
  { nama_makanan: 'Nasi Goreng (1 porsi)', kalori_per_porsi: 267, kategori: 'Pokok' },
  { nama_makanan: 'Mie Ayam (1 mangkuk)', kalori_per_porsi: 330, kategori: 'Olahan' },
  { nama_makanan: 'Bakso Sapi (1 mangkuk)', kalori_per_porsi: 326, kategori: 'Olahan' },
  { nama_makanan: 'Sate Ayam (10 tusuk)', kalori_per_porsi: 340, kategori: 'Lauk' },
  { nama_makanan: 'Soto Ayam (1 mangkuk)', kalori_per_porsi: 220, kategori: 'Olahan' },
  { nama_makanan: 'Rendang Sapi (1 potong)', kalori_per_porsi: 195, kategori: 'Lauk' },
  { nama_makanan: 'Gado-Gado (1 porsi)', kalori_per_porsi: 318, kategori: 'Sayur' },
  { nama_makanan: 'Tempe Goreng (1 potong)', kalori_per_porsi: 34, kategori: 'Lauk' },
  { nama_makanan: 'Tahu Goreng (1 potong)', kalori_per_porsi: 35, kategori: 'Lauk' },
  { nama_makanan: 'Ayam Goreng (1 potong)', kalori_per_porsi: 260, kategori: 'Lauk' },
  { nama_makanan: 'Ikan Bakar (1 potong)', kalori_per_porsi: 150, kategori: 'Lauk' },
  { nama_makanan: 'Es Teh Manis (1 gelas)', kalori_per_porsi: 90, kategori: 'Minuman' },
  { nama_makanan: 'Kopi Manis (1 cangkir)', kalori_per_porsi: 70, kategori: 'Minuman' },
  { nama_makanan: 'Pisang Goreng (1 potong)', kalori_per_porsi: 140, kategori: 'Camilan' },
  { nama_makanan: 'Telur Mata Sapi (1 butir)', kalori_per_porsi: 92, kategori: 'Lauk' },
  { nama_makanan: 'Telur Rebus (1 butir)', kalori_per_porsi: 77, kategori: 'Lauk' },
  { nama_makanan: 'Susu Sapi (1 gelas)', kalori_per_porsi: 146, kategori: 'Minuman' },
  { nama_makanan: 'Roti Tawar (1 lembar)', kalori_per_porsi: 75, kategori: 'Pokok' },
  { nama_makanan: 'Mie Instan Goreng (1 bungkus)', kalori_per_porsi: 380, kategori: 'Olahan' },
  { nama_makanan: 'Sayur Sop (1 mangkuk)', kalori_per_porsi: 70, kategori: 'Sayur' },
];

export default function KelolaMakananView() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama_makanan: '', kalori_per_porsi: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', title: '', details: null });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmVariant: 'danger'
  });
  const [searchMockQuery, setSearchMockQuery] = useState('');
  const [searchDbQuery, setSearchDbQuery] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('/api/makanan');
      setFoods(response.data.data || []);
    } catch (err) {
      console.error('Gagal memuat data makanan', err);
    }
  };

  const filteredMock = EXTERNAL_API_MOCK.filter(food =>
    food.nama_makanan.toLowerCase().includes(searchMockQuery.toLowerCase())
  );

  const filteredDb = foods.filter(food =>
    (food.nama_makanan || '').toLowerCase().includes(searchDbQuery.toLowerCase())
  );

  const handleSaveFromApi = async (food) => {
    setIsLoading(true);
    setMessage({ type: '', text: '', title: '', details: null });
    const token = localStorage.getItem('auth_token');

    try {
      await axios.post('/api/makanan', {
        nama_makanan: food.nama_makanan,
        kalori_per_porsi: food.kalori_per_porsi
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage({
        type: 'success',
        title: 'Berhasil Menambahkan Makanan',
        text: `"${food.nama_makanan}" berhasil ditambahkan ke basis data posyandu!`
      });
      fetchFoods();
    } catch (err) {
      const errDetail = err.response?.data?.pesan || err.response?.data?.message || 'Gagal menyimpan makanan dari referensi.';
      setMessage({
        type: 'error',
        title: 'Gagal Menyimpan Makanan',
        text: errDetail
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showForm = (id) => {
    setMessage({ type: '', text: '', title: '', details: null });
    if (id) {
      const food = foods.find(f => f.id === id);
      setEditingId(id);
      setFormData({ nama_makanan: food.nama_makanan, kalori_per_porsi: food.kalori_per_porsi });
    } else {
      setEditingId('new');
      setFormData({ nama_makanan: '', kalori_per_porsi: '' });
    }
  };

  const hideForm = () => {
    setEditingId(null);
    setFormData({ nama_makanan: '', kalori_per_porsi: '' });
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
        text: 'Mohon perbaiki formulir makanan sebelum melanjutkan:',
        details: missing
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '', title: '', details: null });
    const token = localStorage.getItem('auth_token');

    try {
      if (editingId && editingId !== 'new') {
        await axios.put(`/api/makanan/${editingId}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({
          type: 'success',
          title: 'Perubahan Tersimpan',
          text: 'Menu makanan berhasil diperbarui dalam basis data posyandu.'
        });
      } else {
        await axios.post('/api/makanan', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({
          type: 'success',
          title: 'Menu Berhasil Dibuat',
          text: 'Menu makanan kustom baru berhasil ditambahkan.'
        });
      }
      hideForm();
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
    <>
      <style>{`
        .makanan-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1.35fr);
          gap: 24px;
          align-items: start;
          width: 100%;
        }
        @media (max-width: 1024px) {
          .makanan-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

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
          <span>Menu makanan yang dikelola di sini akan otomatis tersedia pada Kalkulator Gizi & Kalori Mandiri untuk Warga.</span>
        </div>

        {/* Modal Notifikasi Error & Sukses */}
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

        <div className="makanan-grid-layout">
          {/* KIRI: CARI DARI DATABASE REFERENSI STANDAR KEMENKES */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--orange-bg, #FFF1DF)',
                  color: 'var(--orange-deep, #B5650C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <KitchenUtensilsIcon size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
                  Referensi Kalori Standar
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                  Pilih cepat dari standar gizi lokal
                </span>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
              Ketik nama makanan untuk mencari referensi porsi dan kalori baku, lalu tambahkan ke database dengan 1 klik.
            </p>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search01Icon
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }}
              />
              <input
                type="text"
                placeholder="Cari makanan (Contoh: Nasi, Soto, Tempe)..."
                value={searchMockQuery}
                onChange={(e) => setSearchMockQuery(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  padding: '0 14px 0 42px',
                  fontSize: '13.5px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ maxHeight: '480px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredMock.map((food, idx) => {
                const isAlreadyAdded = foods.some(f => f.nama_makanan?.toLowerCase() === food.nama_makanan?.toLowerCase());
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      backgroundColor: isAlreadyAdded ? '#f8fafc' : '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      gap: '10px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {food.nama_makanan}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--orange-deep, #B5650C)', fontWeight: 800 }}>
                          {food.kalori_per_porsi} kkal
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {food.kategori}</span>
                      </div>
                    </div>

                    <Button
                      variant={isAlreadyAdded ? 'secondary' : 'teal'}
                      size="sm"
                      icon={isAlreadyAdded ? CheckmarkCircle01Icon : Add01Icon}
                      iconOnly
                      onClick={() => handleSaveFromApi(food)}
                      disabled={isLoading || isAlreadyAdded}
                      title={isAlreadyAdded ? 'Sudah Ada di Basis Data' : 'Tambah ke Menu'}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* KANAN: BASIS DATA POSYANDU & EDITOR */}
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
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink, #0f172a)', margin: 0 }}>
                  Basis Data Makanan Posyandu
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft, #64748b)' }}>
                  Total {foods.length} makanan terdaftar
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Add01Icon}
                iconOnly
                onClick={() => showForm(null)}
                title="Tambah Menu Kustom"
              />
            </div>

            {/* FORM INLINE TAMBAH / EDIT MAKANAN */}
            {editingId && (
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f0fdfa', border: '1.5px solid #99f6e4', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f766e' }}>
                    {editingId === 'new' ? '+ Tambah Menu Kustom Baru' : 'Edit Data Makanan'}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={Cancel01Icon}
                    onClick={hideForm}
                    title="Tutup"
                  />
                </div>

                <form onSubmit={handleSave}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Nama Makanan *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bubur Manado (1 porsi)"
                        value={formData.nama_makanan}
                        onChange={(e) => setFormData({ ...formData, nama_makanan: e.target.value })}
                        required
                        style={{ width: '100%', minHeight: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px', backgroundColor: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Kalori (kkal) *</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="5000"
                        placeholder="Contoh: 180"
                        value={formData.kalori_per_porsi}
                        onChange={(e) => setFormData({ ...formData, kalori_per_porsi: e.target.value })}
                        required
                        style={{ width: '100%', minHeight: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px', backgroundColor: '#fff' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={hideForm}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      loading={isLoading}
                      loadingText="Menyimpan..."
                    >
                      Simpan Data
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* FILTER SEARCH DATABASE */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search01Icon
                size={16}
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
                placeholder="Filter menu terdaftar..."
                value={searchDbQuery}
                onChange={(e) => setSearchDbQuery(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  padding: '0 12px 0 36px',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ maxHeight: '480px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredDb.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <KitchenUtensilsIcon size={32} style={{ margin: '0 auto 6px', color: '#94a3b8' }} />
                  <p style={{ fontWeight: 700, fontSize: '13.5px', color: '#334155', margin: 0 }}>Belum Ada Data</p>
                </div>
              ) : (
                filteredDb.map((food) => (
                  <div
                    key={food.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      gap: '10px'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {food.nama_makanan}
                      </h4>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange-deep, #B5650C)' }}>
                        {food.kalori_per_porsi} kkal / porsi
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit02Icon}
                        onClick={() => showForm(food.id)}
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
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}