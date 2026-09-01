import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Info, Search, Plus, FileEdit, Pencil, Trash } from 'lucide-react';

// === DATABASE PINTAR (MINI API MAKANAN INDONESIA) ===
// Bertindak sebagai "API Luar" agar Kader tidak perlu menebak kalori
const EXTERNAL_API_MOCK = [
  { nama_makanan: 'Nasi Putih (1 centong/100g)', kalori_per_porsi: 130 },
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
  { nama_makanan: 'Mie Instan Kuah (1 bungkus)', kalori_per_porsi: 330 },
  { nama_makanan: 'Bubur Ayam (1 mangkuk)', kalori_per_porsi: 372 },
  { nama_makanan: 'Nasi Padang (1 porsi komplit)', kalori_per_porsi: 680 },
  { nama_makanan: 'Pempek (1 porsi)', kalori_per_porsi: 390 },
  { nama_makanan: 'Sayur Sop (1 mangkuk)', kalori_per_porsi: 70 },
];

export default function KelolaMakananView() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nama_makanan: '', kalori_per_porsi: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State untuk Fitur Pencarian Cerdas
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('/api/makanan');
      setFoods(response.data.data);
    } catch (err) {
      console.error("Gagal memuat data makanan", err);
    }
  };

  // Handler Pencarian Database Pintar
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

  // Menyimpan langsung dari Database Pintar ke Laravel
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
      setMessage({ type: 'success', text: `✨ ${food.nama_makanan} berhasil ditambahkan ke Posyandu!` });
      setSearchQuery('');
      setSearchResults([]);
      fetchFoods(); // Segarkan tabel
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
        setMessage({ type: 'success', text: 'Data makanan dihapus.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal menghapus data makanan.' });
      }
    }
  };

  return (
    <div style={{ animation: 'fadein 0.4s ease' }}>
      <div className="callout" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Info />
        <span>Pilih makanan dari Database Pintar atau ketik manual. Makanan yang ditambahkan di sini akan muncul di Kalkulator Warga.</span>
      </div>

      {message.text && (
        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
          {message.text}
        </div>
      )}

      <div className="grid grid-2" style={{ gap: '24px', alignItems: 'start' }}>

        {/* KIRI: PENCARIAN CERDAS (API MOCK) */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', border: 'none' }}>
          <div className="section-head" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--cyan-deep)', margin: 0 }}><Search className="me-2" />Cari dari Database Pintar</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#0369a1' }}>Ketik nama makanan (misal: Nasi, Soto, Ayam), kalorinya sudah otomatis tersedia!</p>
          </div>

          <input
            type="text"
            className="form-field full"
            placeholder="Cari makanan di sini..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #bae6fd', width: '100%', marginBottom: '12px' }}
          />

          {searchResults.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {searchResults.map((food, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>{food.nama_makanan}</div>
                    <div style={{ fontSize: '12px', color: 'var(--orange-deep)', fontWeight: '600' }}>{food.kalori_per_porsi} kkal</div>
                  </div>
                  <button className="btn btn-sm btn-outline" style={{ color: 'var(--cyan-deep)', borderColor: 'var(--cyan-deep)' }} onClick={() => handleSaveFromApi(food)} disabled={isLoading}>
                    <Plus /> Tambah
                  </button>
                </div>
              ))}
            </div>
          )}
          {searchQuery.length > 1 && searchResults.length === 0 && (
             <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '13px' }}>Makanan tidak ditemukan di Database Pintar. Silakan tambah manual.</div>
          )}
        </div>

        {/* KANAN: TAMBAH MANUAL & DAFTAR MAKANAN */}
        <div className="card">
          <div className="section-head" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Daftar Menu Posyandu</h3>
            <button className="btn btn-violet btn-sm" onClick={() => showForm()}><FileEdit className="me-1" />Input Manual</button>
          </div>

          {editingId && (
            <div className="card pad-sm" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', marginBottom: '16px' }}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Nama Makanan (+ takaran porsi)</label>
                  <input type="text" value={formData.nama_makanan} onChange={(e) => setFormData({ ...formData, nama_makanan: e.target.value })} placeholder="mis. Jus Alpukat (1 gelas)" />
                </div>
                <div className="form-field full">
                  <label>Kalori per Porsi (kkal)</label>
                  <input type="number" value={formData.kalori_per_porsi} onChange={(e) => setFormData({ ...formData, kalori_per_porsi: e.target.value })} placeholder="mis. 220" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button className="btn btn-violet" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : (editingId === 'new' ? 'Simpan Manual' : 'Simpan Perubahan')}
                </button>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={hideForm}>Batal</button>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Menu Makanan</th><th>Kalori</th><th style={{ textAlign: 'right' }}>Aksi</th></tr></thead>
              <tbody>
                {foods.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada data makanan yang ditambahkan.</td></tr>
                ) : (
                  foods.map(f => (
                    <tr key={f.id}>
                      <td><b style={{ color: '#334155' }}>{f.nama_makanan}</b></td>
                      <td style={{ color: 'var(--orange-deep)', fontWeight: 'bold' }}>{f.kalori_per_porsi} kkal</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button className="btn btn-sm btn-outline" onClick={() => showForm(f.id)}><Pencil /></button>
                          <button className="btn btn-sm btn-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => handleDelete(f.id)}><Trash /></button>
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