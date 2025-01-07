<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    /**
     * 
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
        'location',
        'image_path',
    ];

    /**
     * 
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     *
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * 
     *
     * @var string
     */
   
}
