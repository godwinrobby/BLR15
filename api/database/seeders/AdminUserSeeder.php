<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;

/**
 * Seeds the BLR15 staff roster (same records as src/data/initialData.ts and
 * api/storage/seed-staff.json). Demo password for every seeded account is
 * "password123".
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $staff = [
            [
                'id' => 'staff-1',
                'name' => 'Rajesh Kumar',
                'email' => 'rajesh.k@blr15.in',
                'role' => AdminUser::ROLE_SUPER_ADMIN,
                'phone' => '+91 98450 15150',
                'active' => true,
            ],
            [
                'id' => 'staff-2',
                'name' => 'Priya Sharma',
                'email' => 'priya.s@blr15.in',
                'role' => AdminUser::ROLE_ADMIN,
                'phone' => '+91 98452 33410',
                'active' => true,
            ],
            [
                'id' => 'staff-3',
                'name' => 'Suresh Gowda',
                'email' => 'suresh.g@blr15.in',
                'role' => AdminUser::ROLE_LOAN_EXECUTIVE,
                'phone' => '+91 99001 88290',
                'active' => true,
            ],
        ];

        foreach ($staff as $member) {
            AdminUser::query()->updateOrCreate(
                ['id' => $member['id']],
                $member + ['password' => 'password123'],
            );
        }
    }
}
