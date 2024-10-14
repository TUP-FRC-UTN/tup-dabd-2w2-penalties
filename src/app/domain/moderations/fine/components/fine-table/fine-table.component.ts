import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepicker,
  NgbHighlight,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NewFineModalComponent } from '../new-fine-modal/new-fine-modal.component';
import { FineService } from '../../services/fine.service';
import { Fine } from '../../models/fine.model';
import { MainContainerComponent } from "../../../../../shared/components/main-container/main-container.component";

@Component({
  selector: 'app-fine-table',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    NgbdSortableHeader,
    NgbPaginationModule,
    CommonModule,
    NgbDatepicker,
    NewFineModalComponent,
    MainContainerComponent
],
  templateUrl: './fine-table.component.html',
  providers: [FineService],
})
export class FineTable {
  successMessage: string | null = null;

  fines$: Observable<Fine[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;
  router = inject(Router);

  constructor(public service: FineService) {
    this.fines$ = service.fines$;
    this.total$ = service.total$;
  }
  onFineCreated(id: number) {
    this.successMessage = `Se creó la multa ${id}`;
    this.service._search$.next();

    // Limpia el mensaje después de 3 segundos
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  viewDetail(id: number) {
    this.router.navigate([`/fine/${id}`]);
  }
}
