import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactPayload } from '../interfaces/models';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="cta page-section contact-page" id="contact">
      <div class="cta-copy"><span>✳ &nbsp; UNE QUESTION ?</span><h2>Parlons de votre<br>prochain <i>voyage.</i></h2><p>Envoyez-nous un message, nous serons heureux de vous répondre.</p></div>
      <form class="contact-form" #contactForm="ngForm" (ngSubmit)="submitContact(contactForm)" novalidate>
        <label>Votre nom<input name="nom" [(ngModel)]="contact.nom" placeholder="Votre nom" required maxlength="255" autocomplete="name" #nom="ngModel"><span class="field-error" *ngIf="nom.invalid && nom.touched">Saisissez votre nom.</span></label>
        <label>Votre e-mail<input name="email" [(ngModel)]="contact.email" placeholder="Votre e-mail" type="email" required maxlength="255" autocomplete="email" #email="ngModel"><span class="field-error" *ngIf="email.invalid && email.touched">Saisissez une adresse e-mail valide.</span></label>
        <label>Sujet<input name="sujet" [(ngModel)]="contact.sujet" placeholder="Sujet de votre message" required maxlength="255" #sujet="ngModel"><span class="field-error" *ngIf="sujet.invalid && sujet.touched">Indiquez un sujet.</span></label>
        <label>Message<textarea name="message" [(ngModel)]="contact.message" placeholder="Votre message" required maxlength="5000" #message="ngModel"></textarea><span class="field-error" *ngIf="message.invalid && message.touched">Votre message est obligatoire.</span></label>
        <p class="demo-alert" role="status" *ngIf="notice">{{ notice }}</p>
        <button class="primary" type="submit" [disabled]="contactForm.invalid || sending">{{ sending ? 'Envoi…' : 'Envoyer mon message' }} <b>↗</b></button>
      </form>
    </section>
  `,
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  sending = false;
  notice = '';
  contact: ContactPayload = { nom: '', email: '', sujet: '', message: '' };

  submitContact(form: NgForm): void {
    if (!form.valid || this.sending) return;
    this.sending = true;
    this.notice = '';
    this.contactService.create(this.contact).subscribe({
      next: response => { this.notice = response.message; this.contact = { nom: '', email: '', sujet: '', message: '' }; form.resetForm(this.contact); this.sending = false; },
      error: (error: unknown) => { this.notice = this.errorMessage(error); this.sending = false; },
    });
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const first = Object.values(error.error?.errors ?? {}).flat()[0];
      return typeof first === 'string' ? first : error.error?.message ?? 'Le message n’a pas pu être envoyé. Vérifiez les champs et réessayez.';
    }
    return 'Une erreur inattendue est survenue. Réessayez.';
  }
}
