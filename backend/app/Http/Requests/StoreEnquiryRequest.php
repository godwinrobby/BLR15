<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation for a public enquiry submission (website form / eligibility
 * wizard / mobile app). Only the identity + contact fields are mandatory.
 */
class StoreEnquiryRequest extends FormRequest
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
            'customerName' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string', 'max:30'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'dob' => ['nullable', 'string', 'max:30'],
            'city' => ['nullable', 'string', 'max:120'],
            'employmentType' => ['nullable', 'string', 'max:60'],
            'monthlyIncome' => ['nullable', 'numeric', 'min:0'],
            'otherIncome' => ['nullable', 'numeric', 'min:0'],
            'existingEmi' => ['nullable', 'numeric', 'min:0'],
            'otherObligations' => ['nullable', 'numeric', 'min:0'],
            'requiredLoanAmount' => ['nullable', 'numeric', 'min:0'],
            'propertyValue' => ['nullable', 'numeric', 'min:0'],
            'propertyType' => ['nullable', 'string', 'max:60'],
            'propertyLocation' => ['nullable', 'string', 'max:255'],
            'loanType' => ['nullable', 'string', 'max:80'],
            'existingLoan' => ['nullable', 'array'],
            'message' => ['nullable', 'string'],
            'source' => ['nullable', 'string', 'max:60'],
            'status' => ['nullable', 'string', 'max:60'],
            'estimatedEligibilityAmount' => ['nullable', 'numeric', 'min:0'],
            'estimatedEmi' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
