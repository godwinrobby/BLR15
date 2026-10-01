<?php

namespace App\Support;

/**
 * BLR15 office details used in email templates — mirrors BLR15_OFFICE in
 * api/bootstrap.php and BLR15_OFFICE_DETAILS in src/data/initialData.ts.
 */
class Office
{
    /**
     * @return array<string, string>
     */
    public static function details(): array
    {
        return [
            'name' => 'BLR15 Home Loans',
            'fullAddress' => 'Near Narasimha Swamy Temple, 1st Floor, Kammagondanahalli Main Road, Kammagondanahalli, Jalahalli West, Bangalore – 560015',
            'phone' => '+91 98450 15150',
            'landline' => '080 2838 1515',
            'whatsapp' => '+919845015150',
            'email' => 'contact@blr15homeloans.com',
            'supportEmail' => 'support@blr15.in',
            'workingHours' => 'Mon – Sat: 9:30 AM – 7:00 PM (Sunday by appointment)',
        ];
    }
}
