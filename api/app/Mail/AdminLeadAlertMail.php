<?php

namespace App\Mail;

use App\Models\Enquiry;
use App\Support\Money;
use App\Support\Office;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Internal lead alert sent to the BLR15 admin whenever a new enquiry arrives.
 */
class AdminLeadAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $enquiry
     */
    public function __construct(public array $enquiry) {}

    public function envelope(): Envelope
    {
        $name = $this->enquiry['customerName'] ?? 'New Lead';

        return new Envelope(
            subject: "🚨 New BLR15 Home Loan Lead — {$name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-lead-alert',
            with: [
                'enquiry' => $this->enquiry,
                'amountText' => Money::formatINR($this->enquiry['requiredLoanAmount'] ?? null),
                'office' => Office::details(),
                'timestamp' => now()->toISOString(),
            ],
        );
    }

    /**
     * Build an admin alert mail from an Enquiry model.
     */
    public static function fromEnquiry(Enquiry $enquiry): self
    {
        return new self([
            'id' => $enquiry->id,
            'customerName' => $enquiry->customer_name,
            'loanType' => $enquiry->loan_type,
            'requiredLoanAmount' => $enquiry->required_loan_amount,
            'email' => $enquiry->email,
            'phone' => $enquiry->mobile,
            'status' => $enquiry->status,
            'propertyLocation' => $enquiry->property_location,
            'message' => $enquiry->message,
            'createdVia' => $enquiry->source,
        ]);
    }
}
