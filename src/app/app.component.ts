import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CustomNavBarComponent } from './shared/components/custom-nav-bar/custom-nav-bar.component';
import { RoleSelectorComponent } from './shared/components/role-selector/role-selector.component';
import { ToastsContainer } from 'ngx-dabd-grupo01';

import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BlackNavbarComponent } from './shared/components/black-navbar/black-navbar.component';
import { SidebarComponent } from '../../projects/ngx-dabd-grupo01/src/lib/sidebar/sidebar.component';
import { MainLayoutComponent } from '../../projects/ngx-dabd-grupo01/src/lib/main-layout/main-layout.component';
import { NavbarItem } from '../../projects/ngx-dabd-grupo01/src/lib/navbar/navbar.model';
import { InfractionServiceService } from './domain/moderations/infraction/services/infraction-service.service';
import { InfractionStatusEnum } from './domain/moderations/infraction/models/infraction.model';
import { InfractionBadgeService } from './domain/moderations/infraction/services/infraction-badge.service';

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
  private infractionBadgeService = inject(InfractionBadgeService);

  navbarMenu: NavbarItem[] = [
    {
      label: 'Obras & Multas',
      sidebarMenu: [
        {
          label: 'Obras',
          routerLink: '/constructions',
        },
        {
          label: 'Moderación',
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
    // Escucha el cambio en el conteo de infracciones
    this.infractionBadgeService.infractionsCount$.subscribe((count) => {
      const mainMenu = this.navbarMenu[0];
      const sidebarMenuItem = mainMenu?.sidebarMenu?.[1];
      const subMenuItem = sidebarMenuItem?.subMenu?.[1];

      if (count !== 0) {
        if (mainMenu) mainMenu.badge = count.toString();
        if (sidebarMenuItem) sidebarMenuItem.badge = count.toString();
        if (subMenuItem) subMenuItem.badge = count.toString();
      }
    });
  }
}
