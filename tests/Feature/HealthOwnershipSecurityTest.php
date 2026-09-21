<?php

namespace Tests\Feature;

use App\Models\PemeriksaanBalita;
use App\Models\Posyandu;
use App\Models\User;
use App\Models\WargaAnak;
use App\Models\WargaKeluarga;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class HealthOwnershipSecurityTest extends TestCase
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

        // Direct assignment karena posyandu_id
        // belum masuk $fillable User.
        $user->posyandu_id = $posyandu->id;
        $user->save();

        return $user;
    }

    private function createChild(
        Posyandu $posyandu,
        string $suffix
    ): WargaAnak {
        $keluarga = WargaKeluarga::create([
            'posyandu_id' => $posyandu->id,
            'user_id' => null,
            'nama_kepala_keluarga' => 'Kepala Keluarga ' . $suffix,
            'no_kk' => $suffix === 'A'
                ? '1000000000000001'
                : '1000000000000002',
            'nik_kepala_keluarga' => $suffix === 'A'
                ? '2000000000000001'
                : '2000000000000002',
            'no_hp' => null,
        ]);

        return WargaAnak::create([
            'keluarga_id' => $keluarga->id,
            'nama_anak' => 'Anak ' . $suffix,
            'tanggal_lahir' => '2024-01-01',
            'jenis_kelamin' => 'L',
        ]);
    }

    private function validPayload(
        WargaAnak $anak,
        ?int $pemeriksaanId = null
    ): array {
        $payload = [
            'anak_id' => $anak->id,
            'tanggal_periksa' => '2026-09-03',
            'umur_bulan' => 32,
            'berat_badan' => 12.5,
            'tinggi_badan' => 88.5,
            'lingkar_kepala' => 47,
            'lingkar_lengan' => 15,
            'status_gizi' => 'Normal',
            'catatan_perkembangan' => 'Perkembangan baik',
            'status_form' => 'final',
        ];

        if ($pemeriksaanId !== null) {
            $payload['pemeriksaan_id'] = $pemeriksaanId;
        }

        return $payload;
    }

    private function createPemeriksaan(
        WargaAnak $anak,
        User $kader
    ): PemeriksaanBalita {
        return PemeriksaanBalita::create([
            'anak_id' => $anak->id,
            'kader_id' => $kader->id,
            'tanggal_periksa' => '2026-09-01',
            'umur_bulan' => 32,
            'berat_badan' => 12,
            'tinggi_badan' => 88,
            'lingkar_kepala' => 47,
            'lingkar_lengan' => 15,
            'status_gizi' => 'Normal',
            'catatan_perkembangan' => 'Data awal',
            'status_form' => 'final',
        ]);
    }

    public function test_kader_can_create_balita_examination_for_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $anakA = $this->createChild(
            $posyanduA,
            'A'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-balita',
            $this->validPayload($anakA)
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'status',
                'sukses'
            )
            ->assertJsonPath(
                'data.anak_id',
                $anakA->id
            )
            ->assertJsonPath(
                'data.kader_id',
                $kaderA->id
            );

        $this->assertDatabaseHas(
            'pemeriksaan_balita',
            [
                'anak_id' => $anakA->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_create_balita_examination_for_other_posyandu_child(): void
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

        $anakB = $this->createChild(
            $posyanduB,
            'B'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->postJson(
            '/api/pemeriksaan-balita',
            $this->validPayload($anakB)
        );

        $response->assertForbidden();

        $this->assertDatabaseMissing(
            'pemeriksaan_balita',
            [
                'anak_id' => $anakB->id,
                'kader_id' => $kaderA->id,
            ]
        );
    }

    public function test_kader_cannot_update_balita_examination_from_other_posyandu(): void
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

        $anakB = $this->createChild(
            $posyanduB,
            'B'
        );

        $pemeriksaanB = $this->createPemeriksaan(
            $anakB,
            $kaderB
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $anakB,
            $pemeriksaanB->id
        );

        // Nilai ini sengaja berbeda agar kita bisa
        // memastikan data Posyandu B tidak berubah.
        $payload['berat_badan'] = 99;

        $response = $this->postJson(
            '/api/pemeriksaan-balita',
            $payload
        );

        $response->assertForbidden();

        $pemeriksaanB->refresh();

        $this->assertSame(
            12.0,
            (float) $pemeriksaanB->berat_badan
        );

        $this->assertSame(
            $kaderB->id,
            $pemeriksaanB->kader_id
        );
    }

    public function test_kader_can_update_own_posyandu_balita_examination(): void
    {
        $posyanduA = $this->createPosyandu(
            'Posyandu A'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        $anakA = $this->createChild(
            $posyanduA,
            'A'
        );

        $pemeriksaanA = $this->createPemeriksaan(
            $anakA,
            $kaderA
        );

        Sanctum::actingAs($kaderA);

        $payload = $this->validPayload(
            $anakA,
            $pemeriksaanA->id
        );

        $payload['berat_badan'] = 13.5;
        $payload['catatan_perkembangan'] =
            'Data berhasil diperbarui';

        $response = $this->postJson(
            '/api/pemeriksaan-balita',
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
            13.5,
            (float) $pemeriksaanA->berat_badan
        );

        $this->assertSame(
            'Data berhasil diperbarui',
            $pemeriksaanA->catatan_perkembangan
        );
    }
}
