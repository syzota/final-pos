<?php

namespace Tests\Feature;

use App\Models\PencatatanKegiatan;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PosyanduIsolationRegressionTest extends TestCase
{
    use RefreshDatabase;

    private function createPosyandu(string $nama): Posyandu
    {
        return Posyandu::create([
            'nama' => $nama,
        ]);
    }

    private function createKader(Posyandu $posyandu, string $username): User
    {
        $user = User::factory()->create([
            'name' => 'Kader Test',
            'username' => $username,
            'role' => 'kader',
        ]);

        // Sengaja direct assignment karena posyandu_id
        // belum terdaftar di $fillable User.
        $user->posyandu_id = $posyandu->id;
        $user->save();

        return $user;
    }

    private function createPencatatan(
        Posyandu $posyandu,
        string $namaPosyandu
    ): PencatatanKegiatan {
        return PencatatanKegiatan::create([
            'posyandu_id' => $posyandu->id,
            'nama_posyandu' => $namaPosyandu,
            'ketua_pelaksana' => 'Ketua Test',
        ]);
    }

    public function test_kader_only_sees_pencatatan_from_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu('Posyandu A');
        $posyanduB = $this->createPosyandu('Posyandu B');

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $dataA = $this->createPencatatan(
            $posyanduA,
            'Posyandu A'
        );

        $dataB = $this->createPencatatan(
            $posyanduB,
            'Posyandu B'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->getJson(
            '/api/pencatatan-kegiatan'
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonCount(
                1,
                'data'
            )
            ->assertJsonPath(
                'data.0.id',
                $dataA->id
            );

        $response->assertJsonMissing([
            'id' => $dataB->id,
        ]);
    }

    public function test_kader_cannot_delete_pencatatan_from_other_posyandu(): void
    {
        $posyanduA = $this->createPosyandu('Posyandu A');
        $posyanduB = $this->createPosyandu('Posyandu B');

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $dataB = $this->createPencatatan(
            $posyanduB,
            'Posyandu B'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->deleteJson(
            "/api/pencatatan-kegiatan/{$dataB->id}"
        );

        $response
            ->assertNotFound()
            ->assertJson([
                'pesan' => 'Data tidak ditemukan.',
            ]);

        $this->assertDatabaseHas(
            'pencatatan_kegiatans',
            [
                'id' => $dataB->id,
                'posyandu_id' => $posyanduB->id,
            ]
        );
    }

    public function test_kader_can_delete_pencatatan_from_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu('Posyandu A');

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $dataA = $this->createPencatatan(
            $posyanduA,
            'Posyandu A'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->deleteJson(
            "/api/pencatatan-kegiatan/{$dataA->id}"
        );

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'sukses',
                'pesan' => 'Data berhasil dihapus.',
            ]);

        $this->assertDatabaseMissing(
            'pencatatan_kegiatans',
            [
                'id' => $dataA->id,
            ]
        );
    }

    public function test_kader_cannot_forge_posyandu_id_when_creating_pencatatan(): void
    {
        $posyanduA = $this->createPosyandu('Posyandu A');
        $posyanduB = $this->createPosyandu('Posyandu B');

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pencatatan-kegiatan',
            [
                // User mencoba mengaku sebagai Posyandu B.
                'posyandu_id' => $posyanduB->id,
                'nama_posyandu' => 'Percobaan Manipulasi',
                'ketua_pelaksana' => 'Ketua Test',
                'ibu_hamil' => 5,
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonPath(
                'data.posyandu_id',
                $posyanduA->id
            );

        $this->assertDatabaseHas(
            'pencatatan_kegiatans',
            [
                'nama_posyandu' => 'Percobaan Manipulasi',
                'posyandu_id' => $posyanduA->id,
            ]
        );

        $this->assertDatabaseMissing(
            'pencatatan_kegiatans',
            [
                'nama_posyandu' => 'Percobaan Manipulasi',
                'posyandu_id' => $posyanduB->id,
            ]
        );
    }
}
