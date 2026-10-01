<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFollowUpRequest;
use App\Models\AdminUser;
use App\Models\Enquiry;
use App\Services\AuditLogger;
use App\Services\EnquiryService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Follow-up scheduling for enquiries (JWT protected).
 */
class FollowUpController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly EnquiryService $service,
        private readonly AuditLogger $audit,
    ) {}

    /**
     * POST /api/v1/admin/enquiries/{enquiry}/follow-ups
     */
    public function store(StoreFollowUpRequest $request, Enquiry $enquiry): JsonResponse
    {
        /** @var AdminUser $user */
        $user = $request->user('api');
        $createdBy = $user?->name ?? 'Admin';

        $followUp = $this->service->addFollowUp($enquiry, $request->validated(), $createdBy);

        $this->audit->logFromRequest($request, 'enquiry.follow_up_added', $enquiry->id, [
            'date' => $followUp['date'],
        ]);

        return $this->success($followUp, [], 201);
    }

    /**
     * PATCH /api/v1/admin/enquiries/{enquiry}/follow-ups/{followUp}
     */
    public function complete(Request $request, Enquiry $enquiry, string $followUp): JsonResponse
    {
        $completed = $request->boolean('completed', true);
        $updated = $this->service->completeFollowUp($enquiry, $followUp, $completed);

        if ($updated === null) {
            return $this->error("Follow-up not found: {$followUp}", 404);
        }

        $this->audit->logFromRequest($request, 'enquiry.follow_up_updated', $enquiry->id, [
            'followUpId' => $followUp,
            'completed' => $completed,
        ]);

        return $this->success($updated);
    }
}
