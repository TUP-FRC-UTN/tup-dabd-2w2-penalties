import {Component, inject, TemplateRef} from '@angular/core';
import {ModalDismissReasons, NgbInputDatepicker, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CadastreService} from "../../../../cadastre/services/cadastre.service";
import {Plot} from "../../../../cadastre/plot/models/plot.model";
import {FormsModule} from "@angular/forms";
import {SanctionType} from "../../../sanction-type/models/sanction-type.model";
import {SanctionTypeService} from "../../../sanction-type/services/sanction-type.service";
import {InfractionServiceService} from "../../services/infraction-service.service";
import {InfractionDto} from "../../models/infraction.model";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-new-infraction-modal',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    FormsModule,
    NgClass
  ],
  templateUrl: './new-infraction-modal.component.html',
  styleUrl: './new-infraction-modal.component.scss'
})
export class NewInfractionModalComponent {

  //services
  private cadastreService = inject(CadastreService)
  private sanctionService=inject(SanctionTypeService)
  private infractionService= inject(InfractionServiceService)

  //variables
  plots: Plot[] | undefined;
  sanctionTypes:SanctionType[]|undefined;

  claims:number[] = [];
  sanctionTypeNumber:number | undefined;
  description:string | undefined;
  plotId:number|undefined;




  // Modal logic
  private modalService = inject(NgbModal);
  closeResult = '';

  open(content: TemplateRef<any>) {

    //gets the plots from cadastre
    this.cadastreService.getPlots().subscribe({
      next: (response) => {
        this.plots = response.content;

        //console.log(this.plots);
      },
    });

    // gets the sanction types from the service
    this.sanctionService.getPaginatedSanctionTypes(1, 10).subscribe({
      next: (response) => {
        this.sanctionTypes = response.items;
        console.log(this.sanctionTypes);
      },
      error: (error) => {
        console.error('Error fetching sanction types:', error);
      }
    });


    // open modal
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

  //methods
  //adds claims harcoded for now
  addClaim(id:number){
    const index = this.claims.indexOf(id);

    if (index !== -1) {
      // Remove the id if it's already in the array
      this.claims.splice(index, 1);
    } else {
      // Add the id if it's not in the array
      this.claims.push(id);
    }
    console.log('current claims array: ',this.claims)
  }

  //submit method for the form
  submitInfraction(){
    if (this.plotId&&this.sanctionTypeNumber&&this.description){
      const newInfraction: InfractionDto={
        plotId:this.plotId,
        description:this.description,
        sanctionTypeId:this.sanctionTypeNumber,
        claimsId:this.claims
      }

      this.infractionService.createInfraction(newInfraction).subscribe({
        next:(response)=>{
          console.log('Infracción creada con éxito', response);
        },
        error:(error)=>{
          console.error('error al crear la infraccion: ',error)
        }
      })
    } else {
      console.error('faltan datos obligatorios en el formulario')
    }
  }
}
