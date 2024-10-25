import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CustomNavBarComponent } from './shared/components/custom-nav-bar/custom-nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { RoleSelectorComponent } from './shared/components/role-selector/role-selector.component';
import { ToastsContainer } from '../../projects/ngx-dabd-grupo01/src/lib/toast/toasts-container.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
