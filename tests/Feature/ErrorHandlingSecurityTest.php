<?php

namespace Tests\Feature;

use App\Models\Posyandu;
use App\Models\User;
use App\Models\WargaKeluarga;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class ErrorHandlingSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_warga_store_does_not_expose_database_exception_details(): void
    {
        $posyandu = Posyandu::create([
            'nama' => 'Posyandu Test',
        ]);

        $kader = User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.error.test',
            'role' => 'kader',
        ]);

        $kader->posyandu_id = $posyandu->id;
        $kader->save();

        /*
         * Buat data keluarga lebih dulu.
         *
         * no_kk ini nanti sengaja kita gunakan lagi
         * supaya database menghasilkan unique constraint error.
         */
        WargaKeluarga::create([
            'posyandu_id' => $posyandu->id,
            'user_id' => null,
            'nama_kepala_keluarga' => 'Warga Lama',
            'no_kk' => '1111111111111111',
            'nik_kepala_keluarga' => '2222222222222222',
            'no_hp' => null,
        ]);

        Sanctum::actingAs($kader);

        /*
         * NIK berbeda sehingga lolos validasi unique NIK.
         *
         * Tetapi no_kk sengaja sama sehingga database
         * akan melempar exception UNIQUE constraint.
         */
        $response = $this->postJson(
            '/api/warga',
            [
                'nama_lengkap' => 'Warga Baru',
                'jenis_kelamin' => 'L',
                'nik' => '3333333333333333',

                // Sengaja duplicate.
                'no_kk' => '1111111111111111',

                'no_hp' => '081234567890',
                'status_pernikahan' => 'Duda',
            ]
        );

        $response
            ->assertStatus(500)
            ->assertJson([
                'status' => 'gagal',
                'pesan' => 'Terjadi kesalahan sistem. Silakan coba lagi.',
            ]);

        /*
         * Pastikan detail internal database
         * benar-benar tidak bocor.
         */
        $pesan = $response->json('pesan');

        $this->assertStringNotContainsString(
            'SQLSTATE',
            $pesan
        );

        $this->assertStringNotContainsString(
            'warga_keluarga',
            $pesan
        );

        $this->assertStringNotContainsString(
            'UNIQUE',
            strtoupper($pesan)
        );

        /*
         * Karena store memakai transaction,
         * user yang sempat dibuat sebelum error
         * juga harus rollback.
         */
        $this->assertDatabaseMissing(
            'users',
            [
                'username' => '3333333333333333',
            ]
        );
    }
    public function test_warga_destroy_does_not_expose_database_exception_details(): void
    {
        $posyandu = Posyandu::create([
            'nama' => 'Posyandu Test',
        ]);

        $kader = User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.delete.error',
            'role' => 'kader',
        ]);

        $kader->posyandu_id = $posyandu->id;
        $kader->save();

        $keluarga = WargaKeluarga::create([
            'posyandu_id' => $posyandu->id,
            'user_id' => null,
            'nama_kepala_keluarga' => 'Warga Test',
            'no_kk' => '4444444444444444',
            'nik_kepala_keluarga' => '5555555555555555',
            'no_hp' => null,
        ]);

        Sanctum::actingAs($kader);

        /*
         * Buat trigger SQLite khusus untuk test.
         *
         * Setiap DELETE terhadap warga_keluarga
         * sengaja dibuat gagal.
         */
        DB::statement("
        CREATE TRIGGER fail_warga_delete
        BEFORE DELETE ON warga_keluarga
        BEGIN
            SELECT RAISE(
                ABORT,
                'simulated delete failure'
            );
        END;
    ");

        $response = $this->deleteJson(
            '/api/warga/' . $keluarga->id
        );

        $response
            ->assertStatus(500)
            ->assertJson([
                'status' => 'gagal',
                'pesan' => 'Gagal menghapus data keluarga. Silakan coba lagi.',
            ]);

        $pesan = $response->json('pesan');

        $this->assertStringNotContainsString(
            'simulated delete failure',
            $pesan
        );

        $this->assertStringNotContainsString(
            'SQLSTATE',
            $pesan
        );

        $this->assertStringNotContainsString(
            'warga_keluarga',
            $pesan
        );

        /*
         * Delete gagal, maka data asli harus tetap ada.
         */
        $this->assertDatabaseHas(
            'warga_keluarga',
            [
                'id' => $keluarga->id,
            ]
        );
    }
}
