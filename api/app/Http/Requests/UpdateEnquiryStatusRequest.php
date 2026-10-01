<?php

namespace App\Http\Requests;

use App\Support\EnquiryStatuses;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEnquiryStatusRequest extends FormRequest
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
            'status' => ['required', 'string', 'max:60', Rule::in(EnquiryStatuses::all())],
            'note' => ['nullable', 'string'],
        ];
    }
}
