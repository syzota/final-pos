<?php

namespace Tests\Feature;

use App\Models\PemeriksaanLansia;
use App\Models\Posyandu;
use App\Models\User;
use App\Models\WargaDewasa;
use App\Models\WargaKeluarga;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LansiaOwnershipSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function createPosyandu(string $nama): Posyandu
    {
        return Posyandu::create([
            'nama' => $nama,
        ]);
    }

    private function createKader(
        Posyandu $posyandu,
        string $username
    ): User {
        $user = User::factory()->create([
            'name' => 'Kader Test',
            'username' => $username,
            'role' => 'kader',
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        return $user;
    }

    private function createLansia(
        Posyandu $posyandu,
        string $suffix
    ): WargaDewasa {
        $keluarga = WargaKeluarga::create([
            'posyandu_id' => $posyandu->id,
            'user_id' => null,
            'nama_kepala_keluarga' => 'Keluarga ' . $suffix,

            'no_kk' => $suffix === 'A'
                ? '7000000000000001'
                : '7000000000000002',

            'nik_kepala_keluarga' => $suffix === 'A'
                ? '8000000000000001'
                : '8000000000000002',

            'no_hp' => null,
        ]);

        return WargaDewasa::create([
            'keluarga_id' => $keluarga->id,
            'nama_lengkap' => 'Lansia ' . $suffix,
            'tanggal_lahir' => '1955-01-01',
            'jenis_kelamin' => 'L',
        ]);
    }

    private function validPayload(
        WargaDewasa $lansia,
        ?int $pemeriksaanId = null
    ): array {
        $payload = [
            // Controller saat ini menerima lansia_id sebagai string.
            'lansia_id' => (string) $lansia->id,

            'tanggal_periksa' => '2026-09-03',
            'berat_badan' => 60.5,
            'tinggi_badan' => 165,
            'lingkar_pinggang' => 85,
            'tekanan_darah' => '120/80',
            'tensi' => 'Normal',
            'gula_darah' => 100,
            'nadi' => 75,
            'status_imt' => 'Normal',
            'status_form' => 'final',
        ];

        if ($pemeriksaanId !== null) {
            $payload['pemeriksaan_id'] = $pemeriksaanId;
        }

        return $payload;
    }

    private function createPemeriksaan(
        WargaDewasa $lansia,
        User $kader
    ): PemeriksaanLansia {
        return PemeriksaanLansia::create([
            'lansia_id' => $lansia->id,
            'kader_id' => $kader->id,
            'tanggal_periksa' => '2026-09-01',
            'berat_badan' => 60,
            'tinggi_badan' => 165,
            'lingkar_pinggang' => 85,
            'tekanan_darah' => '120/80',
            'tensi' => 'Normal',
            'gula_darah' => 100,
            'nadi' => 75,
            'status_imt' => 'Normal',
            'status_form' => 'final',
        ]);
    }

    public function test_kader_can_create_lansia_examination_for_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $lansiaA = $this->createLansia(
            $posyanduA,
            'A'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-lansia',
            $this->validPayload($lansiaA)
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonPath(
                'data.lansia_id',
                (string) $lansiaA->id
            )
            ->assertJsonPath(
                'data.kader_id',
                $kaderA->id
            );

        $this->assertDatabaseHas(
            'pemeriksaan_lansia',
            [
                'lansia_id' => $lansiaA->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_create_lansia_examination_for_other_posyandu(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $posyanduB = $this->createPosyandu(
            'Posyandu B'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $lansiaB = $this->createLansia(
            $posyanduB,
            'B'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-lansia',
            $this->validPayload($lansiaB)
        );

        $response->assertForbidden();

        $this->assertDatabaseMissing(
            'pemeriksaan_lansia',
            [
                'lansia_id' => $lansiaB->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_update_lansia_examination_from_other_posyandu(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $posyanduB = $this->createPosyandu(
            'Posyandu B'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $kaderB = $this->createKader(
            $posyanduB,
            'kader.b'
        );

        $lansiaB = $this->createLansia(
            $posyanduB,
            'B'
        );

        $pemeriksaanB = $this->createPemeriksaan(
            $lansiaB,
            $kaderB
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $lansiaB,
            $pemeriksaanB->id
        );

        // Sengaja berbeda agar terlihat jika IDOR berhasil.
        $payload['berat_badan'] = 99;

        $response = $this->postJson(
            '/api/pemeriksaan-lansia',
            $payload
        );

        $response->assertForbidden();

        $pemeriksaanB->refresh();

        $this->assertSame(
            60.0,
            (float) $pemeriksaanB->berat_badan
        );

        $this->assertSame(
            $kaderB->id,
            $pemeriksaanB->kader_id
        );
    }

    public function test_kader_can_update_own_posyandu_lansia_examination(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $lansiaA = $this->createLansia(
            $posyanduA,
            'A'
        );

        $pemeriksaanA = $this->createPemeriksaan(
            $lansiaA,
            $kaderA
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $lansiaA,
            $pemeriksaanA->id
        );

        $payload['berat_badan'] = 62.5;
        $payload['tekanan_darah'] = '125/80';

        $response = $this->postJson(
            '/api/pemeriksaan-lansia',
            $payload
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonPath(
                'data.id',
                $pemeriksaanA->id
            );

        $pemeriksaanA->refresh();

        $this->assertSame(
            62.5,
            (float) $pemeriksaanA->berat_badan
        );

        $this->assertSame(
            '125/80',
            $pemeriksaanA->tekanan_darah
        );
    }
}
