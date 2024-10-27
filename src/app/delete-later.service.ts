import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeleteLaterService {

  constructor() { }

  private black:boolean = false;

  change() {
    this.black = !this.black;
  }

  getBlack():boolean {
    return this.black;
  }
}
