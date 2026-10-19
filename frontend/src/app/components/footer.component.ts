import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer>
      <a class="brand footer-brand" routerLink="/" aria-label="Retour à l’accueil">
        <span class="brand-icon">✳</span><span>atlas<span class="brand-light">voyages</span><small>LE MAROC, AUTREMENT</small></span>
      </a>
      <span>Fait avec soin à Marrakech, Maroc</span>
      <span>© {{ currentYear }} Atlas Voyages</span>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
