<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Destination::query()->with('offres')->orderBy('nom')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $destination = Destination::create($request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'pays' => ['required', 'string', 'max:255'],
            'ville' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'prix' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'string', 'max:2048'],
        ]));

        return response()->json($destination, 201);
    }

    public function show(Destination $destination): JsonResponse
    {
        return response()->json($destination->load('offres'));
    }

    public function update(Request $request, Destination $destination): JsonResponse
    {
        $destination->update($request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'pays' => ['sometimes', 'required', 'string', 'max:255'],
            'ville' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'prix' => ['sometimes', 'required', 'numeric', 'min:0'],
            'image' => ['sometimes', 'nullable', 'string', 'max:2048'],
        ]));

        return response()->json($destination->refresh()->load('offres'));
    }

    public function destroy(Destination $destination): JsonResponse
    {
        $destination->delete();

        return response()->json(null, 204);
    }
}
