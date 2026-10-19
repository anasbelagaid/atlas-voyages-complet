<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offre;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Offre::query()->with('destination')->orderBy('date_depart')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $offre = Offre::create($request->validate([
            'destination_id' => ['required', 'integer', 'exists:destinations,id'],
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'prix' => ['required', 'numeric', 'min:0'],
            'duree' => ['required', 'string', 'max:100'],
            'date_depart' => ['required', 'date'],
        ]));

        return response()->json($offre->load('destination'), 201);
    }

    public function show(Offre $offre): JsonResponse
    {
        return response()->json($offre->load('destination'));
    }

    public function update(Request $request, Offre $offre): JsonResponse
    {
        $offre->update($request->validate([
            'destination_id' => ['sometimes', 'required', 'integer', 'exists:destinations,id'],
            'titre' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'prix' => ['sometimes', 'required', 'numeric', 'min:0'],
            'duree' => ['sometimes', 'required', 'string', 'max:100'],
            'date_depart' => ['sometimes', 'required', 'date'],
        ]));

        return response()->json($offre->refresh()->load('destination'));
    }

    public function destroy(Offre $offre): JsonResponse
    {
        $offre->delete();

        return response()->json(null, 204);
    }
}
