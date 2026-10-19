import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Offre } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class OffreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/offres`;

  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }
}
