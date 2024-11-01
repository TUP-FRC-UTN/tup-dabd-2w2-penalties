import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import {
  CheckboxFilter,
  DateFilter,
  Filter,
  RadioFilter,
  SelectFilter,
} from './table-filters.model';

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPopoverModule],
  templateUrl: './table-filters.component.html',
  styleUrl: './table-filters.component.scss',
})
export class TableFiltersComponent implements OnInit {
  @Input() filters: Filter[] = [];
  @Output() filterValueChange = new EventEmitter<Record<string, any>>();

  filterValues: Record<string, any> = {};
  filtersApplied: number = 0;

  ngOnInit() {
    this.filters.forEach((filter) => {
      this.filterValues[filter.key] = filter.type === 'checkbox' ? [] : '';
    });
  }

  isSelectFilter(filter: Filter): filter is SelectFilter {
    return filter.type === 'select';
  }

  isCheckboxFilter(filter: Filter): filter is CheckboxFilter {
    return filter.type === 'checkbox';
  }

  isRadioFilter(filter: Filter): filter is RadioFilter {
    return filter.type === 'radio';
  }

  isDateFilter(filter: Filter): filter is DateFilter {
    return filter.type === 'date';
  }

  clearFilters() {
    Object.keys(this.filterValues).forEach((key) => {
      this.filterValues[key] = Array.isArray(this.filterValues[key]) ? [] : '';
    });
    this.emitFilterValues();
  }

  updateFiltersApplied() {
    this.filtersApplied = Object.values(this.filterValues).filter((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== '';
    }).length;
  }

  onCheckboxChange(event: Event, key: string) {
    const input = event.target as HTMLInputElement;
    if (!this.filterValues[key]) {
      this.filterValues[key] = [];
    }
    if (input.checked) {
      this.filterValues[key].push(input.value);
    } else {
      this.filterValues[key] = this.filterValues[key].filter(
        (value: string) => value !== input.value
      );
    }
  }

  applyFilters() {
    this.updateFiltersApplied();
    this.emitFilterValues();
  }

  private emitFilterValues() {
    this.filterValueChange.emit(this.filterValues);
  }
}
