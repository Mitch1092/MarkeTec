<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'description',
        'reported_id',
        'reporter_id',
    ];

    public function reported()
    {
        return $this->belongsTo(User::class, 'reported_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }
}
