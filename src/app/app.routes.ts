import { Routes } from '@angular/router';
import { ConstructionListComponent } from './domain/construction/components/construction-list/construction-list.component';
import { ConstructionDetailComponent } from './domain/construction/components/construction-detail/construction-detail.component';
import { FineDetailComponent } from './domain/moderations/fine/components/fine-detail/fine-detail.component';
import { FineTable } from './domain/moderations/fine/components/fine-table/fine-table.component';
import { SanctionTypeListComponent } from './domain/moderations/sanction-type/components/sanction-type-list/sanction-type-list.component';
import { InfractionListComponent } from './domain/moderations/infraction/components/infraction-list/infraction-list.component';
import { ClaimListComponent } from './domain/moderations/claim/components/claim-list/claim-list.component';
import { SanctionTypeDetailComponent } from './domain/moderations/sanction-type/components/sanction-type-detail/sanction-type-detail.component';
import { ClaimDetailComponent } from './domain/moderations/claim/components/claim-detail/claim-detail.component';
import { InfractionDetailComponent } from './domain/moderations/infraction/components/infraction-detail/infraction-detail.component';

export const routes: Routes = [
  /*   {
    path: '',
    redirectTo: 'constructions',
    pathMatch: 'full',
  }, */
  {
    path: 'constructions',
    component: ConstructionListComponent,
  },
  {
    path: 'constructions/:id/:mode',
    component: ConstructionDetailComponent,
  },
  {
    path: 'fine',
    component: FineTable,
  },
  { path: 'fine/:id/:mode', component: FineDetailComponent },
  {
    path: 'sanctionType',
    component: SanctionTypeListComponent,
  },
  { path: 'sanctionType/:id', component: SanctionTypeDetailComponent },
  {
    path: 'infraction',
    component: InfractionListComponent,
  },
  {
    path: 'infraction/:id',
    component: InfractionDetailComponent,
  },
  {
    path: 'claim',
    component: ClaimListComponent,
  },
  { path: 'claim/:id/:mode', component: ClaimDetailComponent },
];
