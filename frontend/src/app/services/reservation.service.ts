import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSuccess, ReservationPayload } from '../interfaces/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);

  create(payload: ReservationPayload): Observable<ApiSuccess<ReservationPayload>> {
    return this.http.post<ApiSuccess<ReservationPayload>>(`${environment.apiUrl}/reservations`, payload);
  }
}
