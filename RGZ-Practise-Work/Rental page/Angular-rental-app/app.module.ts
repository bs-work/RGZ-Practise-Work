import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './src/Rental-Comps/app.component';
import { HomeComponent } from './src/Rental-Comps/Home/home.component';
import { AboutUsComponent } from './src/Rental-Comps/About-us/about-us.component';
import { FleetMenuComponent } from './src/Rental-Comps/fleet-menu/fleet-menu.component';
import { FAQComponent } from './src/Rental-Comps/FAQ/faq.component';
import { ContactUsComponent } from './src/Rental-Comps/contact-us/contact-us.component';
import { CareerComponent } from './src/Rental-Comps/career/career.component';
import { BookingCardComponent } from './src/Rental-Comps/booking-card/booking-card.component';
import { BookButtonComponent } from './src/Rental-Comps/book-button/book-button.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormCardComponent } from './src/Rental-Comps/form-card/form-card.component';
import { AuthenticationComponent } from './src/Rental-Comps/authentication/authentication.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './src/Rental-Comps/authentication/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './src/Rental-Comps/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutUsComponent,
    FleetMenuComponent,
    FAQComponent,
    ContactUsComponent,
    CareerComponent,
    BookingCardComponent,
    BookButtonComponent,
    FormCardComponent,
    AuthenticationComponent,
    AuthService,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    HttpClient,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
