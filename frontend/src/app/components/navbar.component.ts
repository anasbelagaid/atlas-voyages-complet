import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/" (click)="closeMenu()" aria-label="Atlas Voyages, accueil">
        <span class="brand-icon">✳</span><span>atlas<span class="brand-light">voyages</span><small>LE MAROC, AUTREMENT</small></span>
      </a>
      <button class="menu" type="button" [attr.aria-expanded]="menuOpen" aria-controls="main-nav" (click)="menuOpen = !menuOpen" aria-label="Ouvrir ou fermer le menu">☰</button>
      <nav id="main-nav" aria-label="Navigation principale" [class.open]="menuOpen">
        <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="active" (click)="closeMenu()">Accueil</a>
        <a routerLink="/destinations" routerLinkActive="active" (click)="closeMenu()">Destinations</a>
        <a routerLink="/offres" routerLinkActive="active" (click)="closeMenu()">Nos offres</a>
        <a routerLink="/reservation" routerLinkActive="active" (click)="closeMenu()">Réserver</a>
        <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">Contact</a>
      </nav>
      <a class="contact" routerLink="/contact">Nous contacter <span>↗</span></a>
    </header>
  `,
})
export class NavbarComponent {
  menuOpen = false;
  closeMenu(): void { this.menuOpen = false; }
}
