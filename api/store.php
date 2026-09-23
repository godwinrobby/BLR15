<?php
declare(strict_types=1);

/**
 * BLR15 PHP API — JSON-file data store for the live /admin CRM.
 *
 * Runtime files live in api/storage/ (git-ignored, never web-accessible) and
 * are seeded from the committed seed-<name>.json on first access. Writes are
 * atomic (tmp file + rename) so concurrent admin saves never corrupt the store.
 */

const BLR15_STORAGE_DIR = __DIR__ . '/storage';

function storage_file(string $name): string
{
    return BLR15_STORAGE_DIR . '/' . $name . '.json';
}

function seed_file(string $name): string
{
    return BLR15_STORAGE_DIR . '/seed-' . $name . '.json';
}

/** Reads a JSON collection, seeding from seed-<name>.json on first access. */
function read_collection(string $name): array
{
    $file = storage_file($name);
    if (!is_file($file)) {
        $seed = seed_file($name);
        $decoded = is_file($seed) ? json_decode((string) file_get_contents($seed), true) : null;
        return is_array($decoded) ? array_values($decoded) : [];
    }
    $decoded = json_decode((string) file_get_contents($file), true);
    if (!is_array($decoded)) {
        return [];
    }
    return array_values($decoded);
}

/** Writes a JSON collection atomically (exclusive lock, tmp + rename). */
function write_collection(string $name, array $items): void
{
    if (!is_dir(BLR15_STORAGE_DIR) && !mkdir(BLR15_STORAGE_DIR, 0775, true) && !is_dir(BLR15_STORAGE_DIR)) {
        json_out(['success' => false, 'error' => "Failed to create storage directory for {$name}"], 500);
    }
    $path = storage_file($name);
    $tmp = $path . '.' . getmypid() . '.tmp';
    $json = json_encode(array_values($items), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, $path)) {
        @unlink($tmp);
        json_out(['success' => false, 'error' => "Failed to persist the {$name} store"], 500);
    }
}

/**
 * Next enquiry id — mirrors the frontend's storageService.generateNextEnquiryId
 * (seed data starts at BLR15-0012, so the first live record is BLR15-0013).
 */
function next_enquiry_id(array $list): string
{
    $highest = 12;
    foreach ($list as $item) {
        $id = (string) ($item['id'] ?? '');
        if (preg_match('/BLR15-(\d+)/', $id, $m)) {
            $highest = max($highest, (int) $m[1]);
        }
    }
    return sprintf('BLR15-%04d', $highest + 1);
}

/** Whitelists + type-casts incoming enquiry fields (drops unknown junk keys). */
function sanitize_enquiry(array $input): array
{
    $record = [];
    $stringKeys = [
        'id', 'customerName', 'mobile', 'email', 'dob', 'city', 'employmentType',
        'propertyType', 'propertyLocation', 'loanType', 'message', 'source', 'status',
        'assignedStaff', 'internalRemarks', 'nextFollowUpDate', 'nextFollowUpTime',
        'createdAt', 'updatedAt',
    ];
    foreach ($stringKeys as $key) {
        if (array_key_exists($key, $input) && $input[$key] !== null && !is_array($input[$key]) && !is_object($input[$key])) {
            $record[$key] = trim((string) $input[$key]);
        }
    }
    $numberKeys = [
        'monthlyIncome', 'otherIncome', 'existingEmi', 'otherObligations',
        'requiredLoanAmount', 'propertyValue', 'estimatedEligibilityAmount', 'estimatedEmi',
    ];
    foreach ($numberKeys as $key) {
        if (array_key_exists($key, $input) && is_numeric($input[$key])) {
            $record[$key] = $input[$key] + 0;
        }
    }
    if (isset($input['existingLoan']) && is_array($input['existingLoan'])) {
        $record['existingLoan'] = $input['existingLoan'];
    }
    if (isset($input['statusHistory']) && is_array($input['statusHistory'])) {
        $record['statusHistory'] = array_values($input['statusHistory']);
    }
    if (isset($input['followUps']) && is_array($input['followUps'])) {
        $record['followUps'] = array_values($input['followUps']);
    }
    return $record;
}

/** Builds a new enquiry — parity with the frontend's createEnquiry defaults. */
function build_new_enquiry(array $payload, array $list): array
{
    $now = gmdate('Y-m-d\TH:i:s.v\Z');
    $record = sanitize_enquiry($payload);
    unset($record['id'], $record['createdAt'], $record['updatedAt'], $record['statusHistory'], $record['followUps']);

    $source = ($record['source'] ?? '') !== '' ? $record['source'] : 'Website Form';
    $record['source'] = $source;
    $record['status'] = ($record['status'] ?? '') !== '' ? $record['status'] : 'New';
    $record['id'] = next_enquiry_id($list);
    $record['createdAt'] = $now;
    $record['updatedAt'] = $now;
    $record['statusHistory'] = [[
        'status' => $record['status'],
        'timestamp' => $now,
        'updatedBy' => 'Customer / Online System',
        'note' => "Enquiry submitted via {$source}",
    ]];
    $record['followUps'] = [];
    return $record;
}

/** Merges an update payload over the stored record (id/createdAt stay authoritative). */
function build_updated_enquiry(array $payload, array $existing): array
{
    $record = array_merge($existing, sanitize_enquiry($payload));
    $record['id'] = $existing['id'];
    $record['createdAt'] = $existing['createdAt'] ?? gmdate('Y-m-d\TH:i:s.v\Z');
    if (($record['updatedAt'] ?? '') === '') {
        $record['updatedAt'] = gmdate('Y-m-d\TH:i:s.v\Z');
    }
    if (($record['status'] ?? '') === '') {
        $record['status'] = 'New';
    }
    if (!isset($record['statusHistory']) || !is_array($record['statusHistory'])) {
        $record['statusHistory'] = $existing['statusHistory'] ?? [];
    }
    if (!isset($record['followUps']) || !is_array($record['followUps'])) {
        $record['followUps'] = $existing['followUps'] ?? [];
    }
    return $record;
}

/** Whitelists staff fields (AdminUser: id, name, email, role, phone, active). */
function sanitize_staff(array $input): array
{
    $record = [];
    foreach (['id', 'name', 'email', 'role', 'phone'] as $key) {
        if (array_key_exists($key, $input) && $input[$key] !== null && !is_array($input[$key])) {
            $record[$key] = trim((string) $input[$key]);
        }
    }
    $record['active'] = array_key_exists('active', $input) ? (bool) $input['active'] : true;
    return $record;
}
