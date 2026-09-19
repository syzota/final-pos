<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PemeriksaanBalita;
use App\Models\PemeriksaanHamil;
use App\Models\PemeriksaanLansia;
use App\Models\PemeriksaanRemaja;
use Illuminate\Http\Request;

class DraftController extends Controller
{
    public function getDrafts(Request $request, $kelompok = 'all')
    {
        $user = $request->user();

        // Ambil ID Posyandu dari user yang login (Kader / Ketua)
        $posyanduId = in_array($user->role, ['ketua', 'kader']) ? $user->posyandu_id : null;

        $data = [];

        if ($kelompok === 'all') {
            // Ambil semua draf dari 4 kelompok sasaran
            $balitaQuery = PemeriksaanBalita::with('anak')->where('status_form', 'draft');
            $remajaQuery = PemeriksaanRemaja::with('remaja')->where('status_form', 'draft');
            $hamilQuery = PemeriksaanHamil::with('ibu')->where('status_form', 'draft');
            $lansiaQuery = PemeriksaanLansia::with('lansia')->where('status_form', 'draft');

            if ($posyanduId) {
                $balitaQuery->whereHas('kader', function ($q) use ($posyanduId) {
                    $q->where('posyandu_id', $posyanduId);
                });
                $remajaQuery->whereHas('kader', function ($q) use ($posyanduId) {
                    $q->where('posyandu_id', $posyanduId);
                });
                $hamilQuery->whereHas('kader', function ($q) use ($posyanduId) {
                    $q->where('posyandu_id', $posyanduId);
                });
                $lansiaQuery->whereHas('kader', function ($q) use ($posyanduId) {
                    $q->where('posyandu_id', $posyanduId);
                });
            }

            $balita = $balitaQuery->latest('updated_at')->get()->map(function ($item) {
                $item->kategori = 'balita';

                return $item;
            });
            $remaja = $remajaQuery->latest('updated_at')->get()->map(function ($item) {
                $item->kategori = 'remaja';

                return $item;
            });
            $hamil = $hamilQuery->latest('updated_at')->get()->map(function ($item) {
                $item->kategori = 'hamil';

                return $item;
            });
            $lansia = $lansiaQuery->latest('updated_at')->get()->map(function ($item) {
                $item->kategori = 'lansia';

                return $item;
            });

            // Gabungkan semua data lalu urutkan berdasarkan updated_at terbaru
            $data = $balita->concat($remaja)->concat($hamil)->concat($lansia)
                ->sortByDesc('updated_at')
                ->values();
        } else {
            // Pilih model berdasarkan parameter {kelompok} yang dikirim dari React
            switch ($kelompok) {
                case 'balita':
                    $query = PemeriksaanBalita::with('anak')->where('status_form', 'draft');
                    if ($posyanduId) {
                        $query->whereHas('kader', function ($q) use ($posyanduId) {
                            $q->where('posyandu_id', $posyanduId);
                        });
                    }
                    $data = $query->latest('updated_at')->get()->map(function ($item) {
                        $item->kategori = 'balita';

                        return $item;
                    });
                    break;

                case 'remaja':
                    $query = PemeriksaanRemaja::with('remaja')->where('status_form', 'draft');
                    if ($posyanduId) {
                        $query->whereHas('kader', function ($q) use ($posyanduId) {
                            $q->where('posyandu_id', $posyanduId);
                        });
                    }
                    $data = $query->latest('updated_at')->get()->map(function ($item) {
                        $item->kategori = 'remaja';

                        return $item;
                    });
                    break;

                case 'hamil':
                case 'ibu':
                    $query = PemeriksaanHamil::with('ibu')->where('status_form', 'draft');
                    if ($posyanduId) {
                        $query->whereHas('kader', function ($q) use ($posyanduId) {
                            $q->where('posyandu_id', $posyanduId);
                        });
                    }
                    $data = $query->latest('updated_at')->get()->map(function ($item) {
                        $item->kategori = 'hamil';

                        return $item;
                    });
                    break;

                case 'lansia':
                    $query = PemeriksaanLansia::with('lansia')->where('status_form', 'draft');
                    if ($posyanduId) {
                        $query->whereHas('kader', function ($q) use ($posyanduId) {
                            $q->where('posyandu_id', $posyanduId);
                        });
                    }
                    $data = $query->latest('updated_at')->get()->map(function ($item) {
                        $item->kategori = 'lansia';

                        return $item;
                    });
                    break;

                default:
                    return response()->json(['status' => 'gagal', 'pesan' => 'Kelompok sasaran tidak valid'], 400);
            }
        }

        return response()->json([
            'status' => 'sukses',
            'data' => $data,
        ]);
    }
}
