<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_warga_roles_cannot_access_warga_account_update(): void
    {
        $roles = [
            'kader',
            'ketua',
            'superadmin',
            'puskesmas',
        ];

        foreach ($roles as $role) {
            $user = User::factory()->create([
                'name' => ucfirst($role) . ' Test',
                'username' => $role . '.test',
                'role' => $role,
                'password' => Hash::make('123456'),
            ]);

            Sanctum::actingAs($user);

            $response = $this->putJson(
                '/api/warga/update-akun',
                [
                    'username' => $role . '.baru',
                    'current_password' => '123456',
                ]
            );

            $response->assertForbidden();
        }
    }

    public function test_warga_can_still_update_own_account(): void
    {
        $user = User::factory()->create([
            'name' => 'Warga Test',
            'username' => 'warga.test',
            'role' => 'warga',
            'password' => Hash::make('123456'),
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson(
            '/api/warga/update-akun',
            [
                'username' => 'warga.baru',
                'current_password' => '123456',
            ]
        );

        $response
            ->assertOk()
            ->assertJson([
                'status' => 'sukses',
                'pesan' => 'Data akun berhasil diperbarui!',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'username' => 'warga.baru',
        ]);
    }

    public function test_login_is_rate_limited_after_five_failed_attempts(): void
    {
        User::factory()->create([
            'name' => 'Rate Limit Test',
            'username' => 'rate.test',
            'role' => 'warga',
            'password' => Hash::make('123456'),
        ]);

        $credentials = [
            'username' => 'rate.test',
            'password' => '999999',
        ];

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this
                ->withServerVariables([
                    'REMOTE_ADDR' => '203.0.113.10',
                ])
                ->postJson('/api/login', $credentials)
                ->assertUnprocessable();
        }

        $this
            ->withServerVariables([
                'REMOTE_ADDR' => '203.0.113.10',
            ])
            ->postJson('/api/login', $credentials)
            ->assertStatus(429);
    }
}
