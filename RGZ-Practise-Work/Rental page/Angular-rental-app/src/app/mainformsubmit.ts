//card with submitted card functionality
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';

// interface DropdownItem {
//   item_id: number;
//   item_text: string;
// }

// @Component({
//   selector: 'app-form-card',
//   standalone: true,
//   imports: [FormsModule, CommonModule, ReactiveFormsModule, NgSelectModule],
//   templateUrl: './form-card.component.html',
//   styleUrls: ['./form-card.component.css']
// })

// export class FormCardComponent implements OnInit {
//   cards: FormGroup[] = [];
//   submittedCards: any[] = [];
//   dropdownList: DropdownItem[] = [];
//   selectedItems: any[] = [];
//   fileNames: string[] = [];
//   filePreviews: string[] = [];  
//   editingIndex: number | null = null;
//   duplicateSubmissionError: boolean = false;

//   constructor(private fb: FormBuilder) {  
//     this.addCard();  
//   }

//   // Dropdown list initializer
//   ngOnInit() {
//     this.dropdownList = [
//       { item_id: 1, item_text: 'Option 1' },
//       { item_id: 2, item_text: 'Option 2' },
//       { item_id: 3, item_text: 'Option 3' }
//     ];
//   }

//   // Dropdown comparison function
//   compareWith(item1: DropdownItem, item2: DropdownItem): boolean {
//     return item1 && item2 ? item1.item_id === item2.item_id : item1 === item2;
//   }

//   // Handles item selection for dropdown
//   onItemSelect(item: any, index: number) {
//     this.selectedItems[index] = item;
//     const selectedItemIds = this.selectedItems[index].map((i: { item_id: any; }) => i.item_id);
//     this.cards[index].get('dropdown')?.setValue(selectedItemIds);
//     this.duplicateSubmissionError = false;  // Reset duplicate error flag
//     this.cards[index].get('dropdown')?.markAsUntouched();  // Clear touched state
//   }

//   // Create form group for each card
//   createCardForm(): FormGroup {
//     return this.fb.group({
//       name: ['', [Validators.required, this.uniqueNameValidator(this.submittedCards), this.nonumber(this.submittedCards)]],
//       dropdown: [[], Validators.required],
//       date: ['', Validators.required],
//     });
//   }

//   // Validator to ensure the name does not contain numbers
//   nonumber(_submittedCards: any[]): (control: AbstractControl) => ValidationErrors | null {
//     return (control: AbstractControl): ValidationErrors | null => {
//       if (!control.value) return null;
//       const hasNumber = /\d/.test(control.value);
//       return hasNumber ? { hasNumber: true } : null;
//     };
//   }

//   // Validator to ensure name is unique among all submitted cards
//   uniqueNameValidator(submittedCards: any[]): any {
//     return (control: AbstractControl): ValidationErrors | null => {
//       if (!control.value) return null;
//       const nameExists = submittedCards.some(card => card.name === control.value);
//       return nameExists ? { nameTaken: true } : null;
//     };
//   }

//   // Add a new card to the form
//   addCard() {
//     const newCard = this.createCardForm();
//     this.cards.push(newCard);
//     this.selectedItems.push([]); 
//     this.fileNames.push('');
//     this.filePreviews.push('');  
//   }

//   // Delete a card
//   deleteCard(index: number) {
//     if (index === 0) return;  // Prevent deletion of the first card
//     this.cards.splice(index, 1);
//     this.selectedItems.splice(index, 1);  
//     this.fileNames.splice(index, 1); 
//     this.filePreviews.splice(index, 1);
//   }

//   // Handle file input and upload
//   handleFileInput(event: any, index: number) {
//     const file = event.target.files[0];
//     if (file) {
//       // Check if file name exists in submitted cards
//       const fileNameExists = this.submittedCards.some(card => card.uploadfile === file.name);
//       if (fileNameExists) {
//         alert('This file has already been uploaded. Please choose a different file.');
//         event.target.value = '';
//         return;
//       }
//       this.fileNames[index] = file.name;
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.filePreviews[index] = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   // Get available options for dropdown dynamically per card
//   getAvailableOptionsForCard(_cardIndex: number): DropdownItem[] {
//     const selectedOptions = new Set<string>();
//     this.submittedCards.forEach(card => {
//       card.dropdown.forEach((option: string) => {
//         selectedOptions.add(option);
//       });
//     });

//     return this.dropdownList.map(option => ({
//       item_id: option.item_id,
//       item_text: option.item_text,
//       disabled: selectedOptions.has(option.item_text)
//     }));
//   }

