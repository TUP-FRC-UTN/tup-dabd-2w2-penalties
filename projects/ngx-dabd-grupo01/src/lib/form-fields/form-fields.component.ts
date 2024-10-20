import { Component, inject, Input, OnInit } from '@angular/core';
import { FormConfig, FormField } from './form-fields.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-fields',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-fields.component.html',
  styleUrl: './form-fields.component.css',
})
export class FormFieldsComponent implements OnInit {
  // Inputs:
  @Input() formConfig!: FormConfig;
  @Input() onSubmit!: (formValue: any) => void;
  @Input() isButtonOutside: boolean = false;

  // Services:
  private formBuilder = inject(FormBuilder);

  // Properties:
  form!: FormGroup;

  // Methods
  ngOnInit(): void {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    const group: any = {};
    this.formConfig.fields.forEach((field) => {
      const control = this.formBuilder.control('', this.buildValidators(field));
      group[field.name] = control;
    });

    return this.formBuilder.group(group);
  }

  buildValidators(field: FormField) {
    const validators = [];
    if (field.validations?.required) {
      validators.push(Validators.required);
    }
    if (field.validations?.min) {
      validators.push(Validators.min(field.validations.min));
    }
    if (field.validations?.maxLength) {
      validators.push(Validators.maxLength(field.validations.maxLength));
    }
    if (field.validations?.pattern) {
      validators.push(Validators.pattern(field.validations.pattern));
    }

    return validators;
  }

  submit(): void {
    if (this.form.valid) {
      this.onSubmit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getFieldControl(fieldName: string) {
    return this.form.get(fieldName);
  }

  getFieldSpan(fieldSpan: number) {
    const formColumns = this.formConfig.formColumns!;
    const finalFieldSpan = fieldSpan > formColumns ? formColumns : fieldSpan;

    return (finalFieldSpan * 12) / formColumns;
  }
}
