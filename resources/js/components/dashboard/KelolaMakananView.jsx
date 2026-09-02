import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Info, Search, Plus, FileEdit, Pencil, Trash2, Utensils, Check } from 'lucide-react';

const EXTERNAL_API_MOCK = [
  { nama_makanan: 'Nasi Putih (1 centong / 100g)', kalori_per_porsi: 130 },
  { nama_makanan: 'Nasi Goreng (1 porsi)', kalori_per_porsi: 267 },
  { nama_makanan: 'Mie Ayam (1 mangkuk)', kalori_per_porsi: 330 },
  { nama_makanan: 'Bakso Sapi (1 mangkuk)', kalori_per_porsi: 326 },
  { nama_makanan: 'Sate Ayam (10 tusuk)', kalori_per_porsi: 340 },
  { nama_makanan: 'Soto Ayam (1 mangkuk)', kalori_per_porsi: 220 },
  { nama_makanan: 'Rendang Sapi (1 potong)', kalori_per_porsi: 195 },
  { nama_makanan: 'Gado-Gado (1 porsi)', kalori_per_porsi: 318 },
  { nama_makanan: 'Tempe Goreng (1 potong)', kalori_per_porsi: 34 },
  { nama_makanan: 'Tahu Goreng (1 potong)', kalori_per_porsi: 35 },
  { nama_makanan: 'Ayam Goreng (1 potong)', kalori_per_porsi: 260 },
  { nama_makanan: 'Ikan Bakar (1 potong)', kalori_per_porsi: 150 },
  { nama_makanan: 'Es Teh Manis (1 gelas)', kalori_per_porsi: 90 },
  { nama_makanan: 'Kopi Manis (1 cangkir)', kalori_per_porsi: 70 },
  { nama_makanan: 'Pisang Goreng (1 potong)', kalori_per_porsi: 140 },
  { nama_makanan: 'Telur Mata Sapi (1 butir)', kalori_per_porsi: 92 },
  { nama_makanan: 'Telur Rebus (1 butir)', kalori_per_porsi: 77 },
  { nama_makanan: 'Susu Sapi (1 gelas)', kalori_per_porsi: 146 },
  { nama_makanan: 'Roti Tawar (1 lembar)', kalori_per_porsi: 75 },
  { nama_makanan: 'Mie Instan Goreng (1 bungkus)', kalori_per_porsi: 380 },
  { nama_makanan: 'Sayur Sop (1 mangkuk)', kalori_per_porsi: 70 },
];

export default function KelolaMakananView() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama_makanan: '', kalori_per_porsi: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 1) {
      const results = EXTERNAL_API_MOCK.filter(food =>
        food.nama_makanan.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSaveFromApi = async (food) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('auth_token');

    try {
      await axios.post('/api/makanan', {
        nama_makanan: food.nama_makanan,
        kalori_per_porsi: food.kalori_per_porsi
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: `✨ ${food.nama_makanan} berhasil ditambahkan ke referensi!` });
      setSearchQuery('');
      setSearchResults([]);
      fetchFoods();
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan makanan dari database pintar.' });
    } finally {
      setIsLoading(false);
    }
  };

  const showForm = (id) => {
    setMessage({ type: '', text: '' });
    if (id) {
      const food = foods.find(f => f.id === id);
      setEditingId(id);
      setFormData({ nama_makanan: food.nama_makanan, kalori_per_porsi: food.kalori_per_porsi });
    } else {
      setEditingId('new');
      setFormData({ nama_makanan: '', kalori_per_porsi: '' });
    }
  };

  const hideForm = () => setEditingId(null);

  const handleSave = async () => {
    if (!formData.nama_makanan || !formData.kalori_per_porsi) {
      return alert('Nama makanan dan kalori wajib diisi.');
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('auth_token');

    try {
      if (editingId && editingId !== 'new') {
        await axios.put(`/api/makanan/${editingId}`, formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Makanan berhasil diperbarui.' });
      } else {
        await axios.post('/api/makanan', formData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage({ type: 'success', text: 'Makanan baru berhasil ditambahkan.' });
      }
      hideForm();
      fetchFoods();
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan data makanan.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus makanan ini dari daftar Kalkulator Kalori?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`/api/makanan/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFoods(foods.filter(f => f.id !== id));
        setMessage({ type: 'success', text: 'Data makanan berhasil dihapus.' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal menghapus data makanan.' });
      }
    }
  };

  return (
    <div style={{ animation: 'fadein 0.3s ease' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: '#f0fdfa',
          border: '1px solid #ccfbf1',
          color: '#0f766e',
          fontSize: '13.5px',
          marginBottom: '20px'
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>Menu makanan yang dikelola di sini akan otomatis tersedia pada Kalkulator Kalori Mandiri untuk Warga.</span>
      </div>

      {message.text && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            color: message.type === 'error' ? '#b91c1c' : '#15803d'
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* KIRI: CARI DARI DATABASE PINTAR */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Utensils size={20} color="#008080" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Cari Referensi Kalori Makanan
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            Ketik nama makanan (mis. Nasi, Soto, Tempe), nilai kalori sudah terstandardisasi.
          </p>

          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Ketik nama makanan lokal..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                width: '100%',
                minHeight: '44px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                padding: '0 14px 0 42px',
                fontSize: '13.5px',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {searchResults.length > 0 && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              {searchResults.map((food, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>{food.nama_makanan}</div>
                    <div style={{ fontSize: '12.5px', color: '#ea580c', fontWeight: 700 }}>{food.kalori_per_porsi} kkal</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveFromApi(food)}
                    disabled={isLoading}
                    style={{
                      minHeight: '34px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: '1px solid #008080',
                      backgroundColor: '#f0fdfa',
                      color: '#008080',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Tambah
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KANAN: DAFTAR MENU & INPUT MANUAL */}
        <div className="card" style={{ padding: '24px', borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Daftar Menu Posyandu
            </h3>
            <button
              type="button"
              onClick={() => showForm()}
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
              <FileEdit size={15} /> Input Manual
            </button>
          </div>

          {editingId && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Nama Makanan</label>
                  <input
                    type="text"
                    value={formData.nama_makanan}
                    onChange={(e) => setFormData({ ...formData, nama_makanan: e.target.value })}
                    placeholder="mis. Jus Buah Naga (1 gelas)"
                    style={{ width: '100%', minHeight: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Kalori per Porsi (kkal)</label>
                  <input
                    type="number"
                    value={formData.kalori_per_porsi}
                    onChange={(e) => setFormData({ ...formData, kalori_per_porsi: e.target.value })}
                    placeholder="mis. 180"
                    style={{ width: '100%', minHeight: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading}
                    style={{ flex: 1, minHeight: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-teal, #008080)', color: '#ffffff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}
                  >
                    {editingId === 'new' ? 'Simpan Manual' : 'Simpan Perubahan'}
                  </button>
                  <button
                    type="button"
                    onClick={hideForm}
                    style={{ flex: 1, minHeight: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="table" style={{ fontSize: '13px', width: '100%' }}>
              <thead>
                <tr>
                  <th>Menu Makanan</th>
                  <th>Kalori</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {foods.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                      Belum ada data makanan yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  foods.map(f => (
                    <tr key={f.id}>
                      <td><strong style={{ color: '#0f172a' }}>{f.nama_makanan}</strong></td>
                      <td><span style={{ color: '#ea580c', fontWeight: 700 }}>{f.kalori_per_porsi} kkal</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => showForm(f.id)}
                            style={{ minHeight: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer' }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(f.id)}
                            style={{ minHeight: '32px', padding: '0 8px', borderRadius: '6px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}