//   // Check if file is an image (for preview purposes)
//   isImageFile(fileName: string): boolean {
//     const fileExtension = fileName.split('.').pop()?.toLowerCase();
//     return ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension ?? '');
//   }

//   // Submit the card data
//   submit(index: number) {
//     // Mark all controls as touched to trigger validation
//     const controls = this.cards[index].controls;
//     for (const control in controls) {
//       if (controls.hasOwnProperty(control)) {
//         controls[control].markAsTouched();
//       }
//     }

//     // Check if dropdown is invalid (empty)
//     if (this.cards[index].get('dropdown')?.invalid) return;

//     // Check for duplicate dropdown selections within the same card
//     if (this.cards[index].valid && !this.cards[index].get('name')?.hasError('nameTaken')) {
//       const cardValue = this.cards[index].value;
//       const dropdownTexts = cardValue.dropdown.map((id: number) => {
//         return this.dropdownList.find(item => item.item_id === id)?.item_text;
//       });

//       // Check for duplicates within the selected dropdown
//       const hasDuplicates = new Set(dropdownTexts).size !== dropdownTexts.length;
//       if (hasDuplicates) {
//         alert('Duplicate dropdown selections are not allowed. Please select unique options.');
//         return;
//       }

//       // Check if the selected dropdown values already exist across all cards
//       const allDropdowns = this.submittedCards.flatMap(card => card.dropdown);
//       const hasCommonValues = dropdownTexts.some((value: any) => allDropdowns.includes(value));

//       if (hasCommonValues) {
//         this.duplicateSubmissionError = true;
//         return;  // Prevent submission
//       } else {
//         this.duplicateSubmissionError = false; // Reset the error flag
//       }

//       // Handle new or edited card submission
//       if (this.editingIndex !== null) {
//         this.submittedCards[this.editingIndex] = {
//           name: cardValue.name,
//           dropdown: dropdownTexts,
//           date: cardValue.date,
//           uploadfile: this.fileNames[index] || 'No file uploaded',
//           filePreview: this.filePreviews[index] || '',
//         };
//         this.editingIndex = null;
//       } else {
//         this.submittedCards.push({
//           name: cardValue.name,
//           dropdown: dropdownTexts,
//           date: cardValue.date,
//           uploadfile: this.fileNames[index] || 'No file uploaded',
//           filePreview: this.filePreviews[index] || ''
//         });
//       }

//       // Reset the form after submission
//       this.cards[index].reset({
//         name: '',
//         dropdown: [],
//         date: ''
//       });

//       this.selectedItems[index] = [];
//       this.fileNames[index] = ''; 
//       this.filePreviews[index] = '';

//       const fileInput = document.querySelector(`input[type="file"][data-index="${index}"]`) as HTMLInputElement;
//       if (fileInput) {
//         fileInput.value = '';
//       }
//     }
//   }

//   // Edit a selected card
//   editSelectedCard(index: number) {
//     const cardToEdit = this.submittedCards[index];
//     this.editingIndex = index;

//     this.selectedItems[0] = cardToEdit.dropdown.map((itemText: string) => {
//       return this.dropdownList.find(item => item.item_text === itemText);
//     }).filter((item: undefined) => item !== undefined);

//     this.cards[0].patchValue({
//       name: cardToEdit.name,
//       dropdown: this.selectedItems[0].map((item: { item_id: any; }) => item.item_id),
//       date: cardToEdit.date
//     });

//     this.fileNames[0] = cardToEdit.uploadfile || '';
//     this.filePreviews[0] = cardToEdit.filePreview || '';
//   }

//   // Delete a selected card from the submitted cards list
//   deleteSelectedCard(index: number) {
//     this.submittedCards.splice(index, 1);
//   }
// }

// <div class="container mt-4 main-card">
//   <h2>Some Cards</h2>
//   <div class="mt-4 added-card">
//     <div *ngFor="let card of cards; let i = index" class="card mb-2">
//       <div class="card-body">
//         <form [formGroup]="card" (ngSubmit)="submit(i)">
//           <!-- Name Field -->
//           <div class="form-group">
//             <label>Name
//               <span *ngIf="card.get('name')?.invalid && card.get('name')?.touched" class="text-danger">*</span>
//             </label>
//             <input formControlName="name" class="form-control"
//               [ngClass]="{'is-invalid': card.get('name')?.invalid && card.get('name')?.touched}"
//               [placeholder]="card.get('name')?.invalid && card.get('name')?.touched ? 'Name is required' : 'Enter name'" />
//             <div *ngIf="card.get('name')?.invalid && card.get('name')?.touched" class="text-danger">
//               <div *ngIf="card.get('name')?.hasError('required')">Please enter a name.</div>
//               <div *ngIf="card.get('name')?.hasError('nameTaken')">This name is already taken.</div>
//               <div *ngIf="card.get('name')?.hasError('hasNumber')">Numbers can't be used as names.</div>
//             </div>
//           </div>

