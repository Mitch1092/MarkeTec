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
        return Review::with('images')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        $review = Review::create([
            'reviewed_id' => $request->reviewed_id,
            'reviewer_id' => $request->user()->id,
            'description' => $request->description,
            'score' => $request->score,
        ]);

        if ($request->user()->id == $request->reviewed_id) {
            return response()->json([
                'message' => 'No puedes reseñarte a ti mismo.'
            ], 422);
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'score' => 'required|decimal',
        ]);

        $data = $request->all();


        $review->update($data);

        return response()->json($review, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
         $review->delete();

        return response()->json([
            'message' => 'Review eliminada'
        ], 200);
    }
}
