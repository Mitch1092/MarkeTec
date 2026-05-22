<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Public routes (auth not required)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::get('/posts', [PostController::class, 'index']);
//Route::get('/posts/{post}', [PostController::class, 'index']);
/*
|--------------------------------------------------------------------------
| Protected routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('posts', PostController::class)->except(['index', 'store', 'show']);
    //Route::apiResource('posts/{post}', PostController::class)->except(['index', 'store']);

    // Posts protegidos
    Route::post('posts', [PostController::class, 'store']);
    Route::patch('/posts/{post}/reactivate', [PostController::class, 'reactivate']);

    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/reactivate', [UserController::class, 'reactivate']);

    Route::apiResource('reports', ReportController::class);
    Route::patch('/reports/{report}/reactivate', [ReportController::class, 'reactivate']);

    Route::apiResource('reviews', ReviewController::class);
    Route::patch('/reviews/{review}/reactivate', [ReviewController::class, 'reactivate']);

    Route::apiResource('images', ImageController::class);

    Route::get('/my-posts', function (Request $request) {
    return $request->user()
        ->posts()
        ->with(['images', 'user'])
        ->latest()
        ->get();
    });
    
});