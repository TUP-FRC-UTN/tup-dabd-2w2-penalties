import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { ConstructionDocResponseDto, ConstructionDocUpdateStatusRequestDto } from "../models/construction-doc.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ConstructionDocService {
  // private apiUrl = environment.constructionApiUrl;
  private apiUrl = 'http://localhost:8080/constructions';

  private itemsSubject = new BehaviorSubject<ConstructionDocResponseDto[]>([]);
  items$ = this.itemsSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly http = inject(HttpClient);

  updateConstructionDocStatus(
    updateStatusRequestDto: ConstructionDocUpdateStatusRequestDto
  ): Observable<ConstructionDocResponseDto> {
    return this.http.put<ConstructionDocResponseDto>(
      `${this.apiUrl}/documentation/status`,
      updateStatusRequestDto
    );
  }
}