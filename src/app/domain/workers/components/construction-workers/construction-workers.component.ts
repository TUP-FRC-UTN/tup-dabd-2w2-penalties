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

import { ToastsContainer } from '../../../../../../projects/ngx-dabd-grupo01/src/lib/toast/toasts-container.component';
import {
  ConfirmAlertComponent,
  TableColumn,
  TableComponent,
  ToastService,
} from 'ngx-dabd-grupo01';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-construction-workers',
  standalone: true,
  imports: [CommonModule, TableComponent, ToastsContainer],
  templateUrl: './construction-workers.component.html',
  styleUrl: './construction-workers.component.css',
})
export class ConstructionWorkersComponent implements AfterViewInit {
  // Inputs:
  @Input() workers: any[] = [];
  @Input() constructionId: number | undefined;

  // Services:

  private modalService = inject(NgbModal);
  private workerService = inject(WorkerService);
  private constructionService = inject(ConstructionService);
  toastService = inject(ToastService);

  // Properties:
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        { headerName: 'Contacto', accessorKey: 'contact' },
        { headerName: 'Dirección', accessorKey: 'address' },
        { headerName: 'Nombre', accessorKey: 'name' },
        { headerName: 'Apellido', accessorKey: 'last_name' },
        { headerName: 'Cuil', accessorKey: 'cuil' },
        { headerName: 'DNI', accessorKey: 'document' },
        {
          headerName: 'Especialidad',
          accessorKey: 'worker_speciality_type',
        },
        {
          headerName: 'Acciones',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  sendSuccess() {
    let worker = { id: 1 };
    this.toastService.sendError(
      `Worker with ID ${worker.id} was successfully unassigned.`
    );
  }

  openFormModal(): void {
    const modalRef = this.modalService.open(WorkerFormComponent);
    modalRef.componentInstance.constructionId = this.constructionId;
  }

  unAssignWorker(worker: any) {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Estás seguro de que deseas desasignar a ${worker.lastName}, ${worker.name} ?`;

    modalRef.result
      .then((result) => {
        if (result) {
          this.workerService.unAssignWorker(worker.id).subscribe({
            next: () => {
              this.workers = this.workers.filter((w) => w.id !== worker.id);
              this.toastService.sendSuccess(
                `Worker with ID ${worker.id} was successfully unassigned.`
              );
            },
            error: () => {
              console.error('Error al desasignar el trabajador');
            },
          });
        }
      })
      .catch(() => {
        console.log('Desasignación cancelada');
      });
  }
}
