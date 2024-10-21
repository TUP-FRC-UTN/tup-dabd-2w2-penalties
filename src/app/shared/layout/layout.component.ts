import { Component } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';
import { CustomNavBarComponent } from "../components/custom-nav-bar/custom-nav-bar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CustomNavBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export default class LayoutComponent {
  userName: string = 'Usuario';
}
