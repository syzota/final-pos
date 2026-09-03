<?php

namespace Tests\Feature;

use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InputValidationSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsKader(): Posyandu
    {
        $posyandu = Posyandu::create([
            'nama' => 'Posyandu Test',
        ]);

        $user = User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.validation.test',
            'role' => 'kader',
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        Sanctum::actingAs($user);

        return $posyandu;
    }

    public function test_pencatatan_kegiatan_ignores_unexpected_fields(): void
    {
        $posyandu = $this->actingAsKader();

        $response = $this->postJson(
            '/api/pencatatan-kegiatan',
            [
                'nama_posyandu' => 'Posyandu Test',
                'ketua_pelaksana' => 'Ketua Test',
                'ibu_hamil' => 5,

                // Field ini tidak ada di schema/database.
                'unexpected_field' => 'malicious-value',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            );

        $this->assertArrayNotHasKey(
            'unexpected_field',
            $response->json('data')
        );
    }

    public function test_pencatatan_kegiatan_rejects_invalid_numeric_input(): void
    {
        $this->actingAsKader();

        $response = $this->postJson(
            '/api/pencatatan-kegiatan',
            [
                'nama_posyandu' => 'Posyandu Test',
                'ketua_pelaksana' => 'Ketua Test',
                'ibu_hamil' => 'bukan-angka',
            ]
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'ibu_hamil',
            ]);
    }

    public function test_data_umum_ignores_unexpected_fields(): void
    {
        $posyandu = $this->actingAsKader();

        $response = $this->postJson(
            '/api/data-umum',
            [
                'nama_posyandu' => 'Posyandu Test',
                'tahun' => '2026',
                'bulan' => 'September',
                'pengunjung_bayi' => 10,

                'unexpected_field' => 'malicious-value',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            );

        $this->assertArrayNotHasKey(
            'unexpected_field',
            $response->json('data')
        );
    }

    public function test_data_umum_rejects_invalid_numeric_input(): void
    {
        $this->actingAsKader();

        $response = $this->postJson(
            '/api/data-umum',
            [
                'nama_posyandu' => 'Posyandu Test',
                'tahun' => '2026',
                'bulan' => 'September',
                'pengunjung_bayi' => 'sepuluh',
            ]
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'pengunjung_bayi',
            ]);
    }

    public function test_rekap_kegiatan_ignores_unexpected_fields(): void
    {
        $posyandu = $this->actingAsKader();

        $response = $this->postJson(
            '/api/rekap-kegiatan',
            [
                'kd_kec' => '001',
                'kd_desa' => '002',
                'rt' => '003',
                'no_posyandu' => '01',
                'bulan_pendataan' => 'September 2026',
                'jumlah' => 20,

                'unexpected_field' => 'malicious-value',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            );

        $this->assertArrayNotHasKey(
            'unexpected_field',
            $response->json('data')
        );
    }

    public function test_rekap_kegiatan_rejects_invalid_numeric_input(): void
    {
        $this->actingAsKader();

        $response = $this->postJson(
            '/api/rekap-kegiatan',
            [
                'kd_kec' => '001',
                'kd_desa' => '002',
                'rt' => '003',
                'no_posyandu' => '01',
                'bulan_pendataan' => 'September 2026',
                'jumlah' => 'dua-puluh',
            ]
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'jumlah',
            ]);
    }
}
