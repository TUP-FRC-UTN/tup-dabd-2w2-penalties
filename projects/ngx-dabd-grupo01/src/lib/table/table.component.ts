import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TableColumn, TablePagination } from './table.models';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule, NgbTooltipModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  // Inputs:

  @Input() items!: any[];
  @Input() columns!: TableColumn[];
  @Input() isLoading?: boolean | null = false;
  @Input() pagination?: TablePagination;
  @Input() height?: string = '560px';
  @Input() showSearchBar?: boolean = true;
  @Input() showExportOptions?: boolean = true;
  @Input() showExportExcelButton?: boolean = true;
  @Input() showExportPdfButton?: boolean = true;
  @Input() showHeaderButton?: boolean = true;
  @Input() headerButtonText?: string = 'Nuevo';
  @Input() headerButtonIcon?: string = undefined;
  @Input() searchPlaceHolder?: string = 'Buscar...';

  // Outputs:

  @Output() searchValueChange = new EventEmitter<string>();
  @Output() headerButtonClick = new EventEmitter<void>();
  @Output() excelButtonClick = new EventEmitter<void>();
  @Output() pdfButtonClick = new EventEmitter<void>();
  @Output() infoButtonClick = new EventEmitter<void>();

  // Properties:

  sizeOptions: number[] = [10, 25, 50];
  searchValue: string = '';

  // Methods:

  onPageChange(page: number): void {
    if (this.pagination) {
      this.pagination.onPageChange(page);
    }
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    if (this.pagination) {
      this.pagination.size = itemsPerPage;
      this.pagination.onPageSizeChange(itemsPerPage);
    }
  }

  onSearchValueChange(): void {
    this.searchValueChange.emit(this.searchValue);
  }

  onHeaderButtonClick(): void {
    this.headerButtonClick.emit();
  }

  onExcelButtonClick(): void {
    this.excelButtonClick.emit();
  }

  onPdfButtonClick(): void {
    this.pdfButtonClick.emit();
  }

  onInfoButtonClick(): void {
    this.infoButtonClick.emit();
  }

  getNestedValue(item: any, accessorKey: string): any {
    return accessorKey.split('.').reduce((acc, key) => acc?.[key], item);
  }
}
