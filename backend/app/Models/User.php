<?php

namespace App\Models;

use App\Models\Post;
use App\Models\Report;
use App\Models\Review;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // 👈 ESTE es el correcto
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'ncontrol',
        'phone',
        'admin',
        'activa',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'reviewed_id');
    }

    public function reviewsWritten()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }
}