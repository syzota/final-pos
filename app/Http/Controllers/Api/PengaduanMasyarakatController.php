<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormulirIdentifikasi;
use App\Models\PengaduanMasyarakat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PengaduanMasyarakatController extends Controller
{
    public function store(Request $request)
    {
        $request->merge([
            'status_form' =>
                $request->input(
                    'status_form',
                    'final'
                ),
        ]);

        $isFinal =
            $request->status_form === 'final';

        $request->validate([
            'draft_id' => 'nullable|integer',

            'bidang' =>
                'required|in:pendidikan,pekerjaan_umum,perumahan_rakyat,trantibumlinmas,sosial',

            'nama_pelapor' =>
                $isFinal
                    ? 'required|string'
                    : 'nullable|string',

            'jenis_kelamin' =>
                $isFinal
                    ? 'required|in:L,P'
                    : 'nullable|in:L,P',

            'nik' =>
                $isFinal
                    ? 'required|digits:16'
                    : [
                        'nullable',
                        'regex:/^[0-9]{1,16}$/'
                    ],

            'no_hp' =>
                $isFinal
                    ? [
                        'nullable',
                        'regex:/^[0-9]{8,15}$/'
                    ]
                    : [
                        'nullable',
                        'regex:/^[0-9]{1,15}$/'
                    ],

            'alamat' =>
                $isFinal
                    ? 'required|string'
                    : 'nullable|string',

            'isi_keluhan' =>
                $isFinal
                    ? 'required|string'
                    : 'nullable|string',

            'lokasi_masalah' =>
                'nullable|string',

            'tanggal_penyampaian' =>
                'nullable|date',

            'penerima_aspirasi' =>
                'nullable|string|max:255',

            'jenis_aspirasi' =>
                'nullable|string|max:255',

            // Nama field di UI Pekerjaan Umum/Perumahan/Trantibum/Sosial.
            // Disimpan ke kolom jenis_aspirasi.
            'jenis_pengaduan' =>
                'nullable|string|max:255',

            'urgensi' =>
                'nullable|string|max:50',

            'rekomendasi' =>
                'nullable|string',

            'tindak_lanjut' =>
                'nullable|string',

            'status_form' =>
                'required|in:draft,final',

            'lampiran' =>
                'nullable|array|max:3',

            'lampiran.*' =>
                'file|mimes:jpeg,png,jpg,pdf,doc,docx|max:2048',
        ], [
            'nama_pelapor.required' =>
                'Nama pelapor wajib diisi sebelum pengaduan dikirim.',
            'jenis_kelamin.required' =>
                'Jenis kelamin wajib dipilih sebelum pengaduan dikirim.',
            'nik.required' =>
                'NIK wajib diisi sebelum pengaduan dikirim.',
            'nik.digits' =>
                'NIK harus terdiri dari 16 digit angka.',
            'nik.regex' =>
                'NIK hanya boleh berisi angka maksimal 16 digit.',
            'no_hp.regex' =>
                $isFinal
                    ? 'Nomor HP harus terdiri dari 8 sampai 15 digit angka.'
                    : 'Nomor HP hanya boleh berisi angka maksimal 15 digit.',
            'alamat.required' =>
                'Alamat wajib diisi sebelum pengaduan dikirim.',
            'isi_keluhan.required' =>
                'Isi pengaduan wajib diisi sebelum pengaduan dikirim.',
        ]);

        if (! $isFinal) {
            $adaIsi =
                $request->filled('nama_pelapor') ||
                $request->filled('nik') ||
                $request->filled('no_hp') ||
                $request->filled('alamat') ||
                $request->filled('tanggal_penyampaian') ||
                $request->filled('penerima_aspirasi') ||
                $request->filled('jenis_aspirasi') ||
                $request->filled('jenis_pengaduan') ||
                $request->filled('isi_keluhan') ||
                $request->filled('lokasi_masalah') ||
                $request->filled('urgensi') ||
                $request->filled('rekomendasi') ||
                $request->filled('tindak_lanjut');

            if (
                ! $adaIsi &&
                ! $request->hasFile('lampiran')
            ) {
                return response()->json([
                    'status' => 'gagal',
                    'pesan' => 'Draf pengaduan masih kosong.',
                ], 422);
            }
        }

        $posyanduId =
            $request->user()->posyandu_id;

        $lampiranPaths = [];

        if ($request->hasFile('lampiran')) {
            foreach (
                $request->file('lampiran')
                as $file
            ) {
                $lampiranPaths[] =
                    $file->store(
                        'pengaduan_lampiran',
                        'public'
                    );
            }
        }

        $defaultJenisAspirasi = match ($request->bidang) {
            'pendidikan' => '1. Sarana Pendidikan',
            'pekerjaan_umum' => 'Pemenuhan Kebutuhan Pokok Air Bersih',
            'perumahan_rakyat' => 'Penyediaan dan Rehabilitasi Rumah yang Layak Huni',
            'trantibumlinmas' => '1) Penyuluhan dan Rehabilitasi Trauma Pasca Bencana',
            'sosial' => 'KIE: Kesetaraan dan Keadilan Gender',
            default => null,
        };

        // Frontend menggunakan jenis_aspirasi untuk Pendidikan
        // dan jenis_pengaduan untuk empat bidang lain.
        // Keduanya disatukan ke kolom database jenis_aspirasi.
        $jenisAspirasi =
            $request->input('jenis_aspirasi')
            ?: $request->input('jenis_pengaduan')
            ?: $defaultJenisAspirasi;

        $payload = [
            'posyandu_id' => $posyanduId,
            'bidang' => $request->bidang,
            'nama_pelapor' => $request->nama_pelapor,
            'jenis_kelamin' => $request->jenis_kelamin,
            'nik' => $request->nik,
            'no_hp' => $request->no_hp,
            'alamat' => $request->alamat,
            'tanggal_penyampaian' => $request->tanggal_penyampaian,
            'penerima_aspirasi' => $request->penerima_aspirasi,
            'jenis_aspirasi' => $jenisAspirasi,
            'isi_keluhan' => $request->isi_keluhan,
            'lokasi_masalah' => $request->lokasi_masalah,
            'urgensi' => $request->input('urgensi', 'Sedang'),
            'rekomendasi' => $request->rekomendasi,
            'tindak_lanjut' => $request->tindak_lanjut,
            'status_form' => $request->status_form,
        ];

        if ($request->filled('draft_id')) {
            $pengaduan =
                PengaduanMasyarakat::where(
                    'id',
                    $request->draft_id
                )
                    ->where(
                        'posyandu_id',
                        $posyanduId
                    )
                    ->where(
                        'status_form',
                        'draft'
                    )
                    ->firstOrFail();

            $lampiranLama =
                is_array($pengaduan->lampiran)
                    ? $pengaduan->lampiran
                    : [];

            if (count($lampiranPaths) > 0) {
                $payload['lampiran'] =
                    array_values(
                        array_merge(
                            $lampiranLama,
                            $lampiranPaths
                        )
                    );
            } else {
                $payload['lampiran'] =
                    $pengaduan->lampiran;
            }

            if ($isFinal) {
                $payload['status'] = 'menunggu';
            }

            $pengaduan->update($payload);

            $httpCode = 200;
        } else {
            $payload['lampiran'] =
                count($lampiranPaths) > 0
                    ? $lampiranPaths
                    : null;

            $payload['status'] = 'menunggu';

            $pengaduan =
                PengaduanMasyarakat::create(
                    $payload
                );

            $httpCode = 201;
        }

        return response()->json([
            'status' => 'sukses',
            'pesan' =>
                $request->status_form === 'draft'
                    ? 'Draf pengaduan berhasil disimpan.'
                    : 'Pengaduan berhasil dikirim dan menunggu tindak lanjut.',
            'data' => $pengaduan,
        ], $httpCode);
    }

    public function index(Request $request)
    {
        $posyanduId =
            $request->user()->posyandu_id;

        $pengaduan =
            PengaduanMasyarakat::where(
                'posyandu_id',
                $posyanduId
            )
                ->where(
                    'status_form',
                    'final'
                )
                ->latest()
                ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $pengaduan,
        ]);
    }

    public function getDraft(Request $request)
    {
        $request->validate([
            'bidang' =>
                'required|in:pendidikan,pekerjaan_umum,perumahan_rakyat,trantibumlinmas,sosial',
        ]);

        $drafts =
            PengaduanMasyarakat::where(
                'posyandu_id',
                $request->user()->posyandu_id
            )
                ->where(
                    'bidang',
                    $request->bidang
                )
                ->where(
                    'status_form',
                    'draft'
                )
                ->latest('updated_at')
                ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $drafts,
        ]);
    }

    public function deleteDraft(
        Request $request,
        $id
    ) {
        $draft =
            PengaduanMasyarakat::where(
                'id',
                $id
            )
                ->where(
                    'posyandu_id',
                    $request->user()->posyandu_id
                )
                ->where(
                    'status_form',
                    'draft'
                )
                ->firstOrFail();

        if (is_array($draft->lampiran)) {
            foreach (
                $draft->lampiran
                as $lampiran
            ) {
                Storage::disk('public')
                    ->delete($lampiran);
            }
        }

        $draft->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Draf pengaduan berhasil dihapus.',
        ]);
    }

    /**
     * Hapus Pengaduan yang sudah final.
     * Untuk keamanan, hanya ketua / superadmin.
     * Tabel pengaduan saat ini belum menyimpan kader_id pembuat.
     */
    public function deleteFinal(Request $request, $id)
    {
        $user = $request->user();

        if (! in_array($user->role, ['ketua', 'superadmin'], true)) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Hanya Ketua atau Superadmin yang dapat menghapus pengaduan yang sudah dikirim.',
            ], 403);
        }

        $query = PengaduanMasyarakat::where('id', $id)
            ->where('status_form', 'final');

        if ($user->role !== 'superadmin') {
            $query->where('posyandu_id', $user->posyandu_id);
        }

        $pengaduan = $query->first();

        if (! $pengaduan) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pengaduan tidak ditemukan atau Anda tidak memiliki izin menghapus data tersebut.',
            ], 404);
        }

        if (is_array($pengaduan->lampiran)) {
            foreach ($pengaduan->lampiran as $lampiran) {
                Storage::disk('public')->delete($lampiran);
            }
        }

        $pengaduan->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Pengaduan berhasil dihapus.',
        ]);
    }
    public function getAllForAdmin(Request $request)
    {
        $query =
            PengaduanMasyarakat::where(
                'status_form',
                'final'
            );

        if ($request->has('posyandu_id')) {
            $query->where(
                'posyandu_id',
                $request->posyandu_id
            );
        }

        $data =
            $query->latest()->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $data,
        ]);
    }

    public function updateStatus(
        Request $request,
        $id
    ) {
        $request->validate([
            'status' =>
                'required|in:menunggu,diproses,selesai',
        ]);

        $pengaduan =
            PengaduanMasyarakat::where(
                'status_form',
                'final'
            )->findOrFail($id);

        $pengaduan->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Status pengaduan berhasil diperbarui.',
            'data' => $pengaduan,
        ]);
    }

    public function getLatestUpdateTiapPosyandu()
    {
        $pengaduanUpdates =
            PengaduanMasyarakat::where(
                'status_form',
                'final'
            )
                ->selectRaw(
                    'posyandu_id, MAX(created_at) as last_update'
                )
                ->groupBy('posyandu_id')
                ->pluck(
                    'last_update',
                    'posyandu_id'
                )
                ->toArray();

        $formulirUpdates =
            FormulirIdentifikasi::where(
                'status_form',
                'final'
            )
                ->selectRaw(
                    'posyandu_id, MAX(created_at) as last_update'
                )
                ->groupBy('posyandu_id')
                ->pluck(
                    'last_update',
                    'posyandu_id'
                )
                ->toArray();

        $posyanduIds =
            collect(
                array_keys(
                    $pengaduanUpdates
                )
            )
                ->merge(
                    array_keys(
                        $formulirUpdates
                    )
                )
                ->unique();

        $finalUpdates = [];

        foreach ($posyanduIds as $id) {
            $waktuPengaduan =
                $pengaduanUpdates[$id]
                ?? null;

            $waktuFormulir =
                $formulirUpdates[$id]
                ?? null;

            if (
                $waktuPengaduan &&
                $waktuFormulir
            ) {
                $finalUpdates[$id] =
                    $waktuPengaduan >
                    $waktuFormulir
                        ? $waktuPengaduan
                        : $waktuFormulir;
            } else {
                $finalUpdates[$id] =
                    $waktuPengaduan
                    ?: $waktuFormulir;
            }
        }

        return response()->json([
            'status' => 'sukses',
            'data' => $finalUpdates,
        ]);
    }

    public function getStatistik()
    {
        $pengaduan =
            PengaduanMasyarakat::where(
                'status_form',
                'final'
            )
                ->select(
                    'bidang',
                    DB::raw(
                        'count(*) as total'
                    )
                )
                ->groupBy('bidang')
                ->orderByDesc('total')
                ->get();

        $formulir =
            FormulirIdentifikasi::where(
                'status_form',
                'final'
            )
                ->select(
                    'bidang',
                    'sub_bidang',
                    DB::raw(
                        'count(*) as total'
                    )
                )
                ->groupBy(
                    'bidang',
                    'sub_bidang'
                )
                ->orderByDesc('total')
                ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => [
                'pengaduan' => $pengaduan,
                'formulir' => $formulir,
            ],
        ]);
    }

    public function destroyForAdmin($id)
    {
        $pengaduan =
            PengaduanMasyarakat::where(
                'status_form',
                'final'
            )->findOrFail($id);

        if (
            $pengaduan->status !==
            'selesai'
        ) {
            return response()->json([
                'status' => 'gagal',
                'pesan' =>
                    'Pengaduan belum selesai, tidak dapat dihapus.',
            ], 403);
        }

        if (is_array($pengaduan->lampiran)) {
            foreach (
                $pengaduan->lampiran
                as $lampiran
            ) {
                Storage::disk('public')
                    ->delete($lampiran);
            }
        }

        $pengaduan->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' =>
                'Data pengaduan berhasil dihapus.',
        ]);
    }
}
