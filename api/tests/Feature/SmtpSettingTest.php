<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SmtpSettingTest extends TestCase
{
    use RefreshDatabase;

    private function token(): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@blr15.in',
            'password' => 'password123',
        ])->json('data.access_token');
    }

    protected function setUp(): void
    {
        parent::setUp();

        AdminUser::factory()->superAdmin()->create(['email' => 'admin@blr15.in']);
    }

    public function test_smtp_config_requires_authentication(): void
    {
        $this->getJson('/api/v1/settings/smtp')->assertStatus(401);
    }

    public function test_smtp_config_never_returns_the_password(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer '.$this->token())
            ->getJson('/api/v1/settings/smtp');

        $response->assertOk()->assertJsonStructure(['configured', 'host', 'port', 'secure', 'user', 'from', 'adminEmail']);
        $this->assertArrayNotHasKey('pass', $response->json());
    }

    public function test_smtp_config_can_be_updated(): void
    {
        $this->withHeader('Authorization', 'Bearer '.$this->token())
            ->putJson('/api/v1/settings/smtp', [
                'host' => 'smtp.example.com',
                'port' => 465,
                'secure' => true,
                'user' => 'mailer@example.com',
                'pass' => 'secret-app-password',
                'adminEmail' => 'leads@blr15.in',
            ])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('config.host', 'smtp.example.com')
            ->assertJsonPath('config.port', 465);

        $this->assertDatabaseHas('settings', ['key' => 'smtp']);

        // Subsequent reads report configured = true (credentials present).
        $this->withHeader('Authorization', 'Bearer '.$this->token())
            ->getJson('/api/v1/settings/smtp')
            ->assertJsonPath('configured', true)
            ->assertJsonPath('user', 'mailer@example.com');
    }

    public function test_smtp_test_is_simulated_while_credentials_are_blank(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer '.$this->token())
            ->postJson('/api/v1/settings/smtp/test', ['toEmail' => 'admin@blr15.in']);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('isSimulated', true);

        $this->assertStringContainsString('@blr15homeloans.local', (string) $response->json('messageId'));
    }
}
