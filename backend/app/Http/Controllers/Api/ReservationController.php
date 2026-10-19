<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Reservation::query()->with('offre.destination')->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $reservation = Reservation::create($request->validate([
            'offre_id' => ['required', 'integer', 'exists:offres,id'],
            'nom_client' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'telephone' => ['required', 'string', 'max:40'],
            'nombre_personnes' => ['required', 'integer', 'min:1', 'max:50'],
            'date_reservation' => ['required', 'date'],
        ]));

        return response()->json([
            'message' => 'Votre demande de réservation a bien été enregistrée.',
            'reservation' => $reservation->load('offre.destination'),
        ], 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json($reservation->load('offre.destination'));
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $reservation->update($request->validate([
            'offre_id' => ['sometimes', 'required', 'integer', 'exists:offres,id'],
            'nom_client' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'telephone' => ['sometimes', 'required', 'string', 'max:40'],
            'nombre_personnes' => ['sometimes', 'required', 'integer', 'min:1', 'max:50'],
            'date_reservation' => ['sometimes', 'required', 'date'],
        ]));

        return response()->json($reservation->refresh()->load('offre.destination'));
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->delete();

        return response()->json(null, 204);
    }
}
