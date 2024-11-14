import { Component, inject, NgModule } from '@angular/core';
import { SanctionTypeService } from '../../services/sanction-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeTypeEnum, SanctionType } from '../../models/sanction-type.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GetValueByKeyForEnumPipe } from '../../../../../shared/pipes/get-value-by-key-for-status.pipe';
import { MainContainerComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/lib/main-container/main-container.component';
import { ConfirmAlertComponent } from '../../../../../../../projects/ngx-dabd-grupo01/src/lib/confirm-alert/confirm-alert.component';
import { ToastService } from 'ngx-dabd-grupo01';
import {AppealDaysFormComponent} from "../appeal-days-form/appeal-days-form.component";

@Component({
  selector: 'app-sanction-type-detail',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MainContainerComponent,
    NgbTooltipModule,
    GetValueByKeyForEnumPipe,
    AppealDaysFormComponent,
  ],
  templateUrl: './sanction-type-detail.component.html',
  styleUrl: './sanction-type-detail.component.scss',
})
export class SanctionTypeDetailComponent {
  sanctionTypeService = inject(SanctionTypeService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  private readonly toastService = inject(ToastService);

  ChargeTypeEnum = ChargeTypeEnum;
  sanctionType: SanctionType | undefined;
  initialSanctionType: SanctionType | undefined;
  chargeTypeKeys: string[] = [];
  editing: boolean = false;
  isAdmin: boolean = true;

  constructor() {
    this.chargeTypeKeys = this.sanctionTypeService.getChargeTypeKeys();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      const mode = params['mode'];
      this.getSanctionTypeById(id);
      this.editing = mode === 'edit';
    });
  }

  getSanctionTypeById(id: number) {
    this.sanctionTypeService
      .getSanctionTypeById(id)
      .subscribe((sanctionType) => {
        this.sanctionType = sanctionType;
        this.initialSanctionType = JSON.parse(JSON.stringify(sanctionType));
      });
  }

  onInfoButtonClick() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertType = 'info';

    modalRef.componentInstance.alertTitle = 'Ayuda';
    modalRef.componentInstance.alertMessage = `Esta pantalla te permite observar los detalles específicos de un tipo de sanción. \n Considera que los costos pueden ser fijos o variables y la cantidad de infracciones que generan una multa dependen del tipo.`;
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
    this.resetSanctionType();
  }

  saveEdit() {
    const modalRef = this.modalService.open(ConfirmAlertComponent);
    modalRef.componentInstance.alertTitle = 'Confirmación';
    modalRef.componentInstance.alertMessage = `¿Estás seguro de que desea modificar el tipo?`;

    modalRef.result.then((result) => {
      if (result) {
        this.sanctionTypeService
          .updateSanctionType(this.sanctionType!)
          .subscribe({
            next: () => {
              this.toastService.sendSuccess(`Tipo actualizado exitosamente.`);
              this.editing = false;
              this.initialSanctionType = JSON.parse(
                JSON.stringify(this.sanctionType)
              );
            },
            error: () => {
              this.toastService.sendError(`Error actualizando tipo.`);

              console.error('Error al actualizar el tipo');
            },
          });
      }
    });
  }

  private resetSanctionType() {
    this.sanctionType = JSON.parse(JSON.stringify(this.initialSanctionType));
  }
}
