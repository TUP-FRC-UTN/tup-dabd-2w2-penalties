export type FilterType =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'radio';

type DateFormat =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'shortDate'
  | 'mediumDate'
  | 'longDate'
  | 'fullDate'
  | 'shortTime'
  | 'mediumTime'
  | 'longTime'
  | 'fullTime'
  | 'yyyy-MM-dd'
  | 'MM/dd/yyyy'
  | 'dd-MM-yyyy'
  | "yyyy-MM-dd'T'HH:mm:ss"
  | 'yyyy-MM-ddTHH:mm:ss.SSSZ';

export interface FilterOption {
  value: string;
  label: string;
}

export class Filter {
  label: string;
  type: FilterType;
  key: string;
  placeholder?: string;

  constructor(
    label: string,
    type: FilterType,
    key: string,
    placeholder?: string
  ) {
    this.label = label;
    this.type = type;
    this.key = key;
    this.placeholder = placeholder;
  }
}

export class TextFilter extends Filter {
  constructor(label: string, key: string, placeholder: string) {
    super(label, 'text', key, placeholder);
  }
}

export class NumberFilter extends Filter {
  constructor(label: string, key: string, placeholder: string) {
    super(label, 'number', key, placeholder);
  }
}

export class SelectFilter extends Filter {
  options: FilterOption[];

  constructor(
    label: string,
    key: string,
    placeholder: string,
    options: FilterOption[]
  ) {
    super(label, 'select', key, placeholder);
    this.options = options;
  }
}

export class CheckboxFilter extends Filter {
  options: FilterOption[];

  constructor(label: string, key: string, options: FilterOption[]) {
    super(label, 'checkbox', key);
    this.options = options;
  }
}

export class RadioFilter extends Filter {
  options: FilterOption[];

  constructor(label: string, key: string, options: FilterOption[]) {
    super(label, 'radio', key);
    this.options = options;
  }
}

export class DateFilter extends Filter {
  format: DateFormat;

  constructor(
    label: string,
    key: string,
    placeholder: string,
    format?: DateFormat
  ) {
    super(label, 'date', key, placeholder);
    this.format = format || 'yyyy-MM-dd';
  }
}

export class FilterConfigBuilder {
  private filters: Filter[] = [];

  textFilter(
    label: string,
    key: string,
    placeholder: string
  ): FilterConfigBuilder {
    this.filters.push(new TextFilter(label, key, placeholder));
    return this;
  }

  numberFilter(
    label: string,
    key: string,
    placeholder: string
  ): FilterConfigBuilder {
    this.filters.push(new NumberFilter(label, key, placeholder));
    return this;
  }

  selectFilter(
    label: string,
    key: string,
    placeholder: string,
    options: FilterOption[]
  ): FilterConfigBuilder {
    this.filters.push(new SelectFilter(label, key, placeholder, options));
    return this;
  }

  checkboxFilter(
    label: string,
    key: string,
    options: FilterOption[]
  ): FilterConfigBuilder {
    this.filters.push(new CheckboxFilter(label, key, options));
    return this;
  }

  radioFilter(
    label: string,
    key: string,
    options: FilterOption[]
  ): FilterConfigBuilder {
    this.filters.push(new RadioFilter(label, key, options));
    return this;
  }

  dateFilter(
    label: string,
    key: string,
    placeholder: string,
    format?: DateFormat
  ): FilterConfigBuilder {
    console.log(format);

    this.filters.push(new DateFilter(label, key, placeholder, format));
    return this;
  }

  build(): Filter[] {
    return this.filters;
  }
}
