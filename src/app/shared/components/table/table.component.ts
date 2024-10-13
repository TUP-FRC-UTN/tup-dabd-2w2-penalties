import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TableConfig } from './table.models';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  // Inputs:

  @Input() tableConfig!: TableConfig;
  @Input() height: string = '580px';

  // Properties:

  sizeOptions = [10, 25, 50];

  // Methods:

  onPageChange(page: number): void {
    if (this.tableConfig.pagination) {
      this.tableConfig.pagination.onPageChange(page);
    }
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    if (this.tableConfig.pagination) {
      this.tableConfig.pagination.size = itemsPerPage;
      this.tableConfig.pagination.onPageSizeChange(itemsPerPage);
    }
  }
}
