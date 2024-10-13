import { Component, inject, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '../../../construction/services/construction.service';
import { FormFieldsComponent } from '../../../../shared/components/form-fields/form-fields.component';
import { FormConfig } from '../../../../shared/components/form-fields/form-fields.model';

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

  private constructionService = inject(ConstructionService);

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
        type: 'text',
        validations: { required: true },
        fieldSpan: 1,
      },
      {
        name: 'document',
        label: 'Document',
        type: 'text',
        validations: { required: true },
        fieldSpan: 1,
      },
      {
        name: 'worker_speciality_type',
        label: 'Worker Speciality',
        type: 'number',
        validations: { required: true },
      },
    ],
  };

  onSubmit = (formValue: any): void => {
    console.log(formValue);
  };

  submitForm(): void {
    this.formFieldsComponent.submit();
  }
}
