import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CustomNavBarComponent } from './shared/components/custom-nav-bar/custom-nav-bar.component';
import { RoleSelectorComponent } from './shared/components/role-selector/role-selector.component';
import { ToastsContainer } from 'ngx-dabd-grupo01';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BlackNavbarComponent } from './shared/components/black-navbar/black-navbar.component';
import { SidebarComponent } from '../../projects/ngx-dabd-grupo01/src/lib/sidebar/sidebar.component';
import { MainLayoutComponent } from '../../projects/ngx-dabd-grupo01/src/lib/main-layout/main-layout.component';
import { NavbarItem } from '../../projects/ngx-dabd-grupo01/src/lib/navbar/navbar.model';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    CustomNavBarComponent,
    RouterModule,
    ToastsContainer,
    RoleSelectorComponent,
    NgbDatepickerModule,
    BlackNavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  navbarMenu: NavbarItem[] = [
    {
      label: 'Obras',
      sidebarMenu: [
        {
          label: 'Obras',
          routerLink: '/constructions',
        },
      ],
    },
    {
      label: 'Multas',
      sidebarMenu: [
        {
          label: 'Multas',
          subMenu: [
            { label: 'Multas', routerLink: '/fine' },
            { label: 'Infracciones', routerLink: '/infraction' },
            { label: 'Reclamos', routerLink: '/claim' },
            { label: 'Tipos de Sanciones', routerLink: '/sanctionType' },
          ],
        },
      ],
    },
    {
      label: 'Configuración',
      subMenu: [
        { label: 'Usuarios', routerLink: '/user' },
        { label: 'Roles', routerLink: '/role' },
        { label: 'Lotes', routerLink: '/lot' },
      ],
    },
  ];

  ngOnInit(): void {
    if (
      this.navbarMenu[0]?.sidebarMenu &&
      this.navbarMenu[0].sidebarMenu[1] &&
      this.navbarMenu[0].sidebarMenu[1].subMenu
    ) {
      this.navbarMenu[0].badge = '2';
      this.navbarMenu[0].sidebarMenu[1].badge = '2';
      this.navbarMenu[0].sidebarMenu[1].subMenu[1].badge = '2';
    }
  }
}
