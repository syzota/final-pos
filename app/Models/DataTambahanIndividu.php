<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataTambahanIndividu extends Model
{
    use HasFactory;

    protected $table = 'data_tambahan_individu';

    protected $fillable = [
        'posyandu_id',
        'jenis',
        'nama',
        'umur',
        'alamat',
        'tanggal',
        'detail',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'detail' => 'array',
    ];

    public function posyandu()
    {
        return $this->belongsTo(Posyandu::class, 'posyandu_id');
    }
}
