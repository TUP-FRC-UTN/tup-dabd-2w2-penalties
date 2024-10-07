import { Component } from '@angular/core';
import { FineTable } from "../fine-table/fine-table.component";

@Component({
  selector: 'app-fine',
  standalone: true,
  imports: [FineTable],
  templateUrl: './fine.component.html',
  styleUrl: './fine.component.scss'
})
export class FineComponent {

}
