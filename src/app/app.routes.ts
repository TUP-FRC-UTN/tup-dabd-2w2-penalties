import { Routes } from '@angular/router';
import { FineDetailComponent } from './components/fine/fine-detail/fine-detail.component';
import { FineTable } from './components/fine/fine-table/fine-table.component';

export const routes: Routes = [
  {
    path: 'fine',
    component: FineTable,
  },
  { path: 'fine/:id', component: FineDetailComponent },
];
