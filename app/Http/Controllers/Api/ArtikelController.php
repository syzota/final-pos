<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // Tambahkan ini untuk membuat slug otomatis

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        $query = Artikel::with(['penulis:id,name,role,posyandu_id', 'posyandu:id,nama']);

        if ($request->has('status') && $request->status !== 'all' && $request->status !== 'semua') {
            $query->where('status', $request->status);
        } elseif (! $request->has('status')) {
            $query->where('status', 'dipublikasikan');
        }

        if ($request->filled('posyandu_id') && $request->posyandu_id !== 'all') {
            $query->where('posyandu_id', $request->posyandu_id);
        }

        if ($request->filled('kategori') && $request->kategori !== 'Semua Topik' && $request->kategori !== 'all') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('isi_artikel', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'status' => 'sukses',
            'data' => $query->latest()->get(),
        ]);
    }

    public function show($id)
    {
        $artikel = Artikel::with(['penulis:id,name,role,posyandu_id', 'posyandu:id,nama'])->find($id);

        if (! $artikel) {
            return response()->json(['status' => 'gagal', 'pesan' => 'Artikel tidak ditemukan'], 404);
        }

        return response()->json(['status' => 'sukses', 'data' => $artikel]);
    }

    public function store(Request $request)
    {
        // Sesuaikan validasi dengan nama kolom
        $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string',
            'isi_artikel' => 'required|string',
            'status' => 'required|in:draf,dipublikasikan',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'posyandu_id' => 'nullable|exists:posyandus,id',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('images/artikel', 'public');
        }

        // Buat URL ramah SEO (Slug) dari Judul, tambah angka acak agar unik
        $slug = Str::slug($request->judul).'-'.time();

        $posyanduId = $request->posyandu_id ?? $request->user()->posyandu_id ?? null;

        $artikel = Artikel::create([
            'penulis_id' => $request->user()->id,
            'posyandu_id' => $posyanduId,
            'judul' => $request->judul,
            'kategori' => $request->kategori,
            'slug' => $slug,
            'isi_artikel' => $request->isi_artikel,
            'status' => $request->status,
            'path_foto' => $fotoPath,
            'published_at' => $request->status === 'dipublikasikan' ? now() : null,
        ]);

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Artikel berhasil disimpan',
            'data' => $artikel->load(['penulis:id,name,role,posyandu_id', 'posyandu:id,nama']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $artikel = Artikel::find($id);
        if (! $artikel) {
            return response()->json(['status' => 'gagal', 'pesan' => 'Artikel tidak ditemukan'], 404);
        }

        $user = $request->user();
        $isAuthorized = in_array($user->role, ['superadmin'])
            || $artikel->penulis_id === $user->id
            || ($user->role === 'ketua' && $user->posyandu_id && $artikel->posyandu_id === $user->posyandu_id);

        if (! $isAuthorized) {
            return response()->json(['status' => 'gagal', 'pesan' => 'Akses ditolak: Anda hanya dapat mengubah artikel yang berkaitan dengan posyandu Anda atau yang Anda tulis sendiri.'], 403);
        }

        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'kategori' => 'sometimes|required|string',
            'isi_artikel' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:draf,dipublikasikan',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'posyandu_id' => 'nullable|exists:posyandus,id',
        ]);

        // Jika ada foto baru
        if ($request->hasFile('foto')) {
            if ($artikel->path_foto && Storage::disk('public')->exists($artikel->path_foto)) {
                Storage::disk('public')->delete($artikel->path_foto);
            }
            $artikel->path_foto = $request->file('foto')->store('images/artikel', 'public');
        }

        // Jika judul berubah, ubah juga slug-nya
        if ($request->has('judul') && $request->judul !== $artikel->judul) {
            $artikel->slug = Str::slug($request->judul).'-'.time();
        }

        // Update waktu publish jika status berubah jadi dipublikasikan
        if ($request->has('status') && $request->status === 'dipublikasikan' && $artikel->status !== 'dipublikasikan') {
            $artikel->published_at = now();
        }

        $artikel->update($request->only(['judul', 'kategori', 'isi_artikel', 'status', 'posyandu_id']));
        $artikel->save();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Artikel berhasil diperbarui',
            'data' => $artikel->load(['penulis:id,name,role,posyandu_id', 'posyandu:id,nama']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $artikel = Artikel::find($id);
        if (! $artikel) {
            return response()->json(['status' => 'gagal', 'pesan' => 'Artikel tidak ditemukan'], 404);
        }

        $user = $request->user();
        $isAuthorized = in_array($user->role, ['superadmin'])
            || $artikel->penulis_id === $user->id
            || ($user->role === 'ketua' && $user->posyandu_id && $artikel->posyandu_id === $user->posyandu_id);

        if (! $isAuthorized) {
            return response()->json(['status' => 'gagal', 'pesan' => 'Akses ditolak: Anda hanya dapat menghapus artikel yang berkaitan dengan posyandu Anda atau yang Anda tulis sendiri.'], 403);
        }

        if ($artikel->path_foto && Storage::disk('public')->exists($artikel->path_foto)) {
            Storage::disk('public')->delete($artikel->path_foto);
        }

        $artikel->delete();

        return response()->json(['status' => 'sukses', 'pesan' => 'Artikel berhasil dihapus']);
    }
}
