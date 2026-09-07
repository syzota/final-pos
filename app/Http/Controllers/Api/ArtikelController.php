<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        $query = Artikel::with('penulis:id,name,role');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'dipublikasikan');
        }

        return response()->json([
            'status' => 'sukses',
            'data' => $query->latest()->get()
        ]);
    }

    public function show($id)
    {
        $artikel = Artikel::with('penulis:id,name,role')->find($id);

        if (!$artikel) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Artikel tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'sukses',
            'data' => $artikel
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string',
            'isi_artikel' => 'required|string',
            'status' => 'required|in:draf,dipublikasikan',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        if (!$user->posyandu_id) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Akun Anda tidak terikat pada Posyandu.'
            ], 403);
        }

        $fotoPath = null;

        if ($request->hasFile('foto')) {
            $fotoPath = $request
                ->file('foto')
                ->store('images/artikel', 'public');
        }

        $slug = Str::slug($request->judul) . '-' . time();

        $artikel = Artikel::create([
            'penulis_id' => $user->id,
            'posyandu_id' => $user->posyandu_id,
            'judul' => $request->judul,
            'kategori' => $request->kategori,
            'slug' => $slug,
            'isi_artikel' => $request->isi_artikel,
            'status' => $request->status,
            'path_foto' => $fotoPath,
            'published_at' =>
                $request->status === 'dipublikasikan'
                    ? now()
                    : null,
        ]);

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Artikel berhasil disimpan',
            'data' => $artikel
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Artikel tidak ditemukan'
            ], 404);
        }

        // Cek apakah artikel milik Posyandu user
        if (!$this->canManageArtikel($request, $artikel)) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Anda tidak memiliki akses untuk mengubah artikel ini.'
            ], 403);
        }

        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'kategori' => 'sometimes|required|string',
            'isi_artikel' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:draf,dipublikasikan',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Jika ada foto baru
        if ($request->hasFile('foto')) {
            if (
                $artikel->path_foto &&
                Storage::disk('public')->exists($artikel->path_foto)
            ) {
                Storage::disk('public')->delete($artikel->path_foto);
            }

            $artikel->path_foto = $request
                ->file('foto')
                ->store('images/artikel', 'public');
        }

        // Jika judul berubah, slug ikut berubah
        if (
            $request->has('judul') &&
            $request->judul !== $artikel->judul
        ) {
            $artikel->slug =
                Str::slug($request->judul) . '-' . time();
        }

        // Jika berubah menjadi dipublikasikan
        if (
            $request->has('status') &&
            $request->status === 'dipublikasikan' &&
            $artikel->status !== 'dipublikasikan'
        ) {
            $artikel->published_at = now();
        }

        $artikel->update(
            $request->only([
                'judul',
                'kategori',
                'isi_artikel',
                'status'
            ])
        );

        $artikel->save();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Artikel berhasil diperbarui',
            'data' => $artikel
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Artikel tidak ditemukan'
            ], 404);
        }

        // Cek apakah artikel milik Posyandu user
        if (!$this->canManageArtikel($request, $artikel)) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Anda tidak memiliki akses untuk menghapus artikel ini.'
            ], 403);
        }

        if (
            $artikel->path_foto &&
            Storage::disk('public')->exists($artikel->path_foto)
        ) {
            Storage::disk('public')->delete($artikel->path_foto);
        }

        $artikel->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Artikel berhasil dihapus'
        ]);
    }

    private function canManageArtikel(
        Request $request,
        Artikel $artikel
    ): bool {
        $user = $request->user();

        if (!$user || !$user->posyandu_id) {
            return false;
        }

        /*
         * Artikel baru menggunakan posyandu_id langsung.
         *
         * Artikel lama mungkin posyandu_id masih null,
         * jadi sementara fallback ke Posyandu penulis.
         */
        $artikelPosyanduId = $artikel->posyandu_id;

        if (!$artikelPosyanduId) {
            $artikelPosyanduId =
                $artikel->penulis?->posyandu_id;
        }

        return (int) $artikelPosyanduId ===
            (int) $user->posyandu_id;
    }
}
