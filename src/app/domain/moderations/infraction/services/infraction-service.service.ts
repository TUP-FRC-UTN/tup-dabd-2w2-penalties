import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InfractionDto} from "../models/infraction.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InfractionServiceService {

  constructor() { }

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/infractions';



  createInfraction(infraction: InfractionDto): Observable<any> {
    return this.http.post(this.apiUrl, infraction, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
