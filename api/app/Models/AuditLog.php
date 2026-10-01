<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Audit trail entry for admin activity.
 */
#[Fillable(['admin_user_id', 'enquiry_id', 'action', 'meta'])]
class AuditLog extends Model
{
    protected $table = 'audit_logs';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'meta' => 'array',
        ];
    }
}
