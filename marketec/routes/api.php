<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductoController;
// use App\Http\Controllers\ProductoController;
use App\Http\Controllers\Auth\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function(){
//     Route::get('productos',[ProductoController::class, 'index']);

//     Route::post('productos',[ProductoController::class, 'store']);

//     Route::get('productos/{id}',[ProductoController::class, 'show']);

//     Route::put('productos/{id}',[ProductoController::class, 'update']);

//     Route::delete('productos/{id}',[ProductoController::class, 'destroy']);
// });

Route::middleware('auth:sanctum')->group(function(){
    Route::apiResource('productos', ProductoController::class);
});

Route::post('login',[AuthController::class, 'login']);