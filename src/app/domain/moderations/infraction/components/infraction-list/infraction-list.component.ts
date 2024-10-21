import { Component } from '@angular/core';
import {NewInfractionModalComponent} from "../new-infraction-modal/new-infraction-modal.component";

@Component({
  selector: 'app-infraction-list',
  standalone: true,
  imports: [
    NewInfractionModalComponent
  ],
  templateUrl: './infraction-list.component.html',
  styleUrl: './infraction-list.component.scss'
})
export class InfractionListComponent {

}
