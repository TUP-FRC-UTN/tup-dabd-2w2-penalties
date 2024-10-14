import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConstructionResponseDto } from '../../models/construction.model';
import { ConstructionFormComponent } from '../construction-form/construction-form.component';
import { ConstructionService } from '../../services/construction.service';
import { Router } from '@angular/router';
import { TableColumn } from '../../../../shared/components/table/table.models';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { MainContainerComponent } from '../../../../shared/components/main-container/main-container.component';

@Component({
  selector: 'app-construction-list',
  standalone: true,
  imports: [CommonModule, TableComponent, MainContainerComponent],
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
  page: number = 1;
  size: number = 10;

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
        { headerName: 'Description', accessorKey: 'project_description' },
        { headerName: 'Plot Id', accessorKey: 'plot_id' },
        { headerName: 'Planned Start Date', accessorKey: 'planned_start_date' },
        { headerName: 'Planned End Date', accessorKey: 'planned_end_date' },
        { headerName: 'Project Name', accessorKey: 'project_name' },
        { headerName: 'Project Address', accessorKey: 'project_address' },
        {
          headerName: 'Construction Status',
          accessorKey: 'construction_status',
        },
        {
          headerName: 'Actions',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  loadItems(): void {
    this.constructionService
      .getAllConstructions(this.page, this.size)
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

  openFormModal(itemId: number | null = null): void {
    console.log({itemId});
    
    const modalRef = this.modalService.open(ConstructionFormComponent);
    modalRef.componentInstance.itemId = itemId;
  }

  goToDetails = (id: number): void => {
    this.router.navigate(['constructions', id]);
  }
}
