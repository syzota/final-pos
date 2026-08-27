<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login untuk Akun Pengelola / Warga
     *
     * @unauthenticated
     * @body username string required Username akun
     * @body password string required Kata sandi akun
     *
     * @response array{status: string, pesan: string, data: array{user: array{}, token: string}}
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::with('posyandu')
            ->where('username', $request->username)
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau PIN salah.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Logout akun.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Logout berhasil',
        ]);
    }

    /**
     * Ganti PIN untuk SEMUA ROLE yang sedang login:
     * warga, kader, ketua, puskesmas, superadmin.
     *
     * PIN baru wajib tepat 6 digit angka.
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => [
                'required',
                'string',
                'current_password',
            ],
            'new_password' => [
                'required',
                'string',
                'size:6',
                'regex:/^[0-9]{6}$/',
                'confirmed',
                'different:current_password',
            ],
        ], [
            'current_password.required' => 'PIN saat ini wajib diisi.',
            'current_password.current_password' => 'PIN saat ini yang Anda masukkan salah.',

            'new_password.required' => 'PIN baru wajib diisi.',
            'new_password.size' => 'PIN baru harus tepat 6 digit.',
            'new_password.regex' => 'PIN baru hanya boleh berisi angka 0-9.',
            'new_password.confirmed' => 'Konfirmasi PIN baru tidak cocok.',
            'new_password.different' => 'PIN baru harus berbeda dari PIN saat ini.',
        ]);

        /*
         * Password di database TETAP tersimpan sebagai hash.
         * Hash::make() menghasilkan hash bcrypt/driver hash Laravel,
         * jadi PIN 6 digit tidak pernah disimpan sebagai plaintext.
         */
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'PIN akun berhasil diperbarui.',
        ], 200);
    }

    /**
     * Fitur lama warga:
     * tetap dipertahankan supaya perubahan username warga tidak rusak.
     */
    public function updateAkunWarga(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'current_password' => 'required|current_password',
            'new_password' => 'nullable|min:6|confirmed',
        ], [
            'current_password.current_password' => 'Password saat ini yang Anda masukkan salah.',
            'username.unique' => 'Username ini sudah dipakai orang lain. Silakan gunakan username lain.',
        ]);

        $user->name = $request->username;
        $user->username = $request->username;

        if ($request->filled('new_password')) {
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        $keluarga = \App\Models\WargaKeluarga::where('user_id', $user->id)->first();

        if ($keluarga) {
            $keluarga->nama_kepala_keluarga = $request->username;
            $keluarga->save();

            \App\Models\WargaDewasa::where('keluarga_id', $keluarga->id)
                ->where('jenis_kelamin', 'L')
                ->update([
                    'nama_lengkap' => $request->username,
                ]);
        }

        return response()->json([
            'status' => 'sukses',
            'pesan' => 'Data akun berhasil diperbarui!',
        ]);
    }
}
