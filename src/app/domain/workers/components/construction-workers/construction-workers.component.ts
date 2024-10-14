import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ConstructionService } from '../../../construction/services/construction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkerFormComponent } from '../worker-form/worker-form.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableColumn } from '../../../../shared/components/table/table.models';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-construction-workers',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './construction-workers.component.html',
  styleUrl: './construction-workers.component.css',
})
export class ConstructionWorkersComponent implements AfterViewInit {
  // Inputs:
  @Input() workers: any[] = [];
  @Input() constructionId: number | undefined;

  // Services:

  private modalService = inject(NgbModal);



  // Properties:
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  

  // Methods:


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        { headerName: 'Contact', accessorKey: 'contact' },
        { headerName: 'Address', accessorKey: 'address' },
        { headerName: 'Name', accessorKey: 'name' },
        { headerName: 'Last Name', accessorKey: 'last_name' },
        { headerName: 'Cuil', accessorKey: 'cuil' },
        { headerName: 'Document', accessorKey: 'document' },
        {
          headerName: 'Worker Speciality',
          accessorKey: 'worker_speciality_type',
        },
        {
          headerName: 'Actions',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  openFormModal(itemId: number | null = null): void {
    const modalRef = this.modalService.open(WorkerFormComponent);
    modalRef.componentInstance.constructionId = this.constructionId;
  }
}
