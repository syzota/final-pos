<?php

namespace Tests\Feature;

use App\Models\PemeriksaanHamil;
use App\Models\Posyandu;
use App\Models\User;
use App\Models\WargaDewasa;
use App\Models\WargaKeluarga;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HamilOwnershipSecurityTest extends TestCase
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

    private function createIbu(
        Posyandu $posyandu,
        string $suffix
    ): WargaDewasa {
        $keluarga = WargaKeluarga::create([
            'posyandu_id' => $posyandu->id,
            'user_id' => null,
            'nama_kepala_keluarga' => 'Keluarga ' . $suffix,

            'no_kk' => $suffix === 'A'
                ? '5000000000000001'
                : '5000000000000002',

            'nik_kepala_keluarga' => $suffix === 'A'
                ? '6000000000000001'
                : '6000000000000002',

            'no_hp' => null,
        ]);

        return WargaDewasa::create([
            'keluarga_id' => $keluarga->id,
            'nama_lengkap' => 'Ibu ' . $suffix,
            'tanggal_lahir' => '1998-01-01',
            'jenis_kelamin' => 'P',
        ]);
    }

    private function validPayload(
        WargaDewasa $ibu,
        ?int $pemeriksaanId = null
    ): array {
        $payload = [
            // Controller saat ini menerima ibu_id sebagai string.
            'ibu_id' => (string) $ibu->id,

            'tanggal_periksa' => '2026-09-03',
            'usia_kehamilan_minggu' => 24,
            'berat_badan' => 60.5,
            'tinggi_badan' => 160,
            'tekanan_darah' => '110/70',
            'lingkar_perut' => 85,
            'lingkar_lengan' => 25,
            'status_kek' => 'Tidak',
            'anemia' => 'Tidak',
            'status_imt' => 'Normal',
            'status_form' => 'final',
        ];

        if ($pemeriksaanId !== null) {
            $payload['pemeriksaan_id'] = $pemeriksaanId;
        }

        return $payload;
    }

    private function createPemeriksaan(
        WargaDewasa $ibu,
        User $kader
    ): PemeriksaanHamil {
        return PemeriksaanHamil::create([
            'ibu_id' => $ibu->id,
            'kader_id' => $kader->id,
            'tanggal_periksa' => '2026-09-01',
            'usia_kehamilan_minggu' => 24,
            'berat_badan' => 60,
            'tinggi_badan' => 160,
            'tekanan_darah' => '110/70',
            'lingkar_perut' => 85,
            'lingkar_lengan' => 25,
            'status_kek' => 'Tidak',
            'anemia' => 'Tidak',
            'status_imt' => 'Normal',
            'status_form' => 'final',
        ]);
    }

    public function test_kader_can_create_hamil_examination_for_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $ibuA = $this->createIbu(
            $posyanduA,
            'A'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-hamil',
            $this->validPayload($ibuA)
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonPath(
                'data.ibu_id',
                (string) $ibuA->id
            )
            ->assertJsonPath(
                'data.kader_id',
                $kaderA->id
            );

        $this->assertDatabaseHas(
            'pemeriksaan_hamil',
            [
                'ibu_id' => $ibuA->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_create_hamil_examination_for_other_posyandu(): void
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

        $ibuB = $this->createIbu(
            $posyanduB,
            'B'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-hamil',
            $this->validPayload($ibuB)
        );

        $response->assertForbidden();

        $this->assertDatabaseMissing(
            'pemeriksaan_hamil',
            [
                'ibu_id' => $ibuB->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_update_hamil_examination_from_other_posyandu(): void
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

        $ibuB = $this->createIbu(
            $posyanduB,
            'B'
        );

        $pemeriksaanB = $this->createPemeriksaan(
            $ibuB,
            $kaderB
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $ibuB,
            $pemeriksaanB->id
        );

        // Sengaja berbeda agar terlihat jika IDOR berhasil.
        $payload['berat_badan'] = 99;

        $response = $this->postJson(
            '/api/pemeriksaan-hamil',
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

    public function test_kader_can_update_own_posyandu_hamil_examination(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $ibuA = $this->createIbu(
            $posyanduA,
            'A'
        );

        $pemeriksaanA = $this->createPemeriksaan(
            $ibuA,
            $kaderA
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $ibuA,
            $pemeriksaanA->id
        );

        $payload['berat_badan'] = 62.5;
        $payload['tekanan_darah'] = '115/75';

        $response = $this->postJson(
            '/api/pemeriksaan-hamil',
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
            '115/75',
            $pemeriksaanA->tekanan_darah
        );
    }
}
