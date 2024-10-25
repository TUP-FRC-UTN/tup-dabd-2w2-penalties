import { Component } from '@angular/core';
import {NewClaimModalComponent} from "../new-claim-modal/new-claim-modal.component";

@Component({
  selector: 'app-claim-list',
  standalone: true,
    imports: [
        NewClaimModalComponent
    ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})
export class ClaimListComponent {

}
