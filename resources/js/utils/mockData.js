export const USER_DB = {
  'kader.melati':      {password:'kader123',    role:'kader',      posyandu:'Melati',       nama:'Kader Melati'},
  'ketua.melati':      {password:'ketua123',    role:'ketua',      posyandu:'Melati',       nama:'Ketua Melati'},
  'kader.mawar':       {password:'kader123',    role:'kader',      posyandu:'Mawar',        nama:'Kader Mawar'},
  'ketua.mawar':       {password:'ketua123',    role:'ketua',      posyandu:'Mawar',        nama:'Ketua Mawar'},
  'petugas.puskesmas': {password:'puskesmas123',role:'puskesmas',  posyandu:null,           nama:'Petugas Puskesmas'},
  'sekdes.ldu':        {password:'perangkat123',role:'superadmin', posyandu:null,           nama:'Sekretaris Desa LDU'},
};

export const WARGA_DB = {
  'herman': {
    password:'3172041234560001', posyandu:'Melati', nama:'Bapak Herman',
    anak:[
      {nama:'Ananda Fitri', usia:'18 bulan', gender:'Perempuan',
        riwayat:[
          {bulan:'Mei 2026', bb:'9.8 kg', tb:'76 cm', status:'Normal'},
          {bulan:'Jun 2026', bb:'10.0 kg', tb:'77 cm', status:'Normal'},
          {bulan:'Jul 2026', bb:'10.2 kg', tb:'78 cm', status:'Normal'}
        ]},
      {nama:'Ananda Rizky', usia:'4 tahun', gender:'Laki-laki',
        riwayat:[
          {bulan:'Mei 2026', bb:'15.4 kg', tb:'99 cm', status:'Normal'},
          {bulan:'Jun 2026', bb:'15.6 kg', tb:'99.5 cm', status:'Normal'},
          {bulan:'Jul 2026', bb:'15.9 kg', tb:'100 cm', status:'Normal'}
        ]}
    ],
    anggotaLansiaBumil:null
  },
  'sari wulandari': {
    password:'3172041234560002', posyandu:'Mawar', nama:'Ibu Sari Wulandari',
    anak:[
      {nama:'Ananda Bintang', usia:'8 bulan', gender:'Laki-laki',
        riwayat:[
          {bulan:'Jun 2026', bb:'7.9 kg', tb:'68 cm', status:'Normal'},
          {bulan:'Jul 2026', bb:'8.2 kg', tb:'69 cm', status:'Normal'}
        ]}
    ],
    anggotaLansiaBumil:{
      nama:'Ibu Sari Wulandari', jenis:'bumil',
      riwayat:[
        {bulan:'Jun 2026', ukuran:'LILA 24.5 cm', tensi:'110/70', status:'Normal'},
        {bulan:'Jul 2026', ukuran:'LILA 24.8 cm', tensi:'115/75', status:'Normal'}
      ]}
  },
};

export const FOOD_DB = [
  {id:'f01', nama:'Nasi Putih (1 centong, ±100g)', kalori:130},
  {id:'f02', nama:'Ayam Goreng (1 potong)', kalori:260},
  {id:'f03', nama:'Ikan Goreng (1 potong)', kalori:206},
  {id:'f04', nama:'Telur Rebus (1 butir)', kalori:78},
  {id:'f05', nama:'Tempe Goreng (1 potong)', kalori:80},
  {id:'f06', nama:'Tahu Goreng (1 potong)', kalori:35},
  {id:'f07', nama:'Tumis Kangkung (1 mangkuk)', kalori:70},
  {id:'f08', nama:'Sayur Bayam Bening (1 mangkuk)', kalori:50},
  {id:'f09', nama:'Mie Instan Goreng (1 bungkus)', kalori:380},
  {id:'f10', nama:'Kerupuk (1 keping)', kalori:40},
  {id:'f11', nama:'Pisang (1 buah)', kalori:105},
  {id:'f12', nama:'Susu Full Cream (1 gelas)', kalori:122},
];

