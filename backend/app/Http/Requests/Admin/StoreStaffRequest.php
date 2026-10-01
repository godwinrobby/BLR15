<?php

namespace App\Http\Requests\Admin;

use App\Models\AdminUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStaffRequest extends FormRequest
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
        return [
            'id' => ['nullable', 'string', 'max:60'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:admin_users,email'],
            'role' => ['required', 'string', Rule::in([
                AdminUser::ROLE_SUPER_ADMIN,
                AdminUser::ROLE_ADMIN,
                AdminUser::ROLE_LOAN_EXECUTIVE,
            ])],
            'phone' => ['nullable', 'string', 'max:30'],
            'active' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', 'min:6'],
        ];
    }
}
