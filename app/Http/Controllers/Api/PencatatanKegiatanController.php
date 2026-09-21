<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PencatatanKegiatan;

class PencatatanKegiatanController extends Controller
{
    public function index(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        $riwayat = PencatatanKegiatan::where(
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

    public function store(Request $request)
    {
        /*
         * Hanya field yang memang dikenal aplikasi/database
         * yang boleh diteruskan ke model.
         *
         * Field asing dari client otomatis tidak akan masuk
         * ke $validated.
         */
        $validated = $request->validate([
            // Field teks
            'nama_posyandu' => ['nullable', 'string'],
            'ketua_pelaksana' => ['nullable', 'string'],
            'signature_data' => ['nullable', 'string'],

            // Ibu Hamil & Menyusui
            'ibu_hamil' => ['nullable', 'integer'],
            'ibu_hamil_periksa' => ['nullable', 'integer'],
            'ibu_hamil_fe' => ['nullable', 'integer'],
            'ibu_menyusui' => ['nullable', 'integer'],

            // KB
            'kb_kondom' => ['nullable', 'integer'],
            'kb_pil' => ['nullable', 'integer'],
            'kb_suntik' => ['nullable', 'integer'],

            // SKDN
            'skdn_s' => ['nullable', 'integer'],
            'skdn_k' => ['nullable', 'integer'],
            'skdn_d' => ['nullable', 'integer'],
            'skdn_n' => ['nullable', 'integer'],
            'skdn_bgm' => ['nullable', 'integer'],
            'bgm_l' => ['nullable', 'integer'],
            'bgm_p' => ['nullable', 'integer'],

            // Rincian Balita
            'vit_a' => ['nullable', 'integer'],
            'kms_keluar' => ['nullable', 'integer'],
            'fe_1' => ['nullable', 'integer'],
            'fe_2' => ['nullable', 'integer'],
            'pmt' => ['nullable', 'integer'],

            // Imunisasi
            'hep_0_7' => ['nullable', 'integer'],
            'dpt_hb' => ['nullable', 'integer'],
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

            // Diare & Layanan
            'diare_jml' => ['nullable', 'integer'],
            'diare_oralit' => ['nullable', 'integer'],
            'layanan_kesehatan' => ['nullable', 'integer'],
            'sosialisasi' => ['nullable', 'integer'],
            'bayi_kms' => ['nullable', 'integer'],
            'balita_imunisasi' => ['nullable', 'integer'],
            'balita_kurang_gizi' => ['nullable', 'integer'],
            'kematian_balita' => ['nullable', 'integer'],
        ]);

        /*
         * Pertahankan perilaku lama:
         * input angka kosong/null diubah menjadi 0.
         */
        $textFields = [
            'nama_posyandu',
            'ketua_pelaksana',
            'signature_data',
        ];

        foreach ($validated as $key => $value) {
            if (! in_array($key, $textFields, true)) {
                $validated[$key] = $value === null || $value === ''
                    ? 0
                    : (int) $value;
            }
        }

        /*
         * posyandu_id selalu berasal dari user login,
         * bukan dari request client.
         */
        $validated['posyandu_id'] =
            $request->user()->posyandu_id;

        $pencatatan = PencatatanKegiatan::create(
            $validated
        );

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Pencatatan Kegiatan 13 Poin berhasil disimpan!',
            'data' => $pencatatan,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $posyanduId = $request->user()->posyandu_id;

        $pencatatan = PencatatanKegiatan::where(
            'id',
            $id
        )
            ->where(
                'posyandu_id',
                $posyanduId
            )
            ->first();

        if (! $pencatatan) {
            return response()->json([
                'pesan' => 'Data tidak ditemukan.',
            ], 404);
        }

        $pencatatan->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.',
        ], 200);
    }
}
