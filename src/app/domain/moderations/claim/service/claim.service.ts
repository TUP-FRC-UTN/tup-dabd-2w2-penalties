import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InfractionDto} from "../../infraction/models/infraction.model";
import {Observable} from "rxjs";
import {ClaimNew} from "../models/claim.model";

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor() { }
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/claims'; // URL de la API

  createClaim(claim: ClaimNew): Observable<any> {
    return this.http.post(this.apiUrl, claim, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
