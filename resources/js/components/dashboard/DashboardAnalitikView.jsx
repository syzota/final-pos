import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboardView from './AdminDashboardView';
import Skeleton from '../common/Skeleton';

import { BarChart2, Hourglass, Megaphone, BookText } from 'lucide-react';

export default function DashboardAnalitikView() {
    const [stats, setStats] = useState({ pengaduan: [], formulir: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStatistik = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/admin/statistik', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(response.data.data);
            } catch (err) {
                console.error("Gagal memuat statistik", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatistik();
    }, []);

    // Mencari nilai tertinggi agar grafik batangnya proporsional
    const maxPengaduan = stats.pengaduan.length > 0 ? Math.max(...stats.pengaduan.map(item => item.total)) : 1;
    const maxFormulir = stats.formulir.length > 0 ? Math.max(...stats.formulir.map(item => item.total)) : 1;

    // Fungsi untuk memformat nama bidang agar rapi (misal: pekerjaan_umum -> Pekerjaan Umum)
    const formatNama = (text) => {
        if (!text) return '-';
        return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <>
            <div className="section-head" style={{ marginBottom: '24px' }}>
                <h2><BarChart2 className="me-2" />Dashboard Analitik Kinerja</h2>
                <p style={{ color: '#666' }}>Ringkasan bidang dan sub-bidang dengan laporan terbanyak dari seluruh Posyandu.</p>
            </div>

            {isLoading ? (
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                        <Skeleton type="box" height="150px" />
                        <Skeleton type="box" height="150px" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <Skeleton type="box" height="350px" />
                        <Skeleton type="box" height="350px" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-2">

                    {/* ==============================================
              GRAFIK 1: TOP BIDANG PENGADUAN
              ============================================== */}
                    <div className="card">
                        <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={{ color: 'var(--magenta-deep)' }}><Megaphone className="me-2" />Top Pengaduan Warga</h3>
                            <span style={{ fontSize: '12px', color: '#888' }}>Berdasarkan Bidang</span>
                        </div>

                        {stats.pengaduan.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {stats.pengaduan.map((item, index) => {
                                    const percent = (item.total / maxPengaduan) * 100;
                                    return (
                                        <div key={index}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold', color: '#444' }}>
                                                <span>{formatNama(item.bidang)}</span>
                                                <span style={{ color: 'var(--magenta-deep)' }}>{item.total} Laporan</span>
                                            </div>
                                            {/* Latar Belakang Bar */}
                                            <div style={{ width: '100%', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                {/* Bar Pengisi */}
                                                <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--magenta-deep)', borderRadius: '10px', transition: 'width 1s ease-in-out' }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Belum ada data pengaduan.</div>
                        )}
                    </div>

                    {/* ==============================================
              GRAFIK 2: TOP SUB-BIDANG FORMULIR IDENTIFIKASI
              ============================================== */}
                    <div className="card">
                        <div className="section-head" style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={{ color: 'var(--violet-deep)' }}><BookText className="me-2" />Top Pemetaan Identifikasi</h3>
                            <span style={{ fontSize: '12px', color: '#888' }}>Berdasarkan Sub-Bidang</span>
                        </div>

                        {stats.formulir.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {stats.formulir.map((item, index) => {
                                    const percent = (item.total / maxFormulir) * 100;
                                    return (
                                        <div key={index}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold', color: '#444' }}>
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }} title={item.sub_bidang}>
                                                    {item.sub_bidang} <span style={{ fontSize: '11px', color: '#888', fontWeight: 'normal' }}>({formatNama(item.bidang)})</span>
                                                </span>
                                                <span style={{ color: 'var(--violet-deep)' }}>{item.total} Data</span>
                                            </div>
                                            {/* Latar Belakang Bar */}
                                            <div style={{ width: '100%', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                                                {/* Bar Pengisi */}
                                                <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--violet-deep)', borderRadius: '10px', transition: 'width 1s ease-in-out' }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Belum ada data formulir identifikasi.</div>
                        )}
                    </div>

                </div>
            )}
        </>
    );
}