import { TemplateRef } from '@angular/core';

export interface TableColumn {
  headerName: string;
  accessorKey?: string;
  cellRenderer?: TemplateRef<any>;
}

export interface TablePagination {
  totalItems: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (itemsPerPage: number) => void;
}