export const ARTIKEL_DB = [
  {id:'a1', judul:'Tips Cegah Stunting Sejak 1000 Hari Pertama', kategori:'Kesehatan', isi:'Pentingnya asupan gizi seimbang sejak masa kehamilan hingga anak berusia 2 tahun untuk mencegah stunting.', penulis:'Kader Melati', status:'publish'},
  {id:'a2', judul:'Penyaluran Bantuan Sosial Triwulan II', kategori:'Sosial', isi:'Informasi jadwal dan syarat penyaluran bantuan sosial triwulan kedua bagi warga terdaftar.', penulis:'Ketua Melati', status:'publish'},
  {id:'a3', judul:'Jadwal Kelas Literasi Digital Orang Tua', kategori:'Pendidikan', isi:'Kelas literasi digital untuk membantu orang tua mendampingi anak menggunakan gawai dengan aman.', penulis:'Kader Melati', status:'draf'}
];

export const POSYANDU_LIST = [
  {nama:'Melati', alamat:'Jl. Mawar RT 02', tanggal:3, ketua:'Ibu Siti Aminah', sekretaris:'Ibu Ratna Sari', bendahara:'Ibu Yuni Lestari', telp:'0812-5000-1001', lat:-0.5150, lng:117.1120, warna:'cyan', ico:'i-heart'},
  {nama:'Rukun Lestari', alamat:'Jl. Anggrek RT 01', tanggal:4, ketua:'Ibu Marlina', sekretaris:'Ibu Fitriani', bendahara:'Ibu Hasanah', telp:'0812-5000-1002', lat:-0.5210, lng:117.1180, warna:'orange', ico:'i-heart'},
  {nama:'Mawar', alamat:'Jl. Kenanga RT 05', tanggal:6, ketua:'Ibu Dewi Kurnia', sekretaris:'Ibu Nurul', bendahara:'Ibu Sumiati', telp:'0812-5000-1003', lat:-0.5090, lng:117.1050, warna:'magenta', ico:'i-heart'},
  {nama:'Bina Putra', alamat:'Jl. Merpati RT 03', tanggal:9, ketua:'Ibu Endang', sekretaris:'Ibu Yanti', bendahara:'Ibu Sri Wahyuni', telp:'0812-5000-1004', lat:-0.5260, lng:117.1005, warna:'green', ico:'i-heart'},
  {nama:'Nusa Indah', alamat:'Jl. Cendana RT 04', tanggal:10, ketua:'Ibu Rahma', sekretaris:'Ibu Wati', bendahara:'Ibu Ningsih', telp:'0812-5000-1005', lat:-0.5040, lng:117.1220, warna:'violet', ico:'i-heart'},
  {nama:'Cempaka', alamat:'Jl. Flamboyan RT 06', tanggal:12, ketua:'Ibu Halimah', sekretaris:'Ibu Puji', bendahara:'Ibu Kartini', telp:'0812-5000-1006', lat:-0.5305, lng:117.1150, warna:'rose', ico:'i-heart'},
  {nama:'Tunas Mulya', alamat:'Jl. Teratai RT 07', tanggal:14, ketua:'Ibu Sartika', sekretaris:'Ibu Lina', bendahara:'Ibu Wulan', telp:'0812-5000-1007', lat:-0.4980, lng:117.0980, warna:'cyan', ico:'i-heart'},
  {nama:'Surya', alamat:'Jl. Dahlia RT 08', tanggal:16, ketua:'Ibu Yulia', sekretaris:'Ibu Erna', bendahara:'Ibu Novita', telp:'0812-5000-1008', lat:-0.5350, lng:117.1250, warna:'orange', ico:'i-heart'},
  {nama:'Terkini', alamat:'Jl. Melur RT 09', tanggal:19, ketua:'Ibu Yanti Sartika', sekretaris:'Ibu Rini', bendahara:'Ibu Desi', telp:'0812-5000-1009', lat:-0.4920, lng:117.1090, warna:'magenta', ico:'i-heart'},
];
