import { CommonModule, formatDate } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePickerDirective } from "../components/date-picker.directive";
import { Destination, Offre } from "../interfaces/models";
import { DestinationService } from "../services/destination.service";
import { OffreService } from "../services/offre.service";

@Component({
  selector: "app-offres",
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerDirective],
  template: `
    <section class="offers page-section">
      <div class="offers-head">
        <div>
          <div class="section-kicker">✳ &nbsp; LE MOMENT EST VENU</div>
          <h2>Nos coups de <i>cœur</i></h2>
          <p class="section-subtitle">
            Choisissez votre prochaine escapade au Maroc.
          </p>
        </div>
      </div>

      <form class="search offers-search" (ngSubmit)="applySearch()">
        <label class="search-control">
          <small>DESTINATION</small>
          <select
            [(ngModel)]="destinationFilter"
            name="destinationFilter"
            aria-label="Destination"
          >
            <option value="">Toutes les destinations</option>
            <option
              *ngFor="let destination of destinations"
              [value]="destination.id"
            >
              {{ destination.nom }}
            </option>
          </select>
        </label>
        <label class="search-control date-control">
          <small>VOTRE DÉPART</small>
          <input
            type="text"
            appDatePicker
            [(ngModel)]="departureFilter"
            name="departureFilter"
            [minDate]="today"
            aria-label="Date de départ"
            placeholder="Choisir la date"
          />
        </label>
        <label class="search-control date-control">
          <small>VOTRE RETOUR</small>
          <input
            type="text"
            appDatePicker
            [(ngModel)]="returnFilter"
            name="returnFilter"
            [minDate]="departureFilter || today"
            aria-label="Date de retour"
            placeholder="Choisir la date"
          />
        </label>
        <label class="search-control traveler-control">
          <small>VOYAGEURS</small>
          <select
            [(ngModel)]="travelerCount"
            name="travelerCount"
            aria-label="Nombre de voyageurs"
          >
            <option [ngValue]="1">1 personne</option>
            <option [ngValue]="2">2 personnes</option>
            <option [ngValue]="3">3 personnes</option>
            <option [ngValue]="4">4 personnes</option>
            <option [ngValue]="5">5 personnes et plus</option>
          </select>
        </label>
        <button class="search-btn" type="submit" [disabled]="dateRangeInvalid">
          Rechercher <span>↗</span>
        </button>
        <p class="search-error" role="alert" *ngIf="searchError">
          {{ searchError }}
        </p>
      </form>

      <p class="demo-alert" role="alert" *ngIf="error">{{ error }}</p>
      <div class="filter-row">
        <span
          >{{ filteredOffres.length }} offre{{
            filteredOffres.length === 1 ? "" : "s"
          }}
          disponible{{ filteredOffres.length === 1 ? "" : "s" }}</span
        >
        <button type="button" *ngIf="hasSearch" (click)="resetSearch()">
          Effacer les filtres
        </button>
      </div>
      <div class="trip-grid" *ngIf="filteredOffres.length; else empty">
        <article class="trip-card" *ngFor="let offre of filteredOffres">
          <div
            class="trip-image"
            [style.background-image]="
              'url(' + imageUrl(offre.destination?.image) + ')'
            "
          >
            <span class="trip-tag">{{
              offre.destination?.nom || "ATLAS VOYAGES"
            }}</span
            ><span class="duration">◷ &nbsp;{{ offre.duree }}</span>
          </div>
          <div class="trip-info">
            <small
              >✦ &nbsp;{{ offre.destination?.ville }},
              {{ offre.destination?.pays }}</small
            >
            <h3>{{ offre.titre }}</h3>
            <p>{{ offre.description }}</p>
            <div class="trip-meta">
              <span
                >Départ :
                <strong>{{
                  offre.date_depart | date: "longDate"
                }}</strong></span
              >
            </div>
            <div class="trip-bottom">
              <span
                >Dès <b>{{ offre.prix | number: "1.0-0" }} DH</b>
                <small>/ personne</small></span
              ><button
                type="button"
                (click)="reserve(offre)"
                aria-label="Réserver cette offre"
              >
                ↗
              </button>
            </div>
          </div>
        </article>
      </div>
      <ng-template #empty
        ><p class="empty-state">
          {{
            loading
              ? "Chargement des offres…"
              : "Aucune offre disponible pour ces critères."
          }}
        </p></ng-template
      >
    </section>
  `,
})
export class OffresComponent implements OnInit {
  private readonly destinationService = inject(DestinationService);
  private readonly offreService = inject(OffreService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  destinations: Destination[] = [];
  offres: Offre[] = [];
  loading = true;
  error = "";
  searchError = "";
  destinationFilter = "";
  departureFilter = "";
  returnFilter = "";
  travelerCount = 2;
  submitted = false;
  today = formatDate(new Date(), "yyyy-MM-dd", "fr-FR");

  get dateRangeInvalid(): boolean {
    return Boolean(
      this.departureFilter &&
        this.returnFilter &&
        this.returnFilter < this.departureFilter,
    );
  }

  get hasSearch(): boolean {
    return Boolean(
      this.submitted &&
        (this.destinationFilter || this.departureFilter || this.returnFilter),
    );
  }

  get filteredOffres(): Offre[] {
    if (!this.submitted) return this.offres;
    return this.offres.filter((offre) => {
      const offerDate = String(offre.date_depart).slice(0, 10);
      const matchesDestination =
        !this.destinationFilter ||
        offre.destination_id === Number(this.destinationFilter);
      const matchesStart =
        !this.departureFilter || offerDate >= this.departureFilter;
      const matchesEnd = !this.returnFilter || offerDate <= this.returnFilter;
      return matchesDestination && matchesStart && matchesEnd;
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.destinationFilter = params.get("destination") ?? "";
      this.departureFilter =
        params.get("dateDebut") ?? params.get("date") ?? "";
      this.returnFilter = params.get("dateFin") ?? "";
      const people = Number(params.get("personnes"));
      if (Number.isInteger(people) && people >= 1 && people <= 50)
        this.travelerCount = people;
      this.submitted = Boolean(
        this.destinationFilter || this.departureFilter || this.returnFilter,
      );
    });
    this.destinationService.getDestinations().subscribe({
      next: (data) => (this.destinations = data),
      error: () => (this.error = "Impossible de charger les destinations."),
    });
    this.offreService.getOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.loading = false;
      },
      error: () => {
        this.error =
          "L’API des offres est indisponible. Démarrez Laravel et réessayez.";
        this.loading = false;
      },
    });
  }

  applySearch(): void {
    if (this.dateRangeInvalid) {
      this.searchError = "La date de retour doit être après la date de départ.";
      return;
    }
    this.searchError = "";
    this.submitted = true;
  }

  resetSearch(): void {
    this.destinationFilter = "";
    this.departureFilter = "";
    this.returnFilter = "";
    this.travelerCount = 2;
    this.submitted = false;
    this.searchError = "";
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        destination: null,
        date: null,
        dateDebut: null,
        dateFin: null,
        personnes: null,
      },
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  reserve(offre: Offre): void {
    void this.router.navigate(["/reservation"], {
      queryParams: { offre: offre.id, personnes: this.travelerCount },
    });
  }

  imageUrl(path: string | null | undefined): string {
    if (!path) return "assets/morocco-hero.jpg";
    return path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `/${path.replace(/^\//, "")}`;
  }
}
