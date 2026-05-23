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
    public function index(\Illuminate\Http\Request $request)
    {
        if ($request->user() && $request->user()->admin) {
            return Report::withoutGlobalScope('activa')->with(['images', 'reporter', 'reported'])->get();
        }
        return Report::with(['images', 'reporter', 'reported'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
        if ($request->user()->id == $request->reported_id) {
            return response()->json([
                'message' => 'No puedes reportarte a ti mismo.'
            ], 422);
        }

        $report = Report::create([
            'reported_id' => $request->reported_id,
            'reporter_id' => $request->user()->id,
            'description' => $request->description,
        ]);

        foreach ($request->file('images') ?? [] as $img) {
            $path = $img->store('images', 'public');

            $report->images()->create([
                'path' => $path,
            ]);
        }
        return response()->json($report->load([
            'images',
            'reporter',
        ]));
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $report = Report::withoutGlobalScope('activa')->findOrFail($id);
        return response()->json(
            $report->load(['reporter', 'reported', 'images'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRequest $request, $id)
    {
        $report = Report::withoutGlobalScope('activa')->findOrFail($id);
        
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
    public function destroy($id)
    {
        $report = Report::withoutGlobalScope('activa')->findOrFail($id);
        
        $report->update([
            'activa' => false,
        ]);

        return response()->json([
            'message' => 'Reporte eliminado'
        ], 200);
    }

    public function reactivate(\Illuminate\Http\Request $request, $id)
    {
        $report = Report::withoutGlobalScope('activa')->findOrFail($id);
        
        $report->update([
            'activa' => true,
        ]);

        return response()->json([
            'message' => 'Reporte reactivado'
        ], 200);
    }
}
