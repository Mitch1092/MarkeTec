<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [ 
        'description',
        'score',
        'reviewed_id',
        'reviewer_id',
        'activa',
    ];

    public function reviewed()
    {
        return $this->belongsTo(User::class, 'reviewed_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    protected static function booted()
    {
        static::addGlobalScope('activa', function (\Illuminate\Database\Eloquent\Builder $builder) {
            $builder->where('activa', true);
        });
    }
}
