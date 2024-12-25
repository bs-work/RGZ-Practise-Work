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
  originalCardValues: any; // Store original values for cancel functionality

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

  editCard(index: number) {
    const cardToEdit = this.cards[index];
    if (this.cards.some((card) => card.isEditing && card !== cardToEdit)) {
      return; // Prevent editing if another card is already being edited
    }

    // Store original values for cancel functionality
    this.originalCardValues = { ...cardToEdit };

    // Set the editing state
    this.cards.forEach((card, i) => (card.isEditing = i === index));
    cardToEdit.errorMessage = '';
    this.isAddNewDisabled = true;

    // Load card data if it exists
    if (cardToEdit.id) {
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
      cardToEdit.isEditing = true; // If no ID, just set to editing
    }
  }

  saveCard(index: number) {
    const card = this.cards[index];
    let hasError = false;
    card.errorMessage = '';

    // Validate card fields
    if (!card.name || /\d/.test(card.name)) {
      card.errorMessage = 'Please fill in all fields before saving.';
      hasError = true;
    } else if (this.cards.some((c, i) => c.name === card.name && i !== index)) {
      card.errorMessage =
        'This name is already added. Please choose a different name.';
      hasError = true;
    }

    if (hasError) return; // Stop if there are validation errors

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
        }after submitting card i have to refresh the full page to edit it fix that when i click edit it's should also get there the data also fix that in all
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

  cancelCard(index: number): void {
    const card = this.cards[index];
    if (!card.id) {
      this.cards.splice(index, 1); // Remove new card if not saved
    } else {
      Object.assign(card, this.originalCardValues); // Restore original values
      card.isEditing = false; // Exit editing mode
    }
    this.isAddNewDisabled = false; // Enable adding new cards
  }
}
