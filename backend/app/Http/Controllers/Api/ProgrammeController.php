<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ProgrammeController extends Controller
{
    /**
     * GET /api/programmes
     * Paramètres optionnels : volana_debut, volana_fin, mpanatanteraka, taona, search
     */
    public function index(Request $request): JsonResponse
    {
        $query = Programme::query();

        // Filtre par année
        if ($request->filled('taona')) {
            $query->byTaona($request->taona);
        }

        // Filtre mpanatanteraka
        if ($request->filled('mpanatanteraka')) {
            $query->byMpanatanteraka($request->mpanatanteraka);
        }

        // Filtre recherche globale (asa + mpanatanteraka + toerana)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('asa', 'like', "%{$search}%")
                  ->orWhere('mpanatanteraka', 'like', "%{$search}%")
                  ->orWhere('toerana', 'like', "%{$search}%");
            });
        }

        // Filtre plage de mois
        $volanaOrder = Programme::$volanaOrder;
        if ($request->filled('volana_debut')) {
            $startIdx = array_search($request->volana_debut, $volanaOrder);
            if ($startIdx !== false) {
                $validVolana = array_slice($volanaOrder, $startIdx);
                $query->whereIn('volana', $validVolana);
            }
        }
        if ($request->filled('volana_fin')) {
            $endIdx = array_search($request->volana_fin, $volanaOrder);
            if ($endIdx !== false) {
                $validVolana = array_slice($volanaOrder, 0, $endIdx + 1);
                $query->whereIn('volana', $validVolana);
            }
        }

        $programmes = $query->ordered()->get();

        return response()->json([
            'data' => $programmes,
            'total' => $programmes->count(),
        ]);
    }

    /**
     * POST /api/programmes
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'volana'          => 'required|string|in:' . implode(',', Programme::$volanaOrder),
                'daty'            => 'required|integer|min:1|max:31',
                'andro'           => 'nullable|string',
                'ora'             => 'nullable|string',
                'asa'             => 'required|string|max:500',
                'mpanatanteraka'  => 'nullable|string|max:200',
                'toerana'         => 'nullable|string|max:200',
                'taona'           => 'nullable|string|max:4',
            ]);

            $validated['taona'] = $validated['taona'] ?? date('Y');

            $programme = Programme::create($validated);

            return response()->json([
                'message' => 'Programme créé avec succès',
                'data'    => $programme,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * GET /api/programmes/{id}
     */
    public function show(Programme $programme): JsonResponse
    {
        return response()->json(['data' => $programme]);
    }

    /**
     * PUT /api/programmes/{id}
     */
    public function update(Request $request, Programme $programme): JsonResponse
    {
        try {
            $validated = $request->validate([
                'volana'          => 'required|string|in:' . implode(',', Programme::$volanaOrder),
                'daty'            => 'required|integer|min:1|max:31',
                'andro'           => 'nullable|string',
                'ora'             => 'nullable|string',
                'asa'             => 'required|string|max:500',
                'mpanatanteraka'  => 'nullable|string|max:200',
                'toerana'         => 'nullable|string|max:200',
                'taona'           => 'nullable|string|max:4',
            ]);

            $programme->update($validated);

            return response()->json([
                'message' => 'Programme mis à jour',
                'data'    => $programme->fresh(),
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Données invalides',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    /**
     * DELETE /api/programmes/{id}
     */
    public function destroy(Programme $programme): JsonResponse
    {
        $programme->delete();

        return response()->json([
            'message' => 'Programme supprimé',
        ]);
    }

    /**
     * POST /api/programmes/{id}/duplicate
     * Duplique avec la même date (Même date)
     */
    public function duplicate(Programme $programme): JsonResponse
    {
        $clone = $programme->replicate();
        $clone->asa = $programme->asa . ' (kopia)';
        $clone->mpanatanteraka = null;
        $clone->save();

        return response()->json([
            'message' => 'Programme dupliqué',
            'data'    => $clone,
        ], 201);
    }

    /**
     * GET /api/programmes/export/csv
     */
    public function exportCsv(Request $request)
    {
        $query = Programme::query();

        if ($request->filled('taona')) {
            $query->byTaona($request->taona);
        }
        if ($request->filled('volana_debut')) {
            $startIdx = array_search($request->volana_debut, Programme::$volanaOrder);
            if ($startIdx !== false) {
                $query->whereIn('volana', array_slice(Programme::$volanaOrder, $startIdx));
            }
        }

        $programmes = $query->ordered()->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="TVF-LaminAsa.csv"',
        ];

        $callback = function () use ($programmes) {
            $file = fopen('php://output', 'w');
            // BOM pour Excel
            fputs($file, "\xEF\xBB\xBF");
            fputcsv($file, ['Taona', 'Volana', 'Daty', 'Andro', 'Ora', 'Asa', 'Mpanatanteraka', 'Toerana']);
            foreach ($programmes as $p) {
                fputcsv($file, [
                    $p->taona, $p->volana, $p->daty, $p->andro,
                    $p->ora, $p->asa, $p->mpanatanteraka, $p->toerana,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}