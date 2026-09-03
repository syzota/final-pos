<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthorizationRegressionTest extends TestCase
{
    use RefreshDatabase;

    private function createUserWithRole(string $role): User
    {
        return User::factory()->create([
            'name' => ucfirst($role) . ' Test',
            'username' => $role . '.test',
            'role' => $role,
            'posyandu_id' => null,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_kader_route(): void
    {
        $response = $this->getJson('/api/pencatatan-kegiatan');

        $response->assertUnauthorized();
    }

    public function test_warga_cannot_access_kader_route(): void
    {
        $user = $this->createUserWithRole('warga');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/pencatatan-kegiatan');

        $response->assertForbidden();
    }

    public function test_superadmin_cannot_access_kader_route(): void
    {
        $user = $this->createUserWithRole('superadmin');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/pencatatan-kegiatan');

        $response->assertForbidden();
    }

    public function test_puskesmas_cannot_access_kader_route(): void
    {
        $user = $this->createUserWithRole('puskesmas');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/pencatatan-kegiatan');

        $response->assertForbidden();
    }

    public function test_kader_can_access_kader_route(): void
    {
        $user = $this->createUserWithRole('kader');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/pencatatan-kegiatan');

        $response->assertOk();
    }

    public function test_ketua_can_access_kader_route(): void
    {
        $user = $this->createUserWithRole('ketua');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/pencatatan-kegiatan');

        $response->assertOk();
    }

    public function test_kader_cannot_access_ketua_only_route(): void
    {
        $user = $this->createUserWithRole('kader');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/posyandu/me');

        $response->assertForbidden();
    }

    public function test_warga_cannot_access_superadmin_route(): void
    {
        $user = $this->createUserWithRole('warga');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/dashboard-analitik');

        $response->assertForbidden();
    }

    public function test_kader_cannot_access_warga_route(): void
    {
        $user = $this->createUserWithRole('kader');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/warga/rapor-keluarga');

        $response->assertForbidden();
    }

    public function test_puskesmas_cannot_access_superadmin_route(): void
    {
        $user = $this->createUserWithRole('puskesmas');

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/dashboard-analitik');

        $response->assertForbidden();
    }
}
