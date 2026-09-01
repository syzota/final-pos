import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { Printer } from 'lucide-react';

export default function ProfilView() {
    const [formData, setFormData] = useState({
        nama: '', alamat: '', kontak_darurat: '', link_gmaps: '',
        kd_kecamatan: '', kd_desa: '', rukun_tetangga: '', nomor_posyandu: '',
        strata: 'Purnama', program_paud: 'Tidak', program_bkb: 'Tidak', program_terintegrasi: '',
        pj_umum: '', pj_operasional: '', ketua_pelaksana: '', sekretaris: '', bendahara: '',
        jml_kader_aktif: 0, jml_kader_tidak_aktif: 0, petugas_kb: '', medis_paramedis: '', bidan_desa: '', keterangan_profil: '',
        tempat_pelayanan: 'Gedung Sendiri', timbangan: 'Tersedia',
        jml_dacin: 0, timbangan_bayi: 0, timbangan_balita: 0, timbangan_ibu: 0,
        buku_kia: 'Tersedia', formulir_sip: 'Tersedia', blanko_skdn: 'Tersedia',
        buku_catatan_keuangan: 'Tersedia', alat_peraga_penyuluhan: 'Tersedia', ape: 'Tersedia',
        sarana_lain: '', keterangan_sarana: ''
    });

    const [foto, setFoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // === STATE UNTUK CETAK PDF ===
    const [printSection, setPrintSection] = useState(null);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/posyandu/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.data) {
                    const dataDariDb = response.data.data;
                    setFormData(prev => ({ ...prev, ...dataDariDb }));
                }
            } catch (err) {
                console.error("Gagal memuat profil posyandu", err);
            }
        };
        fetchProfil();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFoto(e.target.files[0]);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('auth_token');
            const submitData = new FormData();

            // Daftar hitam kolom yang tidak boleh dikirim balik ke database
            const blacklist = ['jadwal', 'id', 'created_at', 'updated_at', 'foto', 'no_telepon'];

            Object.keys(formData).forEach(key => {
                if (!blacklist.includes(key)) {
                    submitData.append(key, formData[key] === null ? '' : formData[key]);
                }
            });

            if (foto) submitData.append('foto', foto);

            await axios.post('/api/posyandu/me/update', submitData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'Seluruh data Profil, Sarana, dan Lokasi berhasil disimpan!' });
            window.scrollTo(0, 0);
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message;
            setMessage({ type: 'error', text: `Gagal menyimpan. Pesan sistem: ${errMsg}` });
        } finally {
            setIsLoading(false);
        }
    };

    // === FUNGSI CETAK PDF ===
    const handlePrint = (section) => {
        setPrintSection(section);
        setIsPrinting(true);
        // Beri jeda agar React me-render tabel rahasia (via portal ke document.body), lalu buka jendela print
        setTimeout(() => {
            window.print();
            // Kembalikan state setelah jendela print ditutup
            setTimeout(() => {
                setIsPrinting(false);
                setPrintSection(null);
            }, 500);
        }, 150);
    };

    return (
        <>
            {/* =========================================
          GAYA CSS KHUSUS UNTUK CETAK KERTAS PDF
          ========================================= */}
            <style>{`
        #dokumen-cetak { display: none; }

        @media print {
          html, body { height: auto !important; overflow: visible !important; position: static !important; }
          body * { visibility: hidden; }
          #dokumen-cetak, #dokumen-cetak * { visibility: visible; }
          #dokumen-cetak {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .tabel-cetak { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          .tabel-cetak th, .tabel-cetak td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
          .tabel-cetak th { background-color: #f2f2f2; width: 40%; }
          .no-print { display: none !important; }

          /* Paksa warna hitam & putih, mengatasi teks/border yang jadi
             tak terlihat karena tertimpa reset CSS print global lain */
          #dokumen-cetak, #dokumen-cetak * {
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
            background-color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .tabel-cetak th, .tabel-cetak td { border-color: #000 !important; }
          .tabel-cetak th { background-color: #f2f2f2 !important; }
        }
      `}</style>

            {/* FORM UTAMA (HANYA TAMPIL DI LAYAR MONITOR) */}
            <form onSubmit={handleSave} className="no-print">
                {message.text && (
                    <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
                        <b>Info Sistem:</b> {message.text}
                    </div>
                )}

                <div className="grid grid-2">
                    {/* ======================= PROFIL KIRI ======================= */}
                    <div className="card">
                        <div className="section-head" style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Profil Posyandu (SIP)</h3>
                            <span className="badge badge-violet ms-2">Data Publik</span>
                            {/* TOMBOL CETAK PROFIL */}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => handlePrint('profil')}
                                style={{ marginLeft: 'auto', color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }}
                            >
                                <Printer className="me-1" /> Cetak Profil
                            </button>
                        </div>

                        <div className="form-grid">
                            {/* Bagian Identitas */}
                            <div className="form-field"><label>Kode Kecamatan</label><input name="kd_kecamatan" value={formData.kd_kecamatan || ''} onChange={handleChange} placeholder="Sesuai lembar SIP" /></div>
                            <div className="form-field"><label>Kode Desa</label><input name="kd_desa" value={formData.kd_desa || ''} onChange={handleChange} placeholder="Sesuai lembar SIP" /></div>
                            <div className="form-field"><label>Rukun Tetangga (RT)</label><input name="rukun_tetangga" value={formData.rukun_tetangga || ''} onChange={handleChange} placeholder="mis. 04" /></div>
                            <div className="form-field"><label>Nomor Posyandu</label><input name="nomor_posyandu" value={formData.nomor_posyandu || ''} onChange={handleChange} placeholder="mis. 01" /></div>

                            <div className="form-field full" style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '4px' }}><label>Alamat Lengkap</label><input name="alamat" value={formData.alamat || ''} onChange={handleChange} placeholder="Jl. Contoh RT 01" /></div>

                            {/* Bagian Profil */}
                            <div className="form-field"><label>Strata Posyandu</label>
                                <select name="strata" value={formData.strata || ''} onChange={handleChange}>
                                    <option value="Pratama">Pratama</option><option value="Madya">Madya</option>
                                    <option value="Purnama">Purnama</option><option value="Mandiri">Mandiri</option>
                                </select>
                            </div>
                            <div className="form-field"><label>Program Integrasi PAUD</label>
                                <select name="program_paud" value={formData.program_paud || 'Tidak'} onChange={handleChange}><option value="Ada">Ada</option><option value="Tidak">Tidak</option></select>
                            </div>
                            <div className="form-field"><label>Program Integrasi BKB</label>
                                <select name="program_bkb" value={formData.program_bkb || 'Tidak'} onChange={handleChange}><option value="Ada">Ada</option><option value="Tidak">Tidak</option></select>
                            </div>
                            <div className="form-field"><label>Program Lain-lain (Opsional)</label><input name="program_terintegrasi" value={formData.program_terintegrasi || ''} onChange={handleChange} placeholder="mis. Posbindu" /></div>

                            <div className="form-field"><label>Penanggung Jawab Umum</label><input name="pj_umum" value={formData.pj_umum || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Penanggung Jawab Operasional</label><input name="pj_operasional" value={formData.pj_operasional || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Ketua Pelaksana</label><input name="ketua_pelaksana" value={formData.ketua_pelaksana || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Sekretaris</label><input name="sekretaris" value={formData.sekretaris || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Bendahara</label><input name="bendahara" value={formData.bendahara || ''} onChange={handleChange} /></div>

                            <div className="form-field"><label>Jumlah Kader Aktif</label><input type="number" name="jml_kader_aktif" value={formData.jml_kader_aktif || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Jumlah Kader Tidak Aktif</label><input type="number" name="jml_kader_tidak_aktif" value={formData.jml_kader_tidak_aktif || ''} onChange={handleChange} /></div>

                            <div className="form-field"><label>Petugas KB</label><input name="petugas_kb" value={formData.petugas_kb || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Medis dan Paramedis</label><input name="medis_paramedis" value={formData.medis_paramedis || ''} onChange={handleChange} placeholder="Nama petugas medis" /></div>
                            <div className="form-field"><label>Bidan Desa</label><input name="bidan_desa" value={formData.bidan_desa || ''} onChange={handleChange} /></div>
                            <div className="form-field full"><label>Keterangan Profil</label><textarea rows="2" name="keterangan_profil" value={formData.keterangan_profil || ''} onChange={handleChange} placeholder="Tambahkan keterangan tambahan bila ada..."></textarea></div>
                        </div>
                    </div>

                    {/* ======================= SARANA KANAN ======================= */}
                    <div className="card">
                        <div className="section-head" style={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Data Sarana Posyandu (SIP)</h3>
                            {/* TOMBOL CETAK SARANA */}
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={() => handlePrint('sarana')}
                                style={{ marginLeft: 'auto', color: 'var(--magenta-deep)', borderColor: 'var(--magenta-deep)' }}
                            >
                                <Printer className="me-1" /> Cetak Sarana
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="form-field"><label>Tempat Pelayanan</label>
                                <select name="tempat_pelayanan" value={formData.tempat_pelayanan || ''} onChange={handleChange}>
                                    <option value="Gedung Sendiri">Gedung Sendiri</option><option value="Menumpang">Menumpang</option><option value="Sewa">Sewa</option>
                                </select>
                            </div>

                            {/* Bagian Timbangan Diperinci */}
                            <div className="form-field full" style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '4px', paddingBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#444' }}>Ketersediaan Timbangan (Jumlah Alat)</span>
                            </div>
                            <div className="form-field"><label>Status Timbangan</label>
                                <select name="timbangan" value={formData.timbangan || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field"><label>Jumlah Dacin</label><input type="number" name="jml_dacin" value={formData.jml_dacin || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Jumlah Timbangan Bayi</label><input type="number" name="timbangan_bayi" value={formData.timbangan_bayi || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Jumlah Timbangan Balita</label><input type="number" name="timbangan_balita" value={formData.timbangan_balita || ''} onChange={handleChange} /></div>
                            <div className="form-field"><label>Jumlah Timbangan Ibu</label><input type="number" name="timbangan_ibu" value={formData.timbangan_ibu || ''} onChange={handleChange} /></div>

                            {/* Administrasi */}
                            <div className="form-field full" style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '4px' }}></div>
                            <div className="form-field"><label>Buku KIA</label>
                                <select name="buku_kia" value={formData.buku_kia || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field"><label>Formulir SIP</label>
                                <select name="formulir_sip" value={formData.formulir_sip || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field"><label>Blanko SKDN</label>
                                <select name="blanko_skdn" value={formData.blanko_skdn || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field"><label>Buku Catatan Keuangan</label>
                                <select name="buku_catatan_keuangan" value={formData.buku_catatan_keuangan || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field"><label>Alat Peraga Penyuluhan</label>
                                <select name="alat_peraga_penyuluhan" value={formData.alat_peraga_penyuluhan || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field"><label>Alat Permainan Edukasi (APE)</label>
                                <select name="ape" value={formData.ape || ''} onChange={handleChange}><option value="Tersedia">Tersedia</option><option value="Tidak Tersedia">Tidak Tersedia</option></select>
                            </div>
                            <div className="form-field full"><label>Sarana Lainnya</label><input name="sarana_lain" value={formData.sarana_lain || ''} onChange={handleChange} placeholder="mis. Ruang tunggu, dapur sehat" /></div>
                            <div className="form-field full"><label>Keterangan Sarana</label><textarea rows="2" name="keterangan_sarana" value={formData.keterangan_sarana || ''} onChange={handleChange} placeholder="Tambahkan keterangan kondisi alat bila ada..."></textarea></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-2" style={{ marginTop: '16px' }}>
                    <div className="card">
                        <div className="section-head"><h3>Lokasi Geografis (G-Maps)</h3></div>
                        <p style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 500, marginBottom: '12px' }}>Salin dan tempel (copy-paste) link tautan dari Google Maps lokasi Posyandu Anda.</p>
                        <div className="form-grid" style={{ marginTop: '12px' }}>
                            <div className="form-field full">
                                <label>Tautan (Link) Google Maps</label>
                                <input name="link_gmaps" value={formData.link_gmaps || ''} onChange={handleChange} placeholder="misal: https://maps.app.goo.gl/xxxxx" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-head"><h3>Foto & Kontak Darurat</h3></div>
                        <p style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 500, marginBottom: '12px' }}>Foto bangunan ini akan tampil di Beranda 9 Posyandu.</p>
                        <div className="form-field">
                            <input type="file" onChange={handleFileChange} accept="image/*" style={{ padding: '8px', border: '1px dashed #ccc', width: '100%' }} />
                        </div>
                        <div className="form-field" style={{ marginTop: '16px' }}>
                            <label>Nomor Kontak Darurat Posyandu</label>
                            <input name="kontak_darurat" value={formData.kontak_darurat || ''} onChange={handleChange} placeholder="0812-5000-1001" />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button type="submit" className="btn btn-violet" disabled={isLoading}>
                        {isLoading ? 'Menyimpan...' : 'Simpan Seluruh Perubahan Data'}
                    </button>
                </div>
            </form>

            {/* =========================================================================
          LAPORAN CETAK RAHASIA (HANYA MUNCUL DI PDF, BUKAN DI LAYAR MONITOR)
          Dirender via React Portal langsung ke document.body agar TIDAK
          terjebak/ke-clip oleh wrapper dashboard (.shell, .main, .content, dsb)
          yang menyebabkan hasil cetak blank.
          ========================================================================= */}
            {isPrinting && printSection === 'profil' && ReactDOM.createPortal(
                <div id="dokumen-cetak">
                    <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>Data Profil Posyandu (SIP)</h2>
                    <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>Nama Posyandu: {formData.nama || '-'}</h4>
                    <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>I. Identitas Wilayah</h3>
                    <table className="tabel-cetak">
                        <tbody>
                        <tr><th>Kode Kecamatan</th><td>{formData.kd_kecamatan || '-'}</td></tr>
                        <tr><th>Kode Desa / Kelurahan</th><td>{formData.kd_desa || '-'}</td></tr>
                        <tr><th>Rukun Tetangga (RT)</th><td>{formData.rukun_tetangga || '-'}</td></tr>
                        <tr><th>Nomor Posyandu</th><td>{formData.nomor_posyandu || '-'}</td></tr>
                        <tr><th>Alamat Lengkap</th><td>{formData.alamat || '-'}</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>II. Profil Posyandu & Kepengurusan</h3>
                    <table className="tabel-cetak">
                        <tbody>
                        <tr><th>Strata Posyandu</th><td>{formData.strata || '-'}</td></tr>
                        <tr><th>Program Integrasi PAUD</th><td>{formData.program_paud || 'Tidak'}</td></tr>
                        <tr><th>Program Integrasi BKB</th><td>{formData.program_bkb || 'Tidak'}</td></tr>
                        <tr><th>Program Lain-lain</th><td>{formData.program_terintegrasi || '-'}</td></tr>
                        <tr><th>Penanggung Jawab Umum</th><td>{formData.pj_umum || '-'}</td></tr>
                        <tr><th>Penanggung Jawab Operasional</th><td>{formData.pj_operasional || '-'}</td></tr>
                        <tr><th>Ketua Pelaksana</th><td>{formData.ketua_pelaksana || '-'}</td></tr>
                        <tr><th>Sekretaris</th><td>{formData.sekretaris || '-'}</td></tr>
                        <tr><th>Bendahara</th><td>{formData.bendahara || '-'}</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px', pageBreakBefore: 'auto' }}>III. Tenaga Medis & Kader</h3>
                    <table className="tabel-cetak">
                        <tbody>
                        <tr><th>Jumlah Kader Aktif</th><td>{formData.jml_kader_aktif || 0} Orang</td></tr>
                        <tr><th>Jumlah Kader Tidak Aktif</th><td>{formData.jml_kader_tidak_aktif || 0} Orang</td></tr>
                        <tr><th>Petugas KB</th><td>{formData.petugas_kb || '-'}</td></tr>
                        <tr><th>Medis dan Paramedis</th><td>{formData.medis_paramedis || '-'}</td></tr>
                        <tr><th>Bidan Desa</th><td>{formData.bidan_desa || '-'}</td></tr>
                        <tr><th>Keterangan Tambahan</th><td style={{ whiteSpace: 'pre-wrap' }}>{formData.keterangan_profil || '-'}</td></tr>
                        </tbody>
                    </table>
                </div>,
                document.body
            )}

            {isPrinting && printSection === 'sarana' && ReactDOM.createPortal(
                <div id="dokumen-cetak">
                    <h2 style={{ textAlign: 'center', margin: '0 0 5px 0' }}>Data Sarana Posyandu (SIP)</h2>
                    <h4 style={{ textAlign: 'center', color: '#555', marginTop: 0, marginBottom: '24px' }}>Nama Posyandu: {formData.nama || '-'}</h4>
                    <hr style={{ borderTop: '2px solid #000', marginBottom: '24px' }} />

                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>I. Lokasi & Fasilitas Timbangan</h3>
                    <table className="tabel-cetak">
                        <tbody>
                        <tr><th>Tempat Pelayanan</th><td>{formData.tempat_pelayanan || '-'}</td></tr>
                        <tr><th>Status Timbangan Keseluruhan</th><td>{formData.timbangan || '-'}</td></tr>
                        <tr><th>Jumlah Timbangan Dacin</th><td>{formData.jml_dacin || 0} Unit</td></tr>
                        <tr><th>Jumlah Timbangan Bayi</th><td>{formData.timbangan_bayi || 0} Unit</td></tr>
                        <tr><th>Jumlah Timbangan Balita</th><td>{formData.timbangan_balita || 0} Unit</td></tr>
                        <tr><th>Jumlah Timbangan Ibu</th><td>{formData.timbangan_ibu || 0} Unit</td></tr>
                        </tbody>
                    </table>

                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontSize: '16px' }}>II. Kelengkapan Administrasi & Alat Peraga</h3>
                    <table className="tabel-cetak">
                        <tbody>
                        <tr><th>Buku KIA</th><td>{formData.buku_kia || '-'}</td></tr>
                        <tr><th>Formulir SIP</th><td>{formData.formulir_sip || '-'}</td></tr>
                        <tr><th>Blanko SKDN</th><td>{formData.blanko_skdn || '-'}</td></tr>
                        <tr><th>Buku Catatan Keuangan</th><td>{formData.buku_catatan_keuangan || '-'}</td></tr>
                        <tr><th>Alat Peraga Penyuluhan</th><td>{formData.alat_peraga_penyuluhan || '-'}</td></tr>
                        <tr><th>Alat Permainan Edukasi (APE)</th><td>{formData.ape || '-'}</td></tr>
                        <tr><th>Sarana Lainnya</th><td>{formData.sarana_lain || '-'}</td></tr>
                        <tr><th>Keterangan Kondisi Sarana</th><td style={{ whiteSpace: 'pre-wrap' }}>{formData.keterangan_sarana || '-'}</td></tr>
                        </tbody>
                    </table>
                </div>,
                document.body
            )}
        </>
    );
}
