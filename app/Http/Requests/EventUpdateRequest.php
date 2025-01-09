<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
class EventUpdateRequest extends FormRequest
{
    /**
     * 
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * 
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_time' => 'required|date|after_or_equal:today',
            'end_time' => 'required|date|after:start_time',
            'location' => 'required|string|max:255',
            'image_path'=> 'nullable|image|mimes:jpg,jpeg,png|max:4000',
        ];
    }
   
}

