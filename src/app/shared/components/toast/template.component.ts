import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-toast-templates',
  template: `
    <ng-template #successTpl let-message>
      {{ message }}
    </ng-template>
  `,
})
export class ToastTemplatesComponent {
  @ViewChild('successTpl', { static: true }) successTpl!: TemplateRef<any>;
}
