<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Tanda ...$roles memungkinkan kita menerima banyak role sekaligus dari api.php
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Cek apakah user login dan memiliki role yang diizinkan
        $user = $request->user();
        if (! $user || ! in_array($user->role, $roles)) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Akses ditolak (403 Forbidden). Anda tidak memiliki izin untuk tindakan ini.',
            ], 403);
        }

        return $next($request);
    }
}
