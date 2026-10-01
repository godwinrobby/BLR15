<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_a_jwt_and_user(): void
    {
        AdminUser::factory()->superAdmin()->create([
            'id' => 'staff-1',
            'email' => 'rajesh.k@blr15.in',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'rajesh.k@blr15.in',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['access_token', 'token_type', 'expires_in', 'user' => ['id', 'name', 'email', 'role']]]);

        $this->assertNotEmpty($response->json('data.access_token'));
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        AdminUser::factory()->create(['email' => 'priya.s@blr15.in']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'priya.s@blr15.in',
            'password' => 'wrong-password',
        ])->assertStatus(401)->assertJsonPath('success', false);
    }

    public function test_inactive_user_cannot_login(): void
    {
        AdminUser::factory()->inactive()->create(['email' => 'inactive@blr15.in']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'inactive@blr15.in',
            'password' => 'password123',
        ])->assertStatus(403);
    }

    public function test_me_requires_a_token(): void
    {
        $this->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_me_returns_the_authenticated_user(): void
    {
        $user = AdminUser::factory()->admin()->create(['email' => 'priya.s@blr15.in']);

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->json('data.access_token');

        $this->withHeader('Authorization', "Bearer {$login}")
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'priya.s@blr15.in')
            ->assertJsonPath('data.role', AdminUser::ROLE_ADMIN);
    }
}
