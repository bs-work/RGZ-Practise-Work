import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../Rental-Comps/location/location.service';
import { CardModel, CardService } from '../Rental-Comps/form-card/card.service';
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
  locationOptions: string[] = [];
  addCardErrorMessage: string = '';
  isAddNewDisabled: boolean = false;
  editDisabled: boolean = false;

  constructor(
    private locationService: LocationService,
    private cardService: CardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStates();
    this.loadCards();
  }

  loadStates(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        const states = locations.map((location) => location.state);
        this.locationOptions = [...new Set(states)];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading states:', error);
      }
    );
  }

  loadCards(): void {
    this.cardService.getCards().subscribe(
      (cards) => {
        this.cards = cards.map((card) => ({
          ...card,
          isEditing: false,
          errorMessage: '',
        }));
        console.log('Cards loaded:', this.cards);
      },
      (error) => {
        console.error('Error loading cards:', error);
      }
    );
  }

  addNewCard() {
    if (this.cards.some((card) => card.isEditing)) {
      this.isAddNewDisabled = true;
      return;
    }
    this.addCardErrorMessage = '';
    this.isAddNewDisabled = false;
    const newCard = {
      name: '',
      location: '',
      uploadfile: '', // This will hold the image name
      isEditing: true,
      datePicker: '',
      errorMessage: '',
      fileUrl: '', // This will hold the URL for backend
    };
    this.cards.push(newCard);
  }

  editCard(index: number) {
    const cardToEdit = this.cards[index];
    if (this.cards.some((card) => card.isEditing && card !== cardToEdit)) {
      return;
    }
    this.cards.forEach((card, i) => (card.isEditing = i === index));
    cardToEdit.errorMessage = '';
    this.isAddNewDisabled = true;

    if (cardToEdit.Id) {
      this.originalCardValues = { ...cardToEdit };
      this.cardService.getCardById(cardToEdit.Id).subscribe(
        (cardData) => {
          if (cardData) {
            Object.assign(cardToEdit, cardData);
            cardToEdit.isEditing = true;
            console.log('Card Edit Filled:', cardToEdit);
            this.cdr.detectChanges();
          }
        },
        (error) => {
          console.error('Error loading card data:', error);
        }
      );
    } else {
      cardToEdit.isEditing = true;
    }

    this.isAddNewDisabled = true;
  }

  isNameInvalid(card: any): boolean {
    return card.errorMessage && (!card.name || /\d/.test(card.name));
  }

  islocationInvalid(card: any): boolean {
    return card.errorMessage && !card.state;
  }

  isDateInvalid(card: any): boolean {
    return card.errorMessage && !card.date;
  }

  isFileInvalid(card: any): boolean {
    return card.errorMessage && !card.uploadfile;
  }

  saveCard(index: number) {
    const card = this.cards[index];
    let hasError = false;
    card.errorMessage = '';

    if (!card.name || /\d/.test(card.name)) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
    } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
      card.errorMessage =
        'This name is already added. Please choose a different name.';
      hasError = true;
    }
    if (!card.location || !card.datePicker || !card.fileUrl) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
    }
    const cardData: CardModel = {
      id: card.id,
      name: card.name,
      location: card.location,
      datePicker: card.datePicker,
      uploadfile: card.fileUrl, // Send the URL to the backend
    };
    const saveObservable = card.Id
      ? this.cardService.updateCard(cardData)
      : this.cardService.addCard(cardData);
    saveObservable.subscribe(
      (response) => {
        if (!card.Id) {
          card.Id = response;
        }
        card.isEditing = false;
        this.isAddNewDisabled = false;
        this.addCardErrorMessage = '';
        console.log('Card saved successfully', response);
      },
      (error) => {
        console.error('Error saving card:', error);
        this.addCardErrorMessage = 'Failed to save card. Please try again.';
      }
    );
  }

  deleteCard(index: number) {
    const card = this.cards[index];
    if (card.id) {
      this.cardService.deleteCard(card.id).subscribe(
        () => {
          this.cards.splice(index, 1);
          this.isAddNewDisabled = this.cards.some((card) => card.isEditing);
          if (!this.isAddNewDisabled) {
            this.addCardErrorMessage = '';
          }
          console.log('Card deleted:', card);
        },
        (error) => {
          card.errorMessage = 'Error deleting card.';
          console.error('Error deleting card:', error);
        }
      );
    } else {
      this.cards.splice(index, 1);
      this.isAddNewDisabled = this.cards.some((card) => card.isEditing);
    }
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Create a URL for the file
      this.cards[index].uploadfile = file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name; // Save only the image name, truncated if necessary
      this.cards[index].fileUrl = fileUrl; // Save the URL for backend
    } else {
      this.cards[index].uploadfile = '';
      this.cards[index].fileUrl = '';
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
            <p><strong>State:</strong> ${card.location}</p>
            <p><strong>Date:</strong> ${card.datePicker}</p>
            <p><strong>File:</strong> ${card.uploadfile}</p>
            ${
              card.fileUrl
                ? `<img src="${card.fileUrl}" alt="File Preview" />`
                : ''
            }
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      console.error(
        'Failed to open new tab. Please check your browser settings.'
      );
    }
  }

  originalCardValues: any;

  cancelCard(index: number): void {
    const card = this.cards[index];
    if (!card.id) {
      this.cards.splice(index, 1);
    } else {
      Object.assign(card, this.originalCardValues);
      card.isEditing = false;
    }
    this.isAddNewDisabled = false;
  }
}


