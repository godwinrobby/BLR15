<?php

namespace App\Support;

/**
 * Indian digit grouping — parity with amount.toLocaleString('en-IN') and
 * api/bootstrap.php's formatINR().
 */
class Money
{
    public static function formatINR(mixed $amount): string
    {
        if (! is_numeric($amount)) {
            return '₹0';
        }

        $number = (float) $amount;
        $prefix = $number < 0 ? '-' : '';
        $whole = (string) (int) abs($number);

        if (strlen($whole) > 3) {
            $last3 = substr($whole, -3);
            $rest = preg_replace('/\B(?=(\d{2})+(?!\d))/', ',', substr($whole, 0, -3));
            $whole = $rest.','.$last3;
        }

        return $prefix.'₹'.$whole;
    }
}
