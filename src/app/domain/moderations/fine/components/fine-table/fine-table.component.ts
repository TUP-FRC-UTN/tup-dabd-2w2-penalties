import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepicker,
  NgbDatepickerModule,
  NgbHighlight,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FineService } from '../../services/fine.service';
import { Fine } from '../../models/fine.model';
import {
  MainContainerComponent,
  TableColumn,
  TableComponent,
  ToastService,
} from 'ngx-dabd-grupo01';

import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { FineStatusEnum } from '../../models/fine-status.enum';
import { PdfService } from '../../../../../shared/services/pdf.service';

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
    MainContainerComponent,
    NgbDatepickerModule,
    TableComponent,
    GetValueByKeyForEnumPipe,
  ],
  templateUrl: './fine-table.component.html',
  providers: [FineService],
})
export class FineTable {
  @ViewChild('fineState') fineStateTemplate!: TemplateRef<any>;
  @ViewChild('fineDate') fineDateTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('pdfTemplate', { static: true }) pdfTemplate!: TemplateRef<any>;

  fines$: Observable<Fine[]>;
  total$: Observable<number>;

  columns: TableColumn[] = [];

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;
  router = inject(Router);
  private modalService = inject(NgbModal);
  FineStatusEnum = FineStatusEnum;
  private toastService = inject(ToastService);
  private pdfService = inject(PdfService);

  constructor(public service: FineService) {
    this.fines$ = service.fines$;
    this.total$ = service.total$;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        {
          headerName: 'Tipo',
          accessorKey: 'type',
          cellRenderer: this.fineStateTemplate,
        },
        {
          headerName: 'Alta',
          accessorKey: 'type',
          cellRenderer: this.fineDateTemplate,
        },
        {
          headerName: 'Acciones',
          accessorKey: 'type',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  onFineCreated(id: number) {
    this.service._search$.next();
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

  onPageChange = (page: number): void => {
    this.service.page = page;
  };

  onPageSizeChange = (size: number): void => {
    this.service.pageSize = size;
  };

  onSearchValueChange = (key: string, searchValue: any): void => {
    this.service.searchTerm = searchValue;
  };

  onExportToExcel = (): void => {
    try {
      this.service.onExportToExcel();
    } catch (error) {
      this.toastService.sendError('Sucedió un error al generar el excel');
    }
  };

  onExportToPdf(): void {
    const data = document.getElementById('pdf-template');
    if (data) this.pdfService.downloadPDF(data);
  }
}
