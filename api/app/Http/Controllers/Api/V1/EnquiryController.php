<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEnquiryRequest;
use App\Http\Resources\EnquiryResource;
use App\Models\Enquiry;
use App\Services\EnquiryService;
use App\Services\MailService;
use App\Support\ApiResponse;
use App\Support\EnquiryMapper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

/**
 * Public (unauthenticated) enquiry endpoints used by the website forms, the
 * eligibility wizard and the mobile app.
 */
class EnquiryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly EnquiryService $service,
        private readonly MailService $mail,
    ) {}

    /**
     * POST /api/v1/enquiries — submit a new lead.
     *
     * The customer acknowledgement + admin alert are dispatched server-side so
     * every client (website form, eligibility wizard, mobile app) receives them
     * without each having to separately call POST /emails/enquiry.
     *
     * Delivery is best-effort: a mail failure is reported and the enquiry still
     * returns 201, because losing a lead is far worse than losing an email.
     * Sent synchronously rather than queued because shared hosting rarely runs
     * a queue worker, which would leave jobs sitting undelivered.
     */
    public function store(StoreEnquiryRequest $request): JsonResponse
    {
        $enquiry = $this->service->create(EnquiryMapper::toColumns($request->validated()));

        try {
            $this->mail->dispatchForEnquiry($enquiry);
        } catch (Throwable $e) {
            report($e);
        }

        return $this->success((new EnquiryResource($enquiry))->toArray($request), [], 201);
    }

    /**
     * GET /api/v1/enquiries/track?q=BLR15-0012 — status lookup (id or mobile).
     */
    public function track(Request $request): JsonResponse
    {
        $term = (string) ($request->query('q') ?? $request->query('id') ?? $request->query('mobile') ?? '');

        $enquiry = $this->service->track($term);

        if (! $enquiry) {
            return $this->error('No enquiry found for the provided reference.', 404);
        }

        return $this->success((new EnquiryResource($enquiry))->toArray($request));
    }

    /**
     * GET /api/v1/enquiries/stats — public, PII-free totals for the website badge.
     */
    public function stats(): JsonResponse
    {
        return $this->success([
            'total' => Enquiry::query()->count(),
        ]);
    }
}
