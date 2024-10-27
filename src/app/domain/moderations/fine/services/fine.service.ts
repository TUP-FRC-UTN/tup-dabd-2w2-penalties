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
import { environment } from '../../../../../environments/environment';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { ExcelExportService } from '../../../../../../projects/ngx-dabd-grupo01/src/lib/excel-service/excel.service';

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
  private excelService = inject(ExcelExportService);
  datePipe = inject(DatePipe)

  private _loading$ = new BehaviorSubject<boolean>(true);
  public _search$ = new Subject<void>();
  private _fines$ = new BehaviorSubject<Fine[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private apiUrl = environment.moderationApiUrl;

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
    let params = this.getParams();
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

  public findAll(): Observable<Fine[]> {
    const params = this.getParams();
    return this.http.get<Fine[]>(`${this.apiUrl}/fine`, { params }).pipe(
      map((data) => data),
      catchError((error) => {
        return throwError(
          () => new Error('Error fetching fines, please try again later.')
        );
      })
    );
  }

  getParams() {
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

    return params;
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

  downloadPdfDetail(fine: Fine) {
    const doc = new jsPDF();

    // Datos del formulario
    const formLabels = ['Lote:', 'Tipo:', 'Alta:', 'Estado:'];
    const formValues = [
      fine.plot_id.toString(),
      fine.sanction_type.name,
      this.datePipe.transform(fine.created_date, 'dd/MM/yyyy HH:mm'),
      this.getValueByKeyForStatusEnum(fine.fine_state),
    ];

    // Estilo del formulario
    const startX = 10;
    const startY = 20;
    const rowHeight = 10;
    const colWidth = 80;

    // Dibujar formulario
    formLabels.forEach((label, index) => {
      const x = startX + (index % 2) * colWidth;
      const y = startY + Math.floor(index / 2) * rowHeight;
      doc.text(label, x, y);
      if (formValues[index]) doc.text(formValues[index], x + 40, y); // Desplazamiento para el valor
    });

    // Separador
    doc.setLineWidth(0.5);
    doc.line(startX, startY + 30, 200, startY + 30); // Línea horizontal

    // Datos de la tabla de infracciones
    const headers = ['ID', 'Usuario', 'Fecha de Alta'];
    const infractions = [
      { id: 1, user: 'Juan', date: '01/01/2023' },
      { id: 2, user: 'Ana', date: '02/01/2023' },
      { id: 3, user: 'Luis', date: '03/01/2023' },
    ];

    // Estilo de la tabla
    const tableStartY = startY + 40;
    const tableRowHeight = 10;

    // Dibujar encabezados de la tabla
    headers.forEach((header, index) => {
      doc.text(header, startX + index * 60, tableStartY);
    });

    // Dibujar datos de infracciones
    infractions.forEach((infraction, rowIndex) => {
      doc.text(
        infraction.id.toString(),
        startX,
        tableStartY + (rowIndex + 1) * tableRowHeight
      );
      doc.text(
        infraction.user,
        startX + 60,
        tableStartY + (rowIndex + 1) * tableRowHeight
      );
      doc.text(
        infraction.date,
        startX + 120,
        tableStartY + (rowIndex + 1) * tableRowHeight
      );
    });

    // Guardar el PDF
    doc.save('infracciones.pdf');
  }

  onExportToExcel(): void {
    this.findAll().subscribe((fines) => {
      const columns = [
        { header: 'ID Multa', accessor: (fine: Fine) => fine.id },
        {
          header: 'Fecha de Creación',
          accessor: (fine: Fine) => fine.created_date,
        },
        { header: 'Lote', accessor: (fine: Fine) => fine.plot_id },
        { header: 'Tipo', accessor: (fine: Fine) => fine.sanction_type.name },
        {
          header: 'Estado de Multa',
          accessor: (fine: Fine) =>
            this.getValueByKeyForStatusEnum(fine.fine_state),
        },
        {
          header: 'ID Infracción',
          accessor: (fine: Fine) =>
            fine.infractions.length > 0
              ? fine.infractions.map((inf) => inf.id).join(', ')
              : 'N/A',
        },
      ];

      this.excelService.exportToExcel(fines, columns, 'multas', 'Multas');
    });
  }
}
