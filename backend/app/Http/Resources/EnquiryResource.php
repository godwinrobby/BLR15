<?php

namespace App\Http\Resources;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Transforms an Enquiry model into the camelCase shape the React app expects
 * (see src/types/index.ts → HomeLoanEnquiry). Keys/optionals mirror that type
 * exactly so the frontend can render server payloads without adaptation.
 *
 * @mixin Enquiry
 */
class EnquiryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customerName' => $this->customer_name,
            'mobile' => $this->mobile,
            'email' => $this->email,
            'dob' => $this->dob,
            'city' => $this->city,
            'employmentType' => $this->employment_type,
            'monthlyIncome' => (float) $this->monthly_income,
            'otherIncome' => (float) $this->other_income,
            'existingEmi' => (float) $this->existing_emi,
            'otherObligations' => (float) $this->other_obligations,
            'requiredLoanAmount' => (float) $this->required_loan_amount,
            'propertyValue' => (float) $this->property_value,
            'propertyType' => $this->property_type,
            'propertyLocation' => $this->property_location,
            'loanType' => $this->loan_type,
            'existingLoan' => $this->existing_loan,
            'message' => $this->message,
            'source' => $this->source,
            'status' => $this->status,
            'assignedStaff' => $this->assigned_staff,
            'internalRemarks' => $this->internal_remarks,
            'nextFollowUpDate' => $this->next_follow_up_date,
            'nextFollowUpTime' => $this->next_follow_up_time,
            'estimatedEligibilityAmount' => $this->estimated_eligibility_amount !== null ? (float) $this->estimated_eligibility_amount : null,
            'estimatedEmi' => $this->estimated_emi !== null ? (float) $this->estimated_emi : null,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'statusHistory' => $this->status_history ?? [],
            'followUps' => $this->follow_ups ?? [],
        ];
    }
}
