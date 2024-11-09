import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import {
  NgbDatepicker,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbHighlight,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FineService } from '../../services/fine.service';
import { Fine } from '../../models/fine.model';
import {
  ConfirmAlertComponent,
  MainContainerComponent,
  ToastService,
} from 'ngx-dabd-grupo01';

import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { FineStatusEnum } from '../../models/fine-status.enum';
import { PdfService } from '../../../../../shared/services/pdf.service';
import { RoleService } from '../../../../../shared/services/role.service';
import {
  TableColumn,
  TableComponent,
} from '../../../../../../../projects/ngx-dabd-grupo01/src/public-api';

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
    CommonModule,
    TableComponent,
    GetValueByKeyForEnumPipe,
    NgbDropdownModule,
    FormsModule,
  ],
  templateUrl: './fine-table.component.html',
  providers: [FineService],
})
export class FineTable {
  @ViewChild('fineState') fineStateTemplate!: TemplateRef<any>;
  @ViewChild('fineDate') fineDateTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('pdfTemplate', { static: true }) pdfTemplate!: TemplateRef<any>;
  @ViewChild('sanctionType') sanctionType!: TemplateRef<any>;

  role: string = '';
  userId: number | undefined;
  userPlotsIds: number[] = [];

  columns: TableColumn[] = [];

  searchParams: { [key: string]: string | string[] | number[] | number } = {};
  searchSubject: Subject<{ key: string; value: any }> = new Subject();

  page: number = 1;
  size: number = 10;
  filterType: string = '';
  status: string = '';
  startDate: string = '';
  endDate: string = '';

  @ViewChildren(NgbdSortableHeader)
  headers!: QueryList<NgbdSortableHeader>;
  router = inject(Router);
  private = inject(NgbModal);
  FineStatusEnum = FineStatusEnum;
  private toastService = inject(ToastService);
  private pdfService = inject(PdfService);
  private roleService = inject(RoleService);
  fineService = inject(FineService);
  modalService = inject(NgbModal);

  items$: Observable<Fine[]> = this.fineService.items$;
  totalItems$: Observable<number> = this.fineService.totalItems$;
  isLoading$: Observable<boolean> = this.fineService.isLoading$;

  ngOnInit() {
    this.roleService.currentRole$.subscribe((role: string) => {
      this.role = role;
      this.loadItems();
    });
    this.roleService.currentUserId$.subscribe((userId: number) => {
      this.userId = userId;
      this.loadItems();
    });

    this.roleService.currentLotes$.subscribe((plots: number[]) => {
      this.userPlotsIds = plots;
      this.loadItems();
    });

    this.searchSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(({ key, value }) => {
        this.searchParams = { [key]: value };
        this.page = 1;
        this.loadItems();
      });

    this.loadItems();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Nº de multa', accessorKey: 'id' },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        {
          headerName: 'Tipo',
          accessorKey: 'sanction_type.name',
          cellRenderer: this.sanctionType,
        },
        {
          headerName: 'Estado',
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

  loadItems(): void {
    if (
      this.role === 'ADMIN' ||
      (this.role === 'OWNER' && this.userPlotsIds.length !== 0)
    ) {
      this.updateFiltersAccordingToUser();
      this.fineService
        .getPaginatedFines(this.page, this.size, this.searchParams)
        .subscribe((response) => {
          this.fineService.setItems(response.items);
          this.fineService.setTotalItems(response.total);
        });
    } else {
      this.fineService.setItems([]);
      this.fineService.setTotalItems(0);
    }
  }

  updateFiltersAccordingToUser() {
    if (this.role !== 'ADMIN') {
      this.searchParams = {
        ...this.searchParams,
        plotsIds: this.userPlotsIds,
      };
    } else {
      if (this.searchParams['plotsIds']) {
        delete this.searchParams['plotsIds'];
      }
    }
  }

  onFineCreated(id: number) {
    this.fineService._search$.next();
  }

  goToFineDetail(id: number) {
    this.router.navigate([`/fine/${id}/detail`]);
  }

  goToFineEdit(id: number) {
    this.router.navigate([`/fine/${id}/edit`]);
  }

  onPageChange = (page: number): void => {
    this.page = page;
    this.loadItems();
  };

  onPageSizeChange = (size: number): void => {
    this.size = size;
    this.loadItems();
  };

  onSearchValueChange = (key: string, searchValue: any): void => {
    this.searchSubject.next({ key, value: searchValue });
  };

  getAllFines = () => {
    return this.fineService.findAll();
  };

  applyFilters(): void {
    if (this.filterType === 'fecha') {
      this.searchParams = {
        startDate: this.startDate,
        endDate: this.endDate,
      };
    } else if (this.filterType === 'estado') {
      this.searchParams = { fineState: [this.status] };
    }
    this.page = 1;
    this.loadItems();
  }

  setFilterType(type: string): void {
    this.filterType = type;
  }

  clearFilters(): void {
    this.filterType = '';
    this.startDate = '';
    this.endDate = '';
    this.status = '';
    this.searchParams = {};
    this.loadItems();
  }

  infoModal() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertType = 'info';

    modalRef.componentInstance.alertTitle = 'Ayuda';
    modalRef.componentInstance.alertMessage = `Esta pantalla te permite consultar tanto los reclamos realizados como los recibidos. Además, proporciona al administrador las herramientas necesarias para gestionar estos reclamos y generar multas cuando sea necesario. La interfaz facilita la visualización y administración de los reclamos, asegurando un control efectivo en el proceso de sanciones.`;
  }
}
