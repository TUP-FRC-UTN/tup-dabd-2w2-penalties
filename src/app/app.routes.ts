import { Routes } from '@angular/router';
import { ConstructionListComponent } from './domain/construction/components/construction-list/construction-list.component';
import { ConstructionDetailComponent } from './domain/construction/components/construction-detail/construction-detail.component';
import { FineDetailComponent } from './domain/moderations/fine/components/fine-detail/fine-detail.component';
import { FineTable } from './domain/moderations/fine/components/fine-table/fine-table.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'constructions',
    pathMatch: 'full',
  },
  {
    path: 'constructions',
    component: ConstructionListComponent,
  },
  {
    path: 'constructions/:id',
    component: ConstructionDetailComponent,
  },
  {
    path: 'fine',
    component: FineTable,
  },
  { path: 'fine/:id', component: FineDetailComponent },
];
