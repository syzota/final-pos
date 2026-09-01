import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../../styles/dataTambahanIndividu.css';

import { Contact, Save, Printer, FolderOpen, Trash2, UserCheck, HeartPulse, TriangleAlert, Droplet, CheckCircle2, CircleAlert } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);

const TYPES = {
  ibu_hamil: {
    label: 'Data Ibu Hamil',
    icon: UserCheck,
    description: 'Data individu ibu hamil yang dicatat oleh kader.',
  },
  nifas: {
    label: 'Data Nifas',
    icon: HeartPulse,
    description: 'Data ibu setelah melahirkan selama masa nifas.',
  },
  kematian_nifas: {
    label: 'Kematian Ibu Nifas',
    icon: TriangleAlert,
    description: 'Pencatatan kasus kematian ibu pada masa nifas.',
  },
  diare: {
    label: 'Data Diare',
    icon: Droplet,
    description: 'Data individu warga yang mengalami diare.',
  },
};

const emptyCommon = {
  nama: '',
  umur: '',
  alamat: '',
  tanggal: today(),
  catatan: '',
};

const emptyDetail = {
  ibu_hamil: {
    usia_kehamilan_minggu: '',
    tekanan_darah: '',
    risiko: 'Normal',
  },
  nifas: {
    tanggal_melahirkan: '',
    hari_nifas: '',
    vitamin_a: 'Ya',
  },
  kematian_nifas: {
    tanggal_melahirkan: '',
    hari_nifas: '',
    penyebab: '',
  },
  diare: {
    lama_hari: '',
    oralit: 'Ya',
    dirujuk: 'Tidak',
  },
};

