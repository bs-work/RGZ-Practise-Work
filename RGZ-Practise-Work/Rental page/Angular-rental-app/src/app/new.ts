
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { StateService } from './form-card.service'; 
// import { ChangeDetectorRef } from '@angular/core';

// @Component({
//   selector: 'app-form-card',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './form-card.component.html',
//   styleUrls: ['./form-card.component.css'],
// })

// export class FormCardComponent implements OnInit {
//   cards: any[] = [];
//   dropdownOptions:string[]=[];
//   addCardErrorMessage: string = ''; 
//   isAddNewDisabled: boolean = false; 
//   editDisabled: boolean = false;
//   changeDetectorRef: any;
//   locationService: any;

//   constructor(private stateService: StateService,private cdr: ChangeDetectorRef) {}
//   ngOnInit(): void {
//     // Subscribe to the states observable to get updated states
//     this.stateService.states$.subscribe(states => {
//       this.dropdownOptions = states;
//       console.log('Dropdown options updated:', this.dropdownOptions);
//       this.cdr.detectChanges();
//         // this.dropdownOptions = ['California', 'Texas', 'New York']; 
//         // console.log('Dropdown options set to hardcoded values:', this.dropdownOptions);
//     });
//     // Fetch unique states from LocationService
//     // this.locationService.getUniqueStates().subscribe((states: string[]) => {
//     //   this.dropdownOptions = states;
//     //   console.log('States for dropdown:', this.dropdownOptions);
//     // });
//   }
  
//   addNewCard() {
//     if (this.cards.some(card => card.isEditing)) {
//       // this.addCardErrorMessage = 'Please complete the current card before adding a new one.';
//       this.isAddNewDisabled = true; // Disable the button
//       return; // Prevent adding a new card
//     }
//     this.addCardErrorMessage = '';
//     this.isAddNewDisabled = false; // Enable the button
//     const newCard = {
//       name: '',
//       Dropdown: '',
//       UploadFile: '',
//       filePreview: '',
//       isEditing: true,
//       date: '',
//       errorMessage: '',
//     };
//     this.cards.push(newCard);
//   }

//   editCard(index: number) {
//     // Check if any card is currently being edited
//     if (this.cards.some(card => card.isEditing)) {
//       // this.addCardErrorMessage = 'Please complete the current card before editing another.';
//       return // Prevent editing another card
//     }

//     // Allow editing the selected card
//     this.cards.forEach((card, i) => (card.isEditing = i === index));
//     this.cards[index].errorMessage = ''; // Clear previous error message
//     this.isAddNewDisabled = true; // Optionally disable adding new cards while editing
//   }

//   isNameInvalid(card: any): boolean {
//     return card.errorMessage && (!card.name|| /\d/.test(card.name));
//   }

//   isDropdownInvalid(card: any): boolean {
//     return card.errorMessage && !card.Dropdown;
//   }

//   isDateInvalid(card: any): boolean {
//     return card.errorMessage && !card.date;
//   }

//   isFileInvalid(card: any): boolean {
//     return card.errorMessage && !card.UploadFile;
//   }

//   saveCard(index: number) {
//     const card = this.cards[index];
//     let hasError = false;
//     card.errorMessage = '';
//     if (!card.name) {
//       card.errorMessage = 'Please fill in all fields before saving.';
//       hasError = true;
//     } else if (/\d/.test(card.name)) {
//       card.errorMessage = 'Name cannot contain numbers.';
//       hasError = true;
//     } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
//       card.errorMessage = 'This name is already added. Please choose a different name.';
//       hasError = true;
//     }
//     if (!hasError) {
//       if (!card.Dropdown || !card.UploadFile || !card.date) {
//         card.errorMessage = 'Please fill in all fields before saving.';
//         hasError = true;
//       }
//     }
//     if (!hasError) {
//       card.isEditing = false; // Enable submit after saving 
//       this.isAddNewDisabled = false; // Re-enable the button after saving
//       this.addCardErrorMessage = ''; // Clear any previous error messages
//     }
//   }
//   deleteCard(index: number) {
//     this.cards.splice(index, 1);
//     this.isAddNewDisabled = this.cards.some(card => card.isEditing);
//     if (!this.isAddNewDisabled) {
//       this.addCardErrorMessage = ''; // Clear any previous error messages 
//     }
//   }

