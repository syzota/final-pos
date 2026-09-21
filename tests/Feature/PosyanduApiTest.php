<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PosyanduApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }
    /**
     * TC-01: Akses halaman publik tanpa token
     */
    public function test_tc01_public_pages_and_api_return_200(): void
    {
        $this->get('/')->assertStatus(200);
        $this->getJson('/api/profil-posyandu')->assertStatus(200);
        $this->getJson('/api/artikels')->assertStatus(200);
        $this->getJson('/api/makanan')->assertStatus(200);
        $this->getJson('/api/ping')->assertStatus(200);
    }

    /**
     * TC-02: Login dengan user terdaftar (Kader & Superadmin)
     */
    public function test_tc02_login_with_registered_users(): void
    {
        $resKader = $this->postJson('/api/login', [
            'username' => 'kader.melati',
            'password' => '466136',
        ]);
        $resKader->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'user' => ['id', 'username', 'role', 'posyandu'],
                    'token',
                ],
            ]);

        $resAdmin = $this->postJson('/api/login', [
            'username' => 'admin.desa',
            'password' => '887201',
        ]);
        $resAdmin->assertStatus(200);
    }

    /**
     * TC-03: Percobaan akses route terproteksi tanpa token mengembalikan 401
     */
    public function test_tc03_protected_routes_without_token_returns_401(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
        $this->getJson('/api/warga')->assertStatus(401);
        $this->getJson('/api/data-umum')->assertStatus(401);
        $this->getJson('/api/pencatatan-kegiatan')->assertStatus(401);
        $this->getJson('/api/rekap-kegiatan')->assertStatus(401);
    }

    /**
     * TC-04: Validasi data wajib pada controller pencatatan (mencegah payload kosong)
     */
    public function test_tc04_validation_rejects_empty_payload(): void
    {
        $kader = User::where('username', 'kader.melati')->first();
        $this->actingAs($kader, 'sanctum');

        // Data umum harus memiliki nama_posyandu, tahun, bulan
        $this->postJson('/api/data-umum', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nama_posyandu', 'tahun', 'bulan']);

        // Pencatatan kegiatan harus memiliki nama_posyandu, ketua_pelaksana
        $this->postJson('/api/pencatatan-kegiatan', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nama_posyandu', 'ketua_pelaksana']);

        // Rekap kegiatan harus memiliki kd_kec, kd_desa, bulan_pendataan
        $this->postJson('/api/rekap-kegiatan', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['kd_kec', 'kd_desa', 'bulan_pendataan']);
    }

    /**
     * TC-05: Admin Desa memanggil /api/admin/pemeriksaan/balita tanpa posyandu_id
     */
    public function test_tc05_admin_desa_fetches_all_posyandu_examinations(): void
    {
        $admin = User::where('username', 'admin.desa')->first();
        $this->actingAs($admin, 'sanctum');

        $this->getJson('/api/admin/pemeriksaan/balita')
            ->assertStatus(200);
    }

    /**
     * TC-07: Filter data tambahan individu berdasarkan bulan YYYY-MM
     */
    public function test_tc07_filter_data_tambahan_individu(): void
    {
        $kader = User::where('username', 'kader.melati')->first();
        $this->actingAs($kader, 'sanctum');

        $this->getJson('/api/data-tambahan-individu?bulan=2026-08')
            ->assertStatus(200);
    }

    /**
     * TC-08: Akses posyandu/me oleh Ketua untuk identitas profil posyandu
     */
    public function test_tc08_ketua_can_access_posyandu_me(): void
    {
        $ketua = User::where('username', 'ketua.melati')->first();
        $this->actingAs($ketua, 'sanctum');

        $this->getJson('/api/posyandu/me')
            ->assertStatus(200)
            ->assertJsonPath('data.nama', 'Melati');
    }
}
