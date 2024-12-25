import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule],
})

export class HomeComponent implements OnInit {
  pickupLocationLabel: string = 'Pickup Location';
  dropoffLocation: string = '';
  dropoffLocationLabel: string = 'Dropoff Location';
  dropoffDate: string = '';
  dropoffDateLabel: string = 'Dropoff Date';
  dropoffTime: string = '';
  dropoffTimeLabel: string = 'Dropoff Time';

  initialDropoffLocation: string = '';
  initialDropoffDate: string = '';
  initialDropoffTime: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.initialDropoffLocation = data['BS']; 
      this.initialDropoffDate = data['BD']; 
      this.initialDropoffTime = data['BT']; 
      this.updateLabels(); 
    });
  }

  onPickupLocationChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trim();
    this.pickupLocationLabel = trimmedValue ? `Pickup ${trimmedValue}` : 'Pickup Location';
  }

  onDropoffLocationChange(event: Event){
    this.updateLabels(); 
  }

  onDropoffDateChange(event: Event) {
    this.updateLabels(); 
  }

  onDropoffTimeChange(event: Event){
    this.updateLabels(); 
  }

  updateLabels(){
    this.dropoffLocationLabel = this.initialDropoffLocation;
    this.dropoffDateLabel = this.initialDropoffDate;
    this.dropoffTimeLabel = this.initialDropoffTime;
  }
}
