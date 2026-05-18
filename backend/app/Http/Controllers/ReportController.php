<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Report::with('images')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
        $report = $request ->user()->reports()->create([
            'description' => $request->description,
        ]);

        foreach ($request-file('images') ?? [] as $img) {
            $path = $img->store('images', 'public');

            $report->images()->create([
                'path' => $path,
            ]);
        }
        return response()->json($report->load('images'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        return response()->json(
            $report->load(['user', 'images'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRequest $request, Report $report)
    {
         $request->validate([
            'description' => 'required|string',
        ]);

        $data = $request->all();


        $report->update($data);

        return response()->json($report, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
         $report->delete();

        return response()->json([
            'message' => 'Reporte eliminado'
        ], 200);
    }
}