const formatDate = (date) => {
  if (!date) return '-';

  const rawDate = String(date);

  const parsedDate = rawDate.includes('T')
    ? new Date(rawDate)
    : new Date(`${rawDate}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
};

const formatMonth = (month) => {
  if (!month) return '-';
  const [year, m] = month.split('-');
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Number(year), Number(m) - 1, 1));
};

export default function DataTambahanIndividuView({ posyandu = '' }) {
  const [activeType, setActiveType] = useState('ibu_hamil');
  const [common, setCommon] = useState(emptyCommon);
  const [detail, setDetail] = useState(emptyDetail.ibu_hamil);

  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [printRows, setPrintRows] = useState([]);

  const token = localStorage.getItem('auth_token');

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const changeType = (type) => {
    setActiveType(type);
    setCommon({
      ...emptyCommon,
      tanggal: today(),
    });
    setDetail({ ...emptyDetail[type] });
    setMessage({ type: '', text: '' });
  };

  const fetchRows = async () => {
    setLoading(true);

    try {
      const response = await axios.get('/api/data-tambahan-individu', {
        ...config,
        params: {
          bulan: filterMonth || undefined,
        },
      });

      setRows(response.data.data || []);
    } catch (error) {
      console.error('Gagal memuat Data Tambahan', error);
      setMessage({
        type: 'error',
        text:
          error.response?.data?.pesan ||
          error.response?.data?.message ||
          'Gagal mengambil data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [filterMonth]);

  const handleCommonChange = (event) => {
    const { name, value } = event.target;

    setCommon((prev) => ({
      ...prev,
      [name]:
        name === 'umur'
          ? value.replace(/[^0-9]/g, '')
          : value,
    }));
  };

  const handleDetailChange = (event) => {
    const { name, value } = event.target;

    setDetail((prev) => ({
      ...prev,
      [name]:
        ['usia_kehamilan_minggu', 'hari_nifas', 'lama_hari'].includes(name)
          ? value.replace(/[^0-9]/g, '')
          : value,
    }));
  };

  const resetForm = () => {
    setCommon({
      ...emptyCommon,
      tanggal: today(),
    });
    setDetail({ ...emptyDetail[activeType] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        jenis: activeType,
        nama: common.nama,
        umur: Number(common.umur),
        alamat: common.alamat || null,
        tanggal: common.tanggal,
        detail,
        catatan: common.catatan || null,
      };

      const response = await axios.post(
        '/api/data-tambahan-individu',
        payload,
        config
      );

      setMessage({
        type: 'success',
        text:
          response.data.pesan ||
          'Data berhasil disimpan.',
      });

      resetForm();
      await fetchRows();
    } catch (error) {
      console.error('Gagal menyimpan Data Tambahan', error);

      const validation = error.response?.data?.errors;
      const firstValidation =
        validation &&
        Object.values(validation)?.[0]?.[0];

      setMessage({
        type: 'error',
        text:
          firstValidation ||
          error.response?.data?.pesan ||
          error.response?.data?.message ||
          'Data gagal disimpan.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data ini?')) return;

    try {
      await axios.delete(
        `/api/data-tambahan-individu/${id}`,
        config
      );

      setMessage({
        type: 'success',
        text: 'Data berhasil dihapus.',
      });

      await fetchRows();
    } catch (error) {
      console.error('Gagal menghapus data', error);

      setMessage({
        type: 'error',
        text: 'Data gagal dihapus.',
      });
    }
  };

  const generateReport = async () => {
    try {
      const response = await axios.get(
        '/api/data-tambahan-individu',
        {
          ...config,
          params: {
            bulan: filterMonth || undefined,
          },
        }
      );

      const data = response.data.data || [];
      setPrintRows(data);

      setTimeout(() => {
        window.print();
      }, 150);
    } catch (error) {
      console.error('Gagal membuat laporan', error);
      setMessage({
        type: 'error',
        text: 'Laporan gagal dibuat.',
      });
    }
  };

  const renderDetailFields = () => {
    if (activeType === 'ibu_hamil') {
      return (
        <>
          <div className="dti-field">
            <label>Usia Kehamilan (minggu)</label>
            <input
              type="number"
              min="0"
              max="45"
              name="usia_kehamilan_minggu"
              value={detail.usia_kehamilan_minggu}
              onChange={handleDetailChange}
              placeholder="Contoh: 24"
            />
          </div>

          <div className="dti-field">
            <label>Tekanan Darah</label>
            <input
              type="text"
              name="tekanan_darah"
              value={detail.tekanan_darah}
              onChange={handleDetailChange}
              placeholder="Contoh: 110/70"
            />
          </div>

          <div className="dti-field">
            <label>Status Risiko</label>
            <select
              name="risiko"
              value={detail.risiko}
              onChange={handleDetailChange}
            >
              <option value="Normal">Normal</option>
              <option value="Risiko Tinggi">Risiko Tinggi</option>
            </select>
          </div>
        </>
      );
    }

    if (activeType === 'nifas') {
      return (
        <>
          <div className="dti-field">
            <label>Tanggal Melahirkan</label>
            <input
              type="date"
              name="tanggal_melahirkan"
              value={detail.tanggal_melahirkan}
              onChange={handleDetailChange}
            />
          </div>

          <div className="dti-field">
            <label>Hari Ke- Nifas</label>
            <input
              type="number"
              min="0"
              name="hari_nifas"
              value={detail.hari_nifas}
              onChange={handleDetailChange}
              placeholder="Contoh: 7"
            />
          </div>

          <div className="dti-field">
            <label>Vitamin A</label>
            <select
              name="vitamin_a"
              value={detail.vitamin_a}
              onChange={handleDetailChange}
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>
        </>
      );
    }

    if (activeType === 'kematian_nifas') {
      return (
        <>
          <div className="dti-field">
            <label>Tanggal Melahirkan</label>
            <input
              type="date"
              name="tanggal_melahirkan"
              value={detail.tanggal_melahirkan}
              onChange={handleDetailChange}
            />
          </div>

          <div className="dti-field">
            <label>Hari Ke- Nifas</label>
            <input
              type="number"
              min="0"
              name="hari_nifas"
              value={detail.hari_nifas}
              onChange={handleDetailChange}
              placeholder="Contoh: 10"
            />
          </div>

          <div className="dti-field">
            <label>Penyebab Singkat</label>
            <input
              type="text"
              name="penyebab"
              value={detail.penyebab}
              onChange={handleDetailChange}
              placeholder="Contoh: perdarahan"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="dti-field">
          <label>Lama Diare (hari)</label>
          <input
            type="number"
            min="0"
            name="lama_hari"
            value={detail.lama_hari}
            onChange={handleDetailChange}
            placeholder="Contoh: 2"
          />
        </div>

        <div className="dti-field">
          <label>Mendapat Oralit</label>
          <select
            name="oralit"
            value={detail.oralit}
            onChange={handleDetailChange}
          >
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>

        <div className="dti-field">
          <label>Dirujuk</label>
          <select
            name="dirujuk"
            value={detail.dirujuk}
            onChange={handleDetailChange}
          >
            <option value="Tidak">Tidak</option>
            <option value="Ya">Ya</option>
          </select>
        </div>
      </>
    );
  };

  const detailSummary = (row) => {
    const d = row.detail || {};

    if (row.jenis === 'ibu_hamil') {
      return `${d.usia_kehamilan_minggu || '-'} minggu • ${d.risiko || '-'}`;
    }

    if (row.jenis === 'nifas') {
      return `Hari ke-${d.hari_nifas || '-'} • Vit A: ${d.vitamin_a || '-'}`;
    }

    if (row.jenis === 'kematian_nifas') {
      return `Hari ke-${d.hari_nifas || '-'} • ${d.penyebab || '-'}`;
    }

    return `${d.lama_hari || '-'} hari • Oralit: ${d.oralit || '-'} • Rujuk: ${d.dirujuk || '-'}`;
  };

  const grouped = Object.keys(TYPES).reduce((acc, type) => {
    acc[type] = printRows.filter((row) => row.jenis === type);
    return acc;
  }, {});

  return (
    <>
      <div className="dti-page dti-no-print">

        <section className="dti-hero">
          <div>
            <span className="dti-eyebrow">
              DATA TAMBAHAN KADER
            </span>

            <h2>Data Individu Tambahan Posyandu</h2>

            <p>
              Pencatatan sederhana per orang untuk ibu hamil,
              nifas, kematian ibu nifas, dan diare.
            </p>
          </div>

          <div className="dti-hero-icon">
            <Contact />
          </div>
        </section>

        {message.text && (
          <div className={`dti-alert dti-alert--${message.type}`}>
            <i
              className={
                message.type === 'success'
                  ? 'bi bi-check-circle-fill'
                  : 'bi bi-exclamation-circle-fill'
              }
            ></i>

            <span>{message.text}</span>
          </div>
        )}

        <section className="dti-tabs">
          {Object.entries(TYPES).map(([key, item]) => (
            <button
              type="button"
              key={key}
              className={`dti-tab ${activeType === key ? 'active' : ''}`}
              onClick={() => changeType(key)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </section>

        <form className="dti-form-card" onSubmit={handleSubmit}>

          <div className="dti-form-head">
            <div>
              <span className="dti-section-label">
                FORM INPUT
              </span>

              <h3>{TYPES[activeType].label}</h3>

              <p>{TYPES[activeType].description}</p>
            </div>

            <div className="dti-form-badge">
              <i className={TYPES[activeType].icon}></i>
            </div>
          </div>

          <div className="dti-grid dti-grid--common">

            <div className="dti-field">
              <label>Nama Lengkap *</label>
              <input
                type="text"
                name="nama"
                value={common.nama}
                onChange={handleCommonChange}
                placeholder="Nama warga"
                required
              />
            </div>

            <div className="dti-field">
              <label>Umur *</label>
              <input
                type="number"
                min="0"
                max="120"
                name="umur"
                value={common.umur}
                onChange={handleCommonChange}
                placeholder="Tahun"
                required
              />
            </div>

            <div className="dti-field">
              <label>Tanggal Pencatatan *</label>
              <input
                type="date"
                name="tanggal"
                value={common.tanggal}
                onChange={handleCommonChange}
                required
              />
            </div>

            <div className="dti-field dti-field--wide">
              <label>Alamat</label>
              <input
                type="text"
                name="alamat"
                value={common.alamat}
                onChange={handleCommonChange}
                placeholder="RT / alamat singkat"
              />
            </div>

          </div>

          <div className="dti-divider">
            <span>Data khusus</span>
          </div>

          <div className="dti-grid dti-grid--detail">
            {renderDetailFields()}
          </div>

          <div className="dti-field dti-field--note">
            <label>Catatan</label>
            <textarea
              name="catatan"
              value={common.catatan}
              onChange={handleCommonChange}
              rows="3"
              placeholder="Opsional"
            ></textarea>
          </div>

          <div className="dti-form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="submit"
              className="btn btn-violet"
              disabled={saving}
            >
              <Save className="me-2" />
              {saving ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>

        </form>

        <section className="dti-history">

          <div className="dti-history-head">

            <div>
              <span className="dti-section-label">
                RIWAYAT & LAPORAN
              </span>

              <h3>Data yang Sudah Dicatat</h3>

              <p>
                Filter per bulan lalu generate laporan A4.
              </p>
            </div>

            <div className="dti-report-tools">

              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-outline"
                onClick={generateReport}
              >
                <Printer className="me-2" />
                Generate Laporan
              </button>

            </div>

          </div>

          {loading ? (
            <div className="dti-empty">
              Memuat data...
            </div>
          ) : rows.length === 0 ? (
            <div className="dti-empty">
              <FolderOpen />
              <h4>Belum ada data</h4>
              <p>
                Belum ada pencatatan pada {formatMonth(filterMonth)}.
              </p>
            </div>
          ) : (
            <div className="dti-table-wrap">
              <table className="dti-table">

                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Nama</th>
                    <th>Umur</th>
                    <th>Detail</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{formatDate(row.tanggal)}</td>

                      <td>
                        <span className={`dti-type dti-type--${row.jenis}`}>
                          {TYPES[row.jenis]?.label || row.jenis}
                        </span>
                      </td>

                      <td>
                        <strong>{row.nama}</strong>
                        <small>{row.alamat || '-'}</small>
                      </td>

                      <td>{row.umur} th</td>

                      <td>{detailSummary(row)}</td>

                      <td>
                        <button
                          type="button"
                          className="dti-delete"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

      </div>

      {/* =====================================================
          LAPORAN CETAK
          ===================================================== */}
      <div className="dti-print dti-print-only">

        <div className="dti-print-header">
          <div>
            <div className="dti-print-org">
              POSYANDU {posyandu || 'LOA DURI ULU'}
            </div>

            <h1>LAPORAN DATA TAMBAHAN</h1>

            <p>
              Ibu Hamil, Nifas, Kematian Ibu Nifas, dan Diare
            </p>
          </div>

          <div className="dti-print-period">
            <span>Periode</span>
            <strong>{formatMonth(filterMonth)}</strong>
          </div>
        </div>

        {Object.entries(TYPES).map(([type, info], index) => (
          <section className="dti-print-section" key={type}>
            <h2>
              {index + 1}. {info.label}
            </h2>

            {grouped[type]?.length === 0 ? (
              <p className="dti-print-none">Tidak ada data.</p>
            ) : (
              <table className="dti-print-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Umur</th>
                    <th>Tanggal</th>
                    <th>Alamat</th>
                    <th>Detail</th>
                  </tr>
                </thead>

                <tbody>
                  {grouped[type]?.map((row, i) => (
                    <tr key={row.id}>
                      <td>{i + 1}</td>
                      <td>{row.nama}</td>
                      <td>{row.umur} th</td>
                      <td>{formatDate(row.tanggal)}</td>
                      <td>{row.alamat || '-'}</td>
                      <td>{detailSummary(row)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}

        <div className="dti-print-signatures">
          <div>
            <p>Kader/Petugas</p>
            <div className="dti-sign-space"></div>
            <strong>(........................................)</strong>
          </div>

          <div>
            <p>Ketua Posyandu</p>
            <div className="dti-sign-space"></div>
            <strong>(........................................)</strong>
          </div>
        </div>

        <div className="dti-print-footer">
          Dicetak dari Sistem Informasi Posyandu Loa Duri Ulu
        </div>

      </div>
    </>
  );
}
