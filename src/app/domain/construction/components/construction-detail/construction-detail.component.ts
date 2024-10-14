import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstructionService } from '../../services/construction.service';
import {
  CONSTRUCTION_STATUSES,
  ConstructionResponseDto,
  ConstructionStatus,
  ConstructionTab,
} from '../../models/construction.model';
import { CommonModule } from '@angular/common';
import { ConstructionWorkersComponent } from '../../../workers/components/construction-workers/construction-workers.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionDocumentationListComponent } from '../../../construction-documentation/components/construction-documentation-list/construction-documentation-list.component';
import { ConstructionNotesListComponent } from '../../../note/components/construction-notes-list/construction-notes-list.component';
import { WorkerService } from '../../../workers/services/worker.service';

@Component({
  selector: 'app-construction-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutComponent,
    TableComponent,
    ConstructionWorkersComponent,
    NgbTooltipModule,
    ConstructionDocumentationListComponent,
    ConstructionNotesListComponent,
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

  // Properties:
  construction: ConstructionResponseDto | undefined;
  activeTab: ConstructionTab = 'documentation';
  selectedStatus!: ConstructionStatus;
  statusOptions: ConstructionStatus[] = CONSTRUCTION_STATUSES;
  successMessage: string | null = null;

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
}
