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
    public function index()
    {
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
    public function show(Post $post)
    {
        return response()->json(
            $post->load(['user', 'images'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePostRequest $request, Post $post)
{
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
    public function destroy(Post $post)
    { 
    $post->update([
        'activa' => false,
    ]);

    return response()->json([
        'message' => 'Post eliminado',
    ]);
    }
}
