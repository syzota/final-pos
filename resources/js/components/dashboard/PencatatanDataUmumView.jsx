import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default function PencatatanDataUmumView() {
    // === STATE DATA SESUAI KERTAS ===
    const [formData, setFormData] = useState({
        nama_posyandu: '', rukun_warga: '', desa: '', kecamatan: '',
        tahun: new Date().getFullYear().toString(), bulan: '',
        pengunjung_bayi: '', pengunjung_baduta: '', pengunjung_balita: '', pengunjung_wus: '', pengunjung_pus: '', pengunjung_ibu_hamil: '', pengunjung_ibu_menyusui: '',
        bayi_lahir: '', bayi_meninggal: '',
        mati_ibu_hamil_salin_nifas: '',
        petugas_kader: '', petugas_plkb: '', petugas_medis: '',
        nifas_fe: '', nifas_vit_a: '',
        hamil_kek: '', hamil_anemia: '',
        pengunjung_l: '', pengunjung_p: '',
        jml_kk: '', jml_ibu_melahirkan: '',
        mati_ibu_hamil: '', mati_ibu_melahirkan: '', mati_ibu_nifas: ''
    });

    const [isPrinting, setIsPrinting] = useState(false);
    const [printData, setPrintData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // === STATE UNTUK RIWAYAT DARI DATABASE ===
    const [riwayat, setRiwayat] = useState([]);
    const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);

    // === AMBIL RIWAYAT SAAT HALAMAN DIBUKA ===
    useEffect(() => {
        fetchRiwayat();
    }, []);

    const fetchRiwayat = async () => {
        setIsLoadingRiwayat(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/data-umum', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRiwayat(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil riwayat", error);
        } finally {
            setIsLoadingRiwayat(false);
        }
    };

    // === HANDLER INPUT ===
    const handleChange = (e) => {
        const { name, value } = e.target;
        const textFields = ['nama_posyandu', 'rukun_warga', 'desa', 'kecamatan', 'bulan'];

        if (!textFields.includes(name)) {
            const onlyNums = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: onlyNums });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // === FUNGSI SIMPAN ASLI KE LARAVEL ===
    const handleSave = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post('/api/data-umum', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: response.data.pesan });

            // Kosongkan form angka setelah sukses
            setFormData({
                ...formData,
                pengunjung_bayi: '', pengunjung_baduta: '', pengunjung_balita: '', pengunjung_wus: '', pengunjung_pus: '', pengunjung_ibu_hamil: '', pengunjung_ibu_menyusui: '',
                bayi_lahir: '', bayi_meninggal: '', mati_ibu_hamil_salin_nifas: '',
                petugas_kader: '', petugas_plkb: '', petugas_medis: '',
                nifas_fe: '', nifas_vit_a: '', hamil_kek: '', hamil_anemia: '',
                pengunjung_l: '', pengunjung_p: '', jml_kk: '', jml_ibu_melahirkan: '',
                mati_ibu_hamil: '', mati_ibu_melahirkan: '', mati_ibu_nifas: ''
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchRiwayat(); // Refresh tabel riwayat
        } catch (error) {
            const errMsg = error.response?.data?.pesan || error.message;
            setMessage({ type: 'error', text: `Gagal menyimpan: ${errMsg}` });
        } finally {
            setIsLoading(false);
        }
    };

    // === FUNGSI HAPUS DATA ===
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus data umum bulan ini?")) return;
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/data-umum/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Data berhasil dihapus!' });
            fetchRiwayat();
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal menghapus data.' });
        }
    };

    // === FUNGSI CETAK PDF ===
    const handlePrint = (historyData = null) => {
        if (historyData) setPrintData(historyData);
        else setPrintData(null);

        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setTimeout(() => { setIsPrinting(false); setPrintData(null); }, 500);
        }, 150);
    };

    const dataToPrint = printData || formData;

    return (
        <>
            <style>{`
        #dokumen-cetak-data-umum { display: none; }

        @media print {
          @page { size: portrait; margin: 15mm 20mm; }
          body * { visibility: hidden; }
          .no-print { display: none !important; }

          #dokumen-cetak-data-umum, #dokumen-cetak-data-umum * { visibility: visible; }
          #dokumen-cetak-data-umum {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 13.5px;
            color: #000;
          }

          .tabel-umum { width: 100%; border-collapse: collapse; margin-bottom: 12px; margin-top: 4px; }
          .tabel-umum th, .tabel-umum td { border: 1px solid #000; padding: 4px 8px; vertical-align: middle; }

          .titik-titik { border-bottom: 1px dotted #000; display: inline-block; min-width: 40px; text-align: right; padding-right: 4px; }
          .garis-bawah { border-bottom: 1px dotted #000; flex-grow: 1; margin: 0 8px; }
          .item-baris { display: flex; align-items: flex-end; margin-bottom: 10px; font-weight: bold; }

          .header-posyandu { margin-bottom: 24px; line-height: 1.6; font-size: 14px; }
          .header-posyandu span { display: inline-block; width: 120px; }

          /* Paksa warna hitam & putih, mengatasi teks/border yang jadi
             tak terlihat karena tertimpa reset CSS print global lain */
          #dokumen-cetak-data-umum, #dokumen-cetak-data-umum * {
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
            background-color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .tabel-umum th, .tabel-umum td {
            border-color: #000 !important;
          }

          .titik-titik, .garis-bawah {
            border-bottom-color: #000 !important;
          }
        }
      `}</style>

            {/* =========================================================
          TAMPILAN MONITOR (INPUT UNTUK KADER/KETUA)
          ========================================================= */}
            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ color: 'var(--violet-deep)', margin: '0 0 8px 0' }}>Pencatatan Data Umum Posyandu</h2>
                        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Isi data keseluruhan sasaran dan pengunjung Posyandu bulan ini.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-outline" onClick={() => handlePrint(null)} style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }}>
                            <i className="bi bi-printer me-2"></i> Ekspor PDF Kertas
                        </button>
                        <button className="btn btn-violet" onClick={handleSave} disabled={isLoading}>
                            <i className="bi bi-save me-2"></i> {isLoading ? 'Menyimpan...' : 'Simpan Data Baru'}
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
                        <b>Info Sistem:</b> {message.text}
                    </div>
                )}

                <div className="grid grid-2" style={{ marginBottom: '16px' }}>
                    {/* KIRI */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="card">
                            <div className="section-head"><h3>Identitas & Poin 1 - 2</h3></div>
                            <div className="form-grid">
                                <div className="form-field full"><label>Posyandu</label><input name="nama_posyandu" value={formData.nama_posyandu} onChange={handleChange} placeholder="Nama Posyandu" /></div>
                                <div className="form-field full"><label>Rukun Warga (RW)</label><input name="rukun_warga" value={formData.rukun_warga} onChange={handleChange} placeholder="mis. 05" /></div>
                                <div className="form-field"><label>Desa/Kelurahan</label><input name="desa" value={formData.desa} onChange={handleChange} /></div>
                                <div className="form-field"><label>Kecamatan</label><input name="kecamatan" value={formData.kecamatan} onChange={handleChange} /></div>

                                <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '8px' }}><b>Waktu Pendataan</b></div>
                                <div className="form-field"><label>1. Tahun</label><input type="number" name="tahun" value={formData.tahun} onChange={handleChange} placeholder="mis. 2026" /></div>
                                <div className="form-field"><label>2. Bulan</label><input name="bulan" value={formData.bulan} onChange={handleChange} placeholder="mis. Agustus" /></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="section-head"><h3>3. Jumlah Pengunjung</h3></div>
                            <div className="form-grid">
                                <div className="form-field"><label>Jml Bayi (0-12 Bln)</label><input name="pengunjung_bayi" value={formData.pengunjung_bayi} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Jml Baduta (13-24 Bln)</label><input name="pengunjung_baduta" value={formData.pengunjung_baduta} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field full"><label>Jml Balita (25-59 Bln)</label><input name="pengunjung_balita" value={formData.pengunjung_balita} onChange={handleChange} placeholder="0" /></div>

                                <div className="form-field"><label>Wanita Usia Subur (WUS)</label><input name="pengunjung_wus" value={formData.pengunjung_wus} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Pasangan Usia Subur (PUS)</label><input name="pengunjung_pus" value={formData.pengunjung_pus} onChange={handleChange} placeholder="0" /></div>

                                <div className="form-field"><label>Ibu Hamil</label><input name="pengunjung_ibu_hamil" value={formData.pengunjung_ibu_hamil} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Ibu Menyusui</label><input name="pengunjung_ibu_menyusui" value={formData.pengunjung_ibu_menyusui} onChange={handleChange} placeholder="0" /></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="section-head"><h3>4. Jumlah Bayi</h3></div>
                            <div className="form-grid">
                                <div className="form-field"><label>Bayi Lahir</label><input name="bayi_lahir" value={formData.bayi_lahir} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Bayi Meninggal</label><input name="bayi_meninggal" value={formData.bayi_meninggal} onChange={handleChange} placeholder="0" /></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="section-head"><h3>9. Jumlah Pengunjung (Berdasarkan Gender)</h3></div>
                            <div className="form-grid">
                                <div className="form-field"><label>Laki-laki</label><input name="pengunjung_l" value={formData.pengunjung_l} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Perempuan</label><input name="pengunjung_p" value={formData.pengunjung_p} onChange={handleChange} placeholder="0" /></div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="card">
                            <div className="section-head"><h3>Kematian Ibu & Petugas Hadir (Poin 5 & 6)</h3></div>
                            <div className="form-grid">
                                <div className="form-field full"><label>5. Jml Kematian Ibu Hamil, salin nifas</label><input name="mati_ibu_hamil_salin_nifas" value={formData.mati_ibu_hamil_salin_nifas} onChange={handleChange} placeholder="0" /></div>

                                <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '8px' }}><b>6. Jumlah Petugas Hadir</b></div>
                                <div className="form-field"><label>Kader PKK Posyandu</label><input name="petugas_kader" value={formData.petugas_kader} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>PLKB/PKB</label><input name="petugas_plkb" value={formData.petugas_plkb} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field full"><label>Medis dan Para Medis</label><input name="petugas_medis" value={formData.petugas_medis} onChange={handleChange} placeholder="0" /></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="section-head"><h3>Ibu Nifas & Ibu Hamil (Poin 7 & 8)</h3></div>
                            <div className="form-grid">
                                <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px' }}><b>7. Jumlah Ibu Nifas</b></div>
                                <div className="form-field"><label>Dapat Fe</label><input name="nifas_fe" value={formData.nifas_fe} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Dapat Vit A</label><input name="nifas_vit_a" value={formData.nifas_vit_a} onChange={handleChange} placeholder="0" /></div>

                                <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '8px' }}><b>8. Ibu Hamil</b></div>
                                <div className="form-field"><label>KEK (Kurang Energi Kronis)</label><input name="hamil_kek" value={formData.hamil_kek} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Anemia</label><input name="hamil_anemia" value={formData.hamil_anemia} onChange={handleChange} placeholder="0" /></div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="section-head"><h3>Keluarga & Kematian Ibu (Poin 10 - 12)</h3></div>
                            <div className="form-grid">
                                <div className="form-field full"><label>10. Jumlah Kepala Keluarga (KK)</label><input name="jml_kk" value={formData.jml_kk} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field full"><label>11. Jumlah Ibu melahirkan</label><input name="jml_ibu_melahirkan" value={formData.jml_ibu_melahirkan} onChange={handleChange} placeholder="0" /></div>

                                <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '8px' }}><b>12. Jumlah Kematian Ibu</b></div>
                                <div className="form-field"><label>Hamil</label><input name="mati_ibu_hamil" value={formData.mati_ibu_hamil} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Melahirkan</label><input name="mati_ibu_melahirkan" value={formData.mati_ibu_melahirkan} onChange={handleChange} placeholder="0" /></div>
                                <div className="form-field"><label>Nifas</label><input name="mati_ibu_nifas" value={formData.mati_ibu_nifas} onChange={handleChange} placeholder="0" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABEL RIWAYAT DARI DATABASE --- */}
                <div className="card" style={{ marginTop: '24px' }}>
                    <div className="section-head">
                        <h3>Riwayat Input Data Umum</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Bulan / Tahun</th>
                                <th>Total Pengunjung Bayi</th>
                                <th>Jml Ibu Hamil</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoadingRiwayat ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '16px' }}>Memuat riwayat...</td></tr>
                            ) : riwayat.length > 0 ? (
                                riwayat.map((item) => (
                                    <tr key={item.id}>
                                        <td><b>{item.bulan} {item.tahun}</b></td>
                                        <td>{item.pengunjung_bayi || 0} Bayi</td>
                                        <td>{item.pengunjung_ibu_hamil || 0} Orang</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button className="btn btn-sm btn-outline" style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }} onClick={() => handlePrint(item)}>
                                                    <i className="bi bi-printer"></i> Cetak
                                                </button>
                                                <button className="btn btn-sm btn-outline" style={{ color: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleDelete(item.id)}>
                                                    <i className="bi bi-trash"></i> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: '#666' }}>Belum ada riwayat pendataan.</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* =========================================================
          DOKUMEN RAHASIA CETAK PDF (HANYA MUNCUL DI KERTAS)
          Dirender via React Portal langsung ke document.body agar
          TIDAK terjebak/ke-clip oleh wrapper dashboard (.shell,
          .main, .content, dsb) yang menyebabkan hasil cetak blank.
          ========================================================= */}
            {isPrinting && dataToPrint && ReactDOM.createPortal(
                <div id="dokumen-cetak-data-umum">
                    <div className="header-posyandu">
                        <div><span>Posyandu</span>: {dataToPrint.nama_posyandu}</div>
                        <div><span>Rukun Warga</span>: {dataToPrint.rukun_warga}</div>
                        <div><span>Desa/Kelurahan</span>: {dataToPrint.desa}</div>
                        <div><span>Kecamatan</span>: {dataToPrint.kecamatan}</div>
                    </div>

                    <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>II.&nbsp;&nbsp;&nbsp;PENCATATAN "DATA UMUM POSYANDU "</h3>

                    <div style={{ paddingLeft: '16px' }}>
                        {/* Poin 1 */}
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontWeight: 'bold' }}>1&nbsp;&nbsp;&nbsp;Tahun</div>
                            <div style={{ color: '#555', fontSize: '12px', paddingLeft: '20px' }}>Diisi dengan tahun pendataan .............................................. <span style={{ color: '#000', fontSize: '13px' }}>{dataToPrint.tahun}</span></div>
                        </div>

                        {/* Poin 2 */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontWeight: 'bold' }}>2&nbsp;&nbsp;&nbsp;Bulan</div>
                            <div style={{ color: '#555', fontSize: '12px', paddingLeft: '20px' }}>Diisi dengan bulan pendataan .............................................. <span style={{ color: '#000', fontSize: '13px' }}>{dataToPrint.bulan}</span></div>
                        </div>

                        {/* Poin 3 */}
                        <div style={{ fontWeight: 'bold' }}>3&nbsp;&nbsp;&nbsp;Jumlah Pengunjung</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
                            <tbody>
                            <tr><td style={{ width: '60%' }}>Jml Bayi ( 0-12 Bln )</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_bayi}</span>&nbsp;Bayi</td></tr>
                            <tr><td>Jml Baduta ( 13-24 Bln )</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_baduta}</span>&nbsp;Bayi</td></tr>
                            <tr><td>Jml Balita ( 25- 59 Bln )</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_balita}</span>&nbsp;Bayi</td></tr>
                            <tr><td>WUS</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_wus}</span>&nbsp;Orang</td></tr>
                            <tr><td>PUS</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_pus}</span>&nbsp;Pasangan</td></tr>
                            <tr>
                                <td rowSpan="2" style={{ verticalAlign: 'middle' }}>Ibu</td>
                                <td style={{ textAlign: 'center', padding: '0' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                                        <tbody>
                                        <tr>
                                            <td style={{ width: '50%', border: 'none', borderRight: '1px solid #000', borderBottom: '1px solid #000', textAlign: 'center' }}>Hamil</td>
                                            <td style={{ width: '50%', border: 'none', borderBottom: '1px solid #000', textAlign: 'center' }}>Menyusui</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: 'none', borderRight: '1px solid #000', textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_ibu_hamil}</span>&nbsp;Orang</td>
                                            <td style={{ border: 'none', textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_ibu_menyusui}</span>&nbsp;Orang</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        {/* Poin 4 */}
                        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>4&nbsp;&nbsp;&nbsp;Jumlah Bayi</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
                            <tbody>
                            <tr><td style={{ width: '60%' }}>Lahir</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.bayi_lahir}</span>&nbsp;Bayi</td></tr>
                            <tr><td>Meninggal</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.bayi_meninggal}</span>&nbsp;Bayi</td></tr>
                            </tbody>
                        </table>

                        {/* Poin 5 */}
                        <div className="item-baris" style={{ marginTop: '16px' }}>
                            <span>5&nbsp;&nbsp;&nbsp;Jumlah Kematian Ibu Hamil, salin nifas</span><div className="garis-bawah"></div><span>{dataToPrint.mati_ibu_hamil_salin_nifas}</span>&nbsp;Orang
                        </div>

                        {/* Poin 6 */}
                        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>6&nbsp;&nbsp;&nbsp;Jumlah Petugas Hadir</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
                            <tbody>
                            <tr><td style={{ width: '60%' }}>Kader PKK Posyandu</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.petugas_kader}</span>&nbsp;Orang</td></tr>
                            <tr><td>PLKB/PKB</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.petugas_plkb}</span>&nbsp;Orang</td></tr>
                            <tr><td>Medis dan Para Medis</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.petugas_medis}</span>&nbsp;Orang</td></tr>
                            </tbody>
                        </table>

                        {/* Poin 7 */}
                        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>7&nbsp;&nbsp;&nbsp;Jumlah Ibu Nifas</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
                            <tbody>
                            <tr><td style={{ width: '60%' }}>Dapat Fe</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.nifas_fe}</span>&nbsp;Orang</td></tr>
                            <tr><td>Dapat Vit A</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.nifas_vit_a}</span>&nbsp;Orang</td></tr>
                            </tbody>
                        </table>

                        {/* Poin 8 */}
                        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>8&nbsp;&nbsp;&nbsp;Ibu Hamil</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
                            <tbody>
                            <tr><td style={{ width: '60%' }}>KEK</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.hamil_kek}</span>&nbsp;Orang</td></tr>
                            <tr><td>Anemia</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.hamil_anemia}</span>&nbsp;Orang</td></tr>
                            </tbody>
                        </table>

                        {/* Poin 9 */}
                        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>9&nbsp;&nbsp;&nbsp;Jumlah Pengunjung</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px' }}>
                            <tbody>
                            <tr><td style={{ width: '60%' }}>Laki-laki</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_l}</span>&nbsp;Orang</td></tr>
                            <tr><td>Perempuan</td><td style={{ textAlign: 'center' }}><span className="titik-titik">{dataToPrint.pengunjung_p}</span>&nbsp;Orang</td></tr>
                            </tbody>
                        </table>

                        {/* Poin 10 & 11 */}
                        <div className="item-baris" style={{ marginTop: '16px' }}>
                            <span>10&nbsp;&nbsp;Jumlah Kepala Keluarga</span><div className="garis-bawah"></div><span>{dataToPrint.jml_kk}</span>&nbsp;KK
                        </div>
                        <div className="item-baris" style={{ marginTop: '12px' }}>
                            <span>11&nbsp;&nbsp;Jumlah Ibu melahirkan</span><div className="garis-bawah"></div><span>{dataToPrint.jml_ibu_melahirkan}</span>&nbsp;Orang
                        </div>

                        {/* Poin 12 */}
                        <div style={{ fontWeight: 'bold', marginTop: '16px' }}>12&nbsp;&nbsp;Jumlah Kematian Ibu</div>
                        <table className="tabel-umum" style={{ width: '80%', marginLeft: '16px', textAlign: 'center' }}>
                            <thead>
                            <tr>
                                <th style={{ width: '33.33%' }}>Hamil</th>
                                <th style={{ width: '33.33%' }}>Melahirkan</th>
                                <th style={{ width: '33.33%' }}>Nifas</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><span className="titik-titik">{dataToPrint.mati_ibu_hamil}</span>&nbsp;Orang</td>
                                <td><span className="titik-titik">{dataToPrint.mati_ibu_melahirkan}</span>&nbsp;Orang</td>
                                <td><span className="titik-titik">{dataToPrint.mati_ibu_nifas}</span>&nbsp;Orang</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
