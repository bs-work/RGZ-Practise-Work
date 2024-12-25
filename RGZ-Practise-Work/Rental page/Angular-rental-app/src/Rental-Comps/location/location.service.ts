import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LocationModel {
  id: number; // Primary key
  state: string;
  city: string;
  address: string;
  zipcode: number;
  postalcode: number;
}

@Injectable({
  providedIn: 'root',
})

export class LocationService {

  private apiUrl = 'https://localhost:44314/api/location';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(this.apiUrl);
  }

  getLocationById(id: number): Observable<LocationModel> {
    return this.http.get<LocationModel>(`${this.apiUrl}/${id}`);
  }

  createLocation(location: LocationModel): Observable<LocationModel> {
    return this.http.post<LocationModel>(this.apiUrl, location);
  }

  updateLocation(id: number, location: LocationModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, location);
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStateByLocationId(locationId: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/state/${locationId}`);
  }

  updateStateInBothTables(location: LocationModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/updateStateInBothTables`, location);
  }
  
}
