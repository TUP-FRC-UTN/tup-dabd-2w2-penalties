import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SanctionType } from '../models/moderations/sanctionType.model';

@Injectable({
  providedIn: 'root',
})
export class SanctionTypeService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080';

  getSanctionTypes(name: string) {
    let params = new HttpParams();
    if (name !== '') {
      params = params.set('partialName', name);
    }

    return this.http.get<Array<SanctionType>>(`${this.apiUrl}/sanctionType`, {
      params,
    });
  }
}
