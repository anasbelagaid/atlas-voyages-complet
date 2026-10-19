# Démonstration du mini-projet Atlas Voyages

## Démarrage

1. Créer la base `agence_voyage` dans MySQL et configurer `backend/.env` à partir de `.env.example`.
2. Dans `backend/` : `composer install`, `php artisan key:generate`, `php artisan migrate --seed`, puis `php artisan serve`.
3. Dans `frontend/` : `npm ci`, puis `npm start`.
4. Ouvrir `http://localhost:4200`. Le proxy Angular relaie `/api` à Laravel sur `localhost:8000`.

## Parcours à présenter

- **Accueil** : montrer les nombres de destinations et d’offres, les cartes chargées depuis Laravel et le moteur de recherche (destination, dates aller/retour, voyageurs). Choisir une période puis lancer la recherche.
- **Destinations** : parcourir les destinations et vérifier les images, descriptions et prix issus de MySQL.
- **Nos offres** : vérifier que les filtres de destination et de dates sont repris ; filtrer par destination/plage de dates puis cliquer sur une offre pour ouvrir le formulaire de réservation.
- **Réserver** : vérifier que l’offre et le nombre de voyageurs sont préremplis ; saisir des données de test valides et envoyer la demande. Le message de confirmation apparaît dans l’interface.
- **Contact** : envoyer un message de test et vérifier le retour de confirmation.
- **Responsive** : réduire la fenêtre ou utiliser les captures de `verification/captures/mobile-home.png` pour montrer le menu mobile.

Ne saisissez que des coordonnées fictives durant la démonstration. La réservation est une demande de contact : aucune disponibilité ni aucun paiement ne sont traités.

## Vérification de l’API

Importer `postman/Atlas-Voyages.postman_collection.json` dans Postman, démarrer Laravel et lancer la collection dans le Runner. Elle couvre les listes et détails des destinations/offres, le CRUD d’une destination de test, la création/liste des réservations et l’envoi d’un message. Un test automatisé équivalent a été exécuté avec Newman : 10 requêtes, 13 assertions réussies. Le rapport est dans `verification/postman-newman-report.json`.

Pour vérifier les lignes sauvegardées dans MySQL après un envoi depuis l’interface :

```sql
SELECT * FROM reservations ORDER BY id DESC;
SELECT * FROM contacts ORDER BY id DESC;
```

Les images de `verification/captures/` montrent l’accueil, les destinations, les offres, la réservation, le contact et la version mobile.
