import { Routes } from '@angular/router';
import { FineDetailComponent } from './components/fine/fine-detail/fine-detail.component';
import { FineComponent } from './components/fine/fine/fine.component';
import { ConstructionListComponent } from './domain/construction/components/construction-list/construction-list.component';
import { ConstructionDetailComponent } from './domain/construction/components/construction-detail/construction-detail.component';

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
    component: FineComponent,
  },
  { path: 'fine/:id', component: FineDetailComponent },
];
