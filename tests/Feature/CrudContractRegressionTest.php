<?php

namespace Tests\Feature;

use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CrudContractRegressionTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsKader(): array
    {
        $posyandu = Posyandu::create([
            'nama' => 'Posyandu Test',
        ]);

        $user = User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.test',
            'role' => 'kader',
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        Sanctum::actingAs($user);

        return [$user, $posyandu];
    }

    public function test_pencatatan_kegiatan_store_preserves_current_response_contract(): void
    {
        [, $posyandu] = $this->actingAsKader();

        $response = $this->postJson(
            '/api/pencatatan-kegiatan',
            [
                'nama_posyandu' => 'Posyandu Test',
                'ketua_pelaksana' => 'Ketua Test',
                'ibu_hamil' => 10,
                'ibu_menyusui' => 5,
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath(
                'pesan',
                'Pencatatan Kegiatan 13 Poin berhasil disimpan!'
            )
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            )
            ->assertJsonPath(
                'data.ibu_hamil',
                10
            )
            ->assertJsonPath(
                'data.ibu_menyusui',
                5
            )
            ->assertJsonStructure([
                'status',
                'pesan',
                'data' => [
                    'id',
                    'posyandu_id',
                    'nama_posyandu',
                    'ketua_pelaksana',
                ],
            ]);
    }

    public function test_pencatatan_kegiatan_converts_empty_numeric_input_to_zero(): void
    {
        [, $posyandu] = $this->actingAsKader();

        $response = $this->postJson(
            '/api/pencatatan-kegiatan',
            [
                'nama_posyandu' => 'Posyandu Test',
                'ketua_pelaksana' => 'Ketua Test',
                'ibu_hamil' => '',
                'ibu_menyusui' => '',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.ibu_hamil',
                0
            )
            ->assertJsonPath(
                'data.ibu_menyusui',
                0
            );

        $this->assertDatabaseHas(
            'pencatatan_kegiatans',
            [
                'posyandu_id' => $posyandu->id,
                'ibu_hamil' => 0,
                'ibu_menyusui' => 0,
            ]
        );
    }

    public function test_data_umum_store_preserves_current_response_contract(): void
    {
        [, $posyandu] = $this->actingAsKader();

        $response = $this->postJson(
            '/api/data-umum',
            [
                'nama_posyandu' => 'Posyandu Test',
                'tahun' => '2026',
                'bulan' => 'September',
                'pengunjung_bayi' => 12,
                'pengunjung_balita' => 20,
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath(
                'pesan',
                'Pencatatan Data Umum berhasil disimpan!'
            )
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            )
            ->assertJsonPath(
                'data.pengunjung_bayi',
                12
            )
            ->assertJsonPath(
                'data.pengunjung_balita',
                20
            );
    }

    public function test_data_umum_converts_empty_numeric_input_to_zero(): void
    {
        [, $posyandu] = $this->actingAsKader();

        $response = $this->postJson(
            '/api/data-umum',
            [
                'nama_posyandu' => 'Posyandu Test',
                'tahun' => '2026',
                'bulan' => 'September',
                'pengunjung_bayi' => '',
                'pengunjung_balita' => '',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.pengunjung_bayi',
                0
            )
            ->assertJsonPath(
                'data.pengunjung_balita',
                0
            );

        $this->assertDatabaseHas(
            'data_umums',
            [
                'posyandu_id' => $posyandu->id,
                'pengunjung_bayi' => 0,
                'pengunjung_balita' => 0,
            ]
        );
    }

    public function test_rekap_kegiatan_store_preserves_current_response_contract(): void
    {
        [, $posyandu] = $this->actingAsKader();

        $response = $this->postJson(
            '/api/rekap-kegiatan',
            [
                'kd_kec' => '001',
                'kd_desa' => '002',
                'rt' => '003',
                'no_posyandu' => '01',
                'bulan_pendataan' => 'September 2026',
                'jumlah' => 15,
                'ibu_hamil_periksa' => 8,
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath(
                'pesan',
                'Data Hasil Kegiatan Posyandu berhasil disimpan!'
            )
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            )
            ->assertJsonPath(
                'data.jumlah',
                15
            )
            ->assertJsonPath(
                'data.ibu_hamil_periksa',
                8
            );
    }

    public function test_rekap_kegiatan_converts_empty_numeric_input_to_zero(): void
    {
        [, $posyandu] = $this->actingAsKader();

        $response = $this->postJson(
            '/api/rekap-kegiatan',
            [
                'kd_kec' => '001',
                'kd_desa' => '002',
                'rt' => '003',
                'no_posyandu' => '01',
                'bulan_pendataan' => 'September 2026',
                'jumlah' => '',
                'ibu_hamil_periksa' => '',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.jumlah',
                0
            )
            ->assertJsonPath(
                'data.ibu_hamil_periksa',
                0
            );

        $this->assertDatabaseHas(
            'rekap_kegiatans',
            [
                'posyandu_id' => $posyandu->id,
                'jumlah' => 0,
                'ibu_hamil_periksa' => 0,
            ]
        );
    }
}
