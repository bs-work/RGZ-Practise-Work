import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { switchMap } from 'rxjs/operators';

export interface CardModel {
  id: number;
  name: string;
  state: string;
  stateId: number; 
  datePicker: Date;
  uploadfile: string;
  fileurl: string;
  isActive:boolean
}

@Injectable({
providedIn: 'root',
})

export class CardService {
  private apiUrl = 'https://localhost:44314/api/card';

  constructor(private http: HttpClient) {}

  getCards(): Observable<CardModel[]> {
    return this.http.get<CardModel[]>(this.apiUrl);
  }

  getCardById(id: number): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.apiUrl}/${id}`);
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/upload`, formData, {
      responseType: 'text' as 'json',
    });
  }

  addCard(card: CardModel): Observable<number> {
    return this.http.post<number>(this.apiUrl, card);
  }

  updateCard(card: CardModel): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/${card.id}`, card);
  }

  deleteCard(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${id}`);
  }

  // updateStateInBothTables(
  //   locationId: number,
  //   newState: string
  // ): Observable<void> {
  //   return this.http.put<void>(`${this.apiUrl}/updateState`, {
  //     locationId,
  //     newState,
  //   });
  // }
}
