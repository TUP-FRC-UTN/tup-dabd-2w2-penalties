export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email'
  | 'select'
  | 'checkbox';

export interface SelectOption {
  name: string;
  value: string;
}

export interface FormField {
  name: string;
  type: FormFieldType;
  options?: SelectOption[];
  label: string;
  validations?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  fieldSpan?: number;
}

export interface FormConfig {
  formColumns?: number;
  formType?: 'card' | 'inline';
  formTitle?: string;
  fields: FormField[];
}
