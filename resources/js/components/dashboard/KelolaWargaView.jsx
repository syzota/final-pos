import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Daftar field utama (dipakai untuk memetakan error backend ke input masing-masing)
const FORM_FIELDS = [
    'nama_lengkap',
    'jenis_kelamin',
    'nik',
    'no_kk',
    'no_hp',
    'status_pernikahan',
    'nama_istri'
];

export default function KelolaWargaView({ posyandu }) {
    const [wargaList, setWargaList] = useState([]);

    // STATE BARU: Tambahan status_pernikahan dan nama_istri
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        jenis_kelamin: 'L',
        nik: '',
        no_kk: '',
        no_hp: '',
        status_pernikahan: 'Menikah',
        nama_istri: ''
    });

    // ===== PERBAIKAN: State error per-field agar validasi tampil LOKAL di tiap input =====
    const [errors, setErrors] = useState({});

    const [anakList, setAnakList] = useState([
        { nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchWarga = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('/api/warga', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            setWargaList(response.data.data);
        } catch (err) {
            console.error('Gagal mengambil data warga:', err);
        }
    };

    useEffect(() => {
        fetchWarga();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // ===== PERBAIKAN: NIK, No. KK & No. HP WAJIB ANGKA (integer) =====
        let finalValue = value;
        if (name === 'nik' || name === 'no_kk' || name === 'no_hp') {
            finalValue = value.replace(/[^0-9]/g, ''); // buang semua karakter selain angka
        }

        if (name === 'jenis_kelamin') {
            setFormData({
                ...formData,
                jenis_kelamin: value,
                status_pernikahan: 'Menikah',
                nama_istri: ''
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: finalValue
        });

        // ===== PERBAIKAN: hapus error field ini begitu user mengetik ulang =====
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleAnakChange = (index, field, value) => {
        const newList = [...anakList];
        newList[index][field] = value;
        setAnakList(newList);
    };

    const handleAddAnak = () => {
        setAnakList([...anakList, { nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }]);
    };

    const handleRemoveAnak = (index) => {
        const newList = [...anakList];
        newList.splice(index, 1);
        setAnakList(newList);
    };

    // ===== PERBAIKAN: Helper untuk menampilkan pesan error LOKAL di bawah input =====
    const renderFieldError = (field) => {
        if (!errors[field]) return null;
        return (
            <p style={{ color: '#dc2626', fontSize: '12px', margin: '4px 0 0', fontWeight: 500 }}>
                {errors[field]}
            </p>
        );
    };

    // ===== PERBAIKAN: Helper untuk mewarnai border input merah saat error =====
    const errorInputStyle = (field) =>
        errors[field]
            ? { border: '1px solid #dc2626', backgroundColor: '#fef2f2' }
            : {};

    const handleResetPassword = async (id) => {
        const isConfirm = window.confirm(
            'Yakin ingin mereset PIN warga ini ke PIN default?'
        );

        if (!isConfirm) return;

        try {
            const token = localStorage.getItem('auth_token');

            const response = await axios.put(
                `/api/warga/${id}/reset-password`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            alert('Berhasil: ' + response.data.pesan);
        } catch (err) {
            console.error('Gagal reset PIN:', err);
            alert('Terjadi kesalahan saat mereset PIN.');
        }
    };

    const handleDeleteWarga = async (id, nama) => {
        const isConfirm = window.confirm(
            `Yakin ingin menghapus keluarga ${nama}?\n\n` +
            `Akun warga dan seluruh data anggota keluarga yang terhubung akan dihapus.`
        );

        if (!isConfirm) return;

        try {
            const token = localStorage.getItem('auth_token');

            const response = await axios.delete(
                `/api/warga/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            alert('Berhasil: ' + response.data.pesan);

            // Refresh tabel warga
            fetchWarga();

        } catch (err) {
            console.error('Gagal menghapus warga:', err);

            const pesan =
                err.response?.data?.pesan ||
                err.response?.data?.message ||
                'Terjadi kesalahan saat menghapus warga.';

            alert(pesan);
        }
    };

    const handleSubmit = async () => {
        // ===== PERBAIKAN: Validasi Dasar per-field (peringatan muncul di input masing-masing) =====
        const newErrors = {};

        if (!formData.nama_lengkap.trim()) {
            newErrors.nama_lengkap = 'Nama lengkap wajib diisi!';
        }

        if (!formData.nik) {
            newErrors.nik = 'NIK wajib diisi!';
        } else if (!/^[0-9]+$/.test(formData.nik)) {
            newErrors.nik = 'NIK hanya boleh berisi angka!';
        } else if (formData.nik.length !== 16) {
            newErrors.nik = 'NIK harus tepat 16 digit angka!';
        }

        if (!formData.no_kk) {
            newErrors.no_kk = 'No. KK wajib diisi!';
        } else if (!/^[0-9]+$/.test(formData.no_kk)) {
            newErrors.no_kk = 'No. KK hanya boleh berisi angka!';
        } else if (formData.no_kk.length !== 16) {
            newErrors.no_kk = 'No. KK harus tepat 16 digit angka!';
        }

        // No. HP opsional, tapi jika diisi harus angka & maksimal 15 digit
        if (formData.no_hp) {
            if (!/^[0-9]+$/.test(formData.no_hp)) {
                newErrors.no_hp = 'No. HP hanya boleh berisi angka!';
            } else if (formData.no_hp.length > 15) {
                newErrors.no_hp = 'No. HP maksimal 15 digit!';
            }
        }

        // VALIDASI: Istri wajib diisi jika Menikah
        if (
            formData.status_pernikahan === 'Menikah' &&
            !formData.nama_istri.trim()
        ) {
            newErrors.nama_istri = 'Nama pasangan wajib diisi jika status Menikah!';
        }

        // Jika ada error, tampilkan di input masing-masing lalu berhenti
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setMessage({ type: '', text: '' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });
        setErrors({});

        try {
            const token = localStorage.getItem('auth_token');
            const anakValid = anakList.filter(anak => anak.nama.trim() !== '');

            const payload = {
                ...formData,
                anak: anakValid
            };

            const response = await axios.post('/api/warga', payload, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });

            setMessage({ type: 'success', text: response.data.pesan || 'Akun warga berhasil dibuat!' });

            // Reset Form
            setFormData({
                nama_lengkap: '',
                jenis_kelamin: 'L',
                nik: '',
                no_kk: '',
                no_hp: '',
                status_pernikahan: 'Menikah',
                nama_istri: ''
            });
            setErrors({});
            setAnakList([{ nama: '', tanggal_lahir: '', jenis_kelamin: 'L' }]);
            fetchWarga();

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 422) {
                // ===== PERBAIKAN: error validasi backend (422) dipetakan ke input masing-masing =====
                const backendErrors = err.response.data.errors || {};
                const localErrors = {};
                const otherMessages = [];

                Object.keys(backendErrors).forEach((key) => {
                    const msgs = Array.isArray(backendErrors[key])
                        ? backendErrors[key]
                        : [backendErrors[key]];

                    if (FORM_FIELDS.includes(key)) {
                        localErrors[key] = msgs[0];
                    } else {
                        otherMessages.push(...msgs);
                    }
                });

                if (Object.keys(localErrors).length > 0) {
                    setErrors(localErrors);
                }
                if (otherMessages.length > 0) {
                    setMessage({ type: 'error', text: otherMessages.join(' ') });
                }
            } else {
                // --- UBAH BARIS INI AGAR JUJUR ---
                const pesanAsli = err.response?.data?.pesan || err.response?.data?.message || err.message;
                setMessage({ type: 'error', text: `Error Backend: ${pesanAsli}` });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-2">
            {/* Kolom Kiri: Tabel Warga */}
            <div className="card">
                <div className="section-head">
                    <h3>Daftar Akun Warga</h3>
                    <span className="badge badge-violet">{wargaList.length} Keluarga Terdaftar</span>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr><th>Nama Warga</th><th>No. KK</th><th>Jml Anak</th><th></th></tr>
                        </thead>
                        <tbody>
                        {wargaList.length > 0 ? (
                            wargaList.map((warga, index) => (
                                <tr key={index}>
                                    <td>{warga.nama_kepala_keluarga}</td>
                                    <td>{warga.no_kk}</td>
                                    <td>{warga.anak_count}</td>
                                    <td>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '6px',
                                                flexWrap: 'wrap'
                                            }}
                                        >
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleResetPassword(warga.id)}
                                            >
                                                Reset PIN
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteWarga(
                                                        warga.id,
                                                        warga.nama_kepala_keluarga
                                                    )
                                                }
                                                style={{
                                                    padding: '6px 10px',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada data keluarga terdaftar.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                <p
                    style={{
                        fontSize: '11px',
                        color: 'var(--ink-soft)',
                        fontWeight: 600,
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <svg className="ic ic-sm">
                        <use href="#i-alert" />
                    </svg>
                    Reset PIN dilakukan langsung oleh Kader/Ketua;
                    sampaikan PIN default kepada warga secara tatap muka.
                </p>
            </div>

            {/* Kolom Kanan: Form Pendaftaran Warga */}
            <div className="card">
                <div className="section-head"><h3>Buat Akun Warga Baru</h3></div>

                {message.text && (
                    <div style={{ padding: '10px', marginBottom: '14px', borderRadius: '6px', fontSize: '13px', backgroundColor: message.type === 'error' ? '#fde8e8' : '#e1fce8', color: message.type === 'error' ? '#c81e1e' : '#036c2a' }}>
                        {message.text}
                    </div>
                )}

                <div className="form-field" style={{ marginBottom: '12px' }}>
                    <label>Nama Lengkap Kepala Keluarga</label>
                    <input
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={handleInputChange}
                        placeholder="mis. Bapak Herman"
                        style={errorInputStyle('nama_lengkap')}
                    />
                    {renderFieldError('nama_lengkap')}
                </div>
                <div className="form-field" style={{ marginBottom: '12px' }}>
                    <label>Jenis Kelamin Kepala Keluarga</label>
                    <select
                        name="jenis_kelamin"
                        value={formData.jenis_kelamin}
                        onChange={handleInputChange}
                        style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            width: '100%',
                            outline: 'none'
                        }}
                    >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                </div>
                {/* DROPDOWN STATUS PERNIKAHAN */}
                <div className="form-field" style={{ marginBottom: '12px' }}>
                    <label>Status Pernikahan</label>
                    <select
                        name="status_pernikahan"
                        value={formData.status_pernikahan}
                        onChange={handleInputChange}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', outline: 'none' }}
                    >
                        <option value="Menikah">Menikah</option>
                        {formData.jenis_kelamin === 'L' ? (
                            <option value="Duda">Duda</option>
                        ) : (
                            <option value="Janda">Janda</option>
                        )}
                    </select>
                </div>

                {/* INPUT NAMA ISTRI (Hanya muncul jika Menikah) */}
                {formData.status_pernikahan === 'Menikah' && (
                    <div className="form-field" style={{ marginBottom: '12px' }}>
                        <label>
                            {formData.jenis_kelamin === 'L'
                                ? 'Nama Istri'
                                : 'Nama Suami'}
                        </label>

                        <input
                            name="nama_istri"
                            value={formData.nama_istri}
                            onChange={handleInputChange}
                            placeholder={
                                formData.jenis_kelamin === 'L'
                                    ? 'mis. Ibu Siti'
                                    : 'mis. Bapak Herman'
                            }
                            style={errorInputStyle('nama_istri')}
                        />
                        {renderFieldError('nama_istri')}
                    </div>
                )}

                <div className="form-field" style={{ marginBottom: '12px' }}>
                    <label>NIK Kepala Keluarga</label>
                    <input
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        placeholder="16 digit NIK (digunakan sebagai username)"
                        maxLength={16}
                        inputMode="numeric"
                        style={errorInputStyle('nik')}
                    />
                    {renderFieldError('nik')}
                </div>
                <div className="form-field" style={{ marginBottom: '12px' }}>
                    <label>No. KK</label>
                    <input
                        name="no_kk"
                        value={formData.no_kk}
                        onChange={handleInputChange}
                        placeholder="16 digit No. KK"
                        maxLength={16}
                        inputMode="numeric"
                        style={errorInputStyle('no_kk')}
                    />
                    {renderFieldError('no_kk')}
                </div>
                <div className="form-field" style={{ marginBottom: '12px' }}>
                    <label>No. HP (Opsional)</label>
                    <input
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleInputChange}
                        placeholder="Maks. 15 digit angka, mis. 081234567890"
                        maxLength={15}
                        inputMode="numeric"
                        style={errorInputStyle('no_hp')}
                    />
                    {renderFieldError('no_hp')}
                </div>

                <div className="form-field" style={{ marginBottom: '4px' }}>
                    <label>Data Anak (Opsional)</label>
                </div>

                {anakList.map((anak, index) => (
                    <div className="form-grid" style={{ marginBottom: '8px', display: 'flex', gap: '6px', alignItems: 'center' }} key={index}>
                        <div className="form-field" style={{ flex: 2 }}>
                            <input placeholder="Nama anak" value={anak.nama} onChange={(e) => handleAnakChange(index, 'nama', e.target.value)} />
                        </div>
                        <div className="form-field" style={{ flex: 1.5 }}>
                            <input type="date" value={anak.tanggal_lahir} onChange={(e) => handleAnakChange(index, 'tanggal_lahir', e.target.value)} />
                        </div>
                        <div className="form-field" style={{ flex: 0.8 }}>
                            <select value={anak.jenis_kelamin} onChange={(e) => handleAnakChange(index, 'jenis_kelamin', e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}>
                                <option value="L">Laki</option>
                                <option value="P">Pr</option>
                            </select>
                        </div>
                        {anakList.length > 1 && (
                            <button type="button" onClick={() => handleRemoveAnak(index)} style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>X</button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={handleAddAnak} className="btn btn-outline btn-sm" style={{ marginBottom: '14px', width: 'fit-content' }}>
                    <svg className="ic ic-sm"><use href="#i-plus" /></svg>Tambah Anak Lain
                </button>

                <button onClick={handleSubmit} className="btn btn-violet" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Menyimpan...' : 'Buat Akun Warga'}
                </button>
            </div>
        </div>
    );
}
