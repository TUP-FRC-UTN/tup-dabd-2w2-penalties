import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgbDropdownModule,
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConstructionDocumentationFormComponent } from '../construction-documentation-form/construction-documentation-form.component';
import { CommonModule } from '@angular/common';
import {
  TableColumn,
  ConfirmAlertComponent,
  ToastService,
} from 'ngx-dabd-grupo01';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConstructionDocumentationService } from '../../services/construction-documentation.service';
import { RoleService } from '../../../../shared/services/role.service';
import { TableComponent } from '../../../../../../projects/ngx-dabd-grupo01/src/public-api';

@Component({
  selector: 'app-construction-documentation-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    NgbTooltipModule,
    FormsModule,
    NgbDropdownModule,
  ],
  templateUrl: './construction-documentation-list.component.html',
  styleUrl: './construction-documentation-list.component.scss',
})
export class ConstructionDocumentationListComponent implements AfterViewInit, OnInit {
  // Inputs:
  @Input() construction: any = undefined;
  @Input() currentConstructionStatus!: string;

  // Outputs:
  @Output() constructionApproved = new EventEmitter();
  @Output() constructionRejected = new EventEmitter();
  @Output() constructionUpdated = new EventEmitter();
  @Output() constructionReview = new EventEmitter();

  // Services:
  private modalService = inject(NgbModal);
  constructionDocumentationService = inject(ConstructionDocumentationService);
  toastService = inject(ToastService);
  roleService = inject(RoleService);

  // Properties:
  @ViewChild('revisionTemplate') revisionTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('isApprovedTemplate') isApprovedTemplate!: TemplateRef<any>;
  @ViewChild('documentTypeNameTemplate')
  documentTypeNameTemplate!: TemplateRef<any>;
  @ViewChild('confirmAlertContentTemplate')
  confirmAlertContentTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  role = "";

  ngOnInit(): void {
    this.roleService.currentRole$.subscribe((role) => {
      this.role = role;
    });
  }

  // Methods:
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'N° de Documento', accessorKey: 'id' },
        {
          headerName: 'Estado',
          accessorKey: 'approved',
          cellRenderer: this.isApprovedTemplate,
        },
        { headerName: 'Nombre', accessorKey: 'document_identifier' },
        {
          headerName: 'Tipo',
          accessorKey: 'documentType.name',
          cellRenderer: this.documentTypeNameTemplate,
        },
        {
          headerName: 'Revision',
          accessorKey: 'revision',
          cellRenderer: this.revisionTemplate,
        },
        {
          headerName: 'Acciones',
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
          this.constructionUpdated.emit();
        }
      })
      .catch(() => {});
  }

  rejectDocument(document: any) {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertMessage = `¿Estás seguro de que desea rechazar el documento ${document.documentPath}?`;

    modalRef.result
      .then((result) => {
        if (result) {
          this.constructionDocumentationService
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
    this.constructionDocumentationService
      .updateConstructionDocStatus({
        documentation_id: document.id,
        status: 'APPROVED',
      })
      .subscribe(() => {
        document.state = 'APPROVED';
      });
  }

  deleteDocument(document: any) {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertMessage =
      '¿Está seguro de que desea eliminar el documento?';
    modalRef.componentInstance.alertVariant = 'delete';

    modalRef.result
      .then((result) => {
        if (result) {
          this.constructionDocumentationService
            .deleteConstructionDoc(document.id)
            .subscribe({
              next: () => {
                this.constructionUpdated.emit();
                this.toastService.sendSuccess(
                  'Documento eliminado correctamente'
                );
              },
              error: () => {
                this.toastService.sendError(
                  'Ocurrio un error al eliminar el documento'
                );
              },
            });
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
