<?php

namespace Tests\Feature;

use App\Models\Artikel;
use App\Models\Posyandu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ArtikelOwnershipSecurityTest extends TestCase
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

    private function createArtikel(
        Posyandu $posyandu,
        User $penulis,
        string $judul = 'Artikel Test',
        string $status = 'dipublikasikan'
    ): Artikel {
        return Artikel::create([
            'posyandu_id' => $posyandu->id,
            'penulis_id' => $penulis->id,
            'kategori' => 'Kesehatan',
            'judul' => $judul,
            'slug' => 'artikel-test-' . uniqid(),
            'isi_artikel' => 'Isi artikel test.',
            'status' => $status,
            'published_at' =>
                $status === 'dipublikasikan'
                    ? now()
                    : null,
        ]);
    }
    public function test_created_article_is_assigned_to_logged_in_users_posyandu(): void
    {
        $posyandu = $this->createPosyandu(
            'Posyandu Mawar'
        );

        $kader = $this->createUser(
            $posyandu,
            'kader.mawar'
        );

        Sanctum::actingAs($kader);

        $response = $this->postJson(
            '/api/artikels',
            [
                'judul' => 'Artikel Mawar',
                'kategori' => 'Kesehatan',
                'isi_artikel' => 'Isi artikel Mawar',
                'status' => 'dipublikasikan',
            ]
        );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.penulis_id',
                $kader->id
            )
            ->assertJsonPath(
                'data.posyandu_id',
                $posyandu->id
            );

        $this->assertDatabaseHas(
            'artikel',
            [
                'penulis_id' => $kader->id,
                'posyandu_id' => $posyandu->id,
                'judul' => 'Artikel Mawar',
            ]
        );
    }

    public function test_same_posyandu_user_can_update_article(): void
    {
        $mawar = $this->createPosyandu(
            'Posyandu Mawar'
        );

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $ketua = $this->createUser(
            $mawar,
            'ketua.mawar',
            'ketua'
        );

        $artikel = $this->createArtikel(
            $mawar,
            $kader
        );

        Sanctum::actingAs($ketua);

        $response = $this->postJson(
            '/api/artikels/' . $artikel->id,
            [
                'judul' => 'Artikel Mawar Diperbarui',
            ]
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.judul',
                'Artikel Mawar Diperbarui'
            );

        $this->assertDatabaseHas(
            'artikel',
            [
                'id' => $artikel->id,
                'judul' => 'Artikel Mawar Diperbarui',
            ]
        );
    }

    public function test_other_posyandu_user_cannot_update_article(): void
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

        $kaderMelati = $this->createUser(
            $melati,
            'kader.melati'
        );

        $artikel = $this->createArtikel(
            $mawar,
            $kaderMawar,
            'Artikel Milik Mawar'
        );

        Sanctum::actingAs($kaderMelati);

        $response = $this->postJson(
            '/api/artikels/' . $artikel->id,
            [
                'judul' => 'Artikel Diambil Melati',
            ]
        );

        $response->assertForbidden();

        $this->assertDatabaseHas(
            'artikel',
            [
                'id' => $artikel->id,
                'judul' => 'Artikel Milik Mawar',
                'posyandu_id' => $mawar->id,
            ]
        );
    }

    public function test_same_posyandu_user_can_delete_article(): void
    {
        $mawar = $this->createPosyandu(
            'Posyandu Mawar'
        );

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $ketua = $this->createUser(
            $mawar,
            'ketua.mawar',
            'ketua'
        );

        $artikel = $this->createArtikel(
            $mawar,
            $kader
        );

        Sanctum::actingAs($ketua);

        $response = $this->deleteJson(
            '/api/artikels/' . $artikel->id
        );

        $response->assertOk();

        $this->assertDatabaseMissing(
            'artikel',
            [
                'id' => $artikel->id,
            ]
        );
    }

    public function test_other_posyandu_user_cannot_delete_article(): void
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

        $ketuaMelati = $this->createUser(
            $melati,
            'ketua.melati',
            'ketua'
        );

        $artikel = $this->createArtikel(
            $mawar,
            $kaderMawar
        );

        Sanctum::actingAs($ketuaMelati);

        $response = $this->deleteJson(
            '/api/artikels/' . $artikel->id
        );

        $response->assertForbidden();

        $this->assertDatabaseHas(
            'artikel',
            [
                'id' => $artikel->id,
                'posyandu_id' => $mawar->id,
            ]
        );
    }

    public function test_public_can_still_read_published_articles(): void
    {
        $mawar = $this->createPosyandu(
            'Posyandu Mawar'
        );

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $artikel = $this->createArtikel(
            $mawar,
            $kader,
            'Artikel Publik'
        );

        $this->getJson('/api/artikels')
            ->assertOk()
            ->assertJsonFragment([
                'judul' => 'Artikel Publik',
            ]);

        $this->getJson(
            '/api/artikels/' . $artikel->id
        )
            ->assertOk()
            ->assertJsonPath(
                'data.id',
                $artikel->id
            );
    }
    public function test_public_cannot_read_draft_articles(): void
    {
        $mawar = $this->createPosyandu(
            'Posyandu Mawar'
        );

        $kader = $this->createUser(
            $mawar,
            'kader.mawar'
        );

        $published = $this->createArtikel(
            $mawar,
            $kader,
            'Artikel Publik',
            'dipublikasikan'
        );

        $draft = $this->createArtikel(
            $mawar,
            $kader,
            'Artikel Draft Rahasia',
            'draf'
        );

        /*
         * Bahkan kalau public mencoba mengirim ?status=draf,
         * endpoint public tetap hanya boleh mengembalikan
         * artikel yang sudah dipublikasikan.
         */
        $response = $this->getJson(
            '/api/artikels?status=draf'
        );

        $response->assertOk();

        $ids = collect(
            $response->json('data')
        )->pluck('id');

        $this->assertTrue(
            $ids->contains($published->id)
        );

        $this->assertFalse(
            $ids->contains($draft->id)
        );
    }

    public function test_manage_list_only_returns_articles_from_logged_in_users_posyandu(): void
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

        $kaderMelati = $this->createUser(
            $melati,
            'kader.melati'
        );

        $mawarPublished = $this->createArtikel(
            $mawar,
            $kaderMawar,
            'Artikel Publik Mawar',
            'dipublikasikan'
        );

        $mawarDraft = $this->createArtikel(
            $mawar,
            $kaderMawar,
            'Artikel Draft Mawar',
            'draf'
        );

        $melatiPublished = $this->createArtikel(
            $melati,
            $kaderMelati,
            'Artikel Publik Melati',
            'dipublikasikan'
        );

        Sanctum::actingAs($kaderMawar);

        $response = $this->getJson(
            '/api/artikels/manage'
        );

        $response->assertOk();

        $ids = collect(
            $response->json('data')
        )->pluck('id');

        $this->assertTrue(
            $ids->contains($mawarPublished->id)
        );

        $this->assertTrue(
            $ids->contains($mawarDraft->id)
        );

        $this->assertFalse(
            $ids->contains($melatiPublished->id)
        );
    }
}
