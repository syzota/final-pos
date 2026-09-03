<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PemeriksaanRemaja;
use App\Models\WargaKeluarga;
use App\Models\WargaRemaja;
use Illuminate\Http\Request;

class PemeriksaanRemajaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'pemeriksaan_id' => 'nullable|integer',
            'remaja_id' => 'required|string',
            'nama_remaja_baru' => 'required_if:remaja_id,baru|string',
            'jenis_kelamin_baru' => 'required_if:remaja_id,baru|in:L,P',
            'tanggal_periksa' => 'required|date',
            'umur_tahun' => 'required|integer|min:0',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'tekanan_darah' => 'nullable|string',
            'status_imt' => 'nullable|string',
            'status_form' => 'required|in:draft,final',

            'dokumentasi_foto' => 'nullable|array|max:5',
            'dokumentasi_foto.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        $posyanduId = $user->posyandu_id;

        $remajaId = $request->remaja_id;

        /*
         * ==========================================
         * SECURITY CHECK 1
         * Remaja lama harus berasal dari Posyandu
         * yang sama dengan kader login.
         * ==========================================
         *
         * Pengecekan ini hanya untuk remaja yang
         * sudah terdaftar.
         *
         * Fitur "remaja baru" tetap dipertahankan.
         */
        if (
            $remajaId !== 'baru'
            && $remajaId !== 'null'
        ) {
            $remaja = WargaRemaja::find($remajaId);

            if (! $remaja) {
                return response()->json([
                    'status' => 'gagal',
                    'pesan' => 'Data remaja tidak ditemukan.',
                ], 404);
            }

            /*
             * Remaja yang sudah terdaftar sebagai anggota
             * keluarga wajib mempunyai keluarga dari
             * Posyandu yang sama.
             */
            if ($remaja->keluarga_id !== null) {
                $keluargaMilikPosyandu = WargaKeluarga::where(
                    'id',
                    $remaja->keluarga_id
                )
                    ->where(
                        'posyandu_id',
                        $posyanduId
                    )
                    ->exists();

                if (! $keluargaMilikPosyandu) {
                    return response()->json([
                        'status' => 'gagal',
                        'pesan' => 'Anda tidak memiliki akses ke data remaja ini.',
                    ], 403);
                }
            }
        }

        /*
         * ==========================================
         * SECURITY CHECK 2
         * Pemeriksaan yang di-update harus dimiliki
         * Posyandu yang sama.
         * ==========================================
         */
        if ($request->filled('pemeriksaan_id')) {
            $pemeriksaanLama = PemeriksaanRemaja::find(
                $request->pemeriksaan_id
            );

            if ($pemeriksaanLama) {
                /*
                 * Pemeriksaan harus dibuat oleh kader
                 * dari Posyandu yang sama.
                 */
                $pemeriksaanMilikPosyandu = PemeriksaanRemaja::where(
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
                 * Jika remaja pemeriksaan tersebut terhubung
                 * ke keluarga, keluarganya juga harus berasal
                 * dari Posyandu yang sama.
                 */
                $remajaLama = WargaRemaja::find(
                    $pemeriksaanLama->remaja_id
                );

                if (
                    $remajaLama
                    && $remajaLama->keluarga_id !== null
                ) {
                    $keluargaMilikPosyandu = WargaKeluarga::where(
                        'id',
                        $remajaLama->keluarga_id
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
         * FITUR LAMA: TAMBAH REMAJA BARU
         * Tetap dipertahankan.
         * ==========================================
         */
        if (
            ! $remajaId
            || $remajaId === 'baru'
            || $remajaId === 'null'
        ) {
            $tahunLahir =
                date(
                    'Y',
                    strtotime($request->tanggal_periksa)
                )
                - $request->umur_tahun;

            $remajaBaru = WargaRemaja::create([
                'nama_remaja' => $request->nama_remaja_baru,
                'jenis_kelamin' => $request->jenis_kelamin_baru,
                'tanggal_lahir' => $tahunLahir . '-01-01',
                'keluarga_id' => null,
            ]);

            $remajaId = $remajaBaru->id;
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
        $pemeriksaan = PemeriksaanRemaja::updateOrCreate(
            [
                'id' => $request->pemeriksaan_id,
            ],
            [
                'remaja_id' => $remajaId,
                'kader_id' => $user->id,
                'tanggal_periksa' => $request->tanggal_periksa,
                'umur_tahun' => $request->umur_tahun,
                'berat_badan' => $request->berat_badan,
                'tinggi_badan' => $request->tinggi_badan,
                'tekanan_darah' => $request->tekanan_darah,
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
                ? 'Draf Remaja disimpan.'
                : 'Data pemeriksaan berhasil disimpan.',

            'data' => $pemeriksaan,
        ], 201);
    }

    // ==========================================
    // FUNGSI ADMIN
    // ==========================================

    public function getForAdmin(Request $request)
    {
        $posyanduId = $request->posyandu_id;

        $data = PemeriksaanRemaja::with('remaja')
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
        PemeriksaanRemaja::findOrFail($id)->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.',
        ]);
    }
}
