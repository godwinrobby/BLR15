<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Production runs `php artisan migrate --force` WITHOUT --seed, which
     * creates the MySQL tables and leaves them empty — no demo rows. Only
     * non-production environments seed the demo enquiries/staff automatically;
     * set SEED_DEMO=false to skip even there.
     */
    public function run(): void
    {
        if (! $this->shouldSeedDemo()) {
            $this->command?->info('Demo data skipped (SEED_DEMO is off or APP_ENV is production).');

            return;
        }

        $this->call([
            AdminUserSeeder::class,
            EnquirySeeder::class,
            SettingSeeder::class,
        ]);
    }

    private function shouldSeedDemo(): bool
    {
        if (filter_var(env('SEED_DEMO'), FILTER_VALIDATE_BOOLEAN)) {
            return true;
        }

        return env('APP_ENV', 'production') !== 'production';
    }
}
