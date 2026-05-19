<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::with('reviewsReceived')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
         $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'ncontrol' => 'required|string|max:20|unique:users,ncontrol',
            'phone' => 'required|string|max:10',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'ncontrol' => $request->ncontrol,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user->load(
            'posts.images',  
            'reviewsReceived.reviewer',
            'reviewsReceived.images',
        ));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
         $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'ncontrol' => 'required|string|max:20|unique:users,ncontrol,' . $user->id,
            'phone' => 'required|string|max:10',
            'current_password' => 'required|string',
            'password' => 'nullable|min:6'
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'La contraseña actual es incorrecta.'], 403);
        }

        $data = $request->except('current_password');

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    { 
        $user->update([
            'activa' => false,
        ]);

        return response()->json([
            'message' => 'Usuario eliminado',
        ]);
    }

    public function reactivate(User $user)
    {
        $user->update([
            'activa' => true,
        ]);

        return response()->json([
            'message' => 'Usuario reactivado',
        ]);
    }
}
