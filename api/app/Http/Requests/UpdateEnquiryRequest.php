<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation for an admin edit of an enquiry. Every field is optional so the
 * SPA can PATCH a single change (e.g. assignedStaff or internalRemarks).
 */
class UpdateEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customerName' => ['sometimes', 'string', 'max:255'],
            'mobile' => ['sometimes', 'string', 'max:30'],
            'email' => ['sometimes', 'string', 'email', 'max:255'],
            'dob' => ['sometimes', 'nullable', 'string', 'max:30'],
            'city' => ['sometimes', 'nullable', 'string', 'max:120'],
            'employmentType' => ['sometimes', 'nullable', 'string', 'max:60'],
            'monthlyIncome' => ['sometimes', 'numeric', 'min:0'],
            'otherIncome' => ['sometimes', 'numeric', 'min:0'],
            'existingEmi' => ['sometimes', 'numeric', 'min:0'],
            'otherObligations' => ['sometimes', 'numeric', 'min:0'],
            'requiredLoanAmount' => ['sometimes', 'numeric', 'min:0'],
            'propertyValue' => ['sometimes', 'numeric', 'min:0'],
            'propertyType' => ['sometimes', 'nullable', 'string', 'max:60'],
            'propertyLocation' => ['sometimes', 'nullable', 'string', 'max:255'],
            'loanType' => ['sometimes', 'nullable', 'string', 'max:80'],
            'existingLoan' => ['sometimes', 'nullable', 'array'],
            'message' => ['sometimes', 'nullable', 'string'],
            'source' => ['sometimes', 'nullable', 'string', 'max:60'],
            'assignedStaff' => ['sometimes', 'nullable', 'string', 'max:120'],
            'internalRemarks' => ['sometimes', 'nullable', 'string'],
            'nextFollowUpDate' => ['sometimes', 'nullable', 'string', 'max:30'],
            'nextFollowUpTime' => ['sometimes', 'nullable', 'string', 'max:30'],
        ];
    }
}
