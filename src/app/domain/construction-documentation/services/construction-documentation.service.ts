import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  throwError,
} from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ConstructionDocumentationTypeResponseDTO } from '../models/construction-documentation.model';
import {
  ConstructionDocResponseDto,
  ConstructionDocUpdateStatusRequestDto,
} from '../models/construction-doc.model';

@Injectable({
  providedIn: 'root',
})
export class ConstructionDocumentationService {
  private apiUrl = environment.constructionApiUrl;

  private documentationTypesSubject = new BehaviorSubject<
    ConstructionDocumentationTypeResponseDTO[]
  >([]);
  documentationTypes$ = this.documentationTypesSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly http = inject(HttpClient);

  private itemsSubject = new BehaviorSubject<ConstructionDocResponseDto[]>([]);
  items$ = this.itemsSubject.asObservable();

  updateConstructionDocStatus(
    updateStatusRequestDto: ConstructionDocUpdateStatusRequestDto
  ): Observable<ConstructionDocResponseDto> {
    return this.http.put<ConstructionDocResponseDto>(
      `${this.apiUrl}/constructions/documentation/status`,
      updateStatusRequestDto
    );
  }

  getAllDocumentationTypes(): Observable<
    ConstructionDocumentationTypeResponseDTO[]
  > {
    this.isLoadingSubject.next(true); // Iniciar loading

    return this.http
      .get<ConstructionDocumentationTypeResponseDTO[]>(
        `${this.apiUrl}/documentation-types`
      )
      .pipe(
        map((data) => {
          this.documentationTypesSubject.next(data);
          return data;
        }),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  uploadDocumentation(formData: any): Observable<any> {
    const form = new FormData();
    form.append('documentation_type_id', formData.documentation_type_id);
    form.append('construction_id', formData.construction_id);
    form.append('created_by', formData.created_by);
    form.append('file', formData.file);

    return this.http
      .post<any>(`${this.apiUrl}/constructions/documentation`, form)
      .pipe(
        map(
          (newDocumentation) => {
            return newDocumentation;
          },
          catchError((error) => {
            return throwError(
              () => new Error('Error en alta de documentacion')
            );
          })
        )
      );
  }

  downloadDocumentation(documentationId: number): void {
    const url = `${this.apiUrl}/constructions/documentation/${documentationId}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        this.downloadFile(response, `document_${documentationId}.pdf`);
      },
      error: (error) => {
        console.error('Download failed', error);
      },
    });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

}
