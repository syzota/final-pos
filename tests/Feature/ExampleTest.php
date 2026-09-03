<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_api_is_active(): void
    {
        $response = $this->getJson('/api/ping');

        $response
            ->assertStatus(200)
            ->assertJson([
                'status' => 'sukses',
                'pesan' => 'API Aktif',
            ]);
    }
}
