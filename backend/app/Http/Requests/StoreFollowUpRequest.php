<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFollowUpRequest extends FormRequest
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
            'date' => ['required', 'string', 'max:30'],
            'time' => ['nullable', 'string', 'max:30'],
            'notes' => ['required', 'string'],
        ];
    }
}
