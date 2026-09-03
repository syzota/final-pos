<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.test',
            'role' => 'kader',
            'posyandu_id' => null,
            'password' => Hash::make('123456'),
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'kader.test',
            'password' => '123456',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath('pesan', 'Login berhasil')
            ->assertJsonPath('data.user.username', 'kader.test')
            ->assertJsonPath('data.user.role', 'kader')
            ->assertJsonStructure([
                'status',
                'pesan',
                'data' => [
                    'user',
                    'token',
                ],
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.test',
            'role' => 'kader',
            'posyandu_id' => null,
            'password' => Hash::make('123456'),
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'kader.test',
            'password' => '999999',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['username']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_me_endpoint_rejects_unauthenticated_user(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_access_me_endpoint(): void
    {
        $user = User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.test',
            'role' => 'kader',
            'posyandu_id' => null,
            'password' => Hash::make('123456'),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/me');

        $response
            ->assertOk()
            ->assertJsonPath('status', 'sukses')
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.username', 'kader.test')
            ->assertJsonPath('data.role', 'kader');
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create([
            'name' => 'Kader Test',
            'username' => 'kader.test',
            'role' => 'kader',
            'posyandu_id' => null,
            'password' => Hash::make('123456'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $this->assertDatabaseCount('personal_access_tokens', 1);

        $response = $this
            ->withToken($token)
            ->postJson('/api/logout');

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'sukses',
                'pesan' => 'Logout berhasil',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
