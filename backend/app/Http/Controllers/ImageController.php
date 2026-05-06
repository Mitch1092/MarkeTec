<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Models\Image;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Image::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('images', 'public');

        $image = Image::create([
            'path' => $path,
            'post_id' => $request->post_id,
        ]);

        return response()->json($image);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
         return response()->json($image, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image)
    {
         $request->validate([
            'path' => 'required|string',
        ]);

        $data = $request->all();


        $image->update($data);

        return response()->json($image, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
         $image->delete();

        return response()->json([
            'message' => 'Imagen eliminada'
        ], 200);
    }
}
