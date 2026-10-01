<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestSmtpRequest extends FormRequest
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
            'host' => ['sometimes', 'string', 'max:255'],
            'port' => ['sometimes', 'integer', 'min:1', 'max:65535'],
            'secure' => ['sometimes', 'boolean'],
            'user' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pass' => ['sometimes', 'nullable', 'string', 'max:255'],
            'from' => ['sometimes', 'nullable', 'string', 'max:255'],
            'toEmail' => ['nullable', 'string', 'email', 'max:255'],
        ];
    }
}
