import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminAnalitikView() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalitik = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('/api/admin/dashboard-analitik', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Gagal memuat analitik:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalitik();
  }, []);

  if (isLoading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', marginBottom: '16px', color: 'var(--cyan-deep)' }}></div>
        <h4>Memuat Big Data Analitik... ⏳</h4>
        <p style={{ fontSize: '13px' }}>Sedang menghimpun data dari seluruh Posyandu.</p>
      </div>
    );
  }

  // Label Rentang Waktu
  const tren = data.tren;
  const rentangBulan = `${tren[0]?.bulan}–${tren[tren.length - 1]?.bulan} ${new Date().getFullYear()}`;

  // Warna khusus untuk 6 Bidang
  const bidangConfig = [
    { key: 'kesehatan', label: 'Kesehatan', color: 'var(--violet-deep)', gradient: 'linear-gradient(90deg, var(--violet-deep), var(--violet))' },
    { key: 'pendidikan', label: 'Pendidikan', color: 'var(--orange-deep)', gradient: 'linear-gradient(90deg, var(--orange-deep), var(--orange))' },
    { key: 'pekerjaan_umum', label: 'Pekerjaan Umum', color: 'var(--cyan-deep)', gradient: 'linear-gradient(90deg, var(--cyan-deep), var(--cyan))' },
    { key: 'perumahan_rakyat', label: 'Perumahan Rakyat', color: 'var(--green-deep)', gradient: 'linear-gradient(90deg, var(--green-deep), var(--green))' },
    { key: 'trantibumlinmas', label: 'Trantibumlinmas', color: 'var(--magenta-deep)', gradient: 'linear-gradient(90deg, var(--magenta-deep), var(--magenta))' },
    { key: 'sosial', label: 'Sosial', color: 'var(--rose-deep)', gradient: 'linear-gradient(90deg, var(--rose-deep), var(--rose))' }
  ];

  return (
    <div style={{ animation: 'fadein 0.4s ease' }}>

      {/* =========================================
          GRAFIK TREN KEHADIRAN (6 BULAN)
          ========================================= */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="section-head" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: 'var(--cyan-deep)' }}><i className="bi bi-bar-chart-line-fill me-2"></i>Tren Pemeriksaan Kesehatan (Lintas 9 Posyandu)</h3>
          <span className="badge badge-violet">{rentangBulan}</span>
        </div>

        {/* CHART BAR DINAMIS */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '180px', padding: '10px 4px' }}>
          {data.tren.map((item, index) => {
            // Hitung tinggi bar berdasarkan nilai tertinggi agar tidak meluber
            const minHeight = 10; // minimal height agar bulan 0 tetap kelihatan garisnya
            const maxPx = 140; // maximal pixel height
            const barHeight = item.total === 0 ? minHeight : Math.max((item.total / data.max_tren) * maxPx, minHeight);

            return (
              <div key={index} style={{ flex: 1, textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--cyan-deep)', marginBottom: '4px' }}>
                  {item.total > 0 ? item.total : ''}
                </div>
                <div
                  style={{
                    height: `${barHeight}px`,
                    background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title={`${item.total} Pemeriksaan di bulan ${item.bulan}`}
                ></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginTop: '8px' }}>{item.bulan}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '24px' }}>

        {/* =========================================
            PROGRES CAPAIAN PER BIDANG
            ========================================= */}
        <div className="card">
          <div className="section-head" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}><i className="bi bi-pie-chart-fill me-2" style={{ color: 'var(--violet-deep)' }}></i>Capaian Intervensi per Bidang</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bidangConfig.map((bidang, index) => {
              const persen = data.capaian[bidang.key] || 0;
              return (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{bidang.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: bidang.color }}>{persen}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${persen}%`,
                        height: '100%',
                        background: bidang.gradient,
                        borderRadius: '10px',
                        transition: 'width 1s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', marginTop: '20px', marginBottom: 0 }}>
            *Persentase dihitung secara relatif terhadap volume data terbanyak.
          </p>
        </div>

        {/* =========================================
            RANKING KEHADIRAN POSYANDU
            ========================================= */}
        <div className="card">
          <div className="section-head" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}><i className="bi bi-trophy-fill me-2" style={{ color: 'var(--orange-deep)' }}></i>Ranking Keaktifan Posyandu</h3>
          </div>
          <div className="table-responsive">
            <table className="table" style={{ fontSize: '13.5px' }}>
              <thead>
                <tr>
                  <th style={{ color: '#64748b' }}>Posyandu</th>
                  <th style={{ color: '#64748b', textAlign: 'right' }}>Kehadiran Warga</th>
                </tr>
              </thead>
              <tbody>
                {data.posyandu.map((pos, index) => {
                  // Penentuan warna: Hijau (Bagus), Orange (Sedang), Merah (Rendah)
                  let textColor = 'var(--green-deep)';
                  if (pos.persen < 75 && pos.persen >= 50) textColor = 'var(--orange-deep)';
                  if (pos.persen < 50) textColor = '#dc2626'; // Merah

                  return (
                    <tr key={index}>
                      <td>
                        {index === 0 && <i className="bi bi-award-fill me-2" style={{ color: '#eab308', fontSize: '16px' }}></i>}
                        <b style={{ color: '#334155' }}>{pos.nama}</b>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: textColor }}>
                        {pos.persen}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}