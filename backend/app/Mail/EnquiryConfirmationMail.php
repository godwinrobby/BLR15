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
 * Customer acknowledgement email sent after an enquiry is submitted.
 */
class EnquiryConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $enquiry
     */
    public function __construct(public array $enquiry) {}

    public function envelope(): Envelope
    {
        $id = $this->enquiry['id'] ?? '';

        return new Envelope(
            subject: "✅ Your BLR15 Home Loan Enquiry Received (#{$id}) — We Will Call You Shortly",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.enquiry-confirmation',
            with: [
                'enquiry' => $this->enquiry,
                'firstName' => $this->firstName(),
                'amountText' => Money::formatINR($this->enquiry['requiredLoanAmount'] ?? null),
                'office' => Office::details(),
            ],
        );
    }

    private function firstName(): string
    {
        $name = trim((string) ($this->enquiry['customerName'] ?? ''));

        return $name === '' ? 'Customer' : explode(' ', $name)[0];
    }

    /**
     * Build a confirmation mail from an Enquiry model.
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
        ]);
    }
}
