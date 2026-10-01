<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\Enquiry;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

/**
 * Aggregated dashboard figures for the Admin CRM home screen (JWT protected).
 */
class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/dashboard
     */
    public function stats(): JsonResponse
    {
        $byStatus = Enquiry::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($total) => (int) $total);

        $total = Enquiry::query()->count();
        $new = (int) ($byStatus['New'] ?? 0);
        $followUps = Enquiry::query()
            ->where(fn ($q) => $q->where('status', 'Follow-up')->orWhereNotNull('next_follow_up_date'))
            ->count();

        $pipelineValue = (float) Enquiry::query()->sum('required_loan_amount');

        return $this->success([
            'totalEnquiries' => $total,
            'newEnquiries' => $new,
            'followUps' => $followUps,
            'approved' => (int) ($byStatus['Approved'] ?? 0),
            'converted' => (int) ($byStatus['Converted'] ?? 0),
            'closed' => (int) ($byStatus['Closed'] ?? 0),
            'pipelineValue' => $pipelineValue,
            'staffCount' => AdminUser::query()->count(),
            'byStatus' => $byStatus,
            'byEmployment' => $this->breakdown('employment_type'),
            'bySource' => $this->breakdown('source'),
            'recentEnquiries' => Enquiry::query()
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
                ->map(fn (Enquiry $e) => [
                    'id' => $e->id,
                    'customerName' => $e->customer_name,
                    'requiredLoanAmount' => (float) $e->required_loan_amount,
                    'status' => $e->status,
                    'createdAt' => $e->created_at?->toISOString(),
                ]),
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function breakdown(string $column): array
    {
        return Enquiry::query()
            ->select($column, DB::raw('count(*) as total'))
            ->groupBy($column)
            ->pluck('total', $column)
            ->map(fn ($total) => (int) $total)
            ->all();
    }
}
