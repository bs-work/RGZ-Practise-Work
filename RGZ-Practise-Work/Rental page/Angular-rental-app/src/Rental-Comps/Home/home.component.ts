import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingCardComponent } from '../booking-card/booking-card.component';
import { BookButtonComponent } from '../book-button/book-button.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { FormCardComponent } from '../form-card/form-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule,
    BookingCardComponent,BookButtonComponent,ContactUsComponent,FormCardComponent,
  ],
})

// let cardContainer = document.querySelector('.card-container');
// let cards = document.querySelectorAll('.card');

// cardContainer.addEventListener('scroll', () => {
//     cards.forEach((card, index) => {
//         let cardPosition = card.getBoundingClientRect().left;
//         let cardWidth = card.offsetWidth;
//         let containerWidth = cardContainer.offsetWidth;
//         let scrollPosition = cardContainer.scrollLeft;

//         if (cardPosition + cardWidth < containerWidth + scrollPosition) {
//             card.classList.add('animate');
//         } else {
//             card.classList.remove('animate');
//         }
//     });
// });

export class HomeComponent {
  pickupLocation: string = '';
  pickupDate: string = '';
  pickupTime: string = '';
  dropoffLocation: string = '';
  dropoffDate: string = '';
  dropoffTime: string = '';
  age: string = '';
  promoCode: string = '';
  ages: number[] = [18,19,20,21,22,23,24,25,29,30];
  // pickupLocation: string = 'Florida';
  // onLocationChange(newLocation: string) {
  //   this.pickupLocation = newLocation;
  // }
  
  onBookingDetailsUpdated(details: any) {
    this.pickupLocation = details.pickupLocation;
    this.pickupDate = details.pickupDate;
    this.pickupTime = details.pickupTime;
    this.dropoffLocation = details.dropoffLocation;
    this.dropoffDate = details.dropoffDate;
    this.dropoffTime = details.dropoffTime;
    this.age = details.age;
    this.promoCode = details.promoCode;
  }

  bookNow(bookingCard: BookingCardComponent) {
    bookingCard.onBookNow(); //calling child component
  }
}

//route data
//   pickupLocationLabel: string = 'Pickup Location';
//   dropoffLocation: string = '';
//   dropoffLocationLabel: string = 'Dropoff Location';
//   dropoffDate: string = '';
//   dropoffDateLabel: string = 'Dropoff Date';
//   dropoffTime: string = '';
//   dropoffTimeLabel: string = 'Dropoff Time';
//   initialDropoffLocation: string = '';
//   initialDropoffDate: string = '';
//   initialDropoffTime: string = '';

//   constructor(private route: ActivatedRoute) {}

  // ngOnInit() {
  //   this.route.data.subscribe(data => {
  //     this.initialDropoffLocation =  data['BS']; 
  //     this.initialDropoffDate = data['BD']; 
  //     this.initialDropoffTime = data['BT']; 
  //     this.updateLabels(); 
  //   });
  // }

//   onPickupLocationChange(event: Event): void {
//     const inputElement = event.target as HTMLInputElement;
//     const trimmedValue = inputElement.value.trim();
//     this.pickupLocationLabel = trimmedValue ? `Pickup ${trimmedValue}` : 'Pickup Location';
//   }

//   onDropoffLocationChange(event: Event){
//     this.updateLabels(); 
//   }

//   onDropoffDateChange(event: Event) {
//     this.updateLabels(); 
//   }

//   onDropoffTimeChange(event: Event){
//     this.updateLabels(); 
//   }

//   updateLabels(){
//     this.dropoffLocationLabel = this.initialDropoffLocation;
//     this.dropoffDateLabel = this.initialDropoffDate;
//     this.dropoffTimeLabel = this.initialDropoffTime;
//   }
//}