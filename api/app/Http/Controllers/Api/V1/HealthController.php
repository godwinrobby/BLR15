<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/health
     */
    public function index(): JsonResponse
    {
        return $this->success([
            'status' => 'ok',
            'service' => 'BLR15 Laravel API',
            'framework' => 'Laravel '.app()->version(),
            'environment' => app()->environment(),
            'time' => now()->toISOString(),
        ]);
    }
}
