import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../location/location.service';
import { CardModel, CardService } from '../form-card/card.service';
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
  locationOptions: { id: number; state: string }[] = [];
  addCardErrorMessage: string = '';
  isAddNewDisabled: boolean = false;
  editDisabled: boolean = false;

  constructor(
    private locationService: LocationService,
    private cardService: CardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load states first, then cards
    this.loadStates().then(() => {
      this.loadCards();
    });
  }

  loadStates(): Promise<void> {
    return new Promise((resolve) => {
      this.locationService.getLocations().subscribe(
        (locations) => {
          this.locationOptions = locations.map((location) => ({
            id: location.id,
            state: location.state,
          }));
          this.cdr.detectChanges();
          resolve();
        },
        (error) => {
          console.error('Error loading states:', error);
          resolve();
        }
      );
    });
  }

  loadCards(): void {
    this.cardService.getCards().subscribe(
      (cards) => {
        this.cards = cards.map((card) => ({
          ...card,
          isEditing: false,
          errorMessage: '',
          filePreview: card.fileurl || '',
          stateId: parseInt(card.stateId.toString(), 10) || 1,
        }));
        this.cards.forEach((card) => {
          const location = this.locationOptions.find(
            (s) => s.id === card.stateId
          );
          if (location) {
            card.state = location.state;
          }
        });

        console.log('Cards loaded:', this.cards);
        this.cdr.detectChanges();
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
      state: '',
      stateId: 1,
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
      this.isStateInvalid(card)||
      this.isDateInvalid(card) ||
      this.isUploadfileInvalid(card)
    );
  }

  isNameInvalid(card: any): boolean {
    return card.errorMessage && (!card.name || /\d/.test(card.name));
  }

  isStateInvalid(card: any): boolean {
    return card.errorMessage && !card.stateId;
  }

  isDateInvalid(card: any): boolean {
    return card.errorMessage && !card.datePicker;
  }

  isUploadfileInvalid(card: any): boolean {
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
            cardToEdit.stateId = cardData.stateId;
            const location = this.locationOptions.find(
              (s) => s.id === cardToEdit.stateId
            );
            if (location) {
              cardToEdit.state = location.state;
            }
            // Object.assign(cardToEdit, {
            //   ...cardData,
            //   isEditing: true,
            // });
            
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

  saveCard(index: number): void {
    const card = this.cards[index];
    let hasError = false;

    card.nameError = '';
    card.stateError = '';
    card.datePickerError = '';
    card.uploadfileError = '';

    if (!card.name || /\d/.test(card.name)) {
      card.nameError = 'Please fill in all fields before saving.';
      hasError = true;
    } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
      card.nameError =
        'This name is already added. Please choose a different name.';
      hasError = true;
    }
    if (!card.stateId) {
      card.stateError = 'State is required.';
      hasError = true;
    }
    if (!card.datePicker) {
      card.datePickerError = 'Date is required.';
      hasError = true;
    }
    if (!card.uploadfile) {
      card.uploadfileError = 'File upload is required.';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const cardData: CardModel = {
      id: card.id,
      name: card.name,
      stateId: card.stateId,
      state: card.state,
      datePicker: card.datePicker,
      uploadfile: card.uploadfile,
      fileurl: card.fileurl,
      isActive: true,
    };

    const saveObservable = card.id
      ? this.cardService.updateCard(cardData)
      : this.cardService.addCard(cardData);

    saveObservable.subscribe(
      (response: any) => {
        if (!card.id && typeof response === 'object' && 'id' in response) {
          card.id = response.id;
        }
        card.isEditing = false;
        this.isAddNewDisabled = false;
        this.addCardErrorMessage = '';
        console.log('Card saved successfully');
        this.cdr.detectChanges();
        this.loadStates();
        this.loadCards();
        this.cards[index].state = cardData.state;
        this.cdr.detectChanges();
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
          this.cdr.detectChanges();
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
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.cards[index].errorMessage =
          'Invalid file type. Please upload an image (JPEG, PNG, GIF).';
        return;
      }

      this.cardService.uploadFile(file).subscribe(
        (fileUrl: string) => {
          this.cards[index].filePreview = fileUrl;
          this.cards[index].uploadfile = file.name;
          this.cards[index].fileurl = fileUrl;
          this.cards[index].errorMessage = '';
        },
        (error: any) => {
          console.error('File upload failed:', error);
          this.cards[index].errorMessage =
            'File upload failed. Please try again.';
        }
      );
    } else {
      console.error('No file selected');
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
            <p><strong>Date:</strong> ${card.datePicker}</p>
            <p><strong>UploadFile:</strong> ${card.uploadfile}</p>
            ${
              card.filePreview
                ? `<img src="${card.fileurl}" alt="File Preview" />`
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
