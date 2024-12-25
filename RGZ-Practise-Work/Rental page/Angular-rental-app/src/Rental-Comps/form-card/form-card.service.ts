import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private statesSubject = new BehaviorSubject<string[]>([]);
  states$ = this.statesSubject.asObservable();

  constructor(private locationService: LocationService) {}

  fetchAndUpdateStates(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        const states = locations.map(location => location.state);
        this.statesSubject.next([...new Set(states)]);
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }
}
