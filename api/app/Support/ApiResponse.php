<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * Standard JSON envelope shared by every API endpoint so the React frontend's
 * apiJson()/ApiError parsing keeps working unchanged:
 *
 *   success → { "success": true, ...extras, "data": ... }
 *   error   → { "success": false, "error": "message" }
 */
trait ApiResponse
{
    /**
     * @param  array<string, mixed>  $extra  Additional top-level keys (e.g. count).
     */
    protected function success(mixed $data = null, array $extra = [], int $status = 200): JsonResponse
    {
        $payload = ['success' => true] + $extra;

        if (func_num_args() > 0 || $data !== null) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $status);
    }

    /**
     * @param  array<string, mixed>  $extra
     */
    protected function error(string $message, int $status = 400, array $extra = []): JsonResponse
    {
        return response()->json(['success' => false, 'error' => $message] + $extra, $status);
    }
}
