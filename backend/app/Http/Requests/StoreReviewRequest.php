<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reviewed_id' => 'required|exists:users,id',
            'description' => 'nullable|string',
            'score' => 'required|numeric|min:1|max:10',
            'images' => 'nullable|array',
            'images.*' => 'image|max:8192',
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        logger($validator->errors()->toArray());
        parent::failedValidation($validator);
    }
}
