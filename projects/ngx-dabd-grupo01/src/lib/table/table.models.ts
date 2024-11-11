import { TemplateRef } from '@angular/core';

export interface TableColumn {
  headerName: string;
  accessorKey?: string;
  cellRenderer?: TemplateRef<any>;
  align?: 'left' | 'center' | 'right';
}

export interface TablePagination {
  totalItems: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (itemsPerPage: number) => void;
}