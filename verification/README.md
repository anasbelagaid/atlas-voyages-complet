# Preuves de vérification

Les captures PNG de `captures/` ont été réalisées avec Chromium sur les routes Angular connectées à Laravel/MySQL : accueil, destinations, offres, réservation, contact, accueil mobile (390 × 844), calendrier français ouvert et résultats filtrés par destination/date. La feuille `frontend/src/styles.css` est versionnée et mise en forme pour consultation directe dans GitHub. L’accueil et la page des offres proposent une recherche avec destination, dates de départ/retour et voyageurs.

La vidéo [`demo-frontend.mp4`](demo-frontend.mp4) présente en 21 secondes le parcours Angular : calendrier, recherche filtrée, destinations, réservation préremplie et contact. Elle est sans audio.

Cinq images fixes extraites de cette vidéo sont disponibles dans `preview/` et intégrées au README principal afin de montrer directement les écrans du site sur la page du dépôt.

La collection `../postman/Atlas-Voyages.postman_collection.json` a été exécutée avec Newman contre l’API Laravel : **10 requêtes, 13 assertions, 0 échec**. Le résultat machine lisible est fourni dans `postman-newman-report.json`.

Le rapport Newman n’est pas une capture de l’interface Postman Desktop. Si le professeur exige une capture de Postman lui-même, importer la collection, la lancer dans le Runner de Postman et ajouter une capture du résultat à votre dossier de rapport. Ajoutez vos informations nominatives uniquement dans un rapport séparé si votre établissement le demande, et non dans ce dépôt public.
