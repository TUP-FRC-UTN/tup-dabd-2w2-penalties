import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstructionService } from '../../services/construction.service';
import {
  CONSTRUCTION_STATUSES_ENUM,
  CONSTRUCTION_STATUSES,
  ConstructionRequestDto,
  ConstructionResponseDto,
  ConstructionStatus,
  ConstructionTab,
  ConstructionUpdateRequestDto,
} from '../../models/construction.model';
import { CommonModule } from '@angular/common';
import { ConstructionWorkersComponent } from '../../../workers/components/construction-workers/construction-workers.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionDocumentationListComponent } from '../../../construction-documentation/components/construction-documentation-list/construction-documentation-list.component';
import { ConstructionNotesListComponent } from '../../../note/components/construction-notes-list/construction-notes-list.component';
import { WorkerService } from '../../../workers/services/worker.service';
import { MainContainerComponent, TableComponent } from 'ngx-dabd-grupo01';
import { GetValueByKeyForEnumPipe } from '../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { ToastService } from '../../../../../../projects/ngx-dabd-grupo01/src/public-api';

@Component({
  selector: 'app-construction-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainContainerComponent,
    TableComponent,
    ConstructionWorkersComponent,
    NgbTooltipModule,
    ConstructionDocumentationListComponent,
    ConstructionNotesListComponent,
    GetValueByKeyForEnumPipe
  ],
  templateUrl: './construction-detail.component.html',
  styleUrl: './construction-detail.component.css',
})
export class ConstructionDetailComponent implements OnInit {
  // Services:
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private constructionService = inject(ConstructionService);
  private workerService = inject(WorkerService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  // Properties:
  construction: ConstructionResponseDto | undefined;
  activeTab: ConstructionTab = 'documentation';
  selectedStatus!: ConstructionStatus;
  statusOptions: ConstructionStatus[] = CONSTRUCTION_STATUSES;
  successMessage: string | null = null;
  CONSTRUCTION_STATUSES_ENUM = CONSTRUCTION_STATUSES_ENUM;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.getConstructionById(id);
    });

    this.workerService.message$.subscribe((message) => {
      if (message) {
        if (message.type === 'success') {
          this.getConstructionById(this.construction?.construction_id!);
          this.successMessage = message.message;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        }
      } else {
        this.successMessage = null;
      }
    });
  }

  getConstructionById(id: number) {
    this.constructionService
      .getConstructionById(id)
      .subscribe((construction) => {
        this.construction = construction;
        this.selectedStatus =
          (construction?.construction_status as ConstructionStatus) ||
          'PLANNED';
      });
  }

  setActiveTab(tab: ConstructionTab): void {
    this.activeTab = tab;
  }

  isActiveTab(tab: ConstructionTab): boolean {
    return this.activeTab === tab;
  }

  goBack = (): void => {
    this.router.navigate(['constructions']);
  };

  updateStatus(): void {
    if (this.selectedStatus !== this.construction?.construction_status) {
      this.constructionService
        .updateConstructionStatus({
          construction_id: this.construction?.construction_id || 0,
          status: this.selectedStatus,
        })
        .subscribe(() => {
          if (this.construction) {
            this.construction.construction_status = this.selectedStatus;
          }
        });
    }
  }

  editConstruction: ConstructionUpdateRequestDto = {
    description: '',
    planned_start_date: new Date(),
    planned_end_date: new Date(),
    project_name: '',
  };

  @ViewChild('editModal') editModal!: TemplateRef<any>;

  openEditModal(): void {
    if (this.construction) {
      this.editConstruction = {
        project_name: this.construction.project_name,
        description: this.construction.project_description,
        planned_start_date: new Date(this.construction.planned_start_date),
        planned_end_date: new Date(this.construction.planned_end_date),
      };
      this.modalService.open(this.editModal);
    }
  }

  saveChanges(): void {
    if (this.construction) {
      this.constructionService
        .updateConstruction(
          this.construction.construction_id,
          this.editConstruction
        )
        .subscribe({
          next: (updatedConstruction) => {
            this.construction = updatedConstruction;

            this.modalService.dismissAll();
            this.toastService.sendSuccess('Los datos se actualizaron correctamente');
          },
          error: (err) => {
            console.error('Error al actualizar los datos', err);
            this.toastService.sendError('Ocurrió un error al actualizar los datos');
          },
        });
    }
  }

  onConstructionApproved(constructionId: number): void {
    if (this.construction) {
      this.constructionService
        .approveConstruction(constructionId)
        .subscribe(() => {
          if (this.construction) {
            this.construction.construction_status = 'APPROVED';
            this.toastService.sendSuccess('Se aprobó la construcción correctamente');
          }
        });
    }
  }

  onConstructionRejected(constructionId: number, reason: string): void {
    if (this.construction) {
      this.constructionService
        .rejectConstruction(constructionId, reason)
        .subscribe({
          next: () => {
            () => {
              if (this.construction) {
                this.construction.construction_status = 'REJECTED';
                this.toastService.sendSuccess('Se rechazó la construcción correctamente');
              }
            }
          },
          error: (err) => {
            this.toastService.sendError('Ocurrió un error al rechazar la construcción');
          },
        })
    }
  }
}
