# AngularRentalApp

<!--
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help
<!--To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page. -->
<!-- tasks -->

0. first - employee only opening 7 october 24 - joining
   (smit's task)
   0.9 - 8 october to 18 october designing the cooper web
   (tushar's task)
1. 18 october 24 - pick up location event when typed changed in label with pick if not have default label pick up location (completed 18 october)
2. 18 october 24 - static routing on diffrent route diffrent label /retrun location - drop location(completed 21 october)
3. 21 october 24 - make booking card a diffrent component and don't have it background color now if pickup location if typed it's should change it's parent component text(completed 21 october)
4. 21 october 24 - make book now diffrent component in child component and console.log it whatever we type to parent component booking card(completed 23 october 24)
5. 24 october 24 - make contact-us form in reactive form when user enter the input it's should console log (from my side completed need to check from other side as of 24 october 24)
   fix the code dont give all validation instead give if wrong not all the details and on submit also shows error(completed on 28 october)
   (raj's task)
6. 28 october 24 - make card that in it have name placeholder one dropdown on top in below one date picker and one add button and one delete button and if we add it's add simliar card with those detials to the next and now if we delete it delete the card (completed on 28 october 24)
7. 4 nov 24 - have multiselect option in dropdown and when we submit card it shows data in submitted card and add file upload section - other validations (7 october 24 )
   (tushar's task)
8. 8 nov 24 - make card that when we submit the card it's show submitted card info on same card and have one edit button that when we edit the details of submitted card it's can edit the detils on the same card 11 november 24 opening again
9. 13 nov 24 - sql installation and login and registartion (completed on 19 nov 24)
10. 21 nov 24 - logout task with authguard
11. 25 nov 24 - authguard (completed on 25 nov 24)
12. 26 nov 24 - make a list of location with crud operation with zip code postal code and city in the card if data is already in backend show that all it in frontend card which can be directly in edit mode and on add new card if there is not any data from backend it's all that data should be added and submitted from frontend to backend and make all crud operation in that card
    (completed on 3 dec 24)
13. 4 dec fix bug on cancel button if user is updating data in placeholder and if user cancel the card editing dont take any new entred data in placeholder and if user add new card and directly cancel the card and if have empty values just delete the card directly without having any empty values in the card isActive flag implemanation (completed on 4 dec 24)
14. 5 and 6 dec learn angular and dot net basic concepts
    (fleet == car )
15. 9 dec learning admin from hiten - crm - reservation-setting-masters-rate-rate feature - vehicle management - vehicle master -operation - finance -payment-expense-invoice-cms
16. 10 dec learning more about cms from jay
17. 11 dec making changes for formcard getting data from location for state and learning more about crm from hiten last checked deposit refund pending and it's option in rate feature bond mandatory and it's option in rate feature and clearning status
    draft--confirmed--ready to pickup--proceed to pickup--pickedup--proceed for return--pending payment--deposit refund pending - if have pending of bond--closed
18. 12 dec learning more about dotnet filter methods and angular
19. 13-14 dec leave
20. 16 dec implement crud card (error in date picker to dateonly to date time conversion issue backend) 70 done
21. 17 dec date issue conversion and frontend
22. 18 dec date issue conversion fix in backend for all query
23. 19 dec file preview implement in backend and frontend completed the card
24. 20 dec state join on both table
25. 23 dec learning more about c# and dotnet and fixing state issue
26. 24 dec fixed state id issue
27. 25 dec state not in correct format in get by id issue -- submit card without dropdown option and use left join tell raj how to i used it 


overall task list on worked with 3 card 1 reactive contact us form login and registration





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
          filePreview: card.fileurl || '',
        }));
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
      this.islocationInvalid(card) ||
      this.isDateInvalid(card) ||
      this.isuploadfileInvalid(card)
    );
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

  isuploadfileInvalid(card: any): boolean {
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
    if (!card.state) {
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
      locationId: card.locationId,
      state: card.state,
      datePicker: card.datePicker,
      uploadfile: card.uploadfile,
      fileurl: card.fileurl,
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
          this.cards[index].errorMessage ='File upload failed. Please try again.';
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
// fileUrl: '',
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
    if (!hasError) {
      if (!card.location || !card.datePicker || !card.uploadfile) {
        card.errorMessage = 'Please fill in all fields before saving.';
        hasError = true;
      }
    }
    // if (!hasError) {
    //   card.isEditing = false;
    //   this.isAddNewDisabled = false;
    //   this.addCardErrorMessage = '';
    // }
    const cardData: CardModel = {
      id: card.id,
      name: card.name,
      location: card.location,
      datePicker: card.datePicker,
      uploadfile: card.uploadfile,
    };
    const saveObservable = card.id? this.cardService.updateCard(cardData): this.cardService.addCard(cardData);
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

onFileChange(event: any, index: number) {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (e) => {
this.cards[index].filePreview = e.target?.result as string;
this.cards[index].uploadfile = file.name;

      };
      reader.readAsDataURL(file);
    } else {
      this.cards[index].uploadfile = '';
    }

}

isOptionDisabled(option: string): boolean {
return this.cards.some((card) => card.state === option);
}

openPreview(card: any, \_index: number) {
const newTab = window.open();
if (newTab) {
newTab.document.write(`        <html>
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
              card.filePreview
                ?`<img src="${card.fileUrl}" alt="File Preview" />`            : ''
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

using Microsoft.Data.SqlClient;
using CRUD_with_card.Model;
using Dapper;
using System;

namespace CRUD_with_card.Layer
{
public class CardLayer
{
private readonly string \_connectionString;

        public CardLayer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("LocMaster");
        }

//after clicking on edit inside the the placeholders of location date picker upload file prefill the data from backend
public async Task<IEnumerable<CardModel>> GetCardsAsync()
{
using (var connection = new SqlConnection(\_connectionString))
{
var query = "SELECT \* FROM Card WHERE IsActive = 1";

                // Retrieve the data and manually convert DateTime to DateOnly
                var cards = await connection.QueryAsync<CardModel>(query,
                    map: (card) =>
                    {
                        // Ensure DatePicker is a DateOnly by converting from DateTime
                        card.DatePicker = card.DatePicker.Date; // Truncate the time part if any
                        return card;
                    });

                return cards;
            }
        }

        public async Task<CardModel> GetCardByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT * FROM Card WHERE Id = @Id AND IsActive = 1";

                // Retrieve the data and manually convert DateTime to DateOnly
                var card = await connection.QueryFirstOrDefaultAsync<CardModel>(query, new { Id = id },
                    map: (card) =>
                    {
                        // Ensure DatePicker is a DateOnly by converting from DateTime
                        card.DatePicker = card.DatePicker.Date; // Truncate the time part if any
                        return card;
                    });

                return card;
            }
        }

        public async Task<int> AddCardAsync(CardModel card)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                card.IsActive = true;

                var query = "INSERT INTO Card (Name, DatePicker, Uploadfile, IsActive) VALUES (@Name, @DatePicker, @Uploadfile, @IsActive)";

                var parameters = new
                {
                    card.Name,
                    // Convert DateOnly to DateTime (DateOnly automatically handles the date part)
                    DatePicker = card.DatePicker.ToDateTime(TimeOnly.MinValue), // Convert to DateTime for DB insert
                    card.Uploadfile,
                    card.IsActive
                };

                return await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task<int> UpdateCardAsync(CardModel card)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Card SET Name = @Name, DatePicker = @DatePicker, Uploadfile = @Uploadfile WHERE Id = @Id";

                var parameters = new
                {
                    card.Name,
                    // Convert DateOnly to DateTime (DateOnly automatically handles the date part)
                    DatePicker = card.DatePicker.ToDateTime(TimeOnly.MinValue), // Convert to DateTime for DB update
                    card.Uploadfile,
                    card.Id
                };

                return await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task<int> DeleteCardAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Card SET IsActive = 0 WHERE Id = @Id";
                return await connection.ExecuteAsync(query, new { Id = id });
            }
        }
    }

}

Parent Component:

typescript

Copy code

import { Component } from '@angular/core';

@Component({

selector: 'app-parent',

template: `

    <app-child [message]="parentMessage"></app-child>

`,

})

export class ParentComponent {

parentMessage = 'Hello from parent';

}

Child Component:

typescript

Copy code

import { Component, Input } from '@angular/core';

@Component({

selector: 'app-child',

template: `

    <p>{{ message }}</p>

`,

})

export class ChildComponent {

@Input() message: string;

}

//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using CRUD_with_card.Model;
using Dapper;

namespace CRUD_with_card.Layer
{
public class LocationLayer
{
private readonly string \_connectionString;

        public LocationLayer(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("LocMaster");
        }

        //public async Task<IEnumerable<LocationModel>> GetLocationsAsync()
        //{
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        var query = "SELECT * FROM Location";
        //        return await connection.QueryAsync<LocationModel>(query);
        //    }
        //}

        public async Task<IEnumerable<LocationModel>> GetLocationsAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT * FROM Location WHERE IsActive = 1";
                return await connection.QueryAsync<LocationModel>(query);
            }
        }

        public async Task<LocationModel> GetLocationByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "SELECT * FROM Location WHERE Id = @Id";
                return await connection.QueryFirstOrDefaultAsync<LocationModel>(query, new { Id = id });
            }
        }

        public async Task<int> AddLocationAsync(LocationModel location)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "INSERT INTO Location (State, City, Address, Zipcode, Postalcode) VALUES (@State, @City, @Address, @Zipcode, @Postalcode)";
                return await connection.ExecuteAsync(query, location);
            }
        }



        public async Task<int> UpdateLocationAsync(LocationModel location)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "UPDATE Location SET State = @State, CITY = @City, Address = @Address, Zipcode = @Zipcode, Postalcode = @Postalcode WHERE Id = @Id";
                return await connection.ExecuteAsync(query, location);
            }
        }

        public async Task<int> DeleteLocationAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var query = "DELETE FROM Location WHERE Id = @Id";
                return await connection.ExecuteAsync(query, new { Id = id });
            }
        }
    }

}