optimized


import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../Rental-Comps/location/location.service';
import { CardModel, CardService } from '../Rental-Comps/form-card/card.service';
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
  locationOptions: string[] = [];
  addCardErrorMessage: string = '';
  isAddNewDisabled: boolean = false;
  editDisabled: boolean = false;

  constructor(
    private locationService: LocationService,
    private cardService: CardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStates();
    this.loadCards();
  }

  loadStates(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        const states = locations.map((location) => location.state);
        this.locationOptions = [...new Set(states)];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error loading states:', error);
      }
    );
  }

  loadCards(): void {
    this.cardService.getCards().subscribe(
      (cards) => {
        this.cards = cards.map((card) => ({
          ...card,
          isEditing: false,
          errorMessage: '',
        }));
        console.log('Cards loaded:', this.cards);
      },
      (error) => {
        console.error('Error loading cards:', error);
      }
    );
  }

  addNewCard() {
    if (this.cards.some((card) => card.isEditing)) {
      this.isAddNewDisabled = true;
      return;
    }
    this.addCardErrorMessage = '';
    this.isAddNewDisabled = false;
    const newCard = {
      name: '',
      location: '',
      uploadfile: '',
      isEditing: true,
      datePicker: '',
      errorMessage: '',
      fileUrl: '',
    };
    this.cards.push(newCard);
  }

  editCard(index: number) {
    const cardToEdit = this.cards[index];
    if (this.cards.some((card) => card.isEditing && card !== cardToEdit)) {
      return;
    }
    this.cards.forEach((card, i) => (card.isEditing = i === index));
    cardToEdit.errorMessage = '';
    this.isAddNewDisabled = true;

    if (cardToEdit.id) {
      this.originalCardValues = { ...cardToEdit };
      this.cardService.getCardById(cardToEdit.id).subscribe(
        (cardData) => {
          if (cardData) {
            Object.assign(cardToEdit, cardData);
            cardToEdit.isEditing = true;
            console.log('Card Edit Filled:', cardToEdit);
            this.cdr.detectChanges();
          }
        },
        (error) => {
          console.error('Error loading card data:', error);
        }
      );
    } else {
      cardToEdit.isEditing = true;
    }

    this.isAddNewDisabled = true;
  }

  isNameInvalid(card: any): boolean {
    return card.errorMessage && (!card.name || /\d/.test(card.name));
  }

  islocationInvalid(card: any): boolean {
    return card.errorMessage && !card.state;
  }

  isDateInvalid(card: any): boolean {
    return card.errorMessage && !card.date;
  }

  isFileInvalid(card: any): boolean {
    return card.errorMessage && !card.uploadfile;
  }

  saveCard(index: number) {
    const card = this.cards[index];
    let hasError = false;
    card.errorMessage = '';

    if (!card.name || /\d/.test(card.name)) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
    } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
      card.errorMessage =
        'This name is already added. Please choose a different name.';
      hasError = true;
    }
    if (!card.location || !card.datePicker || !card.fileUrl) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
      
    }
    const cardData: CardModel = {
      id: card.id,
      name: card.name,
      location: card.location,
      datePicker: card.datePicker,
      uploadfile: card.fileUrl,
    };
    const saveObservable = card.id
      ? this.cardService.updateCard(cardData)
      : this.cardService.addCard(cardData);
    saveObservable.subscribe(
      (response) => {
        if (!card.id) {
          card.id = response;
        }
        card.isEditing = true;
        this.isAddNewDisabled = false;
        this.addCardErrorMessage = '';
        console.log('Card saved successfully', response);
      },
      (error) => {
        console.error('Error saving card:', error);
        this.addCardErrorMessage = 'Failed to save card. Please try again.';
      }
    );
  }

  deleteCard(index: number) {
    const card = this.cards[index];
    if (card.id) {
      this.cardService.deleteCard(card.id).subscribe(
        () => {
          this.cards.splice(index, 1);
          this.isAddNewDisabled = this.cards.some((card) => card.isEditing);
          if (!this.isAddNewDisabled) {
            this.addCardErrorMessage = '';
          }
          console.log('Card deleted:', card);
        },
        (error) => {
          card.errorMessage = 'Error deleting card.';
          console.error('Error deleting card:', error);
        }
      );
    } else {
      this.cards.splice(index, 1);
      this.isAddNewDisabled = this.cards.some((card) => card.isEditing);
    }
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      this.cards[index].uploadfile =
        file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name;
      this.cards[index].fileUrl = fileUrl;
    } else {
      this.cards[index].uploadfile = '';
      this.cards[index].fileUrl = '';
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
            <p><strong>State:</strong> ${card.location}</p>
            <p><strong>Date:</strong> ${card.datePicker}</p>
            <p><strong>File:</strong> ${card.uploadfile}</p>
            ${
              card.fileUrl
                ? `<img src="${card.fileUrl}" alt="File Preview" />`
                : ''
            }
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      console.error(
        'Failed to open new tab. Please check your browser settings.'
      );
    }
  }

  originalCardValues: any;

  cancelCard(index: number): void {
    const card = this.cards[index];
    if (!card.id) {
      this.cards.splice(index, 1);
    } else {
      Object.assign(card, this.originalCardValues);
      card.isEditing = false;
    }
    this.isAddNewDisabled = false;
  }
}


