import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';

import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import {
  SortColumn,
  SortDirection,
} from '../components/fine/fine-table/sortable.directive';
import { Fine } from '../models/moderations/fine.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../models/moderations/page.model';
import { FineStatusEnum } from '../models/moderations/fineStatus.enum';
import { SanctionType } from '../models/moderations/sanctionType.model';
import { FineDTO } from '../models/moderations/fineDTO.model';

interface SearchResult {
  fines: Fine[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  searchState: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Injectable({ providedIn: 'root' })
export class FineService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  public _search$ = new Subject<void>();
  private _fines$ = new BehaviorSubject<Fine[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private apiUrl = 'http://localhost:8080';

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    searchState: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private http: HttpClient) {
    // Extraemos las claves del enumerado como un array tipado
    this.fineStatusKeys = Object.keys(FineStatusEnum) as Array<
      keyof typeof FineStatusEnum
    >;
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._fines$.next(result.fines);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  FineStatusEnum = FineStatusEnum;
  fineStatusKeys: string[] = [];

  get fines$() {
    return this._fines$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  get searchState() {
    return this._state.searchState;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set searchState(searchState: string) {
    this._set({ searchState });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  public clearFilters(): void {
    this.searchTerm = '';
    this.searchState = '';
    this.sortColumn = '';
    this.sortDirection = '';
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  public _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
      searchState,
    } = this._state;

    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', pageSize.toString());

    if (searchState !== '') {
      params = params.set('fineState', searchState);
    }

    console.log(params);

    return this.http
      .get<Page<Fine>>(`${this.apiUrl}/pageable/fine`, { params })
      .pipe(
        map((data) => {
          const result: SearchResult = {
            fines: data.content,
            total: data.totalElements,
          };
          return result;
        }),
        catchError((error) => {
          console.error('Error en la solicitud:', error);
          return of({ fines: [], total: 0 }); // Devuelve un objeto vacío en caso de error
        })
      );

    // return of({ fines: [], total: 0 });
  }

  getFineById(id: number) {
    return this.http.get<Fine>(`${this.apiUrl}/fine/${id}`);
  }

  createFine(fine: FineDTO): Observable<Fine> {
    return this.http.post<Fine>(`${this.apiUrl}/fine`, fine).pipe(
      catchError((error) => {
        // Puedes manejar el error aquí si lo deseas
        console.error('Error en la solicitud de creación de multa:', error);
        return throwError(() => new Error('Error en la creación de la multa')); // Lanzar el error
      })
    );
  }

  getValueByKeyForStatusEnum(value: string) {
    return Object.entries(FineStatusEnum).find(
      ([key, val]) => key === value
    )?.[1];
  }
}
