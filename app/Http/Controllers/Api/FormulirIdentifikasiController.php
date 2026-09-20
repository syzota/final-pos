<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormulirIdentifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FormulirIdentifikasiController extends Controller
{
    public function store(Request $request)
    {
        $request->merge([
            'status_form' => $request->input('status_form', 'final'),
        ]);

        $request->validate([
            'draft_id' => 'nullable|integer',
            'bidang' => 'required|in:pendidikan,pekerjaan_umum,perumahan_rakyat,trantibumlinmas,sosial',
            'sub_bidang' => 'required|string',
            'data_formulir' => 'required|json',
            'status_form' => 'required|in:draft,final',
            'dokumentasi_foto' => 'nullable|array',
            'dokumentasi_foto.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $dataFormulir = json_decode($request->data_formulir, true);

        $adaIsiForm = $this->hasMeaningfulValue($dataFormulir);
        $adaFoto = $request->hasFile('dokumentasi_foto');

        if (
            $request->status_form === 'draft' &&
            ! $adaIsiForm &&
            ! $adaFoto
        ) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Draf tidak dapat disimpan karena formulir masih kosong.',
            ], 422);
        }

        if (
            $request->status_form === 'final' &&
            ! $adaIsiForm
        ) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Formulir masih kosong. Isi data identifikasi terlebih dahulu.',
            ], 422);
        }

        $identitas = $this->extractIdentitas($dataFormulir);

        if (
            $request->status_form === 'final' &&
            ! $identitas
        ) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Mohon lengkapi nama subjek, kegiatan, fasilitas, petugas, atau lokasi identifikasi.',
            ], 422);
        }

        $posyanduId = $request->user()->posyandu_id;

        $fotoPaths = [];

        if ($request->hasFile('dokumentasi_foto')) {
            foreach ($request->file('dokumentasi_foto') as $file) {
                $fotoPaths[] = $file->store(
                    'formulir_foto',
                    'public'
                );
            }
        }

        $payload = [
            'posyandu_id' => $posyanduId,
            'kader_id' => $request->user()->id,
            'bidang' => $request->bidang,
            'sub_bidang' => $request->sub_bidang,
            'identitas' => $identitas,
            'data_formulir' => $dataFormulir,
            'status_form' => $request->status_form,
        ];

        if ($request->filled('draft_id')) {
            $formulir = FormulirIdentifikasi::where(
                'id',
                $request->draft_id
            )
                ->where('posyandu_id', $posyanduId)
                ->where('kader_id', $request->user()->id)
                ->where('status_form', 'draft')
                ->firstOrFail();

            $fotoLama = is_array($formulir->dokumentasi_foto)
                ? $formulir->dokumentasi_foto
                : [];

            if (count($fotoPaths) > 0) {
                $payload['dokumentasi_foto'] = array_values(
                    array_merge(
                        $fotoLama,
                        $fotoPaths
                    )
                );
            } else {
                $payload['dokumentasi_foto'] =
                    $formulir->dokumentasi_foto;
            }

            $formulir->update($payload);

            $httpCode = 200;
        } else {
            $payload['dokumentasi_foto'] =
                count($fotoPaths) > 0
                    ? $fotoPaths
                    : null;

            $formulir =
                FormulirIdentifikasi::create(
                    $payload
                );

            $httpCode = 201;
        }

        return response()->json([
            'status' => 'sukses',
            'pesan' =>
                $request->status_form === 'draft'
                    ? 'Draf formulir berhasil disimpan.'
                    : 'Formulir Identifikasi berhasil disimpan.',
            'data' => $formulir,
        ], $httpCode);
    }

    public function index(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        $formulir = FormulirIdentifikasi::where(
            'posyandu_id',
            $posyanduId
        )
            ->where('status_form', 'final')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $formulir,
        ]);
    }

    public function getAllForAdmin(Request $request)
    {
        $query =
            FormulirIdentifikasi::where(
                'status_form',
                'final'
            );

        if ($request->has('posyandu_id')) {
            $query->where(
                'posyandu_id',
                $request->posyandu_id
            );
        }

        $data = $query
            ->latest()
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $data,
        ]);
    }

    public function getDraft(Request $request)
    {
        $request->validate([
            'bidang' =>
                'required|in:pendidikan,pekerjaan_umum,perumahan_rakyat,trantibumlinmas,sosial',
            'sub_bidang' =>
                'nullable|string',
        ]);

        $query =
            FormulirIdentifikasi::where(
                'posyandu_id',
                $request->user()->posyandu_id
            )
                ->where(
                    'kader_id',
                    $request->user()->id
                )
                ->where(
                    'bidang',
                    $request->bidang
                )
                ->where(
                    'status_form',
                    'draft'
                );

        if ($request->filled('sub_bidang')) {
            $query->where(
                'sub_bidang',
                $request->sub_bidang
            );
        }

        $drafts = $query
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
            FormulirIdentifikasi::where(
                'id',
                $id
            )
                ->where(
                    'posyandu_id',
                    $request->user()->posyandu_id
                )
                ->where(
                    'kader_id',
                    $request->user()->id
                )
                ->where(
                    'status_form',
                    'draft'
                )
                ->firstOrFail();

        if (
            is_array(
                $draft->dokumentasi_foto
            )
        ) {
            foreach (
                $draft->dokumentasi_foto
                as $foto
            ) {
                Storage::disk('public')
                    ->delete($foto);
            }
        }

        $draft->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Draf formulir berhasil dihapus.',
        ]);
    }

    /**
     * Hapus data Formulir yang sudah final.
     * Kader: hanya data yang dia buat sendiri.
     * Ketua: semua data final dalam posyandunya.
     * Superadmin: dapat menghapus data final.
     */
    public function deleteFinal(Request $request, $id)
    {
        $user = $request->user();

        if (! in_array($user->role, ['kader', 'ketua', 'superadmin'], true)) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Anda tidak memiliki izin untuk menghapus data ini.',
            ], 403);
        }

        $query = FormulirIdentifikasi::where('id', $id)
            ->where('status_form', 'final');

        if ($user->role !== 'superadmin') {
            $query->where('posyandu_id', $user->posyandu_id);
        }

        if ($user->role === 'kader') {
            $query->where('kader_id', $user->id);
        }

        $formulir = $query->first();

        if (! $formulir) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data tidak ditemukan atau Anda tidak memiliki izin menghapus data tersebut.',
            ], 404);
        }

        if (is_array($formulir->dokumentasi_foto)) {
            foreach ($formulir->dokumentasi_foto as $foto) {
                Storage::disk('public')->delete($foto);
            }
        }

        $formulir->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data formulir berhasil dihapus.',
        ]);
    }
    public function destroyForAdmin($id)
    {
        $formulir =
            FormulirIdentifikasi::where(
                'status_form',
                'final'
            )->findOrFail($id);

        if (
            is_array(
                $formulir->dokumentasi_foto
            )
        ) {
            foreach (
                $formulir->dokumentasi_foto
                as $foto
            ) {
                Storage::disk('public')
                    ->delete($foto);
            }
        }

        $formulir->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data formulir berhasil dihapus.',
        ]);
    }

    private function extractIdentitas(
        array $data
    ): ?string {
        $priorityKeys = [
            'nama_anak',
            'nama_warga',
            'nama_kk',
            'nama_korban',
            'nama_peserta',
            'nama_penerima',
            'nama_ortu',
            'pemilik',
            'nama_fasilitas',
            'nama_kegiatan',
            'nama_paud',
            'jenis_ape',
            'lokasi_embung',
            'lokasi_pipa',
            'lokasi_jalan',
            'lokasi',
            'wilayah',
            'pengelola',
            'petugas',
            'fasilitator',
            'nama_petugas',
        ];

        foreach ($priorityKeys as $key) {
            if (
                isset($data[$key]) &&
                ! is_array($data[$key]) &&
                trim((string) $data[$key]) !== ''
            ) {
                return trim(
                    (string) $data[$key]
                );
            }
        }

        return null;
    }

    private function hasMeaningfulValue(
        $data
    ): bool {
        if (! is_array($data)) {
            return false;
        }

        foreach ($data as $value) {
            if (is_array($value)) {
                if (
                    $this->hasMeaningfulValue(
                        $value
                    )
                ) {
                    return true;
                }

                continue;
            }

            if (
                $value !== null &&
                trim((string) $value) !== ''
            ) {
                return true;
            }
        }

        return false;
    }
}
