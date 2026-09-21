<?php

namespace Tests\Feature;

use App\Models\Posyandu;
use App\Models\User;
use App\Models\WargaKeluarga;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WargaNikPrivacyTest extends TestCase
{
    use RefreshDatabase;

    private function createPosyandu(string $nama): Posyandu
    {
        return Posyandu::create([
            'nama' => $nama,
        ]);
    }

    private function createWarga(
        Posyandu $posyandu,
        string $nama,
        string $nik,
        string $noKk = '3301020304050001'
    ): array {
        $user = User::factory()->create([
            'name'     => $nama,
            'username' => $nik,
            'role'     => 'warga',
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        $keluarga = WargaKeluarga::create([
            'posyandu_id'          => $posyandu->id,
            'user_id'              => $user->id,
            'nama_kepala_keluarga' => $nama,
            'no_kk'                => $noKk,
            'nik_kepala_keluarga'  => $nik,
            'no_hp'                => '08123456789',
        ]);

        return ['user' => $user, 'keluarga' => $keluarga];
    }

    private function createKader(
        Posyandu $posyandu,
        string $username
    ): User {
        $user = User::factory()->create([
            'name'     => 'Kader Test',
            'username' => $username,
            'role'     => 'kader',
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        return $user;
    }

    // =====================================================
    // SKENARIO 1: Warga mencoba akses endpoint /api/warga
    // (seharusnya 403 karena hanya kader/ketua)
    // =====================================================

    public function test_warga_cannot_access_daftar_warga_endpoint(): void
    {
        $posyandu = $this->createPosyandu('Posyandu A');

        $wargaA = $this->createWarga(
            $posyandu,
            'Budi Santoso',
            '3301010101010001'
        );

        $this->createWarga(
            $posyandu,
            'Andi Susanto',
            '3301010101010002',
            '3301020304050002'
        );

        Sanctum::actingAs($wargaA['user']);

        // Warga seharusnya tidak bisa akses endpoint list warga
        $response = $this->getJson('/api/warga');

        $response->assertForbidden();
    }

    // =====================================================
    // SKENARIO 2: Warga mencoba akses endpoint
    // /api/warga/anak, /api/warga/remaja, /api/warga/ibu,
    // /api/warga/lansia (seharusnya 403)
    // =====================================================

    public function test_warga_cannot_access_dropdown_endpoints(): void
    {
        $posyandu = $this->createPosyandu('Posyandu A');

        $wargaA = $this->createWarga(
            $posyandu,
            'Budi Santoso',
            '3301010101010001'
        );

        Sanctum::actingAs($wargaA['user']);

        $this->getJson('/api/warga/anak')
            ->assertForbidden();

        $this->getJson('/api/warga/remaja')
            ->assertForbidden();

        $this->getJson('/api/warga/ibu')
            ->assertForbidden();

        $this->getJson('/api/warga/lansia')
            ->assertForbidden();
    }

    // =====================================================
    // SKENARIO 3: Warga hanya bisa lihat rapor
    // keluarganya sendiri (bukan keluarga orang lain)
    // =====================================================

    public function test_warga_rapor_only_returns_own_family_data(): void
    {
        $posyandu = $this->createPosyandu('Posyandu A');

        $wargaA = $this->createWarga(
            $posyandu,
            'Budi Santoso',
            '3301010101010001'
        );

        $wargaB = $this->createWarga(
            $posyandu,
            'Andi Susanto',
            '3301010101010002',
            '3301020304050002'
        );

        Sanctum::actingAs($wargaA['user']);

        $response = $this->getJson('/api/warga/rapor-keluarga');

        $response->assertOk();

        // Response seharusnya TIDAK mengandung
        // data NIK atau nama warga lain
        $content = $response->getContent();

        $this->assertStringNotContainsString(
            '3301010101010002',
            $content,
            'NIK warga lain bocor di rapor keluarga!'
        );

        $this->assertStringNotContainsString(
            'Andi Susanto',
            $content,
            'Nama warga lain bocor di rapor keluarga!'
        );
    }

    // =====================================================
    // SKENARIO 4: Endpoint /api/me tidak mengekspos NIK
    // warga lain (cuma NIK sendiri lewat username)
    // =====================================================

    public function test_me_endpoint_only_shows_own_data(): void
    {
        $posyandu = $this->createPosyandu('Posyandu A');

        $wargaA = $this->createWarga(
            $posyandu,
            'Budi Santoso',
            '3301010101010001'
        );

        $wargaB = $this->createWarga(
            $posyandu,
            'Andi Susanto',
            '3301010101010002',
            '3301020304050002'
        );

        Sanctum::actingAs($wargaA['user']);

        $response = $this->getJson('/api/me');

        $response->assertOk();

        $content = $response->getContent();

        // NIK warga lain TIDAK boleh muncul
        $this->assertStringNotContainsString(
            '3301010101010002',
            $content,
            'NIK warga lain bocor di endpoint /api/me!'
        );

        // NIK sendiri boleh muncul (sebagai username)
        $this->assertStringContainsString(
            '3301010101010001',
            $content
        );
    }

    // =====================================================
    // SKENARIO 5: Kader HANYA bisa lihat warga dari
    // Posyandu sendiri (bukan Posyandu lain)
    // =====================================================

    public function test_kader_only_sees_warga_from_own_posyandu(): void
    {
        $posyanduA = $this->createPosyandu('Posyandu A');
        $posyanduB = $this->createPosyandu('Posyandu B');

        $this->createWarga(
            $posyanduA,
            'Budi A',
            '3301010101010001'
        );

        $this->createWarga(
            $posyanduB,
            'Andi B',
            '3301010101010002',
            '3301020304050002'
        );

        $kaderA = $this->createKader(
            $posyanduA,
            'kader.a'
        );

        Sanctum::actingAs($kaderA);

        $response = $this->getJson('/api/warga');

        $response->assertOk();

        $content = $response->getContent();

        // NIK warga Posyandu A boleh muncul
        $this->assertStringContainsString(
            '3301010101010001',
            $content
        );

        // NIK warga Posyandu B TIDAK boleh muncul
        $this->assertStringNotContainsString(
            '3301010101010002',
            $content,
            'NIK warga Posyandu lain bocor ke kader!'
        );
    }

    // =====================================================
    // SKENARIO 6: User tanpa login (unauthenticated)
    // tidak bisa akses data warga sama sekali
    // =====================================================

    public function test_unauthenticated_cannot_access_warga_data(): void
    {
        $posyandu = $this->createPosyandu('Posyandu A');

        $this->createWarga(
            $posyandu,
            'Budi Santoso',
            '3301010101010001'
        );

        $this->getJson('/api/warga')
            ->assertUnauthorized();

        $this->getJson('/api/warga/rapor-keluarga')
            ->assertUnauthorized();

        $this->getJson('/api/me')
            ->assertUnauthorized();
    }
}
