<?php

namespace App\Services;

use App\Models\Enquiry;
use Illuminate\Support\Str;

/**
 * Business rules for enquiries — id generation, creation defaults, status
 * transitions and follow-ups. Mirrors api/store.php (PHP API) and the
 * frontend storageService.ts so behaviour is identical across clients.
 */
class EnquiryService
{
    /**
     * Next enquiry id — mirrors the frontend's generateNextEnquiryId()
     * (seed data starts at BLR15-0012, so the first live record is BLR15-0013).
     */
    public function nextEnquiryId(): string
    {
        $highest = 12;

        Enquiry::query()->select('id')->pluck('id')->each(function ($id) use (&$highest) {
            if (preg_match('/BLR15-(\d+)/', (string) $id, $m)) {
                $highest = max($highest, (int) $m[1]);
            }
        });

        return sprintf('BLR15-%04d', $highest + 1);
    }

    /**
     * Create a new enquiry, assigning the id, timestamps and initial status
     * history. Public (website/mobile) submissions use source "Website Form".
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Enquiry
    {
        $now = now();
        $source = trim((string) ($data['source'] ?? '')) ?: 'Website Form';
        $status = trim((string) ($data['status'] ?? '')) ?: 'New';

        $enquiry = new Enquiry;
        $enquiry->fill($data);
        $enquiry->id = $this->nextEnquiryId();
        $enquiry->source = $source;
        $enquiry->status = $status;
        $enquiry->status_history = [[
            'status' => $status,
            'timestamp' => $now->toISOString(),
            'updatedBy' => 'Customer / Online System',
            'note' => "Enquiry submitted via {$source}",
        ]];
        $enquiry->follow_ups = [];
        $enquiry->created_at = $now;
        $enquiry->updated_at = $now;
        $enquiry->save();

        return $enquiry->refresh();
    }

    /**
     * Apply a status change and prepend it to the status history.
     */
    public function updateStatus(Enquiry $enquiry, string $status, string $updatedBy, ?string $note = null): Enquiry
    {
        $history = $enquiry->status_history ?? [];
        array_unshift($history, array_filter([
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'updatedBy' => $updatedBy,
            'note' => $note,
        ], fn ($v) => $v !== null));

        $enquiry->status = $status;
        $enquiry->status_history = $history;
        $enquiry->updated_at = now();
        $enquiry->save();

        return $enquiry->refresh();
    }

    /**
     * Append a follow-up and set the enquiry's next follow-up date/time.
     *
     * @param  array{date:string,time?:string,notes:string}  $data
     * @return array<string, mixed> the created follow-up entry
     */
    public function addFollowUp(Enquiry $enquiry, array $data, string $createdBy): array
    {
        $followUp = [
            'id' => 'fu-'.Str::uuid()->toString(),
            'enquiryId' => $enquiry->id,
            'date' => $data['date'],
            'time' => $data['time'] ?? null,
            'notes' => $data['notes'],
            'createdBy' => $createdBy,
            'completed' => false,
        ];

        $followUps = $enquiry->follow_ups ?? [];
        array_unshift($followUps, $followUp);

        $enquiry->follow_ups = $followUps;
        $enquiry->next_follow_up_date = $data['date'];
        $enquiry->next_follow_up_time = $data['time'] ?? $enquiry->next_follow_up_time;
        $enquiry->updated_at = now();
        $enquiry->save();

        return $followUp;
    }

    /**
     * Update the completion flag of a follow-up entry.
     */
    public function completeFollowUp(Enquiry $enquiry, string $followUpId, bool $completed = true): ?array
    {
        $followUps = $enquiry->follow_ups ?? [];
        $updated = null;

        foreach ($followUps as $index => $followUp) {
            if (($followUp['id'] ?? null) === $followUpId) {
                $followUps[$index]['completed'] = $completed;
                $updated = $followUps[$index];
                break;
            }
        }

        if ($updated === null) {
            return null;
        }

        $enquiry->follow_ups = $followUps;
        $enquiry->updated_at = now();
        $enquiry->save();

        return $updated;
    }

    /**
     * Find an enquiry by id or (partial) mobile number — used by the public
     * "track enquiry" screen.
     */
    public function track(string $term): ?Enquiry
    {
        $term = trim($term);

        if ($term === '') {
            return null;
        }

        $query = Enquiry::query()
            ->where('id', $term)
            ->orWhere('mobile', 'like', "%{$term}%");

        // Also match digit-only input (e.g. "9845122340") against the stored
        // formatted mobile (e.g. "+91 98451 22340").
        $digits = preg_replace('/\D/', '', $term) ?? '';
        if (strlen($digits) >= 7) {
            $query->orWhereRaw(
                "REPLACE(REPLACE(REPLACE(mobile, ' ', ''), '-', ''), '+', '') LIKE ?",
                ["%{$digits}%"]
            );
        }

        return $query->orderByDesc('created_at')->first();
    }
}
