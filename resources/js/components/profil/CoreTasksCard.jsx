import React from 'react';

export default function CoreTasksCard() {
  const tasks = [
    'Membantu masyarakat mendapatkan akses layanan dasar di 6 bidang SPM.',
    'Meningkatkan partisipasi aktif masyarakat dalam pembangunan kesehatan lokal.',
    'Menjadi jembatan penghubung pemerintah desa dengan kader kesehatan.',
    'Mengidentifikasi dan melaporkan masalah kesehatan dasar di lingkungan.'
  ];

  return (
    <div className="tasks-card core-tasks">
      <div className="card-header-row">
        <div className="header-icon-badge blue">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M2 20C1.45 20 0.9792 19.8042 0.5875 19.4125 0.1958 19.0208 0 18.55 0 18V4C0 3.45 0.1958 2.9792 0.5875 2.5875 0.9792 2.1958 1.45 2 2 2H6.2C6.4167 1.4 6.7792 0.9167 7.2875 0.55 7.7958 0.1833 8.3667 0 9 0C9.6333 0 10.2042 0.1833 10.7125 0.55 11.2208 0.9167 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.1958 17.4125 2.5875 17.8042 2.925 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125 17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V4H2V18ZM4 16H11V14H4V16ZM4 12H14V10H4V12ZM4 8H14V6H4V8ZM9 3.25C9.2167 3.25 9.3958 3.1792 9.5375 3.0375 9.6792 2.8958 9.75 2.7167 9.75 2.5C9.75 2.2833 9.6792 2.1042 9.5375 1.9625 9.3958 1.8208 9.2167 1.75 9 1.75C8.7833 1.75 8.6042 1.8208 8.4625 1.9625 8.3208 2.1042 8.25 2.2833 8.25 2.5C8.25 2.7167 8.3208 2.8958 8.4625 3.0375 8.6042 3.1792 8.7833 3.25 9 3.25Z" fill="currentColor"/>
          </svg>
        </div>
        <h3 className="section-title blue">Tugas Utama</h3>
      </div>

      <ul className="task-list">
        {tasks.map((task, idx) => (
          <li key={idx} className="task-item">
            <svg className="check-icon blue" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8.6 14.6L15.65 7.55 14.25 6.15 8.6 11.8 5.75 8.95 4.35 10.35 8.6 14.6ZM10 20C8.6167 20 7.3167 19.7375 6.1 19.2125 4.8833 18.6875 3.825 17.975 2.925 17.075 2.025 16.175 1.3125 15.1167 0.7875 13.9 0.2625 12.6833 0 11.3833 0 10C0 8.6167 0.2625 7.3167 0.7875 6.1 1.3125 4.8833 2.025 3.825 2.925 2.925 3.825 2.025 4.8833 1.3125 6.1 0.7875 7.3167 0.2625 8.6167 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875 15.1167 1.3125 16.175 2.025 17.075 2.925 17.975 3.825 18.6875 4.8833 19.2125 6.1 19.7375 7.3167 20 8.6167 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9 18.6875 15.1167 17.975 16.175 17.075 17.075 16.175 17.975 15.1167 18.6875 13.9 19.2125 12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675 17.225 14.125 18 12.2333 18 10C18 7.7667 17.225 5.875 15.675 4.325 14.125 2.775 12.2333 2 10 2C7.7667 2 5.875 2.775 4.325 4.325 2.775 5.875 2 7.7667 2 10C2 12.2333 2.775 14.125 4.325 15.675 5.875 17.225 7.7667 18 10 18Z" fill="currentColor"/>
            </svg>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
