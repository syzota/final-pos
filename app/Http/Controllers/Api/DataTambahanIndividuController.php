<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataTambahanIndividu;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DataTambahanIndividuController extends Controller
{
    public function index(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        $query = DataTambahanIndividu::where('posyandu_id', $posyanduId);

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }

        if ($request->filled('bulan')) {
            // format: YYYY-MM
            $bulan = $request->bulan;
            $parts = explode('-', $bulan);
            if (count($parts) === 2) {
                $query->whereYear('tanggal', $parts[0])->whereMonth('tanggal', $parts[1]);
            }
        }

        $data = $query
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $data,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'jenis' => [
                'required',
                Rule::in([
                    'ibu_hamil',
                    'nifas',
                    'kematian_nifas',
                    'diare',
                ]),
            ],

            'nama' => ['required', 'string', 'max:150'],
            'umur' => ['required', 'integer', 'min:0', 'max:120'],
            'alamat' => ['nullable', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'detail' => ['nullable', 'array'],
            'catatan' => ['nullable', 'string', 'max:2000'],
        ]);

        $validated['posyandu_id'] = $request->user()->posyandu_id;

        $data = DataTambahanIndividu::create($validated);

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data tambahan berhasil disimpan.',
            'data' => $data,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $data = DataTambahanIndividu::where('id', $id)
            ->where('posyandu_id', $request->user()->posyandu_id)
            ->first();

        if (! $data) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data tidak ditemukan.',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data berhasil dihapus.',
        ], 200);
    }
}
