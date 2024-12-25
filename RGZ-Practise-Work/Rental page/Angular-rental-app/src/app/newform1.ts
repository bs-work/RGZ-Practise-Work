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
      fileurl: '',
    };
    this.cards.push(newCard);
  }

  isFormInvalid(card: any): boolean {
    return (
      this.isNameInvalid(card) ||
      this.isLocationInvalid(card) ||
      this.isDateInvalid(card) ||
      this.isUploadFileInvalid(card)
    );
  }

  isNameInvalid(card: any): boolean {
    return card.errorMessage && (!card.name || /\d/.test(card.name));
  }

  isLocationInvalid(card: any): boolean {
    return card.errorMessage && !card.location;
  }

  isDateInvalid(card: any): boolean {
    return card.errorMessage && !card.datePicker;
  }

  isUploadFileInvalid(card: any): boolean {
    return card.errorMessage && !card.uploadfile;
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

  saveCard(index: number) {
    const card = this.cards[index];
    let hasError = false;
    card.errorMessage = '';

    // Validate name
    if (!card.name || /\d/.test(card.name)) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
    } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
      card.errorMessage = 'This name is already added. Please choose a different name.';
      hasError = true;
    }

    // Validate location
    if (!card.location) {
      card.errorMessage = 'Location is required.';
      hasError = true;
    } else {
      card.errorMessage = ''; // Clear error if valid
    }

    // Validate datepicker
    if (!card.datePicker) {
      card.errorMessage = 'Date is required.';
      hasError = true;
    } else {
      card.errorMessage = ''; // Clear error if valid
    }

    // Validate upload file
    if (!card.uploadfile) {
      card.errorMessage = 'File upload is required.';
      hasError = true;
    } else {
      card.errorMessage = ''; // Clear error if valid
    }

    const cardData: CardModel = {
      id: card.id,
      name: card.name,
      location: card.location,
      datePicker: card.datePicker,
      uploadfile: card.uploadfile,
      fileurl: card.fileurl,
    };

    const saveObservable = card.id
      ? this.cardService.updateCard(cardData)
      : this.cardService.addCard(cardData);
    saveObservable.subscribe(
      (response) => {
        if (!card.id) {
          card.id = response;
        }
        card.isEditing = false;
        this.isAddNewDisabled = false;
        this.addCardErrorMessage = '';
        console.log('Card saved successfully');
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

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.cardService.uploadFile(file).subscribe(
        (fileUrl: string) => {
          this.cards[index].filePreview = fileUrl;
          this.cards[index].uploadfile = file.name;
          this.cards[index].fileurl = fileUrl;
          this.cards[index].errorMessage = ''; // Clear error if file is uploaded
        },
        (error: any) => {
          console.error('File upload failed:', error);
          this.cards[index].errorMessage = 'File upload failed. Please try again.';
        }
      );
    } else {
      console.error('No file selected');
    }
  }

  isOptionDisabled(option: string): boolean {
    return this.cards.some((card) => card.location === option);
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
            <p><strong>Location:</strong> ${card.location}</p>
            <p><strong>Date:</strong> ${card.datePicker}</p>
            <p><strong>File:</strong> ${card.uploadfile}</p>
            ${card.filePreview ? `<img src="${card.fileurl}" alt="File Preview" />` : ''}
          </body>
        </html>
      `);
      newTab.document.close();
    } else {
      console.error('Failed to open new tab. Please check your browser settings.');
    }
  }

  original CardValues: any;

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