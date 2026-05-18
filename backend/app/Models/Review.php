<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'title', 
        'description',
        'score',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }
}
