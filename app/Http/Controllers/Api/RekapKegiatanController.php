<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RekapKegiatan;

class RekapKegiatanController extends Controller
{
    // === FUNGSI AMBIL DATA RIWAYAT (GET) ===
    public function index(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        $riwayat = RekapKegiatan::where(
            'posyandu_id',
            $posyanduId
        )
            ->latest()
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $riwayat,
        ], 200);
    }

    // === FUNGSI SIMPAN DATA (POST) ===
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Identitas & waktu
            'kd_kec' => ['nullable', 'string'],
            'kd_desa' => ['nullable', 'string'],
            'rt' => ['nullable', 'string'],
            'no_posyandu' => ['nullable', 'string'],
            'bulan_pendataan' => ['nullable', 'string'],

            'jumlah' => ['nullable', 'integer'],

            // Ibu hamil & KB
            'ibu_hamil_periksa' => ['nullable', 'integer'],
            'ibu_hamil_fe' => ['nullable', 'integer'],
            'ibu_menyusui' => ['nullable', 'integer'],
            'kb_kondom' => ['nullable', 'integer'],
            'kb_pil' => ['nullable', 'integer'],
            'kb_suntik' => ['nullable', 'integer'],

            // SKDN
            'skdn_s' => ['nullable', 'integer'],
            'skdn_k' => ['nullable', 'integer'],
            'skdn_d' => ['nullable', 'integer'],
            'skdn_n' => ['nullable', 'integer'],
            'skdn_bgm' => ['nullable', 'integer'],

            // Rincian Balita
            'bgm_l' => ['nullable', 'integer'],
            'bgm_p' => ['nullable', 'integer'],
            'vit_a' => ['nullable', 'integer'],
            'kms_keluar' => ['nullable', 'integer'],
            'fe_1' => ['nullable', 'integer'],
            'fe_2' => ['nullable', 'integer'],
            'pmt' => ['nullable', 'integer'],

            // Imunisasi
            'hep_0_7' => ['nullable', 'integer'],
            'bcg' => ['nullable', 'integer'],
            'dpt_1' => ['nullable', 'integer'],
            'dpt_2' => ['nullable', 'integer'],
            'dpt_3' => ['nullable', 'integer'],
            'polio_1' => ['nullable', 'integer'],
            'polio_2' => ['nullable', 'integer'],
            'polio_3' => ['nullable', 'integer'],
            'polio_4' => ['nullable', 'integer'],
            'campak' => ['nullable', 'integer'],
            'hep_1' => ['nullable', 'integer'],
            'hep_2' => ['nullable', 'integer'],
            'hep_3' => ['nullable', 'integer'],
            'tt_1' => ['nullable', 'integer'],
            'tt_2' => ['nullable', 'integer'],

            // Diare & layanan lain
            'diare_jml' => ['nullable', 'integer'],
            'diare_oralit' => ['nullable', 'integer'],
            'sosialisasi' => ['nullable', 'integer'],
            'bayi_kms' => ['nullable', 'integer'],
            'balita_imunisasi' => ['nullable', 'integer'],
            'balita_kurang_gizi' => ['nullable', 'integer'],
        ]);

        $textFields = [
            'kd_kec',
            'kd_desa',
            'rt',
            'no_posyandu',
            'bulan_pendataan',
        ];

        /*
         * Tetap pertahankan angka kosong → 0.
         */
        foreach ($validated as $key => $value) {
            if (! in_array($key, $textFields, true)) {
                $validated[$key] = $value === null || $value === ''
                    ? 0
                    : (int) $value;
            }
        }

        /*
         * Posyandu selalu berasal dari user login.
         */
        $validated['posyandu_id'] =
            $request->user()->posyandu_id;

        $rekap = RekapKegiatan::create(
            $validated
        );

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data Hasil Kegiatan Posyandu berhasil disimpan!',
            'data' => $rekap,
        ], 201);
    }

    // === FUNGSI HAPUS DATA (DELETE) ===
    public function destroy(Request $request, $id)
    {
        $posyanduId = $request->user()->posyandu_id;

        $rekap = RekapKegiatan::where(
            'id',
            $id
        )
            ->where(
                'posyandu_id',
                $posyanduId
            )
            ->first();

        if (! $rekap) {
            return response()->json([
                'pesan' =>
                    'Data tidak ditemukan atau Anda tidak memiliki akses.',
            ], 404);
        }

        $rekap->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data rekap berhasil dihapus.',
        ], 200);
    }
}