//   onFileChange(event: any, index: number) {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         this.cards[index].filePreview = e.target?.result as string ; // Set the file preview
//         this.cards[index].UploadFile = file.name; // Store the file name
//       };
//       reader.readAsDataURL(file);
//     } else {
//       this.cards[index].UploadFile = ''; // Reset if no file is selected
//     }
//   }

//   isOptionDisabled(option: string): boolean {
//     return this.cards.some((card) => card.Dropdown === option);
//   }

//   openPreview(card: any, _index: number) {
//     const newTab = window.open();
//     if (newTab) {
//       newTab.document.write(`
//         <html>
//           <head>
//             <title>Preview</title>
//             <style>
//               body { font-family: Arial, sans-serif; }
//               img { max-width: 50%; height: auto; }
//             </style>
//           </head>
//           <body>
//             <h1>Preview for ${card.name}</h1>
//             <p><strong>Dropdown:</strong> ${card.Dropdown}</p>
//             <p><strong>Date:</strong> ${card.date}</p>
//             <p><strong>File:</strong> ${card.UploadFile}</p>
//             ${card.filePreview ? `<img src="${card.filePreview}" alt="File Preview" />` : ''}
//           </body>
//         </html>
//       `);
//       newTab.document.close();
//     } else {
//       console.error('Failed to open new tab. Please check your browser settings.');
//     }
//   }
// }



// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })

// export class StateService {
//   private statesSubject = new BehaviorSubject<string[]>([]);
//   states$ = this.statesSubject.asObservable();

//   updateStates(states: string[]): void {
//     console.log('Updating states:', states); 
//     this.statesSubject.next([...new Set(states)]); 
//   }
// }

// <div class="container-lg">
//     <div class="table-responsive">
//       <div class="table-wrapper">
//         <div class="table-title">
//           <div class="row">
//             <div class="col-sm-8">
//               <h2>Card <b>Details</b></h2>
//             </div>
//             <div class="col-sm-4">
//               <button type="button" class="btn btn-info add-new" (click)="addNewCard()" [disabled]="isAddNewDisabled || editDisabled">
//                 <i class="fa fa-plus"></i> Add New Card
//               </button>
//               <div *ngIf="addCardErrorMessage" class="text-danger">
//                 {{ addCardErrorMessage }}
//               </div>
//             </div>
//           </div>
//         </div>
//         <!-- Error message -->
//         <div *ngIf="cards.length > 0 && cards[cards.length - 1].errorMessage" class="text-danger">
//           {{ cards[cards.length - 1].errorMessage }}
//         </div>
//         <table class="table table-bordered">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Location</th>
//               <th>Date Picker</th>
//               <th>Upload File</th>
//               <th>Preview</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr *ngFor="let card of cards; let i = index">
//               <td *ngIf="!card.isEditing">
//                 {{ card.name }}
//               </td>
//               <td *ngIf="card.isEditing">
//                 <input type="text" class="form-control" [(ngModel)]="card.name" placeholder="Enter name" [ngClass]="{'error-placeholder': isNameInvalid(card)}"/>
//               </td>
//               <td *ngIf="!card.isEditing">
//                 {{ card.Dropdown }}
//               </td>
//               <td *ngIf="card.isEditing">
//                 <select class="form-control dropdown-custom" [(ngModel)]="card.Dropdown" [ngClass]="{'error-placeholder': isDropdownInvalid(card)}">
//                   <option value="" disabled>Select an option</option>
//                   <option *ngFor="let option of dropdownOptions" [value]="option" [disabled]="isOptionDisabled(option) && card.Dropdown !== option">{{ option }}</option>
//                 </select>
//               </td>
//               <td *ngIf="!card.isEditing">
//                 {{ card.date | date:'dd/MM/yy' }}
//               </td>
//               <td *ngIf="card.isEditing">
//                 <input type="date" class="form-control date-picker" [(ngModel)]="card.date" [ngClass]="{'error-placeholder': isDateInvalid(card)}"/>
//               </td>
//               <td *ngIf="!card.isEditing">
//                 {{ card.UploadFile }}
//               </td>
//               <td *ngIf="card.isEditing">
//                 <input type="text" class="form-control" [value]="card.UploadFile || 'No file chosen'" disabled />
//                 <input type="file" (change)="onFileChange($event, i)" class="upload-file-input" style="display: none;" id="fileInput{{i}}" />
//                 <label for="fileInput{{i}}" class="btn btn-primary btn-sm cf">Choose File</label>
//               </td>
//               <td>
//                 <a *ngIf="card.filePreview" (click)="openPreview(card, i)">
//                   <img [src]="card.filePreview" alt="File Preview" class="file-preview" />
//                 </a>
//               </td>
//               <td class="text-center">
//                 <ng-container *ngIf="card.isEditing; else normalActions">
//                   <div class="d-flex flex-column abtns">
//                     <button class="btn btn-success btn-sm subbtn" (click)="saveCard(i)">Submit</button>
//                     <button class="btn btn-danger btn-sm delbtn" (click)="deleteCard(i)">Delete</button>
//                   </div>
//                 </ng-container>
//                 <ng-template #normalActions>
//                   <button class="btn btn-primary btn-sm" (click)="editCard(i)">Edit</button>
//                 </ng-template>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
  

