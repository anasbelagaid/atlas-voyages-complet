<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Contact::query()->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $contact = Contact::create($request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'sujet' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]));

        return response()->json([
            'message' => 'Votre message a bien été enregistré. Notre équipe vous répondra bientôt.',
            'contact' => $contact,
        ], 201);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function update(Request $request, Contact $contact): JsonResponse
    {
        $contact->update($request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'sujet' => ['sometimes', 'required', 'string', 'max:255'],
            'message' => ['sometimes', 'required', 'string', 'max:5000'],
        ]));

        return response()->json($contact->refresh());
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json(null, 204);
    }
}
