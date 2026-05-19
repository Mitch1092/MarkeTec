<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Review::with(['images', 'reviewer', 'reviewed'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        if ($request->user()->id == $request->reviewed_id) {
            return response()->json([
                'message' => 'No puedes reseñarte a ti mismo.'
            ], 422);
        }
        
        $review = Review::create([
            'reviewed_id' => $request->reviewed_id,
            'reviewer_id' => $request->user()->id,
            'description' => $request->description,
            'score' => $request->score,
        ]);

        foreach ($request->file('images') ?? [] as $img) {
            $path = $img->store('images', 'public');

            $review->images()->create([
                'path' => $path,
            ]);
        }

        return response()->json($review->load([
            'images',
            'reviewer',
        ]));

        
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        return response()->json(
            $review->load(['user', 'images'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
         $request->validate([
            'description' => 'nullable|string',
            'score' => 'required|numeric|min:1|max:10',
            'images' => 'nullable|array',
            'images.*' => 'image|max:8192',
            'kept_images' => 'nullable|array',
            'kept_images.*' => 'integer|exists:images,id',
        ]);

        $data = $request->all();

        $review->update($data);

        $keptImages = $request->input('kept_images', []);
        
        $imagesToDelete = $review->images()->whereNotIn('id', $keptImages)->get();
        foreach ($imagesToDelete as $img) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($img->path);
            $img->delete();
        }

        foreach ($request->file('images') ?? [] as $img) {
            $path = $img->store('images', 'public');

            $review->images()->create([
                'path' => $path,
            ]);
        }

        return response()->json($review->load([
            'images',
            'reviewer',
        ]), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    { 
    $review->update([
        'activa' => false,
    ]);

    return response()->json([
        'message' => 'Reseña eliminada',
    ]);
    }
}
