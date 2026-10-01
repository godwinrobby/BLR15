<?php

namespace App\Support;

/**
 * The enquiry workflow statuses — mirrors EnquiryStatus in src/types/index.ts.
 */
class EnquiryStatuses
{
    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            'New',
            'Contacted',
            'Follow-up',
            'Interested',
            'Documents Requested',
            'Application Started',
            'Submitted to Lender',
            'Approved',
            'Rejected',
            'Converted',
            'Closed',
        ];
    }
}
