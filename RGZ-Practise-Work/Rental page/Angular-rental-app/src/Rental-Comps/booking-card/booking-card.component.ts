import { Component, EventEmitter, Output } from '@angular/core';
import { BookButtonComponent } from '../book-button/book-button.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [BookButtonComponent, FormsModule, CommonModule],
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.css'] 
})

export class BookingCardComponent {
  pickupLocation: string = '';
  pickupDate: string = '';
  pickupTime: string = '';
  dropoffLocation: string = '';
  dropoffDate: string = '';
  dropoffTime: string = '';
  age: string = '';
  promoCode: string = '';
  ages: number[] = [18, 19, 20, 21, 22, 23, 24, 25];

  @Output() locationChange = new EventEmitter<string>();
  @Output() detailsUpdated = new EventEmitter<any>(); 

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.locationChange.emit(input.value);
  }
  
  updateDetails() {
    const details = {
      pickupLocation: this.pickupLocation,
      pickupDate: this.pickupDate,
      pickupTime: this.pickupTime,
      dropoffLocation: this.dropoffLocation,
      dropoffDate: this.dropoffDate,
      dropoffTime: this.dropoffTime,
      age: this.age,
      promoCode: this.promoCode,
    };
    this.detailsUpdated.emit(details);
  }
 
  onBookNow() {
    console.log('Book Now button clicked!');
    if (!this.pickupLocation || !this.pickupDate || !this.pickupTime || 
        !this.dropoffLocation || !this.dropoffDate || !this.dropoffTime || 
        !this.age) {
      console.error('fill in all required fields');
      return; 
    }

    console.log({
      pickupLocation: this.pickupLocation,
      pickupDate: this.pickupDate,
      pickupTime: this.pickupTime,
      dropoffLocation: this.dropoffLocation,
      dropoffDate: this.dropoffDate,
      dropoffTime: this.dropoffTime,
      age: this.age,
      promoCode: this.promoCode,
    });
  }
}
