import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CustomNavBarComponent } from './shared/components/custom-nav-bar/custom-nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastsContainer } from "./shared/components/toast/toasts-container.component";
import { RoleSelectorComponent } from './shared/components/role-selector/role-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomNavBarComponent, RouterModule, HttpClientModule, ToastsContainer, RoleSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
