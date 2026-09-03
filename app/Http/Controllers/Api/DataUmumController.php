<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DataUmum;

class DataUmumController extends Controller
{
    // Ambil riwayat data
    public function index(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        $riwayat = DataUmum::where(
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

    // Simpan data baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Header / teks
            'nama_posyandu' => ['nullable', 'string'],
            'rukun_warga' => ['nullable', 'string'],
            'desa' => ['nullable', 'string'],
            'kecamatan' => ['nullable', 'string'],
            'tahun' => ['nullable', 'string'],
            'bulan' => ['nullable', 'string'],

            // Pengunjung
            'pengunjung_bayi' => ['nullable', 'integer'],
            'pengunjung_baduta' => ['nullable', 'integer'],
            'pengunjung_balita' => ['nullable', 'integer'],
            'pengunjung_wus' => ['nullable', 'integer'],
            'pengunjung_pus' => ['nullable', 'integer'],
            'pengunjung_ibu_hamil' => ['nullable', 'integer'],
            'pengunjung_ibu_menyusui' => ['nullable', 'integer'],

            // Bayi
            'bayi_lahir' => ['nullable', 'integer'],
            'bayi_meninggal' => ['nullable', 'integer'],

            // Kematian ibu
            'mati_ibu_hamil_salin_nifas' => [
                'nullable',
                'integer',
            ],

            // Petugas
            'petugas_kader' => ['nullable', 'integer'],
            'petugas_plkb' => ['nullable', 'integer'],
            'petugas_medis' => ['nullable', 'integer'],

            // Nifas & kehamilan
            'nifas_fe' => ['nullable', 'integer'],
            'nifas_vit_a' => ['nullable', 'integer'],
            'hamil_kek' => ['nullable', 'integer'],
            'hamil_anemia' => ['nullable', 'integer'],

            // Pengunjung L/P
            'pengunjung_l' => ['nullable', 'integer'],
            'pengunjung_p' => ['nullable', 'integer'],

            // Data tambahan
            'jml_kk' => ['nullable', 'integer'],
            'jml_ibu_melahirkan' => ['nullable', 'integer'],
            'mati_ibu_hamil' => ['nullable', 'integer'],
            'mati_ibu_melahirkan' => ['nullable', 'integer'],
            'mati_ibu_nifas' => ['nullable', 'integer'],
        ]);

        $textFields = [
            'nama_posyandu',
            'rukun_warga',
            'desa',
            'kecamatan',
            'tahun',
            'bulan',
        ];

        /*
         * Pertahankan behavior frontend lama:
         * input angka kosong/null menjadi 0.
         */
        foreach ($validated as $key => $value) {
            if (! in_array($key, $textFields, true)) {
                $validated[$key] = $value === null || $value === ''
                    ? 0
                    : (int) $value;
            }
        }

        /*
         * Client tidak boleh menentukan Posyandu sendiri.
         */
        $validated['posyandu_id'] =
            $request->user()->posyandu_id;

        $dataUmum = DataUmum::create(
            $validated
        );

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Pencatatan Data Umum berhasil disimpan!',
            'data' => $dataUmum,
        ], 201);
    }

    // Hapus data
    public function destroy(Request $request, $id)
    {
        $posyanduId = $request->user()->posyandu_id;

        $dataUmum = DataUmum::where(
            'id',
            $id
        )
            ->where(
                'posyandu_id',
                $posyanduId
            )
            ->first();

        if (! $dataUmum) {
            return response()->json([
                'pesan' => 'Data tidak ditemukan.',
            ], 404);
        }

        $dataUmum->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.',
        ], 200);
    }
}
