import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss',
})
export class MainContainerComponent {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() onGoBack?: () => void;

  @Output() infoButtonClick = new EventEmitter();

  goBack() {
    this.onGoBack?.();
  }

  onInfoButtonClick() {
    this.infoButtonClick.emit();
  }
}
