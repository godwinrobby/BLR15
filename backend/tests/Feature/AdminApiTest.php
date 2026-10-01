<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Enquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    private function tokenFor(AdminUser $user): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ])->json('data.access_token');
    }

    public function test_admin_enquiries_require_authentication(): void
    {
        $this->getJson('/api/v1/admin/enquiries')->assertStatus(401);
    }

    public function test_admin_can_list_enquiries(): void
    {
        $token = $this->tokenFor(AdminUser::factory()->admin()->create(['email' => 'admin@blr15.in']));
        Enquiry::factory()->count(3)->create();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/enquiries')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('count', 3);
    }

    public function test_loan_executive_cannot_create_staff(): void
    {
        $token = $this->tokenFor(AdminUser::factory()->create(['email' => 'exec@blr15.in']));

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/admin/staff', [
                'name' => 'New Person',
                'email' => 'new@blr15.in',
                'role' => AdminUser::ROLE_ADMIN,
            ])
            ->assertStatus(403);
    }

    public function test_super_admin_can_create_staff(): void
    {
        $token = $this->tokenFor(AdminUser::factory()->superAdmin()->create(['email' => 'super@blr15.in']));

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/admin/staff', [
                'name' => 'New Admin',
                'email' => 'new@blr15.in',
                'role' => AdminUser::ROLE_ADMIN,
                'phone' => '+91 90000 00002',
            ])
            ->assertCreated()
            ->assertJsonPath('data.email', 'new@blr15.in')
            ->assertJsonPath('data.role', AdminUser::ROLE_ADMIN);

        $this->assertDatabaseHas('admin_users', ['email' => 'new@blr15.in']);
    }

    public function test_staff_index_returns_camel_case_roster(): void
    {
        $token = $this->tokenFor(AdminUser::factory()->admin()->create(['email' => 'admin2@blr15.in']));
        AdminUser::factory()->create(['name' => 'Listed Staff', 'email' => 'listed@blr15.in']);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/staff')
            ->assertOk()
            ->assertJsonStructure(['success', 'count', 'data' => [['id', 'name', 'email', 'role', 'phone', 'active']]]);
    }

    public function test_dashboard_returns_aggregates(): void
    {
        $token = $this->tokenFor(AdminUser::factory()->admin()->create(['email' => 'dash@blr15.in']));
        Enquiry::factory()->count(2)->create(['status' => 'New']);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('data.totalEnquiries', 2)
            ->assertJsonPath('data.newEnquiries', 2);
    }
}
