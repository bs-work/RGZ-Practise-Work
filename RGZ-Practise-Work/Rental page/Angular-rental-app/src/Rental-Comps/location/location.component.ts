import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from './location.service';
import { StateService } from '../form-card/form-card.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})

export class LocationComponent implements OnInit {
  cards: any[] = [];
  addCardErrorMessage: string = '';
  isAddNewDisabled: boolean = false;
  editDisabled: boolean = false;
  hasAttemptedSave: boolean = false;

  constructor(
    private locationService: LocationService,
    private changeDetectorRef: ChangeDetectorRef,
    private stateService: StateService 
  ) {}

  ngOnInit(): void {
    console.log('Component initialized, loading locations...');
    this.stateService.fetchAndUpdateStates(); 
    this.loadLocations();
    this.changeDetectorRef.detectChanges();
  }

  trackById(_index: number, card: any): number {
    // debugger;
    return card.id;
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        console.log('API Response:', locations);
        if (locations) {
          this.cards = locations.map((location) => ({
            ...location,
            isEditing: false,
            errorMessage: '',
          }));
        } else {
          console.error('Expected an array of locations, but received:', locations);
        }
      },
      (error) => {
        console.error('Error loading locations:', error);
      }
    );
  }

  isFormInvalid(card:any): boolean {
    return (
      this.isstateInvalid(card) ||
      this.iscityInvalid(card) ||
      this.isaddressInvalid(card) ||
      this.iszipcodeInvalid(card) ||
      this.ispostalcodeInvalid(card)
    );
  }

  isstateInvalid(card: any): boolean {
    return !card.state;
  }

  iscityInvalid(card: any): boolean {
    return !card.city;
  }

  isaddressInvalid(card: any): boolean {
    return !card.address;
  }

  iszipcodeInvalid(card: any): boolean {
    return !/^\d+$/.test(card.zipcode);
  }

  ispostalcodeInvalid(card: any): boolean {
    return !/^\d+$/.test(card.postalcode);
  }

  addNewCard(): void {
    // debugger;
    if (this.cards.some((card) => card.isEditing)) {
      this.isAddNewDisabled = true;
      return;
    }

    this.addCardErrorMessage = '';
    this.isAddNewDisabled = false;

    const newCard = {
      state: '',
      city: '',
      address: '',
      zipcode: '',
      postalcode: '',
      isEditing: true,
      errorMessage: '',
    };
    this.cards.push(newCard);
  }

  originalCardValues: any;

  editCard(index: number): void {
    // debugger; 
    const cardToEdit = this.cards[index];
    this.originalCardValues = { ...cardToEdit };
    if (this.cards.some((card) => card.isEditing && card !== cardToEdit)) {
      return;
    }
    if (cardToEdit.id) {
      this.locationService.getLocationById(cardToEdit.id).subscribe(
        (location) => {
          Object.assign(cardToEdit, location);
          cardToEdit.isEditing = true;
          console.log('Card Edit Filled:', cardToEdit);
          this.changeDetectorRef.detectChanges();
        },
        (error) => {
          console.error('Error fetching location:', error);
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
    card.errorMessage = '';
    this.hasAttemptedSave = true;

    if (this.isstateInvalid(card)) {
      card['isstateInvalid'] = true;
      hasError = true;
    } else {
      card['isstateInvalid'] = false;
    }

    if (this.iscityInvalid(card)) {
      card['iscityInvalid'] = true;
      hasError = true;
    } else {
      card['iscityInvalid'] = false;
    }

    if (this.isaddressInvalid(card)) {
      card['isaddressInvalid'] = true;
      hasError = true;
    } else {
      card['isaddressInvalid'] = false;
    }

    if (this.iszipcodeInvalid(card)) {
      card['iszipcodeInvalid'] = true;
      hasError = true;
    } else {
      card['iszipcodeInvalid'] = false;
    }

    if (this.ispostalcodeInvalid(card)) {
      card['ispostalcodeInvalid'] = true;
      hasError = true;
    } else {
      card['ispostalcodeInvalid'] = false;
    }

    // if (hasError) {
    //   this.addCardErrorMessage = 'Please fill all fields correctly.';
    //   return;
    // }

    if (!hasError) {
      if (card.id) {
        // Updating an existing card
        this.locationService.updateLocation(card.id, card).subscribe(
          () => {
            card.isEditing = false;
            this.isAddNewDisabled = false;
            this.addCardErrorMessage = '';
            this.hasAttemptedSave = false;
            // this.locationService.updateStateInBothTables(card.id, card.state).subscribe(
            //   () => {
            //     console.log('State updated in both tables');
            //   },
            //   (error) => {
            //     console.error('Error updating state in both tables:', error);
            //   }
            // );
          },
          (error) => {
            card.errorMessage = 'Error updating location.';
            console.error('Error updating location:', error);
          }
        );
      } else {
        // Creating a new card
        this.locationService.createLocation(card).subscribe(
          (newLocation) => {
            card.id = newLocation.id;
            card.isEditing = false;
            this.isAddNewDisabled = false;
            this.addCardErrorMessage = '';
            this.hasAttemptedSave = false;
            // this.locationService.updateStateInBothTables(newLocation.id, card.state).subscribe(
            //   () => {
            //     console.log('State updated in both tables');
            //   },
            //   (error) => {
            //     console.error('Error updating state in both tables:', error);
            //   }
            // );
          },
          (error) => {
            card.errorMessage = 'Error creating location.';
            console.error('Error creating location:', error);
          }
        );
      }
    }
  }

  deleteCard(index: number): void {
    const card = this.cards[index];
    if (card.id) {
      this.locationService.deleteLocation(card.id).subscribe(
        (response) => {
          console.log('Delete response:', response);
          this.cards.splice(index,1);
          this.isAddNewDisabled = false;
        },
        (error) => {
          card.errorMessage = 'Error deleting location.';
          console.error('Error deleting location:', error);
        }
      );
    } else {
      this.cards.splice(index, 1);
      this.isAddNewDisabled = false;
    }
  }

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
  // cancelCard(index: number): void {
  //   this.cards[index].isEditing = false;
  //   this.isAddNewDisabled = false;
  // }
}
