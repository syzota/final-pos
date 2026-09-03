<?php

namespace Tests\Feature;

use App\Models\PemeriksaanRemaja;
use App\Models\Posyandu;
use App\Models\User;
use App\Models\WargaKeluarga;
use App\Models\WargaRemaja;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RemajaOwnershipSecurityTest extends TestCase
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

    private function createRemaja(
        Posyandu $posyandu,
        string $suffix
    ): WargaRemaja {
        $keluarga = WargaKeluarga::create([
            'posyandu_id' => $posyandu->id,
            'user_id' => null,
            'nama_kepala_keluarga' => 'Keluarga ' . $suffix,
            'no_kk' => $suffix === 'A'
                ? '3000000000000001'
                : '3000000000000002',
            'nik_kepala_keluarga' => $suffix === 'A'
                ? '4000000000000001'
                : '4000000000000002',
            'no_hp' => null,
        ]);

        return WargaRemaja::create([
            'keluarga_id' => $keluarga->id,
            'nama_remaja' => 'Remaja ' . $suffix,
            'tanggal_lahir' => '2010-01-01',
            'jenis_kelamin' => 'L',
        ]);
    }

    private function validPayload(
        WargaRemaja $remaja,
        ?int $pemeriksaanId = null
    ): array {
        /*
         * Controller saat ini memvalidasi remaja_id sebagai string,
         * sehingga ID sengaja dikirim sebagai string seperti value
         * dari select React.
         */
        $payload = [
            'remaja_id' => (string) $remaja->id,
            'tanggal_periksa' => '2026-09-03',
            'umur_tahun' => 16,
            'berat_badan' => 50.5,
            'tinggi_badan' => 165.5,
            'tekanan_darah' => '110/70',
            'status_imt' => 'Normal',
            'status_form' => 'final',
        ];

        if ($pemeriksaanId !== null) {
            $payload['pemeriksaan_id'] = $pemeriksaanId;
        }

        return $payload;
    }

    private function createPemeriksaan(
        WargaRemaja $remaja,
        User $kader
    ): PemeriksaanRemaja {
        return PemeriksaanRemaja::create([
            'remaja_id' => $remaja->id,
            'kader_id' => $kader->id,
            'tanggal_periksa' => '2026-09-01',
            'umur_tahun' => 16,
            'berat_badan' => 50,
            'tinggi_badan' => 165,
            'tekanan_darah' => '110/70',
            'status_imt' => 'Normal',
            'status_form' => 'final',
        ]);
    }

    public function test_kader_can_create_remaja_examination_for_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $remajaA = $this->createRemaja(
            $posyanduA,
            'A'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-remaja',
            $this->validPayload($remajaA)
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonPath(
                'data.remaja_id',
                (string) $remajaA->id
            )
            ->assertJsonPath(
                'data.kader_id',
                $kaderA->id
            );

        $this->assertDatabaseHas(
            'pemeriksaan_remaja',
            [
                'remaja_id' => $remajaA->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_create_remaja_examination_for_other_posyandu(): void
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

        $remajaB = $this->createRemaja(
            $posyanduB,
            'B'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-remaja',
            $this->validPayload($remajaB)
        );

        $response->assertForbidden();

        $this->assertDatabaseMissing(
            'pemeriksaan_remaja',
            [
                'remaja_id' => $remajaB->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_update_remaja_examination_from_other_posyandu(): void
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

        $remajaB = $this->createRemaja(
            $posyanduB,
            'B'
        );

        $pemeriksaanB = $this->createPemeriksaan(
            $remajaB,
            $kaderB
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $remajaB,
            $pemeriksaanB->id
        );

        $payload['berat_badan'] = 99;

        $response = $this->postJson(
            '/api/pemeriksaan-remaja',
            $payload
        );

        $response->assertForbidden();

        $pemeriksaanB->refresh();

        $this->assertSame(
            50.0,
            (float) $pemeriksaanB->berat_badan
        );

        $this->assertSame(
            $kaderB->id,
            $pemeriksaanB->kader_id
        );
    }

    public function test_kader_can_update_own_posyandu_remaja_examination(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $remajaA = $this->createRemaja(
            $posyanduA,
            'A'
        );

        $pemeriksaanA = $this->createPemeriksaan(
            $remajaA,
            $kaderA
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $remajaA,
            $pemeriksaanA->id
        );

        $payload['berat_badan'] = 52.5;
        $payload['tekanan_darah'] = '115/75';

        $response = $this->postJson(
            '/api/pemeriksaan-remaja',
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
            52.5,
            (float) $pemeriksaanA->berat_badan
        );

        $this->assertSame(
            '115/75',
            $pemeriksaanA->tekanan_darah
        );
    }
}
