<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request)
    {
        if ($request->user() && $request->user()->admin) {
            return Post::withoutGlobalScope('activa')->with('images')->get();
        }
        return Post::with('images')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(StorePostRequest $request){
    //     // logger('STORE HIT');
    //     // logger($request->all());
    //     // logger($request->user());
        
    //     $post = $request->user()->posts()->create([
    //         'title' => $request->title,
    //         'description' => $request->description,
    //         'venta' => filter_var($request->venta, FILTER_VALIDATE_BOOLEAN),
    //         'price' => $request->venta ? $request->price : 0,
    //     ]);

    //     $images = $request->file('images', []);
    //     foreach ($images as $img) {
    //         $path = $img->store('images', 'public');

    //             $post->images()->create([
    //                 'path' => $path,
    //             ]);
    //     // if ($request->hasFile('images')) {
    //     //     foreach ($request->file('images') as $img) {
    //     //         $path = $img->store('images', 'public');

    //     //         $post->images()->create([
    //     //             'path' => $path,
    //     //         ]);
    //         }
    //     // logger('STORE HIT');
    //     // logger($request->all());
    //     // logger($request->user());
    //     // logger($request->all());
    //     return response()->json($post->load('images'));
    // }


    public function store(StorePostRequest $request)
    {

        $post = $request->user()->posts()->create([
            'title' => $request->title,
            'description' => $request->description,
            'venta' => $request->boolean('venta'),
            'price' => $request->boolean('venta') ? $request->price : 0,
        ]);

        foreach ($request->file('images') ?? [] as $img) {
            $path = $img->store('images', 'public');

            $post->images()->create([
                'path' => $path,
            ]);
        }

        return response()->json($post->load('images'));
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $post = Post::withoutGlobalScope('activa')->findOrFail($id);
        return response()->json(
            $post->load(['user', 'images'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePostRequest $request, $id)
{
    $post = Post::withoutGlobalScope('activa')->findOrFail($id);
    $post->update([
        'title' => $request->title,
        'description' => $request->description,
        'venta' => $request->boolean('venta'),
        'price' => $request->boolean('venta')
            ? $request->price
            : 0,
    ]);

    $keptImages = $request->input('kept_images', []);
        
    $imagesToDelete = $post->images()->whereNotIn('id', $keptImages)->get();
    foreach ($imagesToDelete as $img) {
        \Illuminate\Support\Facades\Storage::disk('public')->delete($img->path);
        $img->delete();
    }

    foreach ($request->file('images') ?? [] as $img) {
        $path = $img->store('images', 'public');

        $post->images()->create([
            'path' => $path,
        ]);
    }

    return response()->json($post->load('images'));
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    { 
        $post = Post::withoutGlobalScope('activa')->findOrFail($id);
        $post->update([
            'activa' => false,
        ]);

    return response()->json([
        'message' => 'Post eliminado',
    ]);
    }

    public function reactivate(\Illuminate\Http\Request $request, $id)
    { 
        $post = Post::withoutGlobalScope('activa')->findOrFail($id);
        $post->update([
            'activa' => true,
        ]);

        return response()->json([
            'message' => 'Post reactivado',
        ]);
    }
}
