<?php

namespace App\Services;

use App\Mail\AdminLeadAlertMail;
use App\Mail\EnquiryConfirmationMail;
use App\Mail\SmtpTestMail;
use Illuminate\Support\Facades\Mail;

/**
 * Dispatches enquiry emails using the active SMTP configuration.
 *
 * When no SMTP credentials are configured the API runs in "simulated" mode
 * (matches server.ts jsonTransport / api/index.php) so the forms and admin
 * panel keep working without a live mailbox.
 */
class MailService
{
    public function __construct(private readonly SettingService $settings) {}

    /**
     * Send the customer acknowledgement + admin lead alert for a raw enquiry
     * payload (camelCase, as sent by the React app).
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public function dispatchForPayload(array $payload): array
    {
        $enquiry = $payload;
        // The frontend sends `mobile`; the templates expect `phone`.
        $enquiry['phone'] = $payload['phone'] ?? $payload['mobile'] ?? '';
        $enquiry['createdVia'] = $payload['createdVia'] ?? $payload['source'] ?? 'Website Enquiry Form';

        $config = $this->settings->smtpConfig();
        $customerEmail = (string) ($enquiry['email'] ?? '');
        $adminEmail = (string) $config['adminEmail'];

        if ($config['user'] === '' || $config['pass'] === '') {
            return [
                'isSimulated' => true,
                'customerEmailSent' => true,
                'adminEmailSent' => true,
                'customerEmail' => $customerEmail,
                'adminEmail' => $adminEmail,
            ];
        }

        $this->applyMailConfig($config);

        Mail::to($customerEmail)->send(new EnquiryConfirmationMail($enquiry));
        Mail::to($adminEmail)->send(new AdminLeadAlertMail($enquiry));

        return [
            'isSimulated' => false,
            'customerEmailSent' => true,
            'adminEmailSent' => true,
            'customerEmail' => $customerEmail,
            'adminEmail' => $adminEmail,
        ];
    }

    /**
     * Verify a candidate SMTP configuration and send a test email.
     *
     * With blank credentials the API reports a simulated success (parity with
     * api/index.php / server.ts jsonTransport) so the admin "Test" button works
     * before SMTP is configured.
     *
     * @param  array<string, mixed>  $override
     * @return array{messageId: string, isSimulated: bool}
     */
    public function sendTest(array $override, string $recipient): array
    {
        $config = array_merge($this->settings->smtpConfig(), array_filter(
            $override,
            fn ($value) => $value !== null && $value !== ''
        ));

        if ($config['user'] === '' || $config['pass'] === '') {
            return [
                'messageId' => $this->simulatedMessageId(),
                'isSimulated' => true,
            ];
        }

        $this->applyMailConfig($config);

        Mail::to($recipient)->send(new SmtpTestMail($config, $recipient));

        return [
            'messageId' => $this->simulatedMessageId(),
            'isSimulated' => false,
        ];
    }

    /**
     * Locally generated Message-ID (mirrors api/index.php simulated_message_id).
     */
    private function simulatedMessageId(): string
    {
        return '<'.bin2hex(random_bytes(16)).'@blr15homeloans.local>';
    }

    /**
     * @param  array<string, mixed>  $config
     */
    private function applyMailConfig(array $config): void
    {
        [$fromEmail, $fromName] = $this->parseFromAddress((string) ($config['from'] ?? ''));

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.transport' => 'smtp',
            'mail.mailers.smtp.host' => $config['host'],
            'mail.mailers.smtp.port' => (int) $config['port'],
            'mail.mailers.smtp.username' => $config['user'],
            'mail.mailers.smtp.password' => $config['pass'],
            'mail.mailers.smtp.encryption' => $config['secure'] ? 'ssl' : 'tls',
            'mail.mailers.smtp.timeout' => 20,
            'mail.from.address' => $fromEmail,
            'mail.from.name' => $fromName,
        ]);

        Mail::purge('smtp');
    }

    /**
     * Parse `"Name" <email@x.com>` (or a bare address) into [email, name].
     *
     * @return array{0: string, 1: string}
     */
    private function parseFromAddress(string $from): array
    {
        if (preg_match('/^(.*)<([^>]+)>$/s', $from, $matches)) {
            return [trim($matches[2]), trim($matches[1], " \t\"'")];
        }

        $email = trim($from);

        return [$email !== '' ? $email : 'contact@blr15homeloans.com', 'BLR15 Home Loans'];
    }
}
