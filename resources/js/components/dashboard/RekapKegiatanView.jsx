import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { Printer, Save, Trash } from 'lucide-react';

export default function RekapKegiatanView() {
    const [formData, setFormData] = useState({
        kd_kec: '', kd_desa: '', rt: '', no_posyandu: '', bulan_pendataan: '', jumlah: '',
        ibu_hamil_periksa: '', ibu_hamil_fe: '', ibu_menyusui: '', kb_kondom: '', kb_pil: '', kb_suntik: '',
        skdn_s: '', skdn_k: '', skdn_d: '', skdn_n: '', skdn_bgm: '',
        bgm_l: '', bgm_p: '', vit_a: '', kms_keluar: '', fe_1: '', fe_2: '', pmt: '',
        hep_0_7: '', bcg: '', dpt_1: '', dpt_2: '', dpt_3: '', polio_1: '', polio_2: '', polio_3: '', polio_4: '', campak: '', hep_1: '', hep_2: '', hep_3: '', tt_1: '', tt_2: '',
        diare_jml: '', diare_oralit: '', sosialisasi: '', bayi_kms: '', balita_imunisasi: '', balita_kurang_gizi: ''
    });

    const [isPrinting, setIsPrinting] = useState(false);
    const [printData, setPrintData] = useState(null); // STATE BARU: Untuk menampung data riwayat yang mau dicetak
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [riwayat, setRiwayat] = useState([]);
    const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(true);

    const fetchRiwayat = async () => {
        setIsLoadingRiwayat(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/rekap-kegiatan', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRiwayat(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil riwayat", error);
        } finally {
            setIsLoadingRiwayat(false);
        }
    };

    useEffect(() => {
        fetchRiwayat();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.post('/api/rekap-kegiatan', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: response.data.pesan });

            setFormData({
                kd_kec: '', kd_desa: '', rt: '', no_posyandu: '', bulan_pendataan: '', jumlah: '',
                ibu_hamil_periksa: '', ibu_hamil_fe: '', ibu_menyusui: '', kb_kondom: '', kb_pil: '', kb_suntik: '',
                skdn_s: '', skdn_k: '', skdn_d: '', skdn_n: '', skdn_bgm: '',
                bgm_l: '', bgm_p: '', vit_a: '', kms_keluar: '', fe_1: '', fe_2: '', pmt: '',
                hep_0_7: '', bcg: '', dpt_1: '', dpt_2: '', dpt_3: '', polio_1: '', polio_2: '', polio_3: '', polio_4: '', campak: '', hep_1: '', hep_2: '', hep_3: '', tt_1: '', tt_2: '',
                diare_jml: '', diare_oralit: '', sosialisasi: '', bayi_kms: '', balita_imunisasi: '', balita_kurang_gizi: ''
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchRiwayat();
        } catch (error) {
            const errMsg = error.response?.data?.pesan || error.message;
            setMessage({ type: 'error', text: `Gagal menyimpan: ${errMsg}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus data rekap ini secara permanen?")) return;

        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/rekap-kegiatan/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Data rekap berhasil dihapus!' });
            fetchRiwayat();
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal menghapus data rekap.' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const textFields = ['kd_kec', 'kd_desa', 'rt', 'no_posyandu', 'bulan_pendataan'];

        if (!textFields.includes(name)) {
            const onlyNums = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: onlyNums });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // === FUNGSI CETAK DIPERBARUI: Bisa menerima data riwayat lama ===
    const handlePrint = (historyData = null) => {
        if (historyData) {
            setPrintData(historyData); // Cetak dari tabel riwayat
        } else {
            setPrintData(null); // Cetak dari form yang sedang diketik
        }

        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                setIsPrinting(false);
                setPrintData(null); // Bersihkan setelah selesai
            }, 500);
        }, 150);
    };

    // Variabel untuk menentukan data mana yang akan dirender di PDF
    const dataToPrint = printData || formData;

    return (
        <>
            <style>{`
        #dokumen-cetak-kegiatan { display: none; }

        @media print {
          @page { size: landscape; margin: 10mm; }
          body * { visibility: hidden; }
          .no-print { display: none !important; }

          #dokumen-cetak-kegiatan, #dokumen-cetak-kegiatan * { visibility: visible; }
          #dokumen-cetak-kegiatan {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-family: 'Times New Roman', Times, serif;
          }

          .tabel-kegiatan { width: 100%; border-collapse: collapse; font-size: 10px; }
          .tabel-kegiatan th, .tabel-kegiatan td { border: 1px solid #000; text-align: center; vertical-align: middle; padding: 2px; }

          .teks-vertikal {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            white-space: nowrap;
            padding: 8px 4px !important;
            max-height: 180px;
          }

          /* Paksa warna hitam & putih, mengatasi teks/border yang jadi
             tak terlihat karena tertimpa reset CSS print global lain */
          #dokumen-cetak-kegiatan, #dokumen-cetak-kegiatan * {
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
            background-color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .tabel-kegiatan th, .tabel-kegiatan td {
            border-color: #000 !important;
          }
        }
      `}</style>

            {/* =========================================================
          TAMPILAN MONITOR (INPUT UNTUK KADER/KETUA)
          ========================================================= */}
            <div className="no-print">
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={() => handlePrint(null)} style={{ color: 'var(--primary-teal, #008080)', borderColor: 'var(--primary-teal, #008080)', minHeight: '42px', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                        <Printer size={16} style={{ marginRight: '8px' }} /> Ekspor Kertas PDF
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={isLoading} style={{ minHeight: '42px', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                        <Save size={16} style={{ marginRight: '8px' }} /> {isLoading ? 'Menyimpan...' : 'Simpan Data Baru'}
                    </button>
                </div>

                {message.text && (
                    <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
                        <b>Info Sistem:</b> {message.text}
                    </div>
                )}

                {/* --- KELOMPOK 1 & 2 --- */}
                <div className="grid grid-2" style={{ marginBottom: '16px' }}>
                    <div className="card">
                        <div className="section-head"><h3>1. Identitas & Waktu Pendataan</h3></div>
                        <div className="form-grid">
                            <div className="form-field"><label>Kode Kecamatan (1)</label><input name="kd_kec" value={formData.kd_kec} onChange={handleChange} placeholder="Kode Kec" /></div>
                            <div className="form-field"><label>Kode Desa (2)</label><input name="kd_desa" value={formData.kd_desa} onChange={handleChange} placeholder="Kode Desa" /></div>
                            <div className="form-field"><label>RT (3)</label><input name="rt" value={formData.rt} onChange={handleChange} placeholder="RT" /></div>
                            <div className="form-field"><label>No Posyandu (4)</label><input name="no_posyandu" value={formData.no_posyandu} onChange={handleChange} placeholder="No Posyandu" /></div>
                            <div className="form-field full"><label>Bulan Pendataan (5)</label><input type="month" name="bulan_pendataan" value={formData.bulan_pendataan} onChange={handleChange} /></div>
                            <div className="form-field full"><label>Jumlah Data (6)</label><input name="jumlah" value={formData.jumlah} onChange={handleChange} placeholder="0" /></div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-head"><h3>2. Ibu Hamil, Menyusui & Peserta KB</h3></div>
                        <div className="form-grid">
                            <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px' }}><b>Ibu Hamil & Menyusui</b></div>
                            <div className="form-field"><label>Jml Memeriksakan Diri (7)</label><input name="ibu_hamil_periksa" value={formData.ibu_hamil_periksa} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Jml Mendapat Fe (8)</label><input name="ibu_hamil_fe" value={formData.ibu_hamil_fe} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Jumlah Yang Menyusui (9)</label><input name="ibu_menyusui" value={formData.ibu_menyusui} onChange={handleChange} placeholder="0" /></div>

                            <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '8px' }}><b>Jumlah Peserta KB</b></div>
                            <div className="form-field"><label>Kondom (10)</label><input name="kb_kondom" value={formData.kb_kondom} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Pil (11)</label><input name="kb_pil" value={formData.kb_pil} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Suntik (12)</label><input name="kb_suntik" value={formData.kb_suntik} onChange={handleChange} placeholder="0" /></div>
                        </div>
                    </div>
                </div>

                {/* --- KELOMPOK 3 & 4 --- */}
                <div className="grid grid-2" style={{ marginBottom: '16px' }}>
                    <div className="card">
                        <div className="section-head"><h3>3. Penimbangan Balita (SKDN)</h3></div>
                        <div className="form-grid">
                            <div className="form-field"><label>Jml Balita Sasaran (S) (13)</label><input name="skdn_s" value={formData.skdn_s} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Yang Punya KMS (K) (14)</label><input name="skdn_k" value={formData.skdn_k} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Yang Ditimbang (D) (15)</label><input name="skdn_d" value={formData.skdn_d} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Yang Naik (N) (16)</label><input name="skdn_n" value={formData.skdn_n} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Bawah Garis Merah (BGM) (17)</label><input name="skdn_bgm" value={formData.skdn_bgm} onChange={handleChange} placeholder="0" /></div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-head"><h3>4. Rincian Jumlah Balita</h3></div>
                        <div className="form-grid">
                            <div className="form-field"><label>BGM Laki-laki (18)</label><input name="bgm_l" value={formData.bgm_l} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>BGM Perempuan (19)</label><input name="bgm_p" value={formData.bgm_p} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Dapat Vitamin A (20)</label><input name="vit_a" value={formData.vit_a} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>KMS Yang Keluar (21)</label><input name="kms_keluar" value={formData.kms_keluar} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Dapat Fe 1 (22)</label><input name="fe_1" value={formData.fe_1} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Dapat Fe 2 (23)</label><input name="fe_2" value={formData.fe_2} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Yang Dapat PMT (24)</label><input name="pmt" value={formData.pmt} onChange={handleChange} placeholder="0" /></div>
                        </div>
                    </div>
                </div>

                {/* --- KELOMPOK 5 & 6 --- */}
                <div className="grid grid-2" style={{ marginBottom: '16px' }}>
                    <div className="card">
                        <div className="section-head"><h3>5. Jumlah Balita Yang Diimunisasi</h3></div>
                        <div className="form-grid">
                            <div className="form-field"><label>Hepatitis 0-7 Hari (25)</label><input name="hep_0_7" value={formData.hep_0_7} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>BCG (26)</label><input name="bcg" value={formData.bcg} onChange={handleChange} placeholder="0" /></div>

                            <div className="form-field full" style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ flex: 1 }}><label>DPT-HB I (27)</label><input name="dpt_1" value={formData.dpt_1} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>DPT-HB II (28)</label><input name="dpt_2" value={formData.dpt_2} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>DPT-HB III (29)</label><input name="dpt_3" value={formData.dpt_3} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                            </div>

                            <div className="form-field full" style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ flex: 1 }}><label>Polio I (30)</label><input name="polio_1" value={formData.polio_1} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>Polio II (31)</label><input name="polio_2" value={formData.polio_2} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>Polio III (32)</label><input name="polio_3" value={formData.polio_3} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>Polio IV (33)</label><input name="polio_4" value={formData.polio_4} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                            </div>

                            <div className="form-field"><label>Campak (34)</label><input name="campak" value={formData.campak} onChange={handleChange} placeholder="0" /></div>

                            <div className="form-field full" style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ flex: 1 }}><label>Hepatitis I (35)</label><input name="hep_1" value={formData.hep_1} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>Hepatitis II (36)</label><input name="hep_2" value={formData.hep_2} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>Hepatitis III (37)</label><input name="hep_3" value={formData.hep_3} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                            </div>

                            <div className="form-field" style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
                                <div style={{ flex: 1 }}><label>TT I (38)</label><input name="tt_1" value={formData.tt_1} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                                <div style={{ flex: 1 }}><label>TT II (39)</label><input name="tt_2" value={formData.tt_2} onChange={handleChange} placeholder="0" style={{ width: '100%' }} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="section-head"><h3>6. Diare & Layanan Kesehatan</h3></div>
                        <div className="form-grid">
                            <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px' }}><b>Balita Yang Menderita Diare</b></div>
                            <div className="form-field"><label>Jumlah Balita (40)</label><input name="diare_jml" value={formData.diare_jml} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field"><label>Dapat Oralit (41)</label><input name="diare_oralit" value={formData.diare_oralit} onChange={handleChange} placeholder="0" /></div>

                            <div className="form-field full" style={{ borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '8px' }}><b>Layanan Kesehatan</b></div>
                            <div className="form-field full"><label>Sosialisasi Penyuluhan (42)</label><input name="sosialisasi" value={formData.sosialisasi} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Jml Bayi Terima KMS (43)</label><input name="bayi_kms" value={formData.bayi_kms} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Jml Balita Dapat Imunisasi (44)</label><input name="balita_imunisasi" value={formData.balita_imunisasi} onChange={handleChange} placeholder="0" /></div>
                            <div className="form-field full"><label>Jml Balita Kurang Gizi (45)</label><input name="balita_kurang_gizi" value={formData.balita_kurang_gizi} onChange={handleChange} placeholder="0" /></div>
                        </div>
                    </div>
                </div>

                {/* --- KELOMPOK 7: TABEL RIWAYAT INPUT --- */}
                <div className="card" style={{ marginTop: '24px' }}>
                    <div className="section-head">
                        <h3>Riwayat Input Data Bulanan</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Tanggal Input Sistem</th>
                                <th>Bulan Pendataan</th>
                                <th>Total Sasaran (S)</th>
                                <th>Total Ditimbang (D)</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {isLoadingRiwayat ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>Memuat riwayat...</td></tr>
                            ) : riwayat.length > 0 ? (
                                riwayat.map((item) => {
                                    const dateObj = new Date(item.created_at);
                                    const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                                    const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <tr key={item.id}>
                                            <td><b>{formattedDate}</b> <br/><span style={{ fontSize: '12px', color: '#666' }}>Pukul {formattedTime} WITA</span></td>
                                            <td>{item.bulan_pendataan || '-'}</td>
                                            <td>{item.skdn_s || 0} Anak</td>
                                            <td>{item.skdn_d || 0} Anak</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    {/* TOMBOL CETAK RIWAYAT */}
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        style={{ color: 'var(--violet-deep)', borderColor: 'var(--violet-deep)' }}
                                                        onClick={() => handlePrint(item)}
                                                    >
                                                        <Printer /> Cetak
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        style={{ color: '#dc3545', borderColor: '#dc3545' }}
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: '#666' }}>Belum ada riwayat pendataan.</td></tr>
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
                <div id="dokumen-cetak-kegiatan">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px' }}>
                            <div>TAHUN : {new Date().getFullYear()}</div>
                            <div>Kab/Kodya : Kutai Kartanegara</div>
                            <div>Provinsi : Kalimantan Timur</div>
                        </div>
                        <div style={{ textAlign: 'center', flexGrow: 1 }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>DATA HASIL KEGIATAN POSYANDU</h2>
                        </div>
                        <div style={{ width: '150px' }}></div> {/* Spacer */}
                    </div>

                    <table className="tabel-kegiatan">
                        <thead>
                        {/* BARIS HEADER UTAMA */}
                        <tr>
                            <th colSpan="3" style={{ borderBottom: 'none' }}>ISI 1 BILA ADA DATA</th>
                            <th rowSpan="3" className="teks-vertikal">NO POSYANDU</th>
                            <th rowSpan="3" className="teks-vertikal">BULAN PENDATAAN</th>
                            <th rowSpan="3" className="teks-vertikal">JUMLAH</th>
                            <th colSpan="3">IBU HAMIL</th>
                            <th colSpan="3">JUMLAH<br/>PESERTA KB</th>
                            <th colSpan="5">PENIMBANG BALITA (JUMLAH)</th>
                            <th colSpan="7">JUMLAH BALITA</th>
                            <th colSpan="15">JUMLAH BALITA YANG DIIMUNISASI</th>
                            <th colSpan="2">BALITA YANG<br/>MENDERITA<br/>DIARE</th>
                            <th colSpan="5" rowSpan="2">LAYANAN KESEHATAN</th>
                        </tr>
                        {/* BARIS SUB-HEADER 1 */}
                        <tr>
                            <th rowSpan="2" className="teks-vertikal">KD KEC</th>
                            <th rowSpan="2" className="teks-vertikal">KD DESA</th>
                            <th rowSpan="2" className="teks-vertikal">RT</th>
                            <th rowSpan="2" className="teks-vertikal">JML YANG MEMERIKSAKAN DIRI</th>
                            <th rowSpan="2" className="teks-vertikal">JML YANG MENDAPAT Fe</th>
                            <th rowSpan="2" className="teks-vertikal">JUMLAH YANG MENYUSUI</th>
                            <th rowSpan="2" className="teks-vertikal">KONDOM</th>
                            <th rowSpan="2" className="teks-vertikal">PIL</th>
                            <th rowSpan="2" className="teks-vertikal">SUNTIK</th>
                            <th rowSpan="2" className="teks-vertikal">JML BALITA SASARAN POSYANDU (S)</th>
                            <th rowSpan="2" className="teks-vertikal">YANG PUNYA KMS (K)</th>
                            <th rowSpan="2" className="teks-vertikal">YANG DITIMBANG (D)</th>
                            <th rowSpan="2" className="teks-vertikal">YANG NAIK</th>
                            <th rowSpan="2" className="teks-vertikal">YANG DIBAWAH GARIS MERAH (BGM)</th>
                            <th rowSpan="2" className="teks-vertikal">JUMLAH BGM LAKI-LAKI</th>
                            <th rowSpan="2" className="teks-vertikal">JUMLAH BGM PEREMPUAN</th>
                            <th rowSpan="2" className="teks-vertikal">YANG DAPAT VITAMIN A</th>
                            <th rowSpan="2" className="teks-vertikal">KMS YANG KELUAR</th>
                            <th colSpan="2">YANG<br/>DAPAT<br/>Fe</th>
                            <th rowSpan="2" className="teks-vertikal">YANG DAPAT PMT</th>
                            <th rowSpan="2" className="teks-vertikal">HEPATITIS 0-7 HARI</th>
                            <th rowSpan="2" className="teks-vertikal">BCG</th>
                            <th colSpan="3">DPT-HB</th>
                            <th colSpan="4">POLIO</th>
                            <th rowSpan="2" className="teks-vertikal">CAMPAK</th>
                            <th colSpan="3">HEPATITIS</th>
                            <th colSpan="2">TT</th>
                            <th rowSpan="2" className="teks-vertikal">JUMLAH BALITA</th>
                            <th rowSpan="2" className="teks-vertikal">JUMLAH BALITA DAPAT ORALIT</th>
                        </tr>
                        {/* BARIS SUB-HEADER 2 (ANGKA ROMAWI) */}
                        <tr>
                            <th>1</th><th>2</th>
                            <th>I</th><th>II</th><th>III</th>
                            <th>I</th><th>II</th><th>III</th><th>IV</th>
                            <th>I</th><th>II</th><th>III</th>
                            <th>I</th><th>II</th>
                            <th className="teks-vertikal">SOSIALISASI PENYULUHAN</th>
                            <th className="teks-vertikal">JUMLAH BAYI YANG MENERIMA KMS</th>
                            <th className="teks-vertikal">JUMLAH BALITA DAPAT IMUNISASI</th>
                            <th className="teks-vertikal">JUMLAH BALITA YG KURANG GIZI</th>
                            <th></th>
                        </tr>
                        {/* BARIS NOMOR KOLOM (1 - 46) */}
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            {[...Array(46)].map((_, i) => <th key={i}>{i + 1}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {/* BARIS DATA INPUT YANG DIAMBIL DARI dataToPrint */}
                        <tr>
                            <td>{dataToPrint.kd_kec}</td><td>{dataToPrint.kd_desa}</td><td>{dataToPrint.rt}</td><td>{dataToPrint.no_posyandu}</td>
                            <td>{dataToPrint.bulan_pendataan}</td><td>{dataToPrint.jumlah}</td><td>{dataToPrint.ibu_hamil_periksa}</td>
                            <td>{dataToPrint.ibu_hamil_fe}</td><td>{dataToPrint.ibu_menyusui}</td><td>{dataToPrint.kb_kondom}</td>
                            <td>{dataToPrint.kb_pil}</td><td>{dataToPrint.kb_suntik}</td><td>{dataToPrint.skdn_s}</td>
                            <td>{dataToPrint.skdn_k}</td><td>{dataToPrint.skdn_d}</td><td>{dataToPrint.skdn_n}</td>
                            <td>{dataToPrint.skdn_bgm}</td><td>{dataToPrint.bgm_l}</td><td>{dataToPrint.bgm_p}</td>
                            <td>{dataToPrint.vit_a}</td><td>{dataToPrint.kms_keluar}</td><td>{dataToPrint.fe_1}</td>
                            <td>{dataToPrint.fe_2}</td><td>{dataToPrint.pmt}</td><td>{dataToPrint.hep_0_7}</td>
                            <td>{dataToPrint.bcg}</td><td>{dataToPrint.dpt_1}</td><td>{dataToPrint.dpt_2}</td>
                            <td>{dataToPrint.dpt_3}</td><td>{dataToPrint.polio_1}</td><td>{dataToPrint.polio_2}</td>
                            <td>{dataToPrint.polio_3}</td><td>{dataToPrint.polio_4}</td><td>{dataToPrint.campak}</td>
                            <td>{dataToPrint.hep_1}</td><td>{dataToPrint.hep_2}</td><td>{dataToPrint.hep_3}</td>
                            <td>{dataToPrint.tt_1}</td><td>{dataToPrint.tt_2}</td><td>{dataToPrint.diare_jml}</td>
                            <td>{dataToPrint.diare_oralit}</td><td>{dataToPrint.sosialisasi}</td><td>{dataToPrint.bayi_kms}</td>
                            <td>{dataToPrint.balita_imunisasi}</td><td>{dataToPrint.balita_kurang_gizi}</td><td></td>
                        </tr>
                        {/* Tambahan baris kosong agar mirip kertas tabel */}
                        {[...Array(5)].map((_, i) => (
                            <tr key={i}>
                                {[...Array(46)].map((_, j) => <td key={j} style={{ height: '16px' }}></td>)}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px', fontSize: '11px', lineHeight: '1.4' }}>
                        <b>Catatan :</b><br/>
                        1. Form ini diisi untuk Kegiatan Posyandu 1 (satu) Bulan<br/>
                        2. Harus dikirim selambat-lambatnya minggu pertama setiap Bulannya<br/>
                        3. Form diserahkan langsung ke Kecamatan
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
