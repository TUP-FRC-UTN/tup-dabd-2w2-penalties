import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor() { }

  private httpMethods = inject(HttpClient)

  getDays():Observable<number> {
    return this.httpMethods.get<number>(environment.moderationApiUrl+"/Configuration/appeal-days")
  }

  putDays(days:number, id:number):Observable<number> {

    const header = new HttpHeaders({
      'userId': id.toString(),
      'Content-Type': 'application/json'});

    return this.httpMethods.put<number>(environment.moderationApiUrl+`/Configuration/appeal-days?daysToAppeal=${days}`,
      null,
      {headers: header});
  }
}
