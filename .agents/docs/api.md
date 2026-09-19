# RESTful API Documentation - Posyandu Loa Duri Ulu

Dokumentasi resmi seluruh endpoint API untuk Web Posyandu Loa Duri Ulu.
Base URL: `/api`

---

## 1. Public Endpoints (Tanpa Token)

### `GET /ping`
- **Tujuan**: Cek status aktif server API.
- **Response**: `200 OK` `{"status": "sukses", "pesan": "API Aktif"}`

### `POST /login`
- **Tujuan**: Autentikasi pengguna & pembuatan Bearer Token Sanctum.
- **Body JSON**: `{"username": "...", "password": "..."}`
- **Response**: `200 OK` `{"status": "sukses", "token": "...", "user": {...}}`

### `GET /profil-posyandu`
- **Tujuan**: Mengambil daftar data profil & jadwal 9 posyandu.
- **Response**: `200 OK` `{"status": "sukses", "data": [...]}`

### `GET /artikels`
- **Tujuan**: Mengambil daftar artikel yang telah dipublikasikan.
- **Query Params**: `kategori`, `search`
- **Response**: `200 OK` `{"status": "sukses", "data": [...]}`

### `GET /artikels/{id}`
- **Tujuan**: Detail konten artikel berdasarkan ID atau slug.
- **Response**: `200 OK` `{"status": "sukses", "data": {...}}`

### `GET /makanan`
- **Tujuan**: Mengambil daftar referensi kalori makanan lokal.
- **Response**: `200 OK` `{"status": "sukses", "data": [...]}`

---

## 2. Authenticated Endpoints (`auth:sanctum`)

### `GET /me`
- **Tujuan**: Mengambil data profil user yang sedang login beserta relasi posyandu.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` `{"status": "sukses", "data": {...}}`

### `POST /logout`
- **Tujuan**: Mencabut token sesi aktif.
- **Response**: `200 OK` `{"status": "sukses", "pesan": "Berhasil logout."}`

### `PUT /akun/ganti-password`
- **Tujuan**: Ganti kata sandi akun aktif.
- **Body JSON**: `{"password_lama": "...", "password_baru": "..."}`

---

## 3. Kader & Ketua Endpoints (`role:kader,ketua`)

### `POST /pemeriksaan-balita`
- **Tujuan**: Simpan atau perbarui data pemeriksaan tumbuh kembang balita (Draf / Final).
- **Body**: `anak_id`, `tanggal_periksa`, `umur_bulan`, `berat_badan`, `tinggi_badan`, `lingkar_kepala`, `lingkar_lengan`, `imunisasi`, `status_form`, `dokumentasi_foto[]`.

### `POST /pemeriksaan-remaja`
- **Tujuan**: Simpan data pemeriksaan kesehatan remaja.

### `POST /pemeriksaan-hamil`
- **Tujuan**: Simpan data pemeriksaan ibu hamil (LILA, Tensi, KEK, Anemia).

### `POST /pemeriksaan-lansia`
- **Tujuan**: Simpan data pemeriksaan kesehatan lansia (Tensi, Gula Darah).

### `GET /draf-pemeriksaan/{kelompok}`
- **Tujuan**: Mengambil daftar draf pemeriksaan yang belum final.

### `GET /warga`, `POST /warga`, `DELETE /warga/{id}`
- **Tujuan**: CRUD data warga posyandu binaan.

---

## 4. Admin & Puskesmas Endpoints (`role:superadmin,puskesmas`)

### `GET /admin/pemeriksaan/balita`
- **Query Params**: `posyandu_id` (opsional — jika kosong, menampilkan seluruh data posyandu).

### `GET /admin/pengaduan`
- **Tujuan**: Mengambil seluruh laporan pengaduan masyarakat desa.

### `PATCH /admin/pengaduan/{id}/status`
- **Body JSON**: `{"status": "menunggu|diproses|selesai"}`

### `GET /admin/dashboard-analitik`
- **Tujuan**: Statistik komprehensif tingkat desa untuk dashboard mata elang.
