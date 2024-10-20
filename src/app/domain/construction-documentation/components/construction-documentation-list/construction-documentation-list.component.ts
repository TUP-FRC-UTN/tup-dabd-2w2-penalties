import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TableColumn } from '../../../../shared/components/table/table.models';
import { ConstructionDocumentationFormComponent } from '../construction-documentation-form/construction-documentation-form.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { ConfirmAlertComponent } from 'ngx-dabd-grupo01';
import { ConstructionDocService } from '../../service/construction-doc.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-construction-documentation-list',
  standalone: true,
  imports: [CommonModule, TableComponent, NgbTooltipModule],
  templateUrl: './construction-documentation-list.component.html',
  styleUrl: './construction-documentation-list.component.scss',
})
export class ConstructionDocumentationListComponent {
  // Inputs:
  @Input() documentations: any[] = [];
  @Input() currentConstructionStatus!: string;

  // Outputs:
  @Output() constructionApproved = new EventEmitter();
  @Output() constructionRejected = new EventEmitter();

  // Services:
  private modalService = inject(NgbModal);
  construcionDocService = inject(ConstructionDocService);

  // Properties:
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('isApprovedTemplate') isApprovedTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  // Methods:
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
        {
          headerName: 'Is approved',
          accessorKey: 'approved',
          cellRenderer: this.isApprovedTemplate,
        },
        { headerName: 'Document path', accessorKey: 'document_identifier' },
        { headerName: 'Document type', accessorKey: 'document_type' },
        {
          headerName: 'Actions',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  openFormModal(itemId: number | null = null): void {
    const modalRef = this.modalService.open(
      ConstructionDocumentationFormComponent
    );
    modalRef.componentInstance.itemId = itemId;
  }

  rejectDocument(document: any) {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Estás seguro de que desea rechazar el documento ${document.documentPath}?`;

    modalRef.result
      .then((result) => {
        if (result) {
          this.construcionDocService
            .updateConstructionDocStatus({
              documentation_id: document.id,
              status: 'REJECTED',
            })
            .subscribe(() => {
              document.state = 'REJECTED';
            });
        }
      })
      .catch(() => {});
  }

  approveDocument(document: any) {
    this.construcionDocService
      .updateConstructionDocStatus({
        documentation_id: document.id,
        status: 'APPROVED',
      })
      .subscribe(() => {
        document.state = 'APPROVED';
      });
  }

  approveConstruction() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Está seguro de que desea aprobar esta obra?`;
    modalRef.componentInstance.alertType = 'info';

    modalRef.result
      .then((result) => {
        if (result) {
          this.constructionApproved.emit();
        }
      })
      .catch(() => {});
  }

  rejectConstruction() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Está seguro de que desea rechazar esta obra?`;
    modalRef.componentInstance.alertType = 'warning';

    modalRef.result
      .then((result) => {
        if (result) {
          this.constructionRejected.emit();
        }
      })
      .catch(() => {});
  }

  isConstructionAbleToApprove() {
    return (
      !this.documentations.some((doc) => doc.state === 'PENDING_APPROVAL') &&
      !this.documentations.some((doc) => doc.state === 'REJECTED')
    );
  }
}
