<?php

namespace App\Services;

use App\Models\AdminUser;
use App\Models\AuditLog;
use Illuminate\Http\Request;

/**
 * Records admin activity into the audit_logs table.
 */
class AuditLogger
{
    /**
     * @param  array<string, mixed>  $meta
     */
    public function log(string $action, ?string $enquiryId = null, array $meta = [], ?AdminUser $user = null): AuditLog
    {
        $user ??= auth('api')->user();

        return AuditLog::query()->create([
            'admin_user_id' => $user?->id,
            'enquiry_id' => $enquiryId,
            'action' => $action,
            'meta' => $meta,
        ]);
    }

    /**
     * Convenience helper using the current request's user agent / ip.
     *
     * @param  array<string, mixed>  $meta
     */
    public function logFromRequest(Request $request, string $action, ?string $enquiryId = null, array $meta = []): AuditLog
    {
        return $this->log($action, $enquiryId, $meta + [
            'ip' => $request->ip(),
            'userAgent' => substr((string) $request->userAgent(), 0, 255),
        ]);
    }
}
