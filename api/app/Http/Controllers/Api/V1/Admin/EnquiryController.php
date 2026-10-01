<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnquiryRequest;
use App\Http\Requests\UpdateEnquiryRequest;
use App\Http\Requests\UpdateEnquiryStatusRequest;
use App\Http\Resources\EnquiryResource;
use App\Models\AdminUser;
use App\Models\Enquiry;
use App\Services\AuditLogger;
use App\Services\EnquiryService;
use App\Support\ApiResponse;
use App\Support\EnquiryMapper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin CRM operations over enquiries (JWT protected).
 */
class EnquiryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly EnquiryService $service,
        private readonly AuditLogger $audit,
    ) {}

    /**
     * GET /api/v1/admin/enquiries
     * Optional filters: status, assignedStaff, q (id/mobile/name/email search).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Enquiry::query()->orderByDesc('created_at');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($staff = $request->query('assignedStaff')) {
            $query->where('assigned_staff', $staff);
        }

        if ($search = $request->query('q')) {
            $term = '%'.$search.'%';
            $query->where(function ($q) use ($term) {
                $q->where('id', 'like', $term)
                    ->orWhere('mobile', 'like', $term)
                    ->orWhere('customer_name', 'like', $term)
                    ->orWhere('email', 'like', $term);
            });
        }

        $enquiries = $query->get();

        return $this->success(
            EnquiryResource::collection($enquiries)->toArray($request),
            ['count' => $enquiries->count()],
        );
    }

    /**
     * POST /api/v1/admin/enquiries — create a lead on behalf of a customer.
     */
    public function store(StoreEnquiryRequest $request): JsonResponse
    {
        $enquiry = $this->service->create(EnquiryMapper::toColumns($request->validated()));

        $this->audit->logFromRequest($request, 'enquiry.created', $enquiry->id);

        return $this->success((new EnquiryResource($enquiry))->toArray($request), [], 201);
    }

    /**
     * GET /api/v1/admin/enquiries/{enquiry}
     */
    public function show(Request $request, Enquiry $enquiry): JsonResponse
    {
        return $this->success((new EnquiryResource($enquiry))->toArray($request));
    }

    /**
     * PUT|PATCH /api/v1/admin/enquiries/{enquiry} — edit details/assignment/remarks.
     */
    public function update(UpdateEnquiryRequest $request, Enquiry $enquiry): JsonResponse
    {
        $enquiry->fill(EnquiryMapper::editableColumns($request->validated()));
        $enquiry->updated_at = now();
        $enquiry->save();

        $this->audit->logFromRequest($request, 'enquiry.updated', $enquiry->id, [
            'fields' => array_keys($request->validated()),
        ]);

        return $this->success((new EnquiryResource($enquiry->refresh()))->toArray($request));
    }

    /**
     * PATCH /api/v1/admin/enquiries/{enquiry}/status
     */
    public function updateStatus(UpdateEnquiryStatusRequest $request, Enquiry $enquiry): JsonResponse
    {
        /** @var AdminUser $user */
        $user = $request->user('api');
        $updatedBy = $user?->name ?? 'Admin';

        $enquiry = $this->service->updateStatus(
            $enquiry,
            $request->validated('status'),
            $updatedBy,
            $request->validated('note'),
        );

        $this->audit->logFromRequest($request, 'enquiry.status_changed', $enquiry->id, [
            'status' => $enquiry->status,
        ]);

        return $this->success((new EnquiryResource($enquiry))->toArray($request));
    }

    /**
     * DELETE /api/v1/admin/enquiries/{enquiry}
     */
    public function destroy(Request $request, Enquiry $enquiry): JsonResponse
    {
        $id = $enquiry->id;
        $enquiry->delete();

        $this->audit->logFromRequest($request, 'enquiry.deleted', $id);

        return $this->success(['deleted' => $id]);
    }
}
