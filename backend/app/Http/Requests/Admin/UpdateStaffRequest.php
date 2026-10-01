<?php

namespace App\Http\Requests\Admin;

use App\Models\AdminUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $staffId = $this->route('staff') ?? $this->route('id');

        return [
            'name' => ['sometimes', 'string', 'max:120'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('admin_users', 'email')->ignore($staffId, 'id')],
            'role' => ['sometimes', 'string', Rule::in([
                AdminUser::ROLE_SUPER_ADMIN,
                AdminUser::ROLE_ADMIN,
                AdminUser::ROLE_LOAN_EXECUTIVE,
            ])],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'active' => ['sometimes', 'boolean'],
            'password' => ['sometimes', 'nullable', 'string', 'min:6'],
        ];
    }
}
