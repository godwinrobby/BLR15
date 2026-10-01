<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestSmtpRequest;
use App\Http\Requests\UpdateSmtpConfigRequest;
use App\Models\Setting;
use App\Services\MailService;
use App\Services\SettingService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

/**
 * SMTP + generic settings management (JWT protected). The SMTP endpoints return
 * the legacy top-level shape so the React SmtpManager keeps working verbatim.
 */
class SettingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SettingService $settings,
        private readonly MailService $mail,
    ) {}

    /**
     * GET /api/v1/settings/smtp — current config (never returns the password).
     */
    public function smtp(): JsonResponse
    {
        return response()->json($this->settings->smtpConfigForClient());
    }

    /**
     * PUT|POST /api/v1/settings/smtp — persist SMTP settings.
     */
    public function updateSmtp(UpdateSmtpConfigRequest $request): JsonResponse
    {
        $config = $this->settings->updateSmtpConfig($request->validated());

        return response()->json([
            'success' => true,
            'config' => [
                'host' => $config['host'],
                'port' => $config['port'],
                'secure' => $config['secure'],
                'user' => $config['user'],
                'from' => $config['from'],
                'adminEmail' => $config['adminEmail'],
            ],
        ]);
    }

    /**
     * POST /api/v1/settings/smtp/test — verify credentials & send a test email.
     */
    public function testSmtp(TestSmtpRequest $request): JsonResponse
    {
        $config = $this->settings->smtpConfig();
        $recipient = (string) ($request->input('toEmail') ?: $config['user'] ?: $config['adminEmail']);

        if ($recipient === '') {
            return response()->json(['success' => false, 'error' => 'Recipient email address is required'], 400);
        }

        try {
            $result = $this->mail->sendTest($request->validated(), $recipient);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage() ?: 'Failed to connect to the SMTP server. Verify credentials and port.',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => "SMTP test email successfully sent to {$recipient}!",
            'messageId' => $result['messageId'],
            // Legacy parity: old-api/index.php flags simulated deliveries.
            ...($result['isSimulated'] ? ['isSimulated' => true] : []),
        ]);
    }

    /**
     * GET /api/v1/settings — list all raw settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::query()->get()
            ->mapWithKeys(fn ($setting) => [$setting->key => $setting->value]);

        return $this->success($settings);
    }

    /**
     * GET /api/v1/settings/{key}
     */
    public function show(string $key): JsonResponse
    {
        $value = $this->settings->get($key);

        if ($value === null) {
            return $this->error("Setting not found: {$key}", 404);
        }

        return $this->success($value);
    }

    /**
     * PUT /api/v1/settings/{key}
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $data = $request->validate(['value' => ['required', 'array']]);

        $setting = $this->settings->put($key, $data['value']);

        return $this->success($setting->value, ['key' => $setting->key]);
    }
}
