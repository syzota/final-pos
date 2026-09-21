<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Posyandu; // PENTING: Gunakan Model agar bisa pakai relasi jadwal
use Illuminate\Http\Request;   // PENTING: Import model Jadwal

class PosyanduController extends Controller
{
    // ==========================================================
    // 1. UNTUK HALAMAN PUBLIK (BERANDA)
    // ==========================================================
    public function index()
    {
        // Menggunakan Model Posyandu dan menambahkan ->with('jadwal')
        $posyandus = Posyandu::with('jadwal')->get();

        if ($posyandus->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'pesan' => 'Data Posyandu tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data Profil 9 Posyandu berhasil diambil',
            'data' => $posyandus,
        ]);
    }

    // ==========================================================
    // 2. UNTUK DASBOR KETUA/KADER (Ambil Data Posyandunya Saja)
    // ==========================================================
    public function getMe(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        // Menggunakan Model Posyandu dan menambahkan ->with('jadwal')
        $posyandu = Posyandu::with('jadwal')->where('id', $posyanduId)->first();

        return response()->json([
            'status' => 'sukses',
            'data' => $posyandu,
        ]);
    }

    // ==========================================================
    // 3. UNTUK DASBOR KETUA/KADER (Simpan Pembaruan Profil & Jadwal)
    // ==========================================================
    public function updateMe(Request $request)
    {
        $posyanduId = $request->user()->posyandu_id;

        // Ambil semua data teks KECUALI foto dan keterangan_waktu
        // (karena keterangan_waktu akan disimpan di tabel terpisah)
        $updateData = $request->except(['foto', 'keterangan_waktu']);

        // Tangani unggah foto jika kader memasukkan gambar baru
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $path = $file->store('profil_posyandu', 'public');
            $updateData['foto'] = $path;
        }

        // 1. Update ke tabel posyandus
        Posyandu::where('id', $posyanduId)->update($updateData);

        // 2. Update / hapus jadwal Posyandu
        if ($request->has('keterangan_waktu')) {

            // Kalau jadwal diisi
            if ($request->filled('keterangan_waktu')) {

                Jadwal::updateOrCreate(
                    ['posyandu_id' => $posyanduId],
                    [
                        'keterangan_waktu' => trim($request->keterangan_waktu),
                    ]
                );

            } else {

                // Kalau dikosongkan, hapus jadwal lama
                // supaya tidak mencoba menyimpan NULL ke kolom NOT NULL.
                Jadwal::where(
                    'posyandu_id',
                    $posyanduId
                )->delete();
            }
        }

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Profil Posyandu dan Jadwal berhasil diperbarui!',
        ]);
    }
}
