import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NewInfractionModalComponent } from '../new-infraction-modal/new-infraction-modal.component';
import { TableColumn } from 'ngx-dabd-grup01';
import { FineService } from '../../../fine/services/fine.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InfractionDto } from '../../models/infraction.model';
import { InfractionServiceService } from '../../services/infraction-service.service';
import { MainContainerComponent, TableComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/public-api';

@Component({
  selector: 'app-infraction-list',
  standalone: true,
  imports: [
    CommonModule,
    NewInfractionModalComponent,
    MainContainerComponent,
    TableComponent,
  ],
  templateUrl: './infraction-list.component.html',
  styleUrl: './infraction-list.component.scss',
})
export class InfractionListComponent {
  // Services:
  private infractionService = inject(InfractionServiceService);
  private modalService = inject(NgbModal);

  // Properties:
  items$: Observable<InfractionDto[]> = this.infractionService.items$;
  totalItems$: Observable<number> = this.infractionService.totalItems$;
  isLoading$: Observable<boolean> = this.infractionService.isLoading$;

  page: number = 1;
  size: number = 10;
  searchParams: { [key: string]: string | string[] } = {};

  // Filtro dinámico
  filterType: string = '';

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngOnInit(): void {
    this.loadItems();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        { headerName: 'Alta', accessorKey: 'created_date' },
        { headerName: 'Descripción', accessorKey: 'description' },
        { headerName: "Multa", accessorKey: 'fine_id' },
        { headerName: "Estado", accessorKey: 'infraction_state' },
        { headerName: 'Lote', accessorKey: 'plot_id' },
        {
          headerName: 'Acciones',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  loadItems(): void {
    this.infractionService
      .getAllInfractions(this.page, this.size, this.searchParams)
      .subscribe((response) => {
        this.infractionService.setItems(response.items);
        this.infractionService.setTotalItems(response.total);
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
    const modalRef = this.modalService.open(NewInfractionModalComponent);
    modalRef.componentInstance.itemId = itemId;
  }

  setFilterType(type: string): void {
    this.filterType = type;
  }

  applyFilters(): void {
    this.page = 1;
    this.loadItems();
  }

  clearFilters(): void {
    this.filterType = '';
    this.searchParams = {};
    this.loadItems();
  }

  onInfoButtonClick() { 
    console.log("Info button clicked");
  }

  goToDetails(id: number) {

  }
}
