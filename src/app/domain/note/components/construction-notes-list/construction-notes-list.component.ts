import {
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionNotesFormComponent } from '../construction-notes-form/construction-notes-form.component';
import { TableColumn, TableComponent } from 'ngx-dabd-grupo01';

@Component({
  selector: 'app-construction-notes-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './construction-notes-list.component.html',
  styleUrl: './construction-notes-list.component.scss',
})
export class ConstructionNotesListComponent {
  // Inputs:
  @Input() notes: any[] = [];

  // Services:
  private modalService = inject(NgbModal);

  // Properties:
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        { headerName: 'Description', accessorKey: 'description' },
        {
          headerName: 'Actions',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  openFormModal(itemId: number | null = null): void {
    const modalRef = this.modalService.open(ConstructionNotesFormComponent);
    modalRef.componentInstance.itemId = itemId;
  }
}
