<?php

namespace Tests\Feature;

use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FoodOwnershipSecurityTest extends TestCase
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
        string $role = 'kader'
    ): User {
        $user = User::factory()->create([
            'name' => $username,
            'username' => $username,
            'role' => $role,
        ]);

        $user->posyandu_id = $posyandu->id;
        $user->save();

        return $user;
    }

    private function createFood(
        Posyandu $posyandu,
        string $nama = 'Nasi Test',
        int $kalori = 100
    ): int {
        return DB::table('referensi_makanan')->insertGetId([
            'nama_makanan' => $nama,
            'kalori_per_porsi' => $kalori,
            'dibuat_oleh_posyandu' => $posyandu->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_created_food_is_assigned_to_logged_in_users_posyandu(): void
    {
        $mawar = $this->createPosyandu('Posyandu Mawar');

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        Sanctum::actingAs($kader);

        $response = $this->postJson('/api/makanan', [
            'nama_makanan' => 'Bubur Mawar',
            'kalori_per_porsi' => 150,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('referensi_makanan', [
            'nama_makanan' => 'Bubur Mawar',
            'kalori_per_porsi' => 150,
            'dibuat_oleh_posyandu' => $mawar->id,
        ]);
    }

    public function test_same_posyandu_user_can_update_food(): void
    {
        $mawar = $this->createPosyandu('Posyandu Mawar');

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $ketua = $this->createUser(
            $mawar,
            'ketua.mawar',
            'ketua'
        );

        $foodId = $this->createFood(
            $mawar,
            'Bubur Lama',
            100
        );

        Sanctum::actingAs($ketua);

        $response = $this->putJson(
            '/api/makanan/' . $foodId,
            [
                'nama_makanan' => 'Bubur Baru',
                'kalori_per_porsi' => 120,
            ]
        );

        $response->assertOk();

        $this->assertDatabaseHas('referensi_makanan', [
            'id' => $foodId,
            'nama_makanan' => 'Bubur Baru',
        ]);
    }

    public function test_other_posyandu_user_cannot_update_food(): void
    {
        $mawar = $this->createPosyandu('Posyandu Mawar');
        $melati = $this->createPosyandu('Posyandu Melati');

        $kaderMelati = $this->createUser(
            $melati,
            'kader.melati'
        );

        $foodId = $this->createFood(
            $mawar,
            'Makanan Mawar',
            100
        );

        Sanctum::actingAs($kaderMelati);

        $response = $this->putJson(
            '/api/makanan/' . $foodId,
            [
                'nama_makanan' => 'Diubah Melati',
                'kalori_per_porsi' => 200,
            ]
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('referensi_makanan', [
            'id' => $foodId,
            'nama_makanan' => 'Makanan Mawar',
            'dibuat_oleh_posyandu' => $mawar->id,
        ]);
    }

    public function test_same_posyandu_user_can_delete_food(): void
    {
        $mawar = $this->createPosyandu('Posyandu Mawar');

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $foodId = $this->createFood($mawar);

        Sanctum::actingAs($kader);

        $response = $this->deleteJson(
            '/api/makanan/' . $foodId
        );

        $response->assertOk();

        $this->assertDatabaseMissing('referensi_makanan', [
            'id' => $foodId,
        ]);
    }

    public function test_other_posyandu_user_cannot_delete_food(): void
    {
        $mawar = $this->createPosyandu('Posyandu Mawar');
        $melati = $this->createPosyandu('Posyandu Melati');

        $ketuaMelati = $this->createUser(
            $melati,
            'ketua.melati',
            'ketua'
        );

        $foodId = $this->createFood(
            $mawar,
            'Makanan Mawar'
        );

        Sanctum::actingAs($ketuaMelati);

        $response = $this->deleteJson(
            '/api/makanan/' . $foodId
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('referensi_makanan', [
            'id' => $foodId,
            'dibuat_oleh_posyandu' => $mawar->id,
        ]);
    }

    public function test_public_can_still_read_food_reference(): void
    {
        $mawar = $this->createPosyandu('Posyandu Mawar');

        $this->createFood(
            $mawar,
            'Makanan Publik'
        );

        $this->getJson('/api/makanan')
            ->assertOk()
            ->assertJsonFragment([
                'nama_makanan' => 'Makanan Publik',
            ]);
    }
    public function test_manage_list_only_returns_food_from_logged_in_users_posyandu(): void
    {
        $mawar = $this->createPosyandu(
            'Posyandu Mawar'
        );

        $melati = $this->createPosyandu(
            'Posyandu Melati'
        );

        $kaderMawar = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $this->createFood(
            $mawar,
            'Makanan Mawar A',
            100
        );

        $this->createFood(
            $mawar,
            'Makanan Mawar B',
            200
        );

        $this->createFood(
            $melati,
            'Makanan Melati',
            300
        );

        Sanctum::actingAs($kaderMawar);

        $response = $this->getJson(
            '/api/makanan/manage'
        );

        $response->assertOk();

        $names = collect(
            $response->json('data')
        )->pluck('nama_makanan');

        $this->assertTrue(
            $names->contains('Makanan Mawar A')
        );

        $this->assertTrue(
            $names->contains('Makanan Mawar B')
        );

        $this->assertFalse(
            $names->contains('Makanan Melati')
        );
    }

    public function test_manage_food_list_requires_authentication(): void
    {
        $response = $this->getJson(
            '/api/makanan/manage'
        );

        $response->assertUnauthorized();
    }
}
