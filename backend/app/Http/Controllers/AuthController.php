<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $user = User::where('email', $request->email)->with(['reviewsReceived.reviewer', 'reviewsReceived.images'])->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}

    public function register(Request $request)
{
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'ncontrol' => 'required|unique:users',
        'phone' => 'required',
        'password' => 'required|min:6'
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'ncontrol' => $request->ncontrol,
        'phone' => $request->phone,
        'password' => bcrypt($request->password),
    ]);

    $user->load(['reviewsReceived.reviewer', 'reviewsReceived.images']);

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}

    public function me(Request $request)
    {
        return response()->json($request->user()->load(['reviewsReceived.reviewer', 'reviewsReceived.images']));
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout ok']);
    }
}