<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Verification email sent by the admin SMTP test endpoint.
 */
class SmtpTestMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $config
     */
    public function __construct(public array $config, public string $recipient) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '✅ BLR15 Home Loans - SMTP Test Verification');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.smtp-test',
            with: [
                'host' => $this->config['host'] ?? '',
                'port' => $this->config['port'] ?? '',
                'user' => $this->config['user'] ?? '',
                'timestamp' => now()->toISOString(),
            ],
        );
    }
}
