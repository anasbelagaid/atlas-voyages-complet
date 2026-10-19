import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
}).catch((error: unknown) => console.error(error));
