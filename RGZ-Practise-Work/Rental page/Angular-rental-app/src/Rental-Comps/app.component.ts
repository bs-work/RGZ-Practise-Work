import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { FleetMenuComponent } from './fleet-menu/fleet-menu.component';
import { FAQComponent } from './FAQ/faq.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CareerComponent } from './career/career.component';
import { AboutUsComponent } from './About-us/about-us.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,FleetMenuComponent,FAQComponent,ContactUsComponent,CareerComponent,AboutUsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Angular-rental-app';
}

