<?php

namespace Database\Seeders;

use App\Models\Enquiry;
use App\Support\EnquiryMapper;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Seeds the demo enquiries. Reuses the SAME JSON the PHP API/frontend use
 * (api/storage/seed-enquiries.json) so all three stay in sync; falls back to
 * the factory when that file is not present.
 */
class EnquirySeeder extends Seeder
{
    public function run(): void
    {
        $path = base_path('../old-api/storage/seed-enquiries.json');

        if (! is_file($path)) {
            Enquiry::factory()->count(12)->create();

            return;
        }

        $records = json_decode((string) file_get_contents($path), true) ?: [];

        foreach ($records as $record) {
            if (! is_array($record) || empty($record['id'])) {
                continue;
            }

            $columns = EnquiryMapper::toColumns($record);
            $columns['id'] = $record['id'];
            $columns['status_history'] = $record['statusHistory'] ?? [];
            $columns['follow_ups'] = $record['followUps'] ?? [];
            $columns['created_at'] = isset($record['createdAt']) ? Carbon::parse($record['createdAt']) : now();
            $columns['updated_at'] = isset($record['updatedAt']) ? Carbon::parse($record['updatedAt']) : now();

            Enquiry::query()->updateOrCreate(['id' => $record['id']], $columns);
        }
    }
}
