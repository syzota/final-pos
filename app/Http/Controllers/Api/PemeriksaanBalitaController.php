<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PemeriksaanBalita;
use App\Models\WargaAnak;
use Illuminate\Support\Facades\Storage;

class PemeriksaanBalitaController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi input dari React
        $request->validate([
            'pemeriksaan_id' => 'nullable|integer',
            'anak_id' => 'required|exists:warga_anak,id',
            'tanggal_periksa' => 'required|date',
            'umur_bulan' => 'required|integer|min:0',
            'berat_badan' => 'required|numeric',
            'tinggi_badan' => 'required|numeric',
            'lingkar_kepala' => 'nullable|numeric',
            'lingkar_lengan' => 'nullable|numeric',
            'status_gizi' => 'nullable|string',
            'catatan_perkembangan' => 'nullable|string',
            'status_form' => 'required|in:draft,final',
            'imunisasi' => 'nullable|array',

            // Validasi foto
            // Maksimal 5 foto, ukuran maks 2MB per foto
            'dokumentasi_foto' => 'nullable|array|max:5',
            'dokumentasi_foto.*' => 'image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = $request->user();
        $posyanduId = $user->posyandu_id;

        /*
         * SECURITY CHECK 1:
         *
         * Pastikan anak yang akan diperiksa memang berasal
         * dari Posyandu yang sama dengan kader yang login.
         *
         * Relasi:
         * warga_anak
         *      ↓ keluarga_id
         * warga_keluarga
         *      ↓ posyandu_id
         * posyandu
         */
        $anakMilikPosyandu = WargaAnak::where(
            'id',
            $request->anak_id
        )
            ->whereHas(
                'keluarga',
                function ($query) use ($posyanduId) {
                    $query->where(
                        'posyandu_id',
                        $posyanduId
                    );
                }
            )
            ->exists();

        if (! $anakMilikPosyandu) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Anda tidak memiliki akses ke data anak ini.',
            ], 403);
        }

        /*
         * SECURITY CHECK 2:
         *
         * Kalau request bermaksud meng-update pemeriksaan lama,
         * pastikan pemeriksaan tersebut memang milik Posyandu
         * user yang sedang login.
         *
         * Kita cek berdasarkan kader pemilik pemeriksaan DAN
         * anak yang diperiksa.
         */
        if ($request->filled('pemeriksaan_id')) {
            $pemeriksaanLama = PemeriksaanBalita::where(
                'id',
                $request->pemeriksaan_id
            )->first();

            /*
             * Jika ID benar-benar ada, lakukan ownership check.
             *
             * Jika ID tidak ada, behavior lama updateOrCreate()
             * tetap dipertahankan.
             */
            if ($pemeriksaanLama) {
                $milikPosyandu = PemeriksaanBalita::where(
                    'id',
                    $request->pemeriksaan_id
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
                    ->whereHas(
                        'anak.keluarga',
                        function ($query) use ($posyanduId) {
                            $query->where(
                                'posyandu_id',
                                $posyanduId
                            );
                        }
                    )
                    ->exists();

                if (! $milikPosyandu) {
                    return response()->json([
                        'status' => 'gagal',
                        'pesan' => 'Anda tidak memiliki akses ke data pemeriksaan ini.',
                    ], 403);
                }
            }
        }

        // 2. Tangani Proses Unggah Foto (Jika ada)
        $fotoPaths = [];

        if ($request->hasFile('dokumentasi_foto')) {
            foreach (
                $request->file('dokumentasi_foto')
                as $file
            ) {
                // Simpan ke storage/app/public/dokumentasi_kegiatan
                $path = $file->store(
                    'dokumentasi_kegiatan',
                    'public'
                );

                $fotoPaths[] = $path;
            }
        }

        // 3. Simpan / update data ke database
        $pemeriksaan = PemeriksaanBalita::updateOrCreate(
            [
                'id' => $request->pemeriksaan_id
            ],
            [
                'anak_id' => $request->anak_id,
                'kader_id' => $user->id,
                'tanggal_periksa' => $request->tanggal_periksa,
                'umur_bulan' => $request->umur_bulan,
                'berat_badan' => $request->berat_badan,
                'tinggi_badan' => $request->tinggi_badan,
                'lingkar_kepala' => $request->lingkar_kepala,
                'lingkar_lengan' => $request->lingkar_lengan,
                'catatan_perkembangan' => $request->catatan_perkembangan,
                'status_gizi' => $request->status_gizi,
                'status_form' => $request->status_form,
                'dokumentasi_foto' => count($fotoPaths) > 0
                    ? $fotoPaths
                    : null,
            ]
        );

        return response()->json([
            'status' => 'sukses',
            'pesan' => $request->status_form === 'draft'
                ? 'Draf berhasil disimpan.'
                : 'Data pemeriksaan berhasil disimpan.',
            'data' => $pemeriksaan
        ], 201);
    }

    public function getForAdmin(Request $request)
    {
        $posyanduId = $request->posyandu_id;

        // Mengambil data balita yang diperiksa
        // oleh kader di posyandu tersebut
        $data = PemeriksaanBalita::with('anak')
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
            'data' => $data
        ]);
    }

    public function destroyForAdmin($id)
    {
        PemeriksaanBalita::findOrFail($id)->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.'
        ]);
    }
}
