import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';

import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { Fine } from '../models/fine.model';
import { FineStatusEnum } from '../models/fine-status.enum';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../../../../shared/models/page.model';
import { FineDTO } from '../models/fine-dto.model';
import { UpdateFineStateDTO } from '../models/update-fine-status-dto';
import {
  SortColumn,
  SortDirection,
} from '../components/fine-table/sortable.directive';
import * as XLSX from 'xlsx';


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
  dateFrom: any;
  dateTo: any;
}

@Injectable({ providedIn: 'root' })
export class FineService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  public _search$ = new Subject<void>();
  private _fines$ = new BehaviorSubject<Fine[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private fines: Fine[] = [];

  private apiUrl = 'http://localhost:8080';

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    searchState: '',
    sortColumn: '',
    sortDirection: '',
    dateFrom: null,
    dateTo: null,
  };

  constructor(private http: HttpClient) {
    // Extraemos las claves del enumerado como un array tipado
    this.fineStatusKeys = Object.keys(this.FineStatusEnum) as Array<
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

    this.fines$.subscribe((fines) => {
      this.fines = fines;
    });
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
  get dateFrom() {
    return this._state.dateFrom;
  }
  get dateTo() {
    return this._state.dateTo;
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

  set dateFrom(dateFrom: any) {
    this._set({ dateFrom });
  }
  set dateTo(dateTo: any) {
    this._set({ dateTo });
  }

  public clearFilters(): void {
    this.searchTerm = '';
    this.searchState = '';
    this.sortColumn = '';
    this.sortDirection = '';
    this.dateFrom = null;
    this.dateTo = null;
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
      dateFrom,
      dateTo,
    } = this._state;

    let params = new HttpParams()
      .set('page', (page - 1).toString())
      .set('size', pageSize.toString());

    if (searchState !== '') {
      params = params.set('fineState', searchState);
    }

    if (this.dateFrom) {
      const fromDate = `${this.dateFrom.year}-${this.dateFrom.month
        .toString()
        .padStart(2, '0')}-${this.dateFrom.day.toString().padStart(2, '0')}`;
      params = params.set('startDate', fromDate);
    }

    if (this.dateTo) {
      const toDate = `${this.dateTo.year}-${this.dateTo.month
        .toString()
        .padStart(2, '0')}-${this.dateTo.day.toString().padStart(2, '0')}`;
      params = params.set('endDate', toDate);
    }

    return this.http
      .get<Page<Fine>>(`${this.apiUrl}/fine/pageable`, { params })
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
  updateState(fine: UpdateFineStateDTO): Observable<Fine> {
    return this.http.put<Fine>(`${this.apiUrl}/fine/state`, fine).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de edición de multa:', error);
        return throwError(() => new Error('Error en la edición de la multa'));
      })
    );
  }

  getValueByKeyForStatusEnum(value: string) {
    return Object.entries(FineStatusEnum).find(
      ([key, val]) => key === value
    )?.[1];
  }

  onExportToExcel(): void {
    const fines = this.fineStatusKeys;
    const data = this.fines.map((fine) => {
      const sanctionType = fine.sanction_type;
      const infractions = fine.infractions;

      // Mapa la información para la exportación
      return {
        'ID Multa': fine.id,
        'Fecha de Creación': fine.created_date,
        'Estado de Multa': fine.fine_state,
        'Nombre Sanción': sanctionType.name,
        'Descripción Sanción': sanctionType.description,
        'Monto Sanción': sanctionType.amount,
        'ID Infracción':
          infractions.length > 0
            ? infractions.map((inf) => inf.id).join(', ')
            : 'N/A',
        'Descripción Infracción':
          infractions.length > 0
            ? infractions.map((inf) => inf.description).join(', ')
            : 'N/A',
      };
    });

    // Crea una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Agrega la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Fines');

    // Genera el archivo Excel
    XLSX.writeFile(wb, 'fines.xlsx');
  }
}
