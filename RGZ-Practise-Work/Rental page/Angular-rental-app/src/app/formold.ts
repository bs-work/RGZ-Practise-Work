//connect formcard to backend just update my code 
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationService } from '../location/location.service';
import { HttpClient } from '@angular/common/http';

export interface CardModel {
  Id: number;
  Name: string;
  Location: string;
  Datepicker: number;
  Uploadfile: string;
}

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

export class CardService {
  private apiUrl = 'https://localhost:44314/api/card';

  constructor(private http: HttpClient) {}

  getCards(): Observable<CardModel[]> {
    return this.http.get<CardModel[]>(this.apiUrl);
  }

  getCardById(id: number): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.apiUrl}/${id}`);
  }

  addCard(card: CardModel): Observable<number> {
    return this.http.post<number>(this.apiUrl, card);
  }

  updateCard(card: CardModel): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/${card.Id}`, card);
  }

  deleteCard(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${id}`);
  }
}


import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../location/location.service'; 
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.css'],
})

export class FormCardComponent implements OnInit {
  cards: any[] = [];
  stateOptions: string[] = [];
  addCardErrorMessage: string = ''; 
  isAddNewDisabled: boolean = false; 
  editDisabled: boolean = false;
  changeDetectorRef: any;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.loadStates();
  }

  loadStates(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        const states = locations.map(location => location.state);
        this.stateOptions = [...new Set(states)]; 
        console.log('States loaded:', this.stateOptions);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading states:', error);
      }
    );
  }
  
  addNewCard() {
    if (this.cards.some(card => card.isEditing)) {
      this.isAddNewDisabled = true; 
      return; // Prevent adding a new card
    }
    this.addCardErrorMessage = '';
    this.isAddNewDisabled = false; // Enable the button
    const newCard = {
      name: '',
      state: '',
      UploadFile: '',
      filePreview: '',
      isEditing: true,
      date: '',
      errorMessage: '',
    };
    this.cards.push(newCard);
  }
  
  // originalCardValues:any
  editCard(index: number) {
    if (this.cards.some(card => card.isEditing)) {
      return; // Prevent editing another card
    }

    this.cards.forEach((card, i) => (card.isEditing = i === index));
    this.cards[index].errorMessage = ''; // Clear previous error message
    this.isAddNewDisabled = true; // Optionally disable adding new cards while editing
  }

  isNameInvalid(card: any): boolean {
    return card.errorMessage && (!card.name || /\d/.test(card.name));
  }

  isstateInvalid(card: any): boolean {
    return card.errorMessage && !card.state;
  }

  isDateInvalid(card: any): boolean {
    return card.errorMessage && !card.date;
  }

  isFileInvalid(card: any): boolean {
    return card.errorMessage && !card.UploadFile;
  }

  saveCard(index: number) {
    const card = this.cards[index];
    let hasError = false;
    card.errorMessage = '';
    if (!card.name) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
    } else if (/\d/.test(card.name)) {
      card.errorMessage = 'Name cannot contain numbers.';
      hasError = true;
    } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
      card.errorMessage = 'This name is already added. Please choose a different name.';
      hasError = true;
    }
    if (!hasError) {
      if (!card.state || !card.UploadFile || !card.date) {
        card.errorMessage = 'Please fill in all fields before saving.';
        hasError = true;
      }
    }
    if (!hasError) {
      card.isEditing = false; // Enable submit after saving 
      this.isAddNewDisabled = false; // Re-enable the button after saving
      this.addCardErrorMessage = ''; // Clear any previous error messages
    }
  }

  deleteCard(index: number) {
    this.cards.splice(index, 1);
    this.isAddNewDisabled = this.cards.some(card => card.isEditing);
    if (!this.isAddNewDisabled) {
      this.addCardErrorMessage = ''; // Clear any previous error messages 
    }
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
 if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.cards[index].filePreview = e.target?.result as string; // Set the file preview
        this.cards[index].UploadFile = file.name; // Store the file name
      };
      reader.readAsDataURL(file);
    } else {
      this.cards[index].UploadFile = ''; // Reset if no file is selected
    }
  }

  isOptionDisabled(option: string): boolean {
    return this.cards.some((card) => card.state === option);
  }

  openPreview(card: any, _index: number) {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>Preview</title>
            <style>
              body { font-family: Arial, sans-serif; }
              img { max-width: 50%; height: auto; }
            </style>
          </head>
          <body>
            <h1>Preview for ${card.name}</h1>
            <p><strong>State:</strong> ${card.state}</p>
            <p><strong>Date:</strong> ${card.date}</p>
            <p><strong>File:</strong> ${card.UploadFile}</p>
            ${card.filePreview ? `<img src="${card.filePreview}" alt="File Preview" />` : ''}
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      console.error('Failed to open new tab. Please check your browser settings.');
    }
  }
}


<div class="container-lg">
    <div class="table-responsive">
      <div class="table-wrapper">
        <div class="table-title">
          <div class="row">
            <div class="col-sm-8">
              <h2>Card <b>Details</b></h2>
            </div>
            <div class="col-sm-4">
              <button type="button" class="btn btn-info add-new" (click)="addNewCard()" [disabled]="isAddNewDisabled || editDisabled">
                <i class="fa fa-plus"></i> Add New Card
              </button>
              <div *ngIf="addCardErrorMessage" class="text-danger">
                {{ addCardErrorMessage }}
              </div>
            </div>
          </div>
        </div>
        <!-- Error message -->
        <div *ngIf="cards.length > 0 && cards[cards.length - 1].errorMessage" class="text-danger">
          {{ cards[cards.length - 1].errorMessage }}
        </div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Date Picker</th>
              <th>Upload File</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let card of cards; let i = index">
              <td *ngIf="!card.isEditing">
                {{ card.name }}
              </td>
              <td *ngIf="card.isEditing">
                <input type="text" class="form-control" [(ngModel)]="card.name" placeholder="Enter name" [ngClass]="{'error-placeholder': isNameInvalid(card)}"/>
              </td>
              <td *ngIf="!card.isEditing">
                {{ card.state }}
              </td>
              <td *ngIf="card.isEditing">
                <select class="form-control state-custom" [(ngModel)]="card.state" [ngClass]="{'error-placeholder': isstateInvalid(card)}">
                  <option value="" disabled>Select an option</option>
                  <option *ngFor="let option of stateOptions" [value]="option" [disabled]="isOptionDisabled(option) && card.state !== option">{{ option }}</option>
                </select>
              </td>
              <td *ngIf="!card.isEditing">
                {{ card.date | date:'dd/MM/yy' }}
              </td>
              <td *ngIf="card.isEditing">
                <input type="date" class="form-control date-picker" [(ngModel)]="card.date" [ngClass]="{'error-placeholder': isDateInvalid(card)}"/>
              </td>
              <td *ngIf="!card.isEditing">
                {{ card.UploadFile }}
              </td>
              <td *ngIf="card.isEditing">
                <input type="text" class="form-control" [value]="card.UploadFile || 'No file chosen'" disabled />
                <input type="file" (change)="onFileChange($event, i)" class="upload-file-input" style="display: none;" id="fileInput{{i}}" />
                <label for="fileInput{{i}}" class="btn btn-primary btn-sm cf">Choose File</label>
              </td>
              <td>
                <a *ngIf="card.filePreview" (click)="openPreview(card, i)">
                  <img [src]="card.filePreview" alt="File Preview" class="file-preview" />
                </a>
              </td>
              <td class="text-center">
                <ng-container *ngIf="card.isEditing; else normalActions">
                  <div class="d-flex flex-column abtns">
                    <button class="btn btn-success btn-sm subbtn" (click)="saveCard(i)">Submit</button>
                    <button class="btn btn-danger btn-sm delbtn" (click)="deleteCard(i)">Delete</button>
                  </div>
                </ng-container>
                <ng-template #normalActions>
                  <button class="btn btn-primary btn-sm" (click)="editCard(i)">Edit</button>
                </ng-template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  
  