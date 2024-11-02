import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { WorkerUpdateRequestDto } from '../../models/worker.model';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldsComponent } from '../../../../../../projects/ngx-dabd-grupo01/src/lib/form-fields/form-fields.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'ngx-dabd-grupo01';
import { InfractionServiceService } from '../../../moderations/infraction/services/infraction-service.service';
import { FormConfig } from '../../../../../../projects/ngx-dabd-grupo01/src/lib/form-fields/form-fields.model';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-update-worker',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './update-worker.component.html',
  styleUrl: './update-worker.component.scss'
})
export class UpdateWorkerComponent implements OnInit {

  @Input() workerId!: number;
  @Input() workerData!: {
    address: string;
    cuil: string;
    document: string;
    last_name: string;
    name: string;
  };

  private activeModal = inject(NgbActiveModal);
  private workerService = inject(WorkerService);
  toastService = inject(ToastService);

  updateData: WorkerUpdateRequestDto = {
    address: '',
    cuil: '',
    document: '',
    last_name: '',
    name: ''
  }

  ngOnInit() {

    if (this.workerData) {
      this.updateData = {
        address: this.workerData.address,
        cuil: this.workerData.cuil,
        document: this.workerData.document,
        last_name: this.workerData.last_name,
        name: this.workerData.name
      };
    }

  }

  updateWorker(): void {
    if (!this.workerId) {
      this.toastService.sendError('Error: ID de infracción no válido');
      return;
    }

    if (this.updateData.address && this.updateData.cuil && this.updateData.document 
      && this.updateData.last_name && this.updateData.name) {
      this.workerService.updateWorkerLikeAdmin(this.workerId, this.updateData)
        .subscribe({
          next: () => {
            this.toastService.sendSuccess('Trabajador actualizad exitosamente');
            this.activeModal.close(true);
          },
          error: () => {
            this.toastService.sendError('Error al actualizar el trabajador');
          }
        });
    }
  }

  dismiss(): void {
    this.activeModal.dismiss('Cross click');
  }

}

