<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Enquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EnquiryApiTest extends TestCase
{
    use RefreshDatabase;

    private function token(): string
    {
        AdminUser::factory()->superAdmin()->create(['email' => 'admin@blr15.in']);

        return $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@blr15.in',
            'password' => 'password123',
        ])->json('data.access_token');
    }

    public function test_public_can_create_an_enquiry(): void
    {
        $response = $this->postJson('/api/v1/enquiries', [
            'customerName' => 'Karthik Venkatesh',
            'mobile' => '+91 98451 22340',
            'email' => 'karthik.v@gmail.com',
            'employmentType' => 'Salaried',
            'monthlyIncome' => 145000,
            'requiredLoanAmount' => 6500000,
            'propertyValue' => 8500000,
            'propertyType' => 'Apartment',
            'propertyLocation' => 'Jalahalli West, Bangalore',
            'source' => 'Website Form',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.customerName', 'Karthik Venkatesh')
            ->assertJsonPath('data.id', 'BLR15-0013')
            ->assertJsonPath('data.status', 'New')
            ->assertJsonPath('data.source', 'Website Form');

        $this->assertDatabaseHas('enquiries', ['id' => 'BLR15-0013', 'status' => 'New']);
    }

    public function test_create_requires_identity_fields(): void
    {
        $this->postJson('/api/v1/enquiries', ['city' => 'Bangalore'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['customerName', 'mobile', 'email']);
    }

    /**
     * StoreEnquiryRequest marks employmentType/propertyType/propertyLocation as
     * optional, but the schema used to make them NOT NULL with no default. With
     * Laravel's strict sql_mode a valid minimal payload therefore failed with
     * "ERROR 1364 Field ... doesn't have a default value" instead of creating
     * the enquiry. Covered by migration 2024_01_01_000500.
     */
    public function test_create_with_optional_fields_omitted_is_accepted(): void
    {
        $this->postJson('/api/v1/enquiries', [
            'customerName' => 'Minimal Lead',
            'mobile' => '+91 90000 11122',
            'email' => 'minimal.lead@blr15.in',
        ])
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.customerName', 'Minimal Lead')
            ->assertJsonPath('data.status', 'New')
            ->assertJsonPath('data.propertyType', null)
            ->assertJsonPath('data.propertyLocation', null)
            ->assertJsonPath('data.employmentType', null);

        $enquiry = Enquiry::query()->where('email', 'minimal.lead@blr15.in')->first();

        $this->assertNotNull($enquiry);
        $this->assertNull($enquiry->property_type);
        $this->assertNull($enquiry->property_location);
        $this->assertNull($enquiry->employment_type);
    }

    public function test_track_returns_an_enquiry_by_id(): void
    {
        Enquiry::factory()->create(['id' => 'BLR15-0042', 'customer_name' => 'Tracked Customer']);

        $this->getJson('/api/v1/enquiries/track?q=BLR15-0042')
            ->assertOk()
            ->assertJsonPath('data.customerName', 'Tracked Customer');
    }

    public function test_track_returns_404_when_not_found(): void
    {
        $this->getJson('/api/v1/enquiries/track?q=BLR15-9999')->assertStatus(404);
    }

    public function test_admin_can_update_status_and_add_follow_up(): void
    {
        $token = $this->token();
        $enquiry = Enquiry::factory()->create(['id' => 'BLR15-0043']);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/v1/admin/enquiries/{$enquiry->id}/status", [
                'status' => 'Contacted',
                'note' => 'Called the customer',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'Contacted');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson("/api/v1/admin/enquiries/{$enquiry->id}/follow-ups", [
                'date' => '2026-10-05',
                'time' => '11:00 AM',
                'notes' => 'Collect salary slips',
            ])
            ->assertCreated()
            ->assertJsonPath('data.completed', false);

        $this->assertDatabaseHas('enquiries', ['id' => 'BLR15-0043', 'status' => 'Contacted']);
    }

    public function test_invalid_status_is_rejected(): void
    {
        $token = $this->token();
        $enquiry = Enquiry::factory()->create(['id' => 'BLR15-0044']);

        $this->withHeader('Authorization', "Bearer {$token}")
            ->patchJson("/api/v1/admin/enquiries/{$enquiry->id}/status", ['status' => 'Not A Status'])
            ->assertStatus(422);
    }

    public function test_email_endpoint_runs_in_simulated_mode(): void
    {
        config(['mail.default' => 'array']);

        $this->postJson('/api/v1/emails/enquiry', [
            'enquiry' => [
                'id' => 'BLR15-0045',
                'customerName' => 'Smoke Test',
                'email' => 'smoke@test.in',
                'mobile' => '+91 90000 00001',
            ],
        ])->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('isSimulated', true)
            ->assertJsonPath('customerEmail', 'smoke@test.in');
    }
}
