import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Destination } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/destinations`;

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.apiUrl);
  }
}
