<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only view of the admin activity trail (JWT protected).
 */
class AuditLogController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/audit-logs?enquiry_id=&admin_user_id=&per_page=
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query()->orderByDesc('created_at');

        if ($enquiryId = $request->query('enquiry_id')) {
            $query->where('enquiry_id', $enquiryId);
        }

        if ($adminId = $request->query('admin_user_id')) {
            $query->where('admin_user_id', $adminId);
        }

        $logs = $query->limit((int) $request->query('limit', 100))->get();

        return $this->success($logs, ['count' => $logs->count()]);
    }
}
