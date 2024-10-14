import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  ConstructionRequestDto,
  ConstructionResponseDto,
  ConstructionUpdateStatusRequestDto,
} from '../models/construction.model';

@Injectable({
  providedIn: 'root',
})
export class ConstructionService {
  private apiUrl = 'http://localhost:8080/constructions';

  private itemsSubject = new BehaviorSubject<ConstructionResponseDto[]>([]);
  items$ = this.itemsSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  private readonly http = inject(HttpClient);

  getAllConstructions(
    page: number,
    limit: number
  ): Observable<{ items: ConstructionResponseDto[]; total: number }> {
    return this.http
      .get<any>(`${this.apiUrl}/pageable?page=${page - 1}&size=${limit}`)
      .pipe(
        map((data) => {
          const items = data.content || [];
          const total = data.totalElements || 0;
          return { items, total };
        })
      );
  }

  getConstructionById(
    id: number
  ): Observable<ConstructionResponseDto | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  registerConstruction(
    construction: ConstructionRequestDto
  ): Observable<ConstructionResponseDto> {
    return this.http
      .post<ConstructionResponseDto>(this.apiUrl, construction)
      .pipe(
        map((newItem) => {
          const updatedItems = [...this.itemsSubject.value, newItem];
          this.itemsSubject.next(updatedItems);
          return newItem;
        })
      );
  }

  updateConstructionStatus(
    updateStatusRequestDto: ConstructionUpdateStatusRequestDto
  ): Observable<ConstructionResponseDto> {
    return this.http.put<ConstructionResponseDto>(
      `${this.apiUrl}/status`,
      updateStatusRequestDto
    );
  }

  setItems(items: ConstructionResponseDto[]): void {
    this.itemsSubject.next(items);
  }

  setTotalItems(total: number): void {
    this.totalItemsSubject.next(total);
  }
}
