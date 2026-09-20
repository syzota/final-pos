<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengaduanMasyarakat extends Model
{
    use HasFactory;

    protected $table = 'pengaduan_masyarakat';

    protected $fillable = [
        'posyandu_id',
        'bidang',
        'nama_pelapor',
        'jenis_kelamin',
        'nik',
        'no_hp',
        'alamat',
        'tanggal_penyampaian',
        'penerima_aspirasi',
        'jenis_aspirasi',
        'isi_keluhan',
        'lokasi_masalah',
        'urgensi',
        'rekomendasi',
        'tindak_lanjut',
        'lampiran',
        'status',
        'status_form',
    ];

    protected $casts = [
        'lampiran' => 'array',
        'tanggal_penyampaian' => 'date',
    ];
}
