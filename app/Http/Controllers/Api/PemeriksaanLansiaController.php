<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PemeriksaanLansia;
use App\Models\WargaDewasa;
use App\Models\WargaKeluarga;
use Illuminate\Http\Request;

class PemeriksaanLansiaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'pemeriksaan_id'     => 'nullable|integer',
            'lansia_id'          => 'required|string',
            'nama_lansia_baru'   => 'required_if:lansia_id,baru|string',
            'jenis_kelamin_baru' => 'required_if:lansia_id,baru|in:L,P',
            'tanggal_periksa'    => 'required|date',
            'berat_badan'        => 'required|numeric',
            'tinggi_badan'       => 'required|numeric',
            'lingkar_pinggang'   => 'nullable|numeric',
            'tekanan_darah'      => 'nullable|string',
            'tensi'              => 'nullable|in:Rendah,Normal,Tinggi',
            'gula_darah'         => 'nullable|integer',
            'nadi'               => 'nullable|integer',
            'status_imt'         => 'nullable|string',
            'status_form'        => 'required|in:draft,final',
            'dokumentasi_foto'   => 'nullable|array|max:5',
            'dokumentasi_foto.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = $request->user();
        $posyanduId = $user->posyandu_id;

        $lansiaId = $request->lansia_id;

        /*
         * ==========================================
         * SECURITY CHECK 1
         * ==========================================
         *
         * Jika lansia sudah terdaftar dan terhubung
         * ke keluarga, keluarganya harus berasal dari
         * Posyandu kader yang sedang login.
         *
         * Fitur "lansia baru" tetap dipertahankan.
         */
        if (
            $lansiaId !== 'baru'
            && $lansiaId !== 'null'
        ) {
            $lansia = WargaDewasa::find($lansiaId);

            if (! $lansia) {
                return response()->json([
                    'status' => 'gagal',
                    'pesan' => 'Data lansia tidak ditemukan.',
                ], 404);
            }

            if ($lansia->keluarga_id !== null) {
                $keluargaMilikPosyandu = WargaKeluarga::where(
                    'id',
                    $lansia->keluarga_id
                )
                    ->where(
                        'posyandu_id',
                        $posyanduId
                    )
                    ->exists();

                if (! $keluargaMilikPosyandu) {
                    return response()->json([
                        'status' => 'gagal',
                        'pesan' => 'Anda tidak memiliki akses ke data lansia ini.',
                    ], 403);
                }
            }
        }

        /*
         * ==========================================
         * SECURITY CHECK 2
         * ==========================================
         *
         * Jika meng-update pemeriksaan lama,
         * pemeriksaan tersebut harus berasal dari
         * Posyandu yang sama.
         */
        if ($request->filled('pemeriksaan_id')) {
            $pemeriksaanLama = PemeriksaanLansia::find(
                $request->pemeriksaan_id
            );

            if ($pemeriksaanLama) {
                /*
                 * Pemeriksaan harus dibuat oleh kader
                 * dari Posyandu yang sama.
                 */
                $pemeriksaanMilikPosyandu = PemeriksaanLansia::where(
                    'id',
                    $pemeriksaanLama->id
                )
                    ->whereHas(
                        'kader',
                        function ($query) use ($posyanduId) {
                            $query->where(
                                'posyandu_id',
                                $posyanduId
                            );
                        }
                    )
                    ->exists();

                if (! $pemeriksaanMilikPosyandu) {
                    return response()->json([
                        'status' => 'gagal',
                        'pesan' => 'Anda tidak memiliki akses ke data pemeriksaan ini.',
                    ], 403);
                }

                /*
                 * Jika lansia pada pemeriksaan lama
                 * terhubung ke keluarga, keluarganya juga
                 * harus berasal dari Posyandu yang sama.
                 */
                $lansiaLama = WargaDewasa::find(
                    $pemeriksaanLama->lansia_id
                );

                if (
                    $lansiaLama
                    && $lansiaLama->keluarga_id !== null
                ) {
                    $keluargaMilikPosyandu = WargaKeluarga::where(
                        'id',
                        $lansiaLama->keluarga_id
                    )
                        ->where(
                            'posyandu_id',
                            $posyanduId
                        )
                        ->exists();

                    if (! $keluargaMilikPosyandu) {
                        return response()->json([
                            'status' => 'gagal',
                            'pesan' => 'Anda tidak memiliki akses ke data pemeriksaan ini.',
                        ], 403);
                    }
                }
            }
        }

        /*
         * ==========================================
         * FITUR LAMA: TAMBAH LANSIA BARU
         * ==========================================
         *
         * Tetap dipertahankan seperti sebelumnya.
         */
        if (
            ! $lansiaId
            || $lansiaId === 'baru'
            || $lansiaId === 'null'
        ) {
            $tanggalLahirPerkiraan = date(
                'Y-m-d',
                strtotime('-60 years')
            );

            $lansiaBaru = WargaDewasa::create([
                'nama_lengkap' => $request->nama_lansia_baru,
                'jenis_kelamin' => $request->jenis_kelamin_baru,
                'tanggal_lahir' => $tanggalLahirPerkiraan,
                'keluarga_id' => null,
            ]);

            $lansiaId = $lansiaBaru->id;
        }

        /*
         * ==========================================
         * UPLOAD FOTO
         * ==========================================
         */
        $fotoPaths = [];

        if ($request->hasFile('dokumentasi_foto')) {
            foreach (
                $request->file('dokumentasi_foto')
                as $file
            ) {
                $fotoPaths[] = $file->store(
                    'dokumentasi_kegiatan',
                    'public'
                );
            }
        }

        /*
         * ==========================================
         * SIMPAN / UPDATE PEMERIKSAAN
         * ==========================================
         */
        $pemeriksaan = PemeriksaanLansia::updateOrCreate(
            [
                'id' => $request->pemeriksaan_id,
            ],
            [
                'lansia_id' => $lansiaId,
                'kader_id' => $user->id,
                'tanggal_periksa' => $request->tanggal_periksa,
                'berat_badan' => $request->berat_badan,
                'tinggi_badan' => $request->tinggi_badan,
                'lingkar_pinggang' => $request->lingkar_pinggang,
                'tekanan_darah' => $request->tekanan_darah,
                'tensi' => $request->tensi,
                'gula_darah' => $request->gula_darah,
                'nadi' => $request->nadi,
                'status_imt' => $request->status_imt,
                'status_form' => $request->status_form,

                'dokumentasi_foto' => count($fotoPaths) > 0
                    ? $fotoPaths
                    : null,
            ]
        );

        return response()->json([
            'status' => 'sukses',

            'pesan' => $request->status_form === 'draft'
                ? 'Draf Lansia disimpan.'
                : 'Data Lansia berhasil disimpan.',

            'data' => $pemeriksaan,
        ], 201);
    }

    // =========================================================================
    // FUNGSI ADMIN DESA
    // =========================================================================

    public function getForAdmin(Request $request)
    {
        $posyanduId = $request->posyandu_id;

        $data = PemeriksaanLansia::with('lansia')
            ->whereHas(
                'kader',
                function ($query) use ($posyanduId) {
                    $query->where(
                        'posyandu_id',
                        $posyanduId
                    );
                }
            )
            ->latest()
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $data,
        ]);
    }

    public function destroyForAdmin($id)
    {
        PemeriksaanLansia::findOrFail($id)->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.',
        ]);
    }
}
