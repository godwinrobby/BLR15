<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Home loan enquiries (leads). Column names mirror supabase-schema.sql so the
 * data can be migrated 1:1; nested structures (existing_loan, status_history,
 * follow_ups) are stored as JSON to preserve the frontend's exact object shape.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $table) {
            $table->string('id')->primary(); // BLR15-0001
            $table->string('customer_name');
            $table->string('mobile');
            $table->string('email');
            $table->string('dob')->nullable();
            $table->string('city')->default('Bangalore');
            $table->string('employment_type');
            $table->decimal('monthly_income', 14, 2)->default(0);
            $table->decimal('other_income', 14, 2)->default(0);
            $table->decimal('existing_emi', 14, 2)->default(0);
            $table->decimal('other_obligations', 14, 2)->default(0);
            $table->decimal('required_loan_amount', 14, 2)->default(0);
            $table->decimal('property_value', 14, 2)->default(0);
            $table->string('property_type');
            $table->string('property_location');
            $table->string('loan_type')->nullable();
            $table->json('existing_loan')->nullable();
            $table->text('message')->nullable();
            $table->string('source')->default('Website Form');
            $table->string('status')->default('New');
            $table->string('assigned_staff')->nullable();
            $table->text('internal_remarks')->nullable();
            $table->string('next_follow_up_date')->nullable();
            $table->string('next_follow_up_time')->nullable();
            $table->decimal('estimated_eligibility_amount', 14, 2)->nullable();
            $table->decimal('estimated_emi', 14, 2)->nullable();
            $table->json('status_history')->nullable();
            $table->json('follow_ups')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('mobile');
            $table->index('assigned_staff');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
