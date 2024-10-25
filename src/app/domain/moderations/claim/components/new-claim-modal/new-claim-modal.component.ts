import {Component, inject, TemplateRef} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Plot} from "../../../../cadastre/plot/models/plot.model";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClaimService} from "../../service/claim.service";
import {SanctionTypeService} from "../../../sanction-type/services/sanction-type.service";
import {CadastreService} from "../../../../cadastre/services/cadastre.service";
import {SanctionType} from "../../../sanction-type/models/sanction-type.model";
import {NgClass} from "@angular/common";
import {ClaimNew} from "../../models/claim.model";

@Component({
  selector: 'app-new-claim-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './new-claim-modal.component.html',
  styleUrl: './new-claim-modal.component.scss'
})
export class NewClaimModalComponent {
  //services
  private cadastreService = inject(CadastreService)
  private sanctionService = inject(SanctionTypeService)
  private claimService = inject(ClaimService) // nuevo servicio para los reclamos

  //variables
  plots: Plot[] | undefined;
  sanctionTypes: SanctionType[] | undefined;
  plotId: number | undefined;
  sanctionTypeId: number | undefined;
  description: string | undefined;

  //variable para los archivos
  selectedFiles: File[] = [];

  // Modal logic
  private modalService = inject(NgbModal);
  closeResult = '';

  openClaimModal(content: TemplateRef<any>) {

    // Obtener lotes
    this.cadastreService.getPlots().subscribe({
      next: (response) => {
        this.plots = response.content;
      },
      error: (error) => {
        console.error('Error fetching plots:', error);
      }
    });

    // Obtener tipos de sanción
    this.sanctionService.getPaginatedSanctionTypes(1, 10).subscribe({
      next: (response) => {
        this.sanctionTypes = response.items;
      },
      error: (error) => {
        console.error('Error fetching sanction types:', error);
      }
    });

    // Abrir el modal
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  //medotod de agregar archivos
  onFilesSelected(event:any){
    const files = event.target.files;
    this.selectedFiles=[]
    for (let file of files) {
      this.selectedFiles.push(file);
    }
  }

  // Método para enviar el formulario de reclamos
  submitClaim() {
    if (this.plotId && this.sanctionTypeId && this.description) {
      const newClaim:ClaimNew = {
        plot_id: this.plotId,
        sanction_type_entity_id: this.sanctionTypeId,
        description: this.description,
        proofs_id: [] // vacío por ahora
      };

      this.claimService.createClaim(newClaim).subscribe({
        next: (response) => {
          console.log('Reclamo creado con éxito', response);
        },
        error: (error) => {
          console.error('Error al crear el reclamo:', error);
        }
      });
    } else {
      console.error('Faltan datos obligatorios en el formulario');
    }
  }
}
