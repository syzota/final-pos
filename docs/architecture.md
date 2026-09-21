# System Architecture Document - Posyandu Loa Duri Ulu

## 1. High-Level Architecture Overview

Aplikasi Posyandu Loa Duri Ulu mengadopsi arsitektur **Decoupled Monolith (Hybrid SPA)**:
- **Backend**: Laravel 12/13 API Engine yang menyediakan RESTful API terstandarisasi dengan autentikasi berbasis Sanctum Token.
- **Frontend**: Single Page Application (SPA) berbasis React 19 dengan Vite 8 sebagai bundler yang disajikan secara terintegrasi via Laravel Blade container (`app.blade.php`).
- **Database**: Relational Database Management System (MySQL / MariaDB) dengan Eloquent ORM.

```
+------------------------------------------------------------------+
|                     Client Browser (Desktop/Mobile)              |
+------------------------------------------------------------------+
                                 |
                          HTTP / HTTPS (JSON)
                                 v
+------------------------------------------------------------------+
|               Laravel Router & Middleware (bootstrap/app.php)   |
|   - Sanctum Auth Middleware ('auth:sanctum')                    |
|   - Role-Based Access Control ('role:{roles}')                   |
+------------------------------------------------------------------+
                                 |
        +------------------------+------------------------+
        |                                                 |
        v                                                 v
+-------------------------+                     +------------------+
|  Public API Controllers |                     |  Protected APIs  |
|  - PosyanduController   |                     |  - Pemeriksaan*  |
|  - ArtikelController    |                     |  - Warga         |
|  - MakananController    |                     |  - Pengaduan     |
|  - AuthController       |                     |  - AdminAnalitik |
+-------------------------+                     +------------------+
                                 |
                                 v
+------------------------------------------------------------------+
|                  Eloquent ORM & Business Logic Models            |
|  - User, Posyandu, Jadwal, Artikel, Pemeriksaan*                |
|  - WargaKeluarga, WargaAnak, WargaRemaja, WargaDewasa            |
|  - PengaduanMasyarakat, FormulirIdentifikasi                    |
+------------------------------------------------------------------+
                                 |
                                 v
+------------------------------------------------------------------+
|               Database Engine (MySQL / MariaDB)                  |
+------------------------------------------------------------------+
```

---

## 2. Directory Structure Conventions

```text
final-pos/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   # API Controller endpoints
│   │   └── Middleware/        # Middleware autentikasi & RBAC (CheckRole)
│   ├── Models/                # Eloquent Models & relationships
│   └── Providers/             # Service Providers
├── config/                    # Application, CORS, Database configs
├── database/
│   ├── migrations/            # Database schema migrations
│   └── seeders/               # Initial master data seeders
├── public/                    # Web root, favicon, compiled assets
├── resources/
│   ├── css/                   # Base CSS & font utilities
│   ├── js/
│   │   ├── api/               # Axios Client instance & interceptors
│   │   ├── assets/images/     # Static images (.webp, .png, .svg)
│   │   ├── components/        # Reusable UI components
│   │   │   ├── beranda/       # Home-specific components
│   │   │   ├── common/        # Shared (Header, Footer, Nav, Modal)
│   │   │   ├── dashboard/     # Role-specific operational views
│   │   │   └── profil/        # Posyandu profile & contact components
│   │   ├── pages/             # Main application pages
│   │   ├── styles/            # Modular CSS files
│   │   ├── App.jsx            # SPA Hash Router & Auth Manager
│   │   └── main.jsx           # React Root Entrypoint
│   └── views/
│       └── app.blade.php      # Main SPA HTML container
├── routes/
│   ├── api.php                # REST API Routes
│   ├── console.php            # Artisan Commands
│   └── web.php                # SPA Web entry route
└── vite.config.js             # Vite build & hot module replacement config
```

---

## 3. Data Flow & State Management
1. **Routing**: Menggunakan SPA Hash Navigation (`window.location.hash`) dengan sinkronisasi state `activePage`.
2. **Session Persistence**: Token Sanctum disimpan di `localStorage ('auth_token')`. Saat inisialisasi aplikasi, endpoint `GET /api/me` dipanggil untuk memvalidasi kredensial pengguna secara real-time.
3. **Data Fetching**: Menggunakan Axios Client terpusat (`resources/js/api/axiosClient.js`) dengan request interceptor otomatis menyuntikkan header `Authorization: Bearer <token>`.
