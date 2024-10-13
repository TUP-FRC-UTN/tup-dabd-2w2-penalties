import { Component, inject, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '../../services/construction.service';
import { CommonModule } from '@angular/common';
import { FormFieldsComponent } from '../../../../shared/components/form-fields/form-fields.component';
import { FormConfig } from '../../../../shared/components/form-fields/form-fields.model';

@Component({
  selector: 'app-construction-form',
  standalone: true,
  imports: [CommonModule, FormFieldsComponent],
  templateUrl: './construction-form.component.html',
  styleUrl: './construction-form.component.css',
})
export class ConstructionFormComponent {
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
        name: 'plot_id',
        label: 'Plot ID',
        type: 'number',
        validations: { required: true, min: 1 },
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        validations: { required: true },
      },
      {
        name: 'planned_start_date',
        label: 'Planned Start Date',
        type: 'date',
        validations: { required: true },
        fieldSpan: 1,
      },
      {
        name: 'planned_end_date',
        label: 'Planned End Date',
        type: 'date',
        validations: { required: true },
        fieldSpan: 1,
      },
      {
        name: 'project_name',
        label: 'Project Name',
        type: 'text',
        validations: { required: true, maxLength: 50 },
      },
      {
        name: 'project_address',
        label: 'Project Address',
        type: 'text',
        validations: { required: true, maxLength: 100 },
      },
    ],
  };

  onSubmit = (formValue: any): void => {
    this.constructionService.registerConstruction(formValue).subscribe(() => {
      this.activeModal.close();
    });
  };

  // In case you want to use the button outside the form
  // @ViewChild(FormFieldsComponent) formFieldsComponent!: FormFieldsComponent; line needed
  submitForm(): void {
    this.formFieldsComponent.submit();
  }
}
