import { Routes } from '@angular/router';
import { FineDetailComponent } from './components/fine/fine-detail/fine-detail.component';
import { FineTable } from './components/fine/fine-table/fine-table.component';
import { FineComponent } from './components/fine/fine/fine.component';

export const routes: Routes = [
  {
    path: 'fine',
    component: FineComponent,
  },
  { path: 'fine/:id', component: FineDetailComponent },
];
