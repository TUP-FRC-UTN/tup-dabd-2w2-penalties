import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConstructionResponseDto } from '../../models/construction.model';
import { ConstructionFormComponent } from '../construction-form/construction-form.component';
import { ConstructionService } from '../../services/construction.service';
import { Router } from '@angular/router';
import {
  MainContainerComponent,
  TableColumn,
  TableComponent,
} from 'ngx-dabd-grupo01';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-construction-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TableComponent,
    MainContainerComponent,
    NgbDropdownModule,
  ],
  templateUrl: './construction-list.component.html',
  styleUrl: './construction-list.component.css',
})
export class ConstructionListComponent {
  // Services:
  private readonly router = inject(Router);

  private constructionService = inject(ConstructionService);
  private modalService = inject(NgbModal);

  // Properties:
  items$: Observable<ConstructionResponseDto[]> =
    this.constructionService.items$;
  totalItems$: Observable<number> = this.constructionService.totalItems$;
  isLoading$: Observable<boolean> = this.constructionService.isLoading$;

  page: number = 1;
  size: number = 10;
  searchParams: { [key: string]: string | string[] } = {};

  // Filtro dinámico
  filterType: string = '';
  startDate: string = '';
  endDate: string = '';
  status: string = '';

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngOnInit(): void {
    this.loadItems();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'construction_id' },
        { headerName: 'Descripción', accessorKey: 'project_description' },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        { headerName: 'Inicio', accessorKey: 'planned_start_date' },
        { headerName: 'Finalización', accessorKey: 'planned_end_date' },
        { headerName: 'Nombre', accessorKey: 'project_name' },
        { headerName: 'Dirección', accessorKey: 'project_address' },
        {
          headerName: 'Estado',
          accessorKey: 'construction_status',
        },
        {
          headerName: 'Acciones',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  loadItems(): void {
    this.constructionService
      .getAllConstructions(this.page, this.size, this.searchParams)
      .subscribe((response) => {
        this.constructionService.setItems(response.items);
        this.constructionService.setTotalItems(response.total);
      });
  }

  onPageChange = (page: number): void => {
    this.page = page;
    this.loadItems();
  };

  onPageSizeChange = (size: number): void => {
    this.size = size;
    this.loadItems();
  };

  onSearchValueChange = (searchValue: any): void => {
    this.searchParams = { searchValue };
    this.page = 1;
    this.loadItems();
  };

  openFormModal(itemId: number | null = null): void {
    const modalRef = this.modalService.open(ConstructionFormComponent);
    modalRef.componentInstance.itemId = itemId;
  }

  goToDetails = (id: number): void => {
    this.router.navigate(['constructions', id]);
  };

  setFilterType(type: string): void {
    this.filterType = type;
  }

  applyFilters(): void {
    if (this.filterType === 'fecha') {
      this.searchParams = {
        startDate: this.startDate,
        endDate: this.endDate,
      };
    } else if (this.filterType === 'estado') {
      this.searchParams = { constructionStatuses: [this.status] };
    }
    this.page = 1;
    this.loadItems();
  }

  clearFilters(): void {
    this.filterType = '';
    this.startDate = '';
    this.endDate = '';
    this.status = '';
    this.searchParams = {};
    this.loadItems();
  }
}
