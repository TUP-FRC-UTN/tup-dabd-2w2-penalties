import {Component, inject} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CustomNavBarComponent } from './shared/components/custom-nav-bar/custom-nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { RoleSelectorComponent } from './shared/components/role-selector/role-selector.component';
import { ToastsContainer } from 'ngx-dabd-grupo01';

import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {BlackNavbarComponent} from "./shared/components/black-navbar/black-navbar.component";
import {DeleteLaterService} from "./delete-later.service";

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    CustomNavBarComponent,
    RouterModule,
    HttpClientModule,
    ToastsContainer,
    RoleSelectorComponent,
    NgbDatepickerModule,
    BlackNavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  black: boolean=false;

  protected changeService = inject(DeleteLaterService)


}
