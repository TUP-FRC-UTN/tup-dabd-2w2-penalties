import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CustomDatepickerI18n, I18n } from './shared/services/customDatepickerI18n.service';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    I18n, 
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ],
};
