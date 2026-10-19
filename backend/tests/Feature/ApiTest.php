<?php

namespace Tests\Feature;

use App\Models\Destination;
use App\Models\Offre;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalogue_routes_return_destinations_and_offers(): void
    {
        $offre = $this->createOffer();

        $this->getJson('/api/destinations')
            ->assertOk()
            ->assertJsonPath('0.nom', 'Marrakech');

        $this->getJson('/api/offres')
            ->assertOk()
            ->assertJsonPath('0.titre', $offre->titre)
            ->assertJsonPath('0.destination.nom', 'Marrakech');
    }

    public function test_reservation_is_created_and_returns_a_success_message(): void
    {
        $offre = $this->createOffer();

        $this->postJson('/api/reservations', [
            'offre_id' => $offre->id,
            'nom_client' => 'Ahmed Exemple',
            'email' => 'ahmed@example.com',
            'telephone' => '0612345678',
            'nombre_personnes' => 2,
            'date_reservation' => '2026-11-15',
        ])->assertCreated()
            ->assertJsonPath('message', 'Votre demande de réservation a bien été enregistrée.')
            ->assertJsonPath('reservation.offre_id', $offre->id);

        $this->assertDatabaseHas('reservations', [
            'email' => 'ahmed@example.com',
            'nombre_personnes' => 2,
        ]);
    }

    public function test_reservation_validation_returns_json_errors(): void
    {
        $this->postJson('/api/reservations', [
            'offre_id' => 9999,
            'nom_client' => '',
            'email' => 'pas-une-adresse',
            'telephone' => '0612345678',
            'nombre_personnes' => 0,
            'date_reservation' => '2026-11-15',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['offre_id', 'nom_client', 'email', 'nombre_personnes']);
    }

    public function test_contact_is_saved_and_can_be_read_back(): void
    {
        $this->postJson('/api/contacts', [
            'nom' => 'Sara Exemple',
            'email' => 'sara@example.com',
            'sujet' => 'Séjour à Marrakech',
            'message' => 'Je souhaite recevoir des informations.',
        ])->assertCreated()
            ->assertJsonPath('contact.email', 'sara@example.com');

        $this->assertDatabaseHas('contacts', ['email' => 'sara@example.com']);
        $this->getJson('/api/contacts')->assertOk()->assertJsonPath('0.nom', 'Sara Exemple');
    }

    public function test_destination_can_be_created_updated_and_deleted(): void
    {
        $payload = [
            'nom' => 'Paris',
            'pays' => 'France',
            'ville' => 'Paris',
            'description' => 'La ville lumière.',
            'prix' => 2200,
            'image' => 'https://example.test/paris.jpg',
        ];

        $response = $this->postJson('/api/destinations', $payload)->assertCreated();
        $id = $response->json('id');

        $this->putJson('/api/destinations/'.$id, ['prix' => 2300])
            ->assertOk()
            ->assertJsonPath('prix', '2300.00');

        $this->deleteJson('/api/destinations/'.$id)->assertNoContent();
        $this->assertDatabaseMissing('destinations', ['id' => $id]);
    }

    private function createOffer(): Offre
    {
        $destination = Destination::create([
            'nom' => 'Marrakech',
            'pays' => 'Maroc',
            'ville' => 'Marrakech',
            'description' => 'La ville ocre.',
            'prix' => 1200,
            'image' => null,
        ]);

        return Offre::create([
            'destination_id' => $destination->id,
            'titre' => 'Escapade à Marrakech',
            'description' => 'Un séjour découverte.',
            'prix' => 2190,
            'duree' => '3 jours / 2 nuits',
            'date_depart' => '2027-03-15',
        ]);
    }
}
