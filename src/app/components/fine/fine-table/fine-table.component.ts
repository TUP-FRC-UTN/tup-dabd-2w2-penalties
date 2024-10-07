import { AsyncPipe } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Fine } from '../../../models/moderations/fine.model';
import { FineService } from '../../../services/fine.service';

@Component({
  selector: 'app-fine-table',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    NgbdSortableHeader,
    NgbPaginationModule,
  ],
  templateUrl: './fine-table.component.html',
  providers: [FineService],
})
export class FineTable {
  fines$: Observable<Fine[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;
  router: any;

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
    console.log('boton apretados', id);
    console.log(this.fines$);
    this.router.navigate([`/fine/${id}`]);
  }
}