//   import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { LocationService } from './location.service';
// import { StateService } from './form-card.service';

// @Component({
//   selector: 'app-location',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './location.component.html',
//   styleUrls: ['./location.component.css'],
// })

// export class LocationComponent implements OnInit {
//   cards: any[] = [];
//   addCardErrorMessage: string = '';
//   isAddNewDisabled: boolean = false;
//   editDisabled: boolean = false;
//   hasAttemptedSave: boolean = false;

//   constructor(
//     private locationService: LocationService,
//     private changeDetectorRef: ChangeDetectorRef,
//     private stateService: StateService 
//   ) {}

//   ngOnInit(): void {
//     console.log('Component initialized, loading locations...');
//     this.loadLocations();
//     this.changeDetectorRef.detectChanges();
//     // setInterval(() => {
//     //   this.loadLocations();
//     // }, 3000)
//   }

//   trackById(_index: number, card: any): number {
//     // debugger;
//     return card.id;
//   }

//   // loadLocations(): void {
//   //   // debugger;
//   //   this.locationService.getLocations().subscribe(
//   //     (locations) => {
//   //       if (locations) {
//   //         console.log('Received locations:', locations);
//   //         this.cards = locations.map((location) => ({
//   //           ...location,
//   //           isEditing: false,
//   //           errorMessage: '',
//   //         }));
//   //         // Extract states and update the StateService
//   //       const states = this.cards.map(card => card.state);
//   //       this.stateService.updateStates(states);
//   //         console.log('Cards array populated:', this.cards);
//   //       } else {
//   //         console.error(
//   //           'Expected an array of locations, but received:',
//   //           locations
//   //         );  
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error loading locations:', error);
//   //     }
//   //   );
//   // }
  

//   // loadLocations(): void {
//   //   this.locationService.getLocations().subscribe(
//   //     (locations) => {
//   //       if (locations) {
//   //         this.cards = locations.map((location) => ({
//   //           ...location,
//   //           isEditing: false,
//   //           errorMessage: '',
//   //         }));
//   //         // Extract unique states and update the StateService
//   //         const states = this.cards.map(card => card.state); 
//   //         this.stateService.updateStates(states);
//   //         console.log('States updated:', states); // Debugging line
//   //       } else {
//   //         console.error('Expected an array of locations, but received:', locations);
//   //       }
//   //     },
//   //     (error) => {
//   //       console.error('Error loading locations:', error);
//   //     }
//   //   );
//   // }

