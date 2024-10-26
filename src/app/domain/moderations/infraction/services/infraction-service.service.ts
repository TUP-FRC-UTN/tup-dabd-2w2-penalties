import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InfractionDto } from '../models/infraction.model';
import { BehaviorSubject, finalize, map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InfractionServiceService {
  private apiUrl = `${environment.moderationApiUrl}/infractions`;

  private itemsSubject = new BehaviorSubject<InfractionDto[]>([]);
  items$ = this.itemsSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly http = inject(HttpClient);

  setItems(items: InfractionDto[]): void {
    this.itemsSubject.next(items);
  }

  setTotalItems(total: number): void {
    this.totalItemsSubject.next(total);
  }

  getAllInfractions(
    page: number,
    limit: number,
    searchParams: any = {}
  ): Observable<{ items: InfractionDto[]; total: number }> {
    this.isLoadingSubject.next(true); // Iniciar loading
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', limit.toString());

    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        params = params.set(key, searchParams[key]);
      }
    });

    return this.http.get<any>(`${this.apiUrl}/pageable`, { params }).pipe(
      map((data) => {
        const items = data.content || [];
        const total = data.totalElements || 0;
        return { items, total };
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createInfraction(infraction: InfractionDto): Observable<any> {
    return this.http.post(this.apiUrl, infraction, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
