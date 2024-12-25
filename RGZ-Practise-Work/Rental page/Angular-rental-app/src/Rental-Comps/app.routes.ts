import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { AboutUsComponent } from './About-us/about-us.component';
import { FleetMenuComponent } from './fleet-menu/fleet-menu.component';
import { FAQComponent } from './FAQ/faq.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CareerComponent } from './career/career.component';
import { BookingCardComponent } from './booking-card/booking-card.component';
import { BookButtonComponent } from './book-button/book-button.component';
import { FormCardComponent } from './form-card/form-card.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../auth.gurad';
import { LocationComponent } from './location/location.component';
import { ChildcompComponent } from './childcomp/childcomp.component';
import { ParentcomptComponent } from './parentcomp/parentcomp.component';
// import { TestAppComponent } from './test-app parent/test-app-parent.component';
import { TestAppComponentChild } from './test-app child/test-app-child.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { BS: 'Return Location', BD: 'Return Date', BT: 'Return Time' },
  },
  {
    path: 'aboutus',
    component: AboutUsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fleetmenu',
    component: FleetMenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'faq',
    component: FAQComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contactus',
    component: ContactUsComponent,
  },
  {
    path: 'career',
    component: CareerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: HomeComponent,
    data: { BS: 'Drop Location', BD: 'Drop Date', BT: 'Drop Time' },
  },

  //   {
  //   path: "",
  //   component: AuthenticationComponent,
  // },

  {
    path: 'bookingcard',
    component: BookingCardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bookbutton',
    component: BookButtonComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'formcard',
    component: FormCardComponent,
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'locationcrud',
    component: LocationComponent,
  },
  {
    path:'child',
    component:ChildcompComponent
  },
  {
    path: 'parent',
    component:ParentcomptComponent
  },
  {
    path:'testapp',
    component:TestAppComponentChild
  }
];
