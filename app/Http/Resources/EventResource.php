<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public static $wrap = false;
    /**
     * 
     *
     * @param  \Illuminate\Http\Request  $request
     *  @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'start_time' => $this->start_time ,
            'end_time' => $this->end_time ,
            'location' => $this->location,
            'image_path' => $this->image_path ? url('storage/' . $this->image_path) : null,
            
        ];
    }
}
