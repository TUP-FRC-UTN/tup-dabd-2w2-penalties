import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkerService } from '../../services/worker.service';
import { WorkerRequestDto, WorkerUpdateRequestDto } from '../../models/worker.model';
import {
  FormConfig,
  FormFieldsComponent,
  ToastService,
} from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [FormFieldsComponent],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.css',
})
export class WorkerFormComponent implements OnInit{
  // Inputs:
  @Input() constructionId: number | null = null;
  @Input() workerId: number | null = null;
  @Input() workerData: any | null = null;

  // Propiedades para el formulario
  address: string = '';
  cuil: string = '';
  document: string = '';
  last_name: string = '';
  name: string = '';

  @ViewChild(FormFieldsComponent) formFieldsComponent!: FormFieldsComponent;

  // Services:
  activeModal = inject(NgbActiveModal);

  private workerService = inject(WorkerService);
  private toastService = inject(ToastService);

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Properties:
  isButtonOutside: boolean = true;

  constructionFormConfig: FormConfig = {
    formColumns: 2,
    fields: [
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        validations: { required: true },
      },
      {
        name: 'last_name',
        label: 'Apellido',
        type: 'text',
        validations: { required: true },
      },
      {
        name: 'address',
        label: 'Direccion',
        type: 'text',
        validations: { required: true },
        fieldSpan: 2,
      },
      {
        name: 'cuil',
        label: 'Cuil',
        type: 'number',
        validations: { required: true, min: 10000000000, max: 99999999999 },
        fieldSpan: 1,
      },
      {
        name: 'document',
        label: 'Documento',
        type: 'number',
        validations: { required: true, maxLength: 20 },
        fieldSpan: 1,
      },
    ],
  };

  
  ngOnInit() {
    if (this.workerData) {
      this.address = this.workerData.address;
      this.cuil = this.workerData.cuil;
      this.document = this.workerData.document;
      this.last_name = this.workerData.last_name;
      this.name = this.workerData.name;
    }
  }

  onSubmit = (formValue: any): void => {
    const worker: WorkerRequestDto = {
      construction_id: this.constructionId!,
      address: formValue.address,
      contact: { contact_value: formValue.contact },
      cuil: formValue.cuil,
      document: formValue.document,
      last_name: formValue.last_name,
      name: formValue.name,
      created_by: 0,
    };

    const workerUpdate: WorkerUpdateRequestDto = {
      address: formValue.address,
      cuil: formValue.cuil,
      document: formValue.document,
      last_name: formValue.last_name,
      name: formValue.name
    };

    if (this.workerId) {
      this.workerService.updateWorkerLikeAdmin(this.workerId, workerUpdate).subscribe({
        next: (result) => {
          this.activeModal.close('updated');
          this.toastService.sendSuccess(`Se actualizo el trabajador ${result.id}`);
        },
        error: (err) => {
          this.toastService.sendError('Error al actualizar el trabajador');
          console.error(err);
        },
      });
    } else {
      this.workerService.registerWorker(worker).subscribe({
        next: (result) => {
          this.activeModal.close();
          this.toastService.sendSuccess(`Se creó el trabajador ${result.id}`);
        },
        error: (error) => {
          this.toastService.sendError('Ocurrió un error al crear el trabajador');
        },
      });
    }
  
  };

  submitForm(): void {
    this.formFieldsComponent.submit();
  }
}
