<?php

namespace App\Support;

/**
 * Maps the frontend's camelCase enquiry payload onto the database columns.
 * Unknown keys are dropped (whitelisting), matching api/store.php's
 * sanitize_enquiry() behaviour.
 */
class EnquiryMapper
{
    /**
     * camelCase input key => snake_case column.
     *
     * @var array<string, string>
     */
    public const MAP = [
        'customerName' => 'customer_name',
        'mobile' => 'mobile',
        'email' => 'email',
        'dob' => 'dob',
        'city' => 'city',
        'employmentType' => 'employment_type',
        'monthlyIncome' => 'monthly_income',
        'otherIncome' => 'other_income',
        'existingEmi' => 'existing_emi',
        'otherObligations' => 'other_obligations',
        'requiredLoanAmount' => 'required_loan_amount',
        'propertyValue' => 'property_value',
        'propertyType' => 'property_type',
        'propertyLocation' => 'property_location',
        'loanType' => 'loan_type',
        'existingLoan' => 'existing_loan',
        'message' => 'message',
        'source' => 'source',
        'status' => 'status',
        'assignedStaff' => 'assigned_staff',
        'internalRemarks' => 'internal_remarks',
        'nextFollowUpDate' => 'next_follow_up_date',
        'nextFollowUpTime' => 'next_follow_up_time',
        'estimatedEligibilityAmount' => 'estimated_eligibility_amount',
        'estimatedEmi' => 'estimated_emi',
    ];

    /**
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public static function toColumns(array $input): array
    {
        $columns = [];

        foreach (self::MAP as $inputKey => $column) {
            if (array_key_exists($inputKey, $input) && $input[$inputKey] !== null) {
                $columns[$column] = $input[$inputKey];
            }
        }

        return $columns;
    }

    /**
     * Columns an admin may edit in bulk (excludes identity/timestamp/history).
     *
     * @param  array<string, mixed>  $input
     * @return array<string, mixed>
     */
    public static function editableColumns(array $input): array
    {
        $columns = self::toColumns($input);

        // Status/history are handled through the dedicated status endpoint.
        unset($columns['status']);

        return $columns;
    }
}
