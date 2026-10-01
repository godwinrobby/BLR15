<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * StoreEnquiryRequest documents employmentType / propertyType / propertyLocation
 * as `nullable`, but the create-enquiries table made them NOT NULL with no
 * default. Because EnquiryMapper::toColumns() drops null/absent keys, any
 * payload that passed validation but omitted them raised
 * "ERROR 1364 Field ... doesn't have a default value" under the strict
 * sql_mode Laravel applies. Align the schema with the validation contract.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->string('employment_type', 60)->nullable()->change();
            $table->string('property_type', 60)->nullable()->change();
            $table->string('property_location')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('enquiries', function (Blueprint $table) {
            $table->string('employment_type', 60)->default('Salaried')->change();
            $table->string('property_type', 60)->default('')->change();
            $table->string('property_location')->default('')->change();
        });
    }
};
