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

  ngOnInit(): void {
    this.workerService.message$.subscribe((message) => {
      if (message) {
        if (message.type === 'success') {
          this.successMessage = message.message;
          this.errorMessage = null;
        } else if (message.type === 'error') {
          this.errorMessage = message.message;
          this.successMessage = null;
        }
      } else {
        this.successMessage = null;
        this.errorMessage = null;
      }

      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    });
  }

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
      next: () => {
        this.activeModal.close();
      },
    });
  };

  submitForm(): void {
    this.formFieldsComponent.submit();
  }
}
