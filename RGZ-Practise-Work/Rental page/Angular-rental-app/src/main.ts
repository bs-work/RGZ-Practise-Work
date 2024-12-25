import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './Rental-Comps/app.config';
import { AppComponent } from './Rental-Comps/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

