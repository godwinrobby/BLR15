<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Http\Requests\Admin\UpdateStaffRequest;
use App\Models\AdminUser;
use App\Services\AuditLogger;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Staff roster management (JWT protected, Super Admin for writes).
 */
class StaffController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * GET /api/v1/admin/staff
     */
    public function index(): JsonResponse
    {
        $staff = AdminUser::query()
            ->orderBy('name')
            ->get()
            ->map(fn (AdminUser $user) => $user->toApiArray());

        return $this->success($staff, ['count' => $staff->count()]);
    }

    /**
     * GET /api/v1/admin/staff/{staff}
     */
    public function show(AdminUser $staff): JsonResponse
    {
        return $this->success($staff->toApiArray());
    }

    /**
     * POST /api/v1/admin/staff
     */
    public function store(StoreStaffRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = AdminUser::query()->create([
            'id' => $data['id'] ?? 'staff-'.Str::lower(Str::random(8)),
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'phone' => $data['phone'] ?? null,
            'active' => $data['active'] ?? true,
            // Default demo password when none is supplied (documented in README).
            'password' => $data['password'] ?? 'password123',
        ]);

        $this->audit->logFromRequest($request, 'staff.created', null, ['staffId' => $user->id]);

        return $this->success($user->toApiArray(), [], 201);
    }

    /**
     * PUT|PATCH /api/v1/admin/staff/{staff}
     */
    public function update(UpdateStaffRequest $request, AdminUser $staff): JsonResponse
    {
        $data = $request->validated();

        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
        }

        $staff->fill($data)->save();

        $this->audit->logFromRequest($request, 'staff.updated', null, ['staffId' => $staff->id]);

        return $this->success($staff->refresh()->toApiArray());
    }

    /**
     * DELETE /api/v1/admin/staff/{staff}
     */
    public function destroy(Request $request, AdminUser $staff): JsonResponse
    {
        if ($request->user('api')?->id === $staff->id) {
            return $this->error('You cannot remove your own account.', 422);
        }

        $id = $staff->id;
        $staff->delete();

        $this->audit->logFromRequest($request, 'staff.deleted', null, ['staffId' => $id]);

        return $this->success(['deleted' => $id]);
    }

    /**
     * PUT|POST /api/v1/admin/staff/sync — bulk upsert (roster save).
     * Upserts the provided rows; never deletes existing users.
     */
    public function sync(Request $request): JsonResponse
    {
        $items = $request->input('staff') ?? $request->input('data') ?? $request->all();

        if (! is_array($items)) {
            return $this->error('Staff array payload is required', 422);
        }

        $synced = [];

        foreach ($items as $member) {
            if (! is_array($member) || empty($member['email'])) {
                continue;
            }

            $user = AdminUser::query()->find($member['id'] ?? '');

            $attributes = [
                'name' => $member['name'] ?? ($user->name ?? 'Staff'),
                'email' => $member['email'],
                'role' => $member['role'] ?? ($user->role ?? AdminUser::ROLE_LOAN_EXECUTIVE),
                'phone' => $member['phone'] ?? ($user->phone ?? null),
                'active' => (bool) ($member['active'] ?? true),
            ];

            if ($user) {
                $user->fill($attributes)->save();
            } else {
                $user = AdminUser::query()->create([
                    'id' => $member['id'] ?? 'staff-'.Str::lower(Str::random(8)),
                    'password' => $member['password'] ?? 'password123',
                ] + $attributes);
            }

            $synced[] = $user->toApiArray();
        }

        $this->audit->logFromRequest($request, 'staff.synced', null, ['count' => count($synced)]);

        return $this->success($synced, ['count' => count($synced)]);
    }
}