//   loadLocations(): void {
//     this.locationService.getLocations().subscribe(
//       (locations) => {
//         console.log('API Response:', locations); // Log the API response
//         if (locations) {
//           this.cards = locations.map((location) => ({
//             ...location,
//             isEditing: false,
//             errorMessage: '',
//           }));
//           const states = this.cards.map(card => card.state); 
//           this.stateService.updateStates(states);
//           console.log('States updated:', states); // Debugging line
//         } else {
//           console.error('Expected an array of locations, but received:', locations);
//         }
//       },
//       (error) => {
//         console.error('Error loading locations:', error);
//       }
//     );
//   }

//   isFormInvalid(card:any): boolean {
//     return (
//       this.isstateInvalid(card) ||
//       this.iscityInvalid(card) ||
//       this.isaddressInvalid(card) ||
//       this.iszipcodeInvalid(card) ||
//       this.ispostalcodeInvalid(card)
//     );
//   }

//   isstateInvalid(card: any): boolean {
//     return !card.state;
//   }

//   iscityInvalid(card: any): boolean {
//     return !card.city;
//   }

//   isaddressInvalid(card: any): boolean {
//     return !card.address;
//   }

//   iszipcodeInvalid(card: any): boolean {
//     return !/^\d+$/.test(card.zipcode);
//   }

//   ispostalcodeInvalid(card: any): boolean {
//     return !/^\d+$/.test(card.postalcode);
//   }

//   addNewCard(): void {
//     debugger;
//     if (this.cards.some((card) => card.isEditing)) {
//       this.isAddNewDisabled = true;
//       return;
//     }

//     this.addCardErrorMessage = '';
//     this.isAddNewDisabled = false;

//     const newCard = {
//       state: '',
//       city: '',
//       address: '',
//       zipcode: '',
//       postalcode: '',
//       isEditing: true,
//       errorMessage: '',
//     };
//     this.cards.push(newCard);
//   }

//   originalCardValues: any;

//   editCard(index: number): void {
//     // debugger;
//     const cardToEdit = this.cards[index];
//     this.originalCardValues = { ...cardToEdit };
//     if (this.cards.some((card) => card.isEditing && card !== cardToEdit)) {
//       return;
//     }
//     if (cardToEdit.id) {
//       this.locationService.getLocationById(cardToEdit.id).subscribe(
//         (location) => {
//           Object.assign(cardToEdit, location);
//           cardToEdit.isEditing = true;
//           console.log('Card Edit Filled:', cardToEdit);
//           this.changeDetectorRef.detectChanges();
//         },
//         (error) => {
//           console.error('Error fetching location:', error);
//         }
//       );
//     } else {
//       cardToEdit.isEditing = true;
//     }

//     this.isAddNewDisabled = true;
//   }

//   saveCard(index: number): void {
//     const card = this.cards[index];
//     let hasError = false;
//     card.errorMessage = '';
//     this.hasAttemptedSave = true;

//     if (this.isstateInvalid(card)) {
//       card['isstateInvalid'] = true;
//       hasError = true;
//     } else {
//       card['isstateInvalid'] = false;
//     }

//     if (this.iscityInvalid(card)) {
//       card['iscityInvalid'] = true;
//       hasError = true;
//     } else {
//       card['iscityInvalid'] = false;
//     }

//     if (this.isaddressInvalid(card)) {
//       card['isaddressInvalid'] = true;
//       hasError = true;
//     } else {
//       card['isaddressInvalid'] = false;
//     }

//     if (this.iszipcodeInvalid(card)) {
//       card['iszipcodeInvalid'] = true;
//       hasError = true;
//     } else {
//       card['iszipcodeInvalid'] = false;
//     }

