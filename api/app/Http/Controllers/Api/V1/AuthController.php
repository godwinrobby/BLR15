<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AdminUser;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Throwable;

/**
 * JWT authentication for the App + Admin portals.
 *
 * @see docs/API_MAPPING.md
 */
class AuthController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/v1/auth/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $token = auth('api')->attempt($request->only('email', 'password'));

        if (! $token) {
            return $this->error('Invalid email or password.', 401);
        }

        /** @var AdminUser $user */
        $user = auth('api')->user();

        if (! $user->active) {
            auth('api')->logout();

            return $this->error('This account has been deactivated. Contact a Super Admin.', 403);
        }

        $user->forceFill(['last_login_at' => now()])->save();

        return $this->success($this->tokenPayload($token, $user));
    }

    /**
     * POST /api/v1/auth/logout  (JWT required)
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return $this->success(['message' => 'Signed out successfully.']);
    }

    /**
     * POST /api/v1/auth/refresh  (JWT required)
     */
    public function refresh(): JsonResponse
    {
        try {
            $token = auth('api')->refresh();
        } catch (Throwable) {
            return $this->error('Unable to refresh the session. Please sign in again.', 401);
        }

        /** @var AdminUser $user */
        $user = auth('api')->user();

        return $this->success($this->tokenPayload($token, $user));
    }

    /**
     * GET /api/v1/auth/me  (JWT required)
     */
    public function me(): JsonResponse
    {
        /** @var AdminUser $user */
        $user = auth('api')->user();

        return $this->success($user->toApiArray());
    }

    /**
     * POST /api/v1/auth/change-password  (JWT required)
     */
    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'currentPassword' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        /** @var AdminUser $user */
        $user = auth('api')->user();

        if (! Hash::check($data['currentPassword'], $user->password)) {
            return $this->error('Your current password is incorrect.', 422);
        }

        $user->password = $data['newPassword'];
        $user->save();

        return $this->success(['message' => 'Password updated successfully.']);
    }

    /**
     * @return array<string, mixed>
     */
    private function tokenPayload(string $token, AdminUser $user): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user->toApiArray(),
        ];
    }
}
