export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email';

export interface FormField {
  name: string;
  type: FormFieldType;
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
