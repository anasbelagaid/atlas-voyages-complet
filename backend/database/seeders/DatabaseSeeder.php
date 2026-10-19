<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Offre;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            ['nom' => 'Marrakech', 'pays' => 'Maroc', 'ville' => 'Marrakech', 'description' => 'La ville ocre, ses jardins, ses souks et ses riads.', 'prix' => 1200, 'image' => 'assets/morocco-city.webp'],
            ['nom' => 'Agafay', 'pays' => 'Maroc', 'ville' => 'Agafay', 'description' => 'Un désert de pierre aux portes de Marrakech, face aux montagnes de l’Atlas.', 'prix' => 1500, 'image' => 'assets/agafay.jpg'],
            ['nom' => 'Essaouira', 'pays' => 'Maroc', 'ville' => 'Essaouira', 'description' => 'Une cité portuaire lumineuse, ses remparts et ses plages atlantiques.', 'prix' => 1100, 'image' => 'assets/morocco-hero.jpg'],
            ['nom' => 'Merzouga', 'pays' => 'Maroc', 'ville' => 'Merzouga', 'description' => 'Les dunes du Sahara, les nuits étoilées et l’hospitalité du désert.', 'prix' => 1800, 'image' => 'assets/morocco-hero.jpg'],
            ['nom' => 'Agadir', 'pays' => 'Maroc', 'ville' => 'Agadir', 'description' => 'Le littoral atlantique, ses plages et son climat doux toute l’année.', 'prix' => 1300, 'image' => 'assets/agafay.jpg'],
        ];

        foreach ($destinations as $data) {
            Destination::updateOrCreate(['ville' => $data['ville']], $data);
        }

        $offres = [
            ['destination' => 'Marrakech', 'titre' => 'Marrakech, côté secret', 'description' => 'Trois jours entre riad de charme, médina et ateliers d’artisans.', 'prix' => 2190, 'duree' => '3 jours / 2 nuits', 'date_depart' => '2027-03-15'],
            ['destination' => 'Merzouga', 'titre' => 'Nuits dorées à Merzouga', 'description' => 'Une traversée du désert avec bivouac sous les étoiles.', 'prix' => 3290, 'duree' => '4 jours / 3 nuits', 'date_depart' => '2027-04-10'],
            ['destination' => 'Agafay', 'titre' => 'L’Atlas au grand air', 'description' => 'Villages berbères, vallées et grands horizons de l’Atlas.', 'prix' => 4890, 'duree' => '5 jours / 4 nuits', 'date_depart' => '2027-05-05'],
            ['destination' => 'Essaouira', 'titre' => 'Escapade iodée à Essaouira', 'description' => 'L’océan, les remparts et une médina où prendre le temps.', 'prix' => 2490, 'duree' => '3 jours / 2 nuits', 'date_depart' => '2027-06-20'],
            ['destination' => 'Agadir', 'titre' => 'L’Atlantique en douceur', 'description' => 'Un séjour côtier entre plage, marché et excursions dans l’arrière-pays.', 'prix' => 3790, 'duree' => '5 jours / 4 nuits', 'date_depart' => '2027-07-12'],
        ];

        foreach ($offres as $data) {
            $destination = Destination::where('ville', $data['destination'])->firstOrFail();
            Offre::updateOrCreate(
                ['titre' => $data['titre']],
                [
                    'destination_id' => $destination->id,
                    'description' => $data['description'],
                    'prix' => $data['prix'],
                    'duree' => $data['duree'],
                    'date_depart' => $data['date_depart'],
                ],
            );
        }
    }
}
