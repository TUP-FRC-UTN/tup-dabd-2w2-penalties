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
import { FineReportsComponent } from './domain/moderations/fine/components/fine-reports/fine-reports.component';
import { InfractionReportsComponent } from './domain/moderations/infraction/components/infraction-reports/infraction-reports.component';
import { ConstructionReportComponent } from './domain/construction/components/construction-report/construction-report.component';
import { ClaimReportsComponent } from './domain/moderations/claim/components/claim-reports/claim-reports.component';

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
    path: 'constructions-report',
    component: ConstructionReportComponent,
  },
  {
    path: 'fine',
    component: FineTable,
  },
  {
    path: 'fine-report',
    component: FineReportsComponent,
  },
  { path: 'fine/:id/:mode', component: FineDetailComponent },
  {
    path: 'sanctionType',
    component: SanctionTypeListComponent,
  },
  { path: 'sanctionType/:id/:mode', component: SanctionTypeDetailComponent },
  {
    path: 'infraction',
    component: InfractionListComponent,
  },
  {
    path: 'infraction-report',
    component: InfractionReportsComponent,
  },
  {
    path: 'infraction/:id',
    component: InfractionDetailComponent,
  },
  {
    path: 'claim',
    component: ClaimListComponent,
  },
  {
    path: 'claim-report',
    component: ClaimReportsComponent,
  },
  { path: 'claim/:id/:mode', component: ClaimDetailComponent },
];
