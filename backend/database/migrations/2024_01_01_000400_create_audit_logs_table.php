<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Audit trail for admin activity (status changes, edits, staff/settings
 * changes). Mirrors the audit_logs table in supabase-schema.sql.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('admin_user_id')->nullable();
            $table->string('enquiry_id')->nullable();
            $table->string('action');
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index('enquiry_id');
            $table->index('admin_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
