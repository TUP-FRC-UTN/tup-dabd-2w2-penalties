import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Rules} from "../../rules/rules";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationPenaltiesService {

  constructor() {
  }

  private httpMethods = inject(HttpClient)

  getDays(): Observable<number> {
    return this.httpMethods.get<number>(environment.moderationApiUrl + "/Configuration/appeal-days")
  }


  putDays(days: number, id: number): Observable<number> {

    const header = new HttpHeaders({
      'userId': id.toString(),
      'Content-Type': 'application/json'
    });

    return this.httpMethods.put<number>(environment.moderationApiUrl + `/Configuration/appeal-days?daysToAppeal=${days}`,
      null,
      {headers: header});
  }

  getRules(): Observable<Rules> {
    return this.httpMethods.get<Rules>(environment.moderationApiUrl + "/Configuration/rules")

  }

  putRules(rules: Rules, id: number): Observable<Rules> {
    const header = new HttpHeaders({
      'userId': id.toString(),
      'Content-Type': 'application/json'
    })

    return this.httpMethods.put<Rules>(
      environment.moderationApiUrl + "/Configuration/rules",
      rules,
      {headers: header}
    )


  }
}
