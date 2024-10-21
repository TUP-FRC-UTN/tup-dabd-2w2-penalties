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
import { ConstructionDocumentationFormComponent } from '../construction-documentation-form/construction-documentation-form.component';
import { CommonModule } from '@angular/common';
import {
  TableColumn,
  TableComponent,
  ConfirmAlertComponent,
} from 'ngx-dabd-grupo01';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ConstructionDocumentationService } from '../../services/construction-documentation.service';
//import { ConfirmAlertComponent } from '../../../../../../projects/ngx-dabd-grupo01/src/public-api';

@Component({
  selector: 'app-construction-documentation-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    NgbTooltipModule,
    FormsModule,
  ],
  templateUrl: './construction-documentation-list.component.html',
  styleUrl: './construction-documentation-list.component.scss',
})
export class ConstructionDocumentationListComponent {
  // Inputs:
  @Input() construction: any = undefined;
  @Input() currentConstructionStatus!: string;

  // Outputs:
  @Output() constructionApproved = new EventEmitter();
  @Output() constructionRejected = new EventEmitter();

  // Services:
  private modalService = inject(NgbModal);
  constructionDocumentationService = inject(ConstructionDocumentationService);

  // Properties:
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('isApprovedTemplate') isApprovedTemplate!: TemplateRef<any>;
  @ViewChild('documentTypeNameTemplate')
  documentTypeNameTemplate!: TemplateRef<any>;
  @ViewChild('confirmAlertContentTemplate')
  confirmAlertContentTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];
  rejectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rejectForm = this.fb.group({
      rejectReason: ['', Validators.required],
    });
  }

  get rejectReasonControl() {
    return this.rejectForm.get('rejectReason');
  }

  // Methods:
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { headerName: 'Id', accessorKey: 'id' },
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

  clearForm() {
    this.rejectForm.reset();
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
          this.clearForm();
        }
      })
      .catch(() => {});
  }

  rejectConstruction() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);

    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Está seguro de que desea rechazar esta obra?`;
    modalRef.componentInstance.alertType = 'warning';

    modalRef.componentInstance.content = this.confirmAlertContentTemplate;

    modalRef.componentInstance.onConfirm = () => {
      if (this.rejectForm.valid) {
        const rejectReason = this.rejectForm.value.rejectReason;
        this.constructionRejected.emit(rejectReason);
        modalRef.close();
        this.clearForm();
      } else {
        this.rejectForm.markAllAsTouched();
      }
    };
  }

  isConstructionAbleToApprove() {
    if (this.construction.construction_documentation) {
      return (
        !this.construction.construction_documentation.some(
          (doc: { state: string }) => doc.state === 'PENDING_APPROVAL'
        ) &&
        !this.construction.construction_documentation.some(
          (doc: { state: string }) => doc.state === 'REJECTED'
        )
      );
    } else {
      return false;
    }
  }

  download(documentationId: number): void {
    this.constructionDocumentationService.downloadDocumentation(
      documentationId
    );
  }
}
