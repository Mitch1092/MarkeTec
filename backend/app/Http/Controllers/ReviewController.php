<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Review::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
         $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'score' => 'required|decimal',
        ]);

        $review = Review::create([
            'title' => $request->title,
            'description' => $request->description,
            'score' => $request->score,
        ]);

        return response()->json($review, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
         return response()->json($review, 200);
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
