<?php

namespace Database\Seeders;

use App\Services\SettingService;
use App\Support\Office;
use Illuminate\Database\Seeder;

/**
 * Seeds non-sensitive site settings (office details). SMTP is intentionally
 * left unset so the API starts in simulated-mail mode until an admin configures
 * it (or the .env provides credentials).
 */
class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = app(SettingService::class);

        $settings->put('site', [
            'office' => Office::details(),
            'defaultCity' => 'Bangalore',
            'currency' => 'INR',
        ]);
    }
}
