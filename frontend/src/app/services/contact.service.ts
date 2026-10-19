import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSuccess, ContactPayload } from '../interfaces/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  create(payload: ContactPayload): Observable<ApiSuccess<ContactPayload>> {
    return this.http.post<ApiSuccess<ContactPayload>>(`${environment.apiUrl}/contacts`, payload);
  }
}
