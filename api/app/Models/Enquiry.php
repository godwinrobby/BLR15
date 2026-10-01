<?php

namespace App\Models;

use Database\Factories\EnquiryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Home loan enquiry (lead).
 *
 * @property string $id
 * @property string $customer_name
 * @property string $status
 * @property array|null $status_history
 * @property array|null $follow_ups
 * @property array|null $existing_loan
 */
#[Fillable([
    'id', 'customer_name', 'mobile', 'email', 'dob', 'city', 'employment_type',
    'monthly_income', 'other_income', 'existing_emi', 'other_obligations',
    'required_loan_amount', 'property_value', 'property_type', 'property_location',
    'loan_type', 'existing_loan', 'message', 'source', 'status', 'assigned_staff',
    'internal_remarks', 'next_follow_up_date', 'next_follow_up_time',
    'estimated_eligibility_amount', 'estimated_emi', 'status_history', 'follow_ups',
])]
class Enquiry extends Model
{
    /** @use HasFactory<EnquiryFactory> */
    use HasFactory;

    protected $table = 'enquiries';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'monthly_income' => 'float',
            'other_income' => 'float',
            'existing_emi' => 'float',
            'other_obligations' => 'float',
            'required_loan_amount' => 'float',
            'property_value' => 'float',
            'estimated_eligibility_amount' => 'float',
            'estimated_emi' => 'float',
            'existing_loan' => 'array',
            'status_history' => 'array',
            'follow_ups' => 'array',
        ];
    }
}
