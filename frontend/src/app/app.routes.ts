import { Routes } from '@angular/router';
import { ContactComponent } from './pages/contact.component';
import { DestinationsComponent } from './pages/destinations.component';
import { HomeComponent } from './pages/home.component';
import { OffresComponent } from './pages/offres.component';
import { ReservationComponent } from './pages/reservation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil | Atlas Voyages' },
  { path: 'destinations', component: DestinationsComponent, title: 'Destinations | Atlas Voyages' },
  { path: 'offres', component: OffresComponent, title: 'Offres de voyage | Atlas Voyages' },
  { path: 'reservation', component: ReservationComponent, title: 'Réservation | Atlas Voyages' },
  { path: 'contact', component: ContactComponent, title: 'Contact | Atlas Voyages' },
  { path: '**', redirectTo: '' },
];
