<?php

use App\Http\Controllers\Api\V1\Admin\AuditLogController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\EnquiryController as AdminEnquiryController;
use App\Http\Controllers\Api\V1\Admin\FollowUpController;
use App\Http\Controllers\Api\V1\Admin\ReportController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\StaffController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmailController;
use App\Http\Controllers\Api\V1\EnquiryController;
use App\Http\Controllers\Api\V1\HealthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| BLR15 API (v1) — App (public) + Admin (JWT) routes
|--------------------------------------------------------------------------
| Every route is mapped to its frontend caller in docs/API_MAPPING.md.
| The apiPrefix "api" is configured in bootstrap/app.php, so all of the
| routes below live under /api/v1/...
*/

Route::prefix('v1')->group(function () {

    // ---------------------------------------------------------------------
    // Public (unauthenticated) — website, mobile app, eligibility wizard
    // ---------------------------------------------------------------------
    Route::get('health', [HealthController::class, 'index']);

    Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::post('enquiries', [EnquiryController::class, 'store']);
    Route::get('enquiries/stats', [EnquiryController::class, 'stats']);
    Route::get('enquiries/track', [EnquiryController::class, 'track']);

    Route::post('emails/enquiry', [EmailController::class, 'sendEnquiry']);

    // ---------------------------------------------------------------------
    // Authenticated (JWT) — App account + Admin CRM
    // ---------------------------------------------------------------------
    Route::middleware('auth:api')->group(function () {

        // --- Auth / account ---
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/change-password', [AuthController::class, 'changePassword']);

        // --- SMTP settings (legacy-compatible top-level responses) ---
        Route::get('settings/smtp', [SettingController::class, 'smtp']);
        Route::match(['put', 'post'], 'settings/smtp', [SettingController::class, 'updateSmtp']);
        Route::post('settings/smtp/test', [SettingController::class, 'testSmtp']);

        // --- Dashboard / reports / audit ---
        Route::get('admin/dashboard', [DashboardController::class, 'stats']);
        Route::get('admin/reports/locations', [ReportController::class, 'locations']);
        Route::get('admin/reports/employment', [ReportController::class, 'employment']);
        Route::get('admin/reports/sources', [ReportController::class, 'sources']);
        Route::get('admin/reports/statuses', [ReportController::class, 'statuses']);
        Route::get('admin/audit-logs', [AuditLogController::class, 'index']);

        // --- Enquiries (admin CRM) ---
        Route::get('admin/enquiries', [AdminEnquiryController::class, 'index']);
        Route::post('admin/enquiries', [AdminEnquiryController::class, 'store']);
        Route::get('admin/enquiries/{enquiry}', [AdminEnquiryController::class, 'show']);
        Route::match(['put', 'patch'], 'admin/enquiries/{enquiry}', [AdminEnquiryController::class, 'update']);
        Route::patch('admin/enquiries/{enquiry}/status', [AdminEnquiryController::class, 'updateStatus']);
        Route::delete('admin/enquiries/{enquiry}', [AdminEnquiryController::class, 'destroy']);

        // --- Follow-ups ---
        Route::post('admin/enquiries/{enquiry}/follow-ups', [FollowUpController::class, 'store']);
        Route::patch('admin/enquiries/{enquiry}/follow-ups/{followUp}', [FollowUpController::class, 'complete']);

        // --- Staff roster (reads: any admin; writes: Super Admin only) ---
        Route::get('admin/staff', [StaffController::class, 'index']);
        Route::get('admin/staff/{staff}', [StaffController::class, 'show']);
        Route::match(['put', 'post'], 'admin/staff/sync', [StaffController::class, 'sync'])
            ->middleware('role:Super Admin');

        Route::middleware('role:Super Admin')->group(function () {
            Route::post('admin/staff', [StaffController::class, 'store']);
            Route::match(['put', 'patch'], 'admin/staff/{staff}', [StaffController::class, 'update']);
            Route::delete('admin/staff/{staff}', [StaffController::class, 'destroy']);
        });

        // --- Generic settings (Super Admin) ---
        Route::get('settings', [SettingController::class, 'index']);
        Route::get('settings/{key}', [SettingController::class, 'show']);
        Route::put('settings/{key}', [SettingController::class, 'update'])->middleware('role:Super Admin');
    });
});