//     if (this.ispostalcodeInvalid(card)) {
//       card['ispostalcodeInvalid'] = true;
//       hasError = true;
//     } else {
//       card['ispostalcodeInvalid'] = false;
//     }

//     // if (hasError) {
//     //   this.addCardErrorMessage = 'Please fill all fields correctly.';
//     //   return;
//     // }

//     if (!hasError) {
//       if (card.id) {
//         // Updating an existing card
//         this.locationService.updateLocation(card.id, card).subscribe(
//           () => {
//             card.isEditing = false;
//             this.isAddNewDisabled = false;
//             this.addCardErrorMessage = '';
//             this.hasAttemptedSave = false;
//           },
//           (error) => {
//             card.errorMessage = 'Error updating location.';
//             console.error('Error updating location:', error);
//           }
//         );
//       } else {
//         // Creating a new card
//         this.locationService.createLocation(card).subscribe(
//           (newLocation) => {
//             card.id = newLocation.id;
//             card.isEditing = false;
//             this.isAddNewDisabled = false;
//             this.addCardErrorMessage = '';
//             this.hasAttemptedSave = false;
//           },
//           (error) => {
//             card.errorMessage = 'Error creating location.';
//             console.error('Error creating location:', error);
//           }
//         );
//       }
//     }
//   }

//   deleteCard(index: number): void {
//     const card = this.cards[index];
//     if (card.id) {
//       this.locationService.deleteLocation(card.id).subscribe(
//         (response) => {
//           console.log('Delete response:', response);
//           this.cards.splice(index,1);
//           this.isAddNewDisabled = false;
//         },
//         (error) => {
//           card.errorMessage = 'Error deleting location.';
//           console.error('Error deleting location:', error);
//         }
//       );
//     } else {
//       this.cards.splice(index, 1);
//       this.isAddNewDisabled = false;
//     }
//   }

//   cancelCard(index: number): void {
//     const card = this.cards[index];
//     if (!card.id) {
//       this.cards.splice(index, 1);
//     } else {
//       Object.assign(card, this.originalCardValues);
//       card.isEditing = false;
//     }
//     this.isAddNewDisabled = false;
//   }
//   // cancelCard(index: number): void {
//   //   this.cards[index].isEditing = false;
//   //   this.isAddNewDisabled = false;
//   // }
// }



// import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { LocationService } from './location.service';
// import { StateService } from './form-card.service';
// import { ChangeDetectorRef } from '@angular/core';

// @Component({
//   selector: 'app-location',
//   templateUrl: './location.component.html',
//   styleUrls: ['./location.component.css'],
// })

// export class LocationComponent implements OnInit {
//   @Output() statesUpdated = new EventEmitter<string[]>();

//   constructor(
//     private locationService: LocationService,
//     private stateService: StateService,
//     private changeDetectorRef: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadLocations();
//   }

//   loadLocations(): void {
//     this.locationService.getLocations().subscribe(
//       (locations) => {
//         if (locations) {
//           // Extract states and emit them to FormCardComponent
//           const states = locations.map((location) => location.state);
//           this.statesUpdated.emit(states);
//         }
//       },
//       (error) => {
//         console.error('Error loading locations:', error);
//       }
//     );
//   }
// }


// import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
// import { StateService } from './form-card.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-form-card',
//   templateUrl: './form-card.component.html',
//   styleUrls: ['./form-card.component.css'],
// })

// export class FormCardComponent implements OnInit {
//   @Input() dropdownOptions: string[] = [];

//   constructor(private stateService: StateService, private cdr: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     // You can also subscribe to state updates via StateService if needed
//     // Example: this.stateService.states$.subscribe(states => { this.dropdownOptions = states; });
//   }
// }



// <!-- location.component.html -->
// <app-form-card [dropdownOptions]="dropdownOptions"></app-form-card>