//           <!-- Dropdown Field -->
//           <div class="form-group">
//             <label>Dropdown
//               <span *ngIf="card.get('dropdown')?.invalid && card.get('dropdown')?.touched" class="text-danger">*</span>
//             </label>
//             <ng-select [items]="getAvailableOptionsForCard(i)"
//                        bindLabel="item_text" bindValue="item_id" [(ngModel)]="selectedItems[i]"
//                        [multiple]="true" placeholder="Select options" 
//                        (change)="onItemSelect($event, i)" [clearable]="true"
//                        [closeOnSelect]="true" [ngModelOptions]="{standalone: true}" [compareWith]="compareWith">
//             </ng-select>
//             <div *ngIf="card.get('dropdown')?.invalid && card.get('dropdown')?.touched" class="text-danger">
//               Please select at least one option.
//             </div>
//           </div>

//           <!-- Date Field -->
//           <div class="form-group">
//             <label>Date
//               <span *ngIf="card.get('date')?.invalid && card.get('date')?.touched" class="text-danger">*</span>
//             </label>
//             <input type="date" formControlName="date" class="form-control"
//               [ngClass]="{'is-invalid': card.get('date')?.invalid && card.get('date')?.touched}"
//               [placeholder]="card.get('date')?.invalid && card.get('date')?.touched ? 'Date is required' : ''" />
//             <div *ngIf="card.get('date')?.invalid && card.get('date')?.touched" class="text-danger">
//               Please select a date.
//             </div>
//           </div>

//           <!-- File Upload Section -->
//           <div class="form-group">
//             <label for="myfile-{{i}}">Upload File</label>
//             <input type="file" (change)="handleFileInput($event, i)" id="myfile-{{i}}" name="myfile"
//               [attr.data-index]="i" class="form-control" />
//             <div *ngIf="!fileNames[i] && card.get('name')?.touched && card.get('dropdown')?.touched && card.get('date')?.touched"
//               class="text-danger">
//               Please upload a file.
//             </div>

//             <!-- File Preview -->
//             <div *ngIf="filePreviews[i]" class="mt-2">
//               <img [src]="filePreviews[i]" alt="File preview" class="img-fluid" />
//               <p><strong>File Name:</strong> {{ fileNames[i] }}</p>
//             </div>
//           </div>

//           <!-- Action Buttons -->
//           <div class="btns">
//             <button type="button" class="btn btn-danger dt-bt" (click)="deleteCard(i)">Delete</button>
//             <button type="button" class="btn btn-primary mt-3 ad-bt" (click)="addCard()">Add Card</button>
//             <button type="submit" class="btn btn-primary mt-3 st-bt">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>

//   <!-- Submitted Cards Section -->
//   <div class="mt-4">
//     <h3>Submitted Cards</h3>
//     <div *ngFor="let submittedCard of submittedCards; let j = index" class="card mb-2">
//       <div class="card-body">
//         <p><strong>Card {{ j + 1 }}</strong></p>
//         <p>Name: {{ submittedCard.name }}</p>
//         <p>Dropdown: {{ submittedCard.dropdown | json }}</p>
//         <p>Date: {{ submittedCard.date | date:'dd/MM/yyyy'}}</p>

//         <!-- Display uploaded file name -->
//         <div *ngIf="submittedCard.uploadfile">
//           <p><strong>Uploaded File:</strong> {{ submittedCard.uploadfile }}</p>
//         </div>

//         <!-- Show file preview if available -->
//         <div *ngIf="submittedCard.filePreview">
//           <img [src]="submittedCard.filePreview" alt="File preview" class="img-fluid" />
//         </div>

//         <!-- Edit Button -->
//         <button type="button" class="btn btn-warning ed-bt mt-3" (click)="editSelectedCard(j)">
//           Edit
//         </button>

//         <!-- Delete Button -->
//         <button type="button" class="btn btn-danger det-bt mt-3" (click)="deleteSelectedCard(j)">
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
