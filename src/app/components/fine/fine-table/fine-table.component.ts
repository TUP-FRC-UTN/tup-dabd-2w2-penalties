import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepicker,
  NgbHighlight,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Fine } from '../../../models/moderations/fine.model';
import { FineService } from '../../../services/fine.service';
import { Router } from '@angular/router';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { NewFineModalComponent } from "../new-fine-modal/new-fine-modal.component";

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
    NewFineModalComponent
],
  templateUrl: './fine-table.component.html',
  providers: [FineService],
})
export class FineTable {
  fines$: Observable<Fine[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;
  router = inject(Router);

  constructor(public service: FineService) {
    this.fines$ = service.fines$;
    this.total$ = service.total$;
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
