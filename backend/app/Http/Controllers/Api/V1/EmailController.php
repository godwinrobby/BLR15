<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

/**
 * Public email dispatch endpoint — parity with the legacy
 * POST /api/send-enquiry-email (server.ts / api/index.php).
 *
 * Responds with the SAME top-level shape the React emailService reads:
 *   { success, isSimulated, customerEmailSent, adminEmailSent, customerEmail, adminEmail }
 */
class EmailController extends Controller
{
    public function __construct(private readonly MailService $mail) {}

    /**
     * POST /api/v1/emails/enquiry
     */
    public function sendEnquiry(Request $request): JsonResponse
    {
        $data = $request->validate([
            'enquiry' => ['required', 'array'],
            'enquiry.email' => ['required', 'string', 'email'],
            'enquiry.customerName' => ['required', 'string'],
        ]);

        try {
            $result = $this->mail->dispatchForPayload($data['enquiry']);
        } catch (Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }

        return response()->json(['success' => true] + $result);
    }
}
