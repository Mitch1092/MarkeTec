<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use App\Models\Report;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Report::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
         $request->validate([
            'description' => 'required|string',
        ]);

        $report = Report::create([
            'description' => $request->description,
        ]);

        return response()->json($report, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
         return response()->json($report, 200);
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
