import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Destination } from '../interfaces/models';
import { DestinationService } from '../services/destination.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="destinations-section page-section">
      <div class="section-kicker">✳ &nbsp; UN PAYS, MILLE HORIZONS</div>
      <div class="offers-head"><div><h2>Nos <i>destinations</i></h2><p class="section-subtitle">Des villes impériales aux grands espaces, trouvez votre prochaine escale.</p></div></div>
      <p class="demo-alert" role="alert" *ngIf="error">{{ error }}</p>
      <div class="destination-grid" *ngIf="destinations.length; else empty">
        <article class="destination-card" *ngFor="let destination of destinations">
          <div class="destination-image" [style.background-image]="'url(' + imageUrl(destination.image) + ')'" role="img" [attr.aria-label]="destination.nom"></div>
          <div class="destination-info"><small>{{ destination.ville }} · {{ destination.pays }}</small><h3>{{ destination.nom }}</h3><p>{{ destination.description }}</p><span class="price-hint">Dès {{ destination.prix | number:'1.0-0' }} DH</span></div>
        </article>
      </div>
      <ng-template #empty><p class="empty-state">{{ loading ? 'Chargement des destinations…' : 'Aucune destination à afficher.' }}</p></ng-template>
    </section>
  `,
})
export class DestinationsComponent implements OnInit {
  private readonly destinationService = inject(DestinationService);
  destinations: Destination[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe({
      next: data => { this.destinations = data; this.loading = false; },
      error: () => { this.error = 'L’API des destinations est indisponible. Démarrez Laravel et réessayez.'; this.loading = false; },
    });
  }

  imageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/morocco-hero.jpg';
    return path.startsWith('http://') || path.startsWith('https://') ? path : `/${path.replace(/^\//, '')}`;
  }
}
