<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Reporting breakdowns for the Admin CRM (JWT protected).
 */
class ReportController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/reports/locations — enquiry counts by property location.
     */
    public function locations(): JsonResponse
    {
        return $this->success($this->groupBy('property_location'));
    }

    /**
     * GET /api/v1/admin/reports/employment — counts by employment type.
     */
    public function employment(): JsonResponse
    {
        return $this->success($this->groupBy('employment_type'));
    }

    /**
     * GET /api/v1/admin/reports/sources — counts by lead source.
     */
    public function sources(): JsonResponse
    {
        return $this->success($this->groupBy('source'));
    }

    /**
     * GET /api/v1/admin/reports/statuses — counts by workflow status.
     */
    public function statuses(): JsonResponse
    {
        return $this->success($this->groupBy('status'));
    }

    /**
     * @return array<int, array{label: string, count: int, totalValue: float}>
     */
    private function groupBy(string $column): array
    {
        return Enquiry::query()
            ->select($column, DB::raw('count(*) as count'), DB::raw('sum(required_loan_amount) as total_value'))
            ->groupBy($column)
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'label' => $row->{$column} ?? 'Unspecified',
                'count' => (int) $row->count,
                'totalValue' => (float) ($row->total_value ?? 0),
            ])
            ->all();
    }
}
