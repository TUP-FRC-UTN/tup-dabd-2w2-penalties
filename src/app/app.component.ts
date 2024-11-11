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
  private infractionService = inject(InfractionServiceService);

  navbarMenu: NavbarItem[] = [
    {
      label: 'Construcciones',
      sidebarMenu: [
        {
          label: 'Administración',
          subMenu: [
            {
              label: 'Obras',
              routerLink: '/constructions',
            },
          ],
        },
        {
          label: 'Reportes',
          subMenu: [
            {
              label: 'Gráficos de obras',
              routerLink: '/constructions-report',
            },
          ],
        },
      ],
    },
    {
      label: 'Moderación',
      sidebarMenu: [
        {
          label: 'Administración',
          subMenu: [
            { label: 'Multas', routerLink: '/fine' },
            { label: 'Infracciones', routerLink: '/infraction' },
            { label: 'Reclamos', routerLink: '/claim' },
            { label: 'Tipos de Sanciones', routerLink: '/sanctionType' },
          ],
        },
        {
          label: 'Reportes',
          subMenu: [
            { label: 'Gráficos de Multas', routerLink: '/fine-report' },
            { label: 'Gráficos de Infracciones', routerLink: '/infraction-report' },
            { label: 'Gráficos de Reclamos', routerLink: '/claim-report' },
          ],
        },
      ],
    },
    {
      label: 'Normas',
      sidebarMenu: [
        {
          label: 'Reglamento',
          routerLink: '/rules',
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.infractionService
    .getAllInfractions(1, 10000, )
    .subscribe((response) => {
      this.infractionService.setItems(response.items);
      this.infractionService.setTotalItems(response.total);

      const infractionsToSolve = response.items.filter(
        (item) => item.infraction_status.toString() === "CREATED"
      ).length;

      this.infractionBadgeService.updateInfractionsCount(infractionsToSolve);
    });

    this.infractionBadgeService.infractionsCount$.subscribe((count) => {
      const mainMenu = this.navbarMenu[1];
      const sidebarMenuItem = mainMenu?.sidebarMenu?.[0];
      const subMenuItem = sidebarMenuItem?.subMenu?.[1];

      if (count !== 0) {
        if (mainMenu) mainMenu.badge = count.toString();
        if (sidebarMenuItem) sidebarMenuItem.badge = count.toString();
        if (subMenuItem) subMenuItem.badge = count.toString();
      }
    });
  }
}