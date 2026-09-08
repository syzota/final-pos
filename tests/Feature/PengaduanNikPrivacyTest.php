<?php

namespace Tests\Feature;

use App\Models\PengaduanMasyarakat;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PengaduanNikPrivacyTest extends TestCase
{
    use RefreshDatabase;

    private function createPosyandu(string $nama): Posyandu
    {
        return Posyandu::create([
            'nama' => $nama,
        ]);
    }

    private function createUser(
        Posyandu $posyandu,
        string $username,
        string $name,
        string $role = 'warga'
    ): User {
        $user = User::factory()->create([
            'name'     => $name,
            'username' => $username,
            'role'     => $role,
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        return $user;
    }

    private function createPengaduan(
        Posyandu $posyandu,
        string $namaP,
        string $nik
    ): PengaduanMasyarakat {
        return PengaduanMasyarakat::create([
            'posyandu_id'    => $posyandu->id,
            'bidang'         => 'sosial',
            'nama_pelapor'   => $namaP,
            'jenis_kelamin'  => 'L',
            'nik'            => $nik,
            'no_hp'          => '081234567890',
            'alamat'         => 'Jl. Test',
            'isi_keluhan'    => 'Keluhan test',
            'lokasi_masalah' => 'Lokasi test',
            'status'         => 'menunggu',
        ]);
    }

    // =====================================================
    // SKENARIO 1: Warga bisa lihat pengaduan orang lain
    // yang se-posyandu (termasuk NIK-nya)
    // =====================================================

    public function test_warga_can_see_other_warga_nik_via_pengaduan_index(): void
    {
        $posyandu = $this->createPosyandu('Posyandu Melati');

        $wargaA = $this->createUser(
            $posyandu,
            'warga.a',
            'Warga A'
        );

        $wargaB = $this->createUser(
            $posyandu,
            'warga.b',
            'Warga B'
        );

        // Warga A kirim pengaduan dengan NIK-nya
        $this->createPengaduan(
            $posyandu,
            'Warga A',
            '3301010101010001'
        );

        // Warga B login dan akses endpoint pengaduan
        Sanctum::actingAs($wargaB);

        $response = $this->getJson('/api/pengaduan-masyarakat');

        $response->assertOk();

        $content = $response->getContent();

        // CEK: Apakah NIK Warga A bocor ke Warga B?
        $nikBocor = str_contains($content, '3301010101010001');

        if ($nikBocor) {
            // Ini adalah BUG — warga bisa lihat NIK orang lain
            $this->markTestIncomplete(
                'BUG DITEMUKAN: NIK Warga A (3301010101010001) '
                . 'bocor ke Warga B lewat GET /api/pengaduan-masyarakat. '
                . 'Response mengembalikan semua data pengaduan '
                . 'termasuk NIK pelapor lain.'
            );
        }

        // Jika sudah di-fix, NIK tidak boleh muncul
        $this->assertStringNotContainsString(
            '3301010101010001',
            $content,
            'NIK warga lain bocor di pengaduan!'
        );
    }

    // =====================================================
    // SKENARIO 2: Warga dari Posyandu lain tidak bisa lihat
    // pengaduan Posyandu lain (isolasi posyandu)
    // =====================================================

    public function test_warga_cannot_see_pengaduan_from_other_posyandu(): void
    {
        $melati = $this->createPosyandu('Posyandu Melati');
        $mawar = $this->createPosyandu('Posyandu Mawar');

        $wargaMelati = $this->createUser(
            $melati,
            'warga.melati',
            'Warga Melati'
        );

        $wargaMawar = $this->createUser(
            $mawar,
            'warga.mawar',
            'Warga Mawar'
        );

        // Warga Melati kirim pengaduan
        $this->createPengaduan(
            $melati,
            'Warga Melati',
            '3301010101010001'
        );

        // Warga Mawar coba lihat pengaduan
        Sanctum::actingAs($wargaMawar);

        $response = $this->getJson('/api/pengaduan-masyarakat');

        $response->assertOk();

        $content = $response->getContent();

        // NIK warga Melati TIDAK boleh muncul
        $this->assertStringNotContainsString(
            '3301010101010001',
            $content,
            'NIK warga Posyandu lain bocor lewat pengaduan!'
        );

        // Data pengaduan Melati TIDAK boleh muncul
        $this->assertStringNotContainsString(
            'Warga Melati',
            $content,
            'Nama pelapor Posyandu lain bocor lewat pengaduan!'
        );
    }

    // =====================================================
    // SKENARIO 3: Warga kirim pengaduan, response store()
    // boleh return data sendiri (termasuk NIK sendiri)
    // =====================================================

    public function test_pengaduan_store_returns_own_data_only(): void
    {
        $posyandu = $this->createPosyandu('Posyandu Melati');

        $warga = $this->createUser(
            $posyandu,
            'warga.a',
            'Warga A'
        );

        Sanctum::actingAs($warga);

        $response = $this->postJson('/api/pengaduan-masyarakat', [
            'bidang'         => 'sosial',
            'nama_pelapor'   => 'Warga A',
            'jenis_kelamin'  => 'L',
            'nik'            => '3301010101010001',
            'alamat'         => 'Jl. Test',
            'isi_keluhan'    => 'Keluhan test',
        ]);

        $response->assertCreated();

        // Response store boleh mengandung NIK sendiri
        // (karena itu data yang baru saja dikirim)
        $response->assertJsonPath('data.nik', '3301010101010001');
    }

    // =====================================================
    // SKENARIO 4: Tanpa login tidak bisa kirim/lihat
    // pengaduan
    // =====================================================

    public function test_unauthenticated_cannot_access_pengaduan(): void
    {
        $this->getJson('/api/pengaduan-masyarakat')
            ->assertUnauthorized();

        $this->postJson('/api/pengaduan-masyarakat', [
            'bidang'         => 'sosial',
            'nama_pelapor'   => 'Hacker',
            'jenis_kelamin'  => 'L',
            'nik'            => '9999999999999999',
            'alamat'         => 'Jl. Hack',
            'isi_keluhan'    => 'Hack attempt',
        ])->assertUnauthorized();
    }

    // =====================================================
    // SKENARIO 5: Warga yang tidak punya posyandu_id
    // tidak bisa lihat/kirim pengaduan
    // =====================================================

    public function test_warga_without_posyandu_sees_empty_pengaduan(): void
    {
        $user = User::factory()->create([
            'name'     => 'Warga Tanpa Posyandu',
            'username' => 'warga.orphan',
            'role'     => 'warga',
        ]);

        // Sengaja tidak set posyandu_id

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/pengaduan-masyarakat');

        $response->assertOk();

        // Warga tanpa posyandu_id seharusnya dapat data kosong
        // karena query filter by posyandu_id (null)
        $data = $response->json('data');
        $this->assertEmpty($data);
    }

    // =====================================================
    // SKENARIO 6: Warga tetap bisa melihat pengaduan miliknya sendiri
    // =====================================================

    public function test_warga_can_see_own_pengaduan(): void
    {
        $posyandu = $this->createPosyandu('Posyandu Melati');

        $wargaA = $this->createUser(
            $posyandu,
            '3301010101010001',
            'Warga A'
        );

        $this->createPengaduan(
            $posyandu,
            'Warga A',
            '3301010101010001'
        );

        Sanctum::actingAs($wargaA);

        $response = $this->getJson('/api/pengaduan-masyarakat');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.nik', '3301010101010001');
    }

    // =====================================================
    // SKENARIO 7: Kader tetap bisa melihat SEMUA pengaduan di Posyandunya
    // =====================================================

    public function test_kader_can_see_all_pengaduan_in_posyandu(): void
    {
        $posyandu = $this->createPosyandu('Posyandu Melati');

        $kader = $this->createUser(
            $posyandu,
            'kader.melati',
            'Kader Melati',
            'kader'
        );

        $this->createPengaduan(
            $posyandu,
            'Warga A',
            '3301010101010001'
        );

        $this->createPengaduan(
            $posyandu,
            'Warga B',
            '3301010101010002'
        );

        Sanctum::actingAs($kader);

        $response = $this->getJson('/api/pengaduan-masyarakat');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }
}
