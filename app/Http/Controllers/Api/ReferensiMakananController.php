<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReferensiMakananController extends Controller
{
    // Mengambil semua daftar makanan untuk Publik & Dasbor
    public function index()
    {
        $makanan = DB::table('referensi_makanan')
            ->orderBy('nama_makanan', 'asc')
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $makanan
        ]);
    }

    public function manage(Request $request)
    {
        $user = $request->user();

        if (!$user->posyandu_id) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Akun Anda tidak terikat pada Posyandu.'
            ], 403);
        }

        $makanan = DB::table('referensi_makanan')
            ->where('dibuat_oleh_posyandu', $user->posyandu_id)
            ->orderBy('nama_makanan', 'asc')
            ->get();

        return response()->json([
            'status' => 'sukses',
            'data' => $makanan
        ]);
    }

    // Menambah Makanan Baru
    public function store(Request $request)
    {
        $request->validate([
            'nama_makanan' => 'required|string',
            'kalori_per_porsi' => 'required|numeric'
        ]);

        $posyanduId = $request->user()->posyandu_id;

        DB::table('referensi_makanan')->insert([
            'nama_makanan' => $request->nama_makanan,
            'kalori_per_porsi' => $request->kalori_per_porsi,
            'dibuat_oleh_posyandu' => $posyanduId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['status' => 'sukses', 'pesan' => 'Data makanan berhasil ditambahkan!']);
    }

    // Memperbarui Makanan
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_makanan' => 'required|string',
            'kalori_per_porsi' => 'required|numeric'
        ]);

        $user = $request->user();

        if (!$user->posyandu_id) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Akun Anda tidak terikat pada Posyandu.'
            ], 403);
        }

        $makanan = DB::table('referensi_makanan')
            ->where('id', $id)
            ->first();

        if (!$makanan) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data makanan tidak ditemukan.'
            ], 404);
        }

        if (
            (int) $makanan->dibuat_oleh_posyandu !==
            (int) $user->posyandu_id
        ) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Anda tidak memiliki akses untuk mengubah data makanan ini.'
            ], 403);
        }

        DB::table('referensi_makanan')
            ->where('id', $id)
            ->update([
                'nama_makanan' => $request->nama_makanan,
                'kalori_per_porsi' => $request->kalori_per_porsi,
                'updated_at' => now(),
            ]);

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data makanan berhasil diperbarui!'
        ]);
    }
    // Menghapus Makanan
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->posyandu_id) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Akun Anda tidak terikat pada Posyandu.'
            ], 403);
        }

        $makanan = DB::table('referensi_makanan')
            ->where('id', $id)
            ->first();

        if (!$makanan) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data makanan tidak ditemukan.'
            ], 404);
        }

        if (
            (int) $makanan->dibuat_oleh_posyandu !==
            (int) $user->posyandu_id
        ) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Anda tidak memiliki akses untuk menghapus data makanan ini.'
            ], 403);
        }

        DB::table('referensi_makanan')
            ->where('id', $id)
            ->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data makanan berhasil dihapus!'
        ]);
    }
}
