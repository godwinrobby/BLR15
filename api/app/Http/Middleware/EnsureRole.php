<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restricts a route to the given admin roles, e.g.
 *
 *   Route::middleware('role:Super Admin')->group(...)
 *   Route::middleware('role:Super Admin,Admin')->group(...)
 *
 * Assumes the request is already authenticated via the `auth:api` (JWT) guard.
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user('api') ?? $request->user();

        if (! $user) {
            return response()->json(['success' => false, 'error' => 'Unauthenticated.'], 401);
        }

        if (! empty($roles) && ! in_array($user->role, $roles, true)) {
            return response()->json([
                'success' => false,
                'error' => 'Your role is not permitted to perform this action.',
            ], 403);
        }

        return $next($request);
    }
}
