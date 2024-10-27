import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InfractionDto } from '../../infraction/models/infraction.model';
import { BehaviorSubject, finalize, map, Observable } from 'rxjs';
import { ClaimDTO, ClaimNew } from '../models/claim.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private http = inject(HttpClient);
  private apiUrl = environment.moderationApiUrl; // URL de la API

  // private oneClaim = new BehaviorSubject<OneConstruction>(undefined);
  // oneClaim$ = this.oneClaim.asObservable();

  private itemsSubject = new BehaviorSubject<ClaimDTO[]>([]);
  items$ = this.itemsSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private oneClaim = new BehaviorSubject<ClaimDTO | undefined>(undefined);
  oneClaim$ = this.oneClaim.asObservable();

  setItems(items: ClaimDTO[]): void {
    this.itemsSubject.next(items);
  }

  setTotalItems(total: number): void {
    this.totalItemsSubject.next(total);
  }

  createClaim(claim: ClaimNew): Observable<any> {
    return this.http.post(`${this.apiUrl}/claims`, claim, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getPaginatedClaims(
    page: number,
    limit: number,
    searchParams: any = {}
  ): Observable<{ items: ClaimDTO[]; total: number }> {
    this.isLoadingSubject.next(true);
    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', limit.toString());

    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        params = params.set(key, searchParams[key]);
      }
    });

    return this.http
      .get<any>(`${this.apiUrl}/claims/pageable`, { params })
      .pipe(
        map((data) => {
          const items = data.content || [];
          const total = data.totalElements || 0;
          return { items, total };
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  getClaimById(id: number): Observable<ClaimDTO | undefined> {
    return this.http.get<ClaimDTO>(`${this.apiUrl}/claims/${id}`).pipe(
      map((oneClaim) => {
        this.oneClaim.next(oneClaim);
        return oneClaim;
      })
    );
  }
}
