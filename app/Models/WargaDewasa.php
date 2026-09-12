<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WargaDewasa extends Model
{
    use HasFactory;

    protected $table = 'warga_dewasa';

    protected $fillable = ['keluarga_id', 'nama_lengkap', 'tanggal_lahir', 'jenis_kelamin'];

    public function keluarga()
    {
        return $this->belongsTo(WargaKeluarga::class, 'keluarga_id');
    }

    public function pemeriksaanHamil()
    {
        return $this->hasMany(PemeriksaanHamil::class, 'ibu_id');
    }

    public function pemeriksaanLansia()
    {
        return $this->hasMany(PemeriksaanLansia::class, 'lansia_id');
    }
}
