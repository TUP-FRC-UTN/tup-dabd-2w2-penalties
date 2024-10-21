import {
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionDocumentationFormComponent } from '../construction-documentation-form/construction-documentation-form.component';
import {
  ConfirmAlertComponent,
  TableColumn,
  TableComponent,
} from 'ngx-dabd-grupo01';
import { ConstructionDocumentationService } from '../../services/construction-documentation.service';

@Component({
  selector: 'app-construction-documentation-list',
  standalone: true,
  imports: [TableComponent, NgbTooltipModule],
  templateUrl: './construction-documentation-list.component.html',
  styleUrl: './construction-documentation-list.component.scss',
})
export class ConstructionDocumentationListComponent {
  // Inputs:
  @Input() construction: any = undefined;

  // Services:
  private modalService = inject(NgbModal);
  constructionDocumentationService = inject(ConstructionDocumentationService);

  // Properties:
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('isApprovedTemplate') isApprovedTemplate!: TemplateRef<any>;
  @ViewChild('documentTypeNameTemplate')
  documentTypeNameTemplate!: TemplateRef<any>;

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
        { headerName: 'Nombre', accessorKey: 'documentIdentifier' },
        {
          headerName: 'Document type',
          accessorKey: 'documentType.name',
          cellRenderer: this.documentTypeNameTemplate,
        },
        {
          headerName: 'Actions',
          accessorKey: 'actions',
          cellRenderer: this.actionsTemplate,
        },
      ];
    });
  }

  openFormModal(): void {
    const modalRef = this.modalService.open(
      ConstructionDocumentationFormComponent
    );
    modalRef.componentInstance.constructionId =
      this.construction.construction_id;

    modalRef.result
      .then((result) => {
        if (result) {
          this.construction = result;
        }
      })
      .catch(() => {});
  }

  rejectDocument(document: any) {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Estás seguro de que desea rechazar el documento ${document.documentPath}?`;

    modalRef.result
      .then((result) => {
        if (result) {
        }
      })
      .catch(() => {});
  }

  approveConstruction() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Está seguro de que desea aprobar esta construcción?`;
    modalRef.componentInstance.alertType = 'success';

    modalRef.result
      .then((result) => {
        if (result) {
        }
      })
      .catch(() => {});
  }

  download(documentationId: number): void {
    this.constructionDocumentationService.downloadDocumentation(
      documentationId
    );
  }
}
