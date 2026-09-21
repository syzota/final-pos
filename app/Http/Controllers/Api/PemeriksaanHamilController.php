<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PemeriksaanHamil;
use App\Models\WargaDewasa;
use App\Models\WargaKeluarga;
use Illuminate\Http\Request;

class PemeriksaanHamilController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'pemeriksaan_id' => 'nullable|integer',
            'ibu_id' => 'required|string',
            'nama_ibu_baru' => 'required_if:ibu_id,baru|string',
            'tanggal_periksa' => 'required|date',
            'usia_kehamilan_minggu' => 'required|integer|min:1',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'tekanan_darah' => 'nullable|string',
            'lingkar_perut' => 'nullable|numeric',
            'lingkar_lengan' => 'nullable|numeric',
            'status_kek' => 'required|in:Ya,Tidak',
            'anemia' => 'required|in:Ya,Tidak',
            'status_imt' => 'nullable|string',
            'status_form' => 'required|in:draft,final',
            'dokumentasi_foto' => 'nullable|array|max:5',
            'dokumentasi_foto.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        $posyanduId = $user->posyandu_id;

        $ibuId = $request->ibu_id;

        /*
         * ==========================================
         * SECURITY CHECK 1
         * ==========================================
         *
         * Jika memilih ibu yang sudah terdaftar,
         * pastikan ibu tersebut berasal dari keluarga
         * Posyandu yang sama dengan kader login.
         *
         * Fitur "ibu baru" tetap dipertahankan.
         */
        if (
            $ibuId !== 'baru'
            && $ibuId !== 'null'
        ) {
            $ibu = WargaDewasa::find($ibuId);

            if (! $ibu) {
                return response()->json([
                    'status' => 'gagal',
                    'pesan' => 'Data ibu tidak ditemukan.',
                ], 404);
            }

            /*
             * Warga dewasa yang berasal dari data keluarga
             * mempunyai keluarga_id.
             *
             * Jika ada keluarga_id, wajib berasal dari
             * Posyandu yang sama.
             */
            if ($ibu->keluarga_id !== null) {
                $keluargaMilikPosyandu = WargaKeluarga::where(
                    'id',
                    $ibu->keluarga_id
                )
                    ->where(
                        'posyandu_id',
                        $posyanduId
                    )
                    ->exists();

                if (! $keluargaMilikPosyandu) {
                    return response()->json([
                        'status' => 'gagal',
                        'pesan' => 'Anda tidak memiliki akses ke data ibu ini.',
                    ], 403);
                }
            }
        }

        /*
         * ==========================================
         * SECURITY CHECK 2
         * ==========================================
         *
         * Kalau request ingin update pemeriksaan lama,
         * pemeriksaan tersebut harus berasal dari
         * Posyandu yang sama.
         */
        if ($request->filled('pemeriksaan_id')) {
            $pemeriksaanLama = PemeriksaanHamil::find(
                $request->pemeriksaan_id
            );

            if ($pemeriksaanLama) {
                /*
                 * Pemeriksaan harus dibuat oleh kader
                 * dari Posyandu yang sama.
                 */
                $pemeriksaanMilikPosyandu = PemeriksaanHamil::where(
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
                 * Jika ibu pada pemeriksaan lama terhubung
                 * ke keluarga, keluarganya juga harus
                 * berasal dari Posyandu yang sama.
                 */
                $ibuLama = WargaDewasa::find(
                    $pemeriksaanLama->ibu_id
                );

                if (
                    $ibuLama
                    && $ibuLama->keluarga_id !== null
                ) {
                    $keluargaMilikPosyandu = WargaKeluarga::where(
                        'id',
                        $ibuLama->keluarga_id
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
         * FITUR LAMA: TAMBAH IBU BARU
         * ==========================================
         *
         * Jangan diubah supaya frontend lama
         * tetap dapat mencatat ibu yang belum terdaftar.
         */
        if (
            ! $ibuId
            || $ibuId === 'baru'
            || $ibuId === 'null'
        ) {
            $tanggalLahirPerkiraan = date(
                'Y-m-d',
                strtotime('-25 years')
            );

            $ibuBaru = WargaDewasa::create([
                'nama_lengkap' => $request->nama_ibu_baru,
                'jenis_kelamin' => 'P',
                'tanggal_lahir' => $tanggalLahirPerkiraan,
                'keluarga_id' => null,
            ]);

            $ibuId = $ibuBaru->id;
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
        $pemeriksaan = PemeriksaanHamil::updateOrCreate(
            [
                'id' => $request->pemeriksaan_id,
            ],
            [
                'ibu_id' => $ibuId,
                'kader_id' => $user->id,
                'tanggal_periksa' => $request->tanggal_periksa,
                'usia_kehamilan_minggu' => $request->usia_kehamilan_minggu,
                'berat_badan' => $request->berat_badan,
                'tinggi_badan' => $request->tinggi_badan,
                'tekanan_darah' => $request->tekanan_darah,
                'lingkar_perut' => $request->lingkar_perut,
                'lingkar_lengan' => $request->lingkar_lengan,
                'status_kek' => $request->status_kek,
                'anemia' => $request->anemia,
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
                ? 'Draf Ibu Hamil disimpan.'
                : 'Data Ibu Hamil berhasil disimpan.',

            'data' => $pemeriksaan,
        ], 201);
    }

    // ==========================================
    // FUNGSI ADMIN
    // ==========================================

    public function getForAdmin(Request $request)
    {
        $posyanduId = $request->posyandu_id;

        $data = PemeriksaanHamil::with('ibu')
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
        PemeriksaanHamil::findOrFail($id)->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.',
        ]);
    }
}
