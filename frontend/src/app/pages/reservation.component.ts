import { CommonModule, formatDate } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DatePickerDirective } from "../components/date-picker.directive";
import { Offre, ReservationPayload } from "../interfaces/models";
import { OffreService } from "../services/offre.service";
import { ReservationService } from "../services/reservation.service";

@Component({
  selector: "app-reservation",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePickerDirective],
  template: `
    <section class="booking page-section" id="reservation">
      <div class="booking-copy">
        <span class="section-kicker">✳ &nbsp; VOTRE PROCHAINE ÉTAPE</span>
        <h2>Demandez votre <i>réservation.</i></h2>
        <p>
          Envoyez votre demande ; l’agence vous recontactera pour confirmer les
          détails du séjour.
        </p>
        <a class="text-link" routerLink="/offres">← Retour aux offres</a>
      </div>
      <form
        class="booking-form"
        #bookingForm="ngForm"
        (ngSubmit)="submitReservation(bookingForm)"
        novalidate
      >
        <label
          >Offre choisie<select
            [(ngModel)]="reservation.offre_id"
            name="offre_id"
            required
            #offreId="ngModel"
          >
            <option [ngValue]="null" disabled>Choisir une offre</option>
            <option *ngFor="let offre of offres" [ngValue]="offre.id">
              {{ offre.titre }} — {{ offre.prix | number: "1.0-0" }} DH
            </option></select
          ><span class="field-error" *ngIf="offreId.invalid && offreId.touched"
            >Choisissez une offre.</span
          ></label
        >
        <div class="form-row">
          <label
            >Nom complet<input
              [(ngModel)]="reservation.nom_client"
              name="nom_client"
              required
              maxlength="255"
              autocomplete="name"
              #nom="ngModel"
            /><span class="field-error" *ngIf="nom.invalid && nom.touched"
              >Saisissez votre nom.</span
            ></label
          ><label
            >Adresse e-mail<input
              [(ngModel)]="reservation.email"
              name="reservation_email"
              required
              type="email"
              maxlength="255"
              autocomplete="email"
              #email="ngModel"
            /><span class="field-error" *ngIf="email.invalid && email.touched"
              >Saisissez une adresse e-mail valide.</span
            ></label
          >
        </div>
        <div class="form-row">
          <label
            >Téléphone<input
              [(ngModel)]="reservation.telephone"
              name="telephone"
              required
              type="tel"
              maxlength="40"
              autocomplete="tel"
              #telephone="ngModel"
            /><span
              class="field-error"
              *ngIf="telephone.invalid && telephone.touched"
              >Saisissez un numéro de téléphone.</span
            ></label
          ><label
            >Nombre de personnes<input
              [(ngModel)]="reservation.nombre_personnes"
              name="nombre_personnes"
              required
              type="number"
              min="1"
              max="50"
              #personnes="ngModel"
            /><span
              class="field-error"
              *ngIf="personnes.invalid && personnes.touched"
              >Indiquez entre 1 et 50 voyageurs.</span
            ></label
          >
        </div>
        <label
          >Date de réservation<input
            [(ngModel)]="reservation.date_reservation"
            name="date_reservation"
            required
            type="text"
            appDatePicker
            [maxDate]="today"
            placeholder="Choisir une date"
            aria-label="Date de réservation"
            #date="ngModel"
          /><span class="field-error" *ngIf="date.invalid && date.touched"
            >Choisissez une date valide qui n’est pas dans le futur.</span
          ></label
        >
        <p class="demo-alert" role="status" *ngIf="notice">{{ notice }}</p>
        <button
          class="primary form-submit"
          type="submit"
          [disabled]="bookingForm.invalid || sending || !offres.length"
        >
          {{ sending ? "Envoi…" : "Envoyer ma demande de réservation" }}
          <b>↗</b>
        </button>
      </form>
    </section>
  `,
})
export class ReservationComponent implements OnInit {
  private readonly offreService = inject(OffreService);
  private readonly reservationService = inject(ReservationService);
  private readonly route = inject(ActivatedRoute);
  offres: Offre[] = [];
  sending = false;
  notice = "";
  today = formatDate(new Date(), "yyyy-MM-dd", "fr-FR");
  reservation: ReservationPayload = this.emptyReservation();

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const offreId = Number(params.get("offre"));
      const people = Number(params.get("personnes"));
      if (Number.isInteger(offreId) && offreId > 0)
        this.reservation.offre_id = offreId;
      if (Number.isInteger(people) && people >= 1 && people <= 50)
        this.reservation.nombre_personnes = people;
    });
    this.offreService.getOffres().subscribe({
      next: (data) => (this.offres = data),
      error: () =>
        (this.notice =
          "Impossible de charger les offres. Vérifiez que le serveur Laravel fonctionne."),
    });
  }

  submitReservation(form: NgForm): void {
    if (!form.valid || this.reservation.offre_id === null || this.sending)
      return;
    this.sending = true;
    this.notice = "";
    this.reservationService.create(this.reservation).subscribe({
      next: (response) => {
        this.notice = response.message;
        this.reservation = this.emptyReservation();
        form.resetForm(this.reservation);
        this.sending = false;
      },
      error: (error: unknown) => {
        this.notice = this.errorMessage(error);
        this.sending = false;
      },
    });
  }

  private emptyReservation(): ReservationPayload {
    return {
      offre_id: null,
      nom_client: "",
      email: "",
      telephone: "",
      nombre_personnes: 2,
      date_reservation: this.todayDate(),
    };
  }
  private todayDate(): string {
    return formatDate(new Date(), "yyyy-MM-dd", "fr-FR");
  }
  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const first = Object.values(error.error?.errors ?? {}).flat()[0];
      return typeof first === "string"
        ? first
        : (error.error?.message ??
            "La demande n’a pas pu être envoyée. Vérifiez les champs et réessayez.");
    }
    return "Une erreur inattendue est survenue. Réessayez.";
  }
}
