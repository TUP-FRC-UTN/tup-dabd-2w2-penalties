import { Component, inject, OnInit } from '@angular/core';
import {
  ConfirmAlertComponent,
  MainContainerComponent,
  ToastService,
} from 'ngx-dabd-grupo01';
import { SanctionTypeService } from '../../../sanction-type/services/sanction-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SanctionType } from '../../../sanction-type/models/sanction-type.model';
import { ClaimService } from '../../service/claim.service';
import { ClaimDTO, ClaimStatusEnum } from '../../models/claim.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { SanctionTypeSelectComponent } from '../../../sanction-type/components/sanction-type-select/sanction-type-select.component';
import { CadastreService } from '../../../../cadastre/services/cadastre.service';
import { Plot } from '../../../../cadastre/plot/models/plot.model';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MainContainerComponent,
    NgbTooltipModule,
    GetValueByKeyForEnumPipe,
    SanctionTypeSelectComponent,
  ],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.scss',
})
export class ClaimDetailComponent implements OnInit {
  claimService = inject(ClaimService);
  sanctionTypeService = inject(SanctionTypeService);

  cadastreService = inject(CadastreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private readonly toastService = inject(ToastService);
  ClaimStatusEnum = ClaimStatusEnum;
  

  claim: ClaimDTO | undefined;
  editing: boolean = false;
  isAdmin: boolean = true;
  plots: Plot[] | undefined;


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this.getClaimbyId(id);
    });

    this.cadastreService.getPlots().subscribe({
      next: (response) => {
        this.plots = response.content;
      },
      error: (error) => {
        console.error('Error fetching plots:', error);
      },
    });
  }

  getClaimbyId(id: number) {
    this.claimService.getClaimById(id).subscribe((claim) => {
      this.claim = claim;
    });
  }

  onSanctionTypeChange(selected: SanctionType | undefined) {
    if (this.claim || selected) {
      this.claim!.sanction_type = selected!;
    }
  }

  goBack = (): void => {
    this.router.navigate(['sanctionType']);
  };

  viewDetail(id: number) {
    this.router.navigate([`/sanctionType/${id}`]);
  }

  edit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    // this.resetSanctionType();
  }

  saveEdit() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Estás seguro de que desea modificar el tipo?`;

    // modalRef.result.then((result) => {
    //   if (result) {
    //     this.claimService
    //       .updateClaim(this.claim!)
    //       .subscribe({
    //         next: () => {
    //           this.toastService.sendSuccess(`Tipo actualizado exitosamente.`);
    //           this.editing = false;

    //         },
    //         error: () => {
    //           this.toastService.sendError(`Error actualizando tipo.`);

    //           console.error('Error al actualizar el tipo');
    //         },
    //       });
    //   }
    // });
  }

  // private resetSanctionType() {
  //   this.sanctionType = JSON.parse(JSON.stringify(this.initialSanctionType));
  // }
}
