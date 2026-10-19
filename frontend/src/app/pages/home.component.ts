import { CommonModule, formatDate } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { DatePickerDirective } from "../components/date-picker.directive";
import { DestinationService } from "../services/destination.service";
import { OffreService } from "../services/offre.service";
import { Destination, Offre } from "../interfaces/models";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePickerDirective],
  template: `
    <section class="hero">
      <div class="hero-image"></div>
      <div class="hero-shade"></div>
      <div class="hero-content">
        <div class="eyebrow"><span></span> L’AUTHENTIQUE MAROC VOUS ATTEND</div>
        <h1>Il y a des voyages<br />qui changent <i>tout.</i></h1>
        <p>
          Des ruelles de Marrakech aux dunes du Sahara, vivez le Maroc au rythme
          de vos envies.
        </p>
        <a class="primary" routerLink="/offres"
          >Découvrir nos voyages <b>↗</b></a
        >
        <div class="hero-note">
          <strong>01</strong>
          <span>VOYAGES PENSÉS<br />POUR VOUS</span>
          <i></i>
          <span>LE MAROC<br />À VOTRE RYTHME</span>
        </div>
      </div>
      <div class="hero-side">
        31° 37′ N &nbsp; 7° 59′ W <span>— MARRAKECH, MAROC</span>
      </div>
      <div class="scroll">DÉFILER <span>↓</span></div>
    </section>

    <section
      class="search-wrap home-search-wrap"
      aria-label="Rechercher un voyage"
    >
      <form class="search home-search" (ngSubmit)="search()">
        <label class="search-control">
          <small>DESTINATION</small>
          <select
            [(ngModel)]="searchDestination"
            name="searchDestination"
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
            [(ngModel)]="departureFrom"
            name="departureFrom"
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
            [(ngModel)]="departureTo"
            name="departureTo"
            [minDate]="departureFrom || today"
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
        <p class="search-error" role="alert" *ngIf="dateRangeInvalid">
          La date de retour doit être après la date de départ.
        </p>
      </form>
    </section>

    <section class="intro">
      <div class="section-kicker">✳ &nbsp; LE GOÛT DE L’AILLEURS</div>
      <div class="intro-row">
        <h2>
          Le Maroc n’est pas<br />une destination.<br /><i
            >C’est une émotion.</i
          >
        </h2>
        <div class="intro-copy">
          <p>
            Un thé partagé dans un riad, le silence du désert au coucher du
            soleil, la lumière dorée sur l’Atlas. Nous créons des voyages qui
            vous ressemblent, jusque dans les détails.
          </p>
          <a routerLink="/destinations" class="text-link"
            >Explorer nos destinations <span>↗</span></a
          >
        </div>
      </div>
      <div class="stats">
        <div>
          <strong>{{ destinations.length }}<span>+</span></strong
          ><small>DESTINATIONS À EXPLORER</small>
        </div>
        <div>
          <strong>{{ offres.length }}<span>+</span></strong
          ><small>OFFRES DISPONIBLES</small>
        </div>
        <div class="stat-note">
          Des itinéraires choisis<br />avec soin, au Maroc.
        </div>
      </div>
      <p class="empty-state" *ngIf="error">{{ error }}</p>
    </section>

    <section class="offers">
      <div class="offers-head">
        <div>
          <div class="section-kicker">✳ &nbsp; LE MOMENT EST VENU</div>
          <h2>Nos coups de <i>cœur</i></h2>
        </div>
        <a class="text-link" routerLink="/offres"
          >Toutes les offres <span>↗</span></a
        >
      </div>
      <div class="trip-grid home-trips" *ngIf="offres.length; else noOffers">
        <article class="trip-card" *ngFor="let offre of offres.slice(0, 3)">
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
              ><a routerLink="/offres" aria-label="Découvrir cette offre">↗</a>
            </div>
          </div>
        </article>
      </div>
      <ng-template #noOffers
        ><p class="empty-state">
          {{ error || "Chargement des offres…" }}
        </p></ng-template
      >
    </section>

    <section class="quote">
      <div class="quote-image"></div>
      <div class="quote-text">
        <span class="section-kicker">✳ &nbsp; AU RYTHME DU DÉSERT</span>
        <div class="quote-mark">“</div>
        <blockquote>
          Le vrai voyage commence<br />là où la route <i>s’arrête.</i>
        </blockquote>
        <p>Une nuit sous les étoiles, au milieu des dunes de Merzouga.</p>
        <a class="primary" routerLink="/offres">Trouver mon voyage <b>↗</b></a>
      </div>
    </section>

    <section class="promise">
      <div class="section-kicker">
        ✳ &nbsp; LES PETITES ATTENTIONS FONT LES GRANDS VOYAGES
      </div>
      <h2>Vous rêvez. On s’occupe <i>du reste.</i></h2>
      <div class="promise-grid">
        <div>
          <span>01</span>
          <h3>Des séjours choisis</h3>
          <p>Des itinéraires pensés pour découvrir le Maroc à votre rythme.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Experts du Maroc</h3>
          <p>Des adresses choisies et des paysages qui méritent le détour.</p>
        </div>
        <div>
          <span>03</span>
          <h3>À vos côtés</h3>
          <p>
            Une équipe disponible pour répondre à vos questions et demandes.
          </p>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly destinationService = inject(DestinationService);
  private readonly offreService = inject(OffreService);
  private readonly router = inject(Router);

  destinations: Destination[] = [];
  offres: Offre[] = [];
  error = "";
  searchDestination = "";
  departureFrom = "";
  departureTo = "";
  travelerCount = 2;
  today = formatDate(new Date(), "yyyy-MM-dd", "fr-FR");

  get dateRangeInvalid(): boolean {
    return Boolean(
      this.departureFrom &&
        this.departureTo &&
        this.departureTo < this.departureFrom,
    );
  }

  ngOnInit(): void {
    this.destinationService.getDestinations().subscribe({
      next: (data) => (this.destinations = data),
      error: () =>
        (this.error =
          "Impossible de charger les destinations. Vérifiez que l’API Laravel est démarrée."),
    });
    this.offreService.getOffres().subscribe({
      next: (data) => (this.offres = data),
      error: () =>
        (this.error =
          "Impossible de charger les offres. Vérifiez que l’API Laravel est démarrée."),
    });
  }

  search(): void {
    if (this.dateRangeInvalid) return;
    void this.router.navigate(["/offres"], {
      queryParams: {
        destination: this.searchDestination || null,
        dateDebut: this.departureFrom || null,
        dateFin: this.departureTo || null,
        personnes: this.travelerCount,
      },
    });
  }

  imageUrl(path: string | null | undefined): string {
    if (!path) return "assets/morocco-hero.jpg";
    return path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `/${path.replace(/^\//, "")}`;
  }
}
