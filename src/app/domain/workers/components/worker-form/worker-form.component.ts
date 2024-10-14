import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldsComponent } from '../../../../shared/components/form-fields/form-fields.component';
import { FormConfig } from '../../../../shared/components/form-fields/form-fields.model';
import { WorkerService } from '../../services/worker.service';
import { WorkerRequestDto } from '../../models/worker.model';
import { ToastService } from '../../../../shared/components/toast/toast-service';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [FormFieldsComponent],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.css',
})
export class WorkerFormComponent {
  // Inputs:
  @Input() constructionId: number | null = null;

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
        label: 'Name',
        type: 'text',
        validations: { required: true },
      },
      {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        validations: { required: true },
      },
      {
        name: 'contact',
        label: 'Contact',
        type: 'text',
        validations: { required: true },
        fieldSpan: 1,
      },
      {
        name: 'address',
        label: 'Address',
        type: 'text',
        validations: { required: true },
        fieldSpan: 1,
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
        label: 'Document',
        type: 'number',
        validations: { required: true, maxLength: 20 },
        fieldSpan: 1,
      },
    ],
  };

  onSubmit = (formValue: any): void => {
    console.log(formValue, this.constructionId);

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

    this.workerService.registerWorker(worker).subscribe({
      next: (result) => {
        this.activeModal.close();
        this.toastService.sendSuccess(`Se creó el trabajador ${result.id}`);
      },
      error: (error) => {
        this.toastService.sendError('Ocurrió un error al crear el trabajador');
      },
    });
  };

  submitForm(): void {
    this.formFieldsComponent.submit();
  }
